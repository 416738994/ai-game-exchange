import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // AI Chat
  chat: router({
    send: protectedProcedure
      .input(z.object({
        message: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Save user message
        await db.createChatMessage({
          userId: ctx.user.id,
          role: "user",
          content: input.message,
        });

        // Get chat history
        const history = await db.getUserChatMessages(ctx.user.id, 10);
        const messages = history.reverse().map(msg => ({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
        }));

        // Add system prompt
        const systemPrompt = `You are an AI assistant for a DeFi trading platform. Help users with:
- Understanding crypto trading strategies
- Analyzing market trends
- Explaining leverage trading risks
- Providing liquidity pool information
- Answering questions about blockchain and DeFi

Always prioritize user safety and risk awareness. Provide clear, educational responses.`;

        // Call LLM
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
            { role: "user", content: input.message },
          ],
        });

        const content = response.choices[0]?.message?.content;
        const assistantMessage = typeof content === 'string' ? content : "I apologize, but I couldn't process your request.";

        // Save assistant response
        await db.createChatMessage({
          userId: ctx.user.id,
          role: "assistant",
          content: assistantMessage,
        });

        return {
          message: assistantMessage,
        };
      }),

    history: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserChatMessages(ctx.user.id, 50);
    }),
  }),

  // Trading Positions
  positions: router({
    list: protectedProcedure
      .input(z.object({
        status: z.enum(["open", "closed", "liquidated"]).optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        return await db.getUserPositions(ctx.user.id, input?.status);
      }),

    create: protectedProcedure
      .input(z.object({
        symbol: z.string(),
        chain: z.string(),
        type: z.enum(["long", "short"]),
        leverage: z.number().int().min(1).max(100),
        entryPrice: z.string(),
        amount: z.string(),
        collateral: z.string(),
        liquidationPrice: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createPosition({
          userId: ctx.user.id,
          ...input,
        });
      }),

    close: protectedProcedure
      .input(z.object({
        id: z.number(),
        currentPrice: z.string(),
        pnl: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updatePosition(input.id, {
          status: "closed",
          currentPrice: input.currentPrice,
          pnl: input.pnl,
          closedAt: new Date(),
        });

        // Create trade record
        const position = (await db.getUserPositions(ctx.user.id)).find(p => p.id === input.id);
        if (position) {
          await db.createTrade({
            userId: ctx.user.id,
            positionId: position.id,
            symbol: position.symbol,
            chain: position.chain,
            type: position.type,
            action: "close",
            leverage: position.leverage,
            price: input.currentPrice,
            amount: position.amount,
            collateral: position.collateral,
            pnl: input.pnl,
          });
        }

        return { success: true };
      }),
  }),

  // Trade History
  trades: router({
    list: protectedProcedure
      .input(z.object({
        limit: z.number().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        return await db.getUserTrades(ctx.user.id, input?.limit);
      }),
  }),

  // Liquidity Positions
  liquidity: router({
    list: protectedProcedure
      .input(z.object({
        status: z.enum(["active", "withdrawn"]).optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        return await db.getUserLiquidityPositions(ctx.user.id, input?.status);
      }),

    add: protectedProcedure
      .input(z.object({
        poolName: z.string(),
        chain: z.string(),
        protocol: z.string(),
        token0: z.string(),
        token1: z.string(),
        amount0: z.string(),
        amount1: z.string(),
        lpTokens: z.string(),
        apy: z.string().optional(),
        totalValue: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createLiquidityPosition({
          userId: ctx.user.id,
          ...input,
        });
      }),

    withdraw: protectedProcedure
      .input(z.object({
        id: z.number(),
        earnedFees: z.string(),
        impermanentLoss: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateLiquidityPosition(input.id, {
          status: "withdrawn",
          earnedFees: input.earnedFees,
          impermanentLoss: input.impermanentLoss,
          withdrawnAt: new Date(),
        });

        return { success: true };
      }),
  }),

  // Wallets
  wallets: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserWallets(ctx.user.id);
    }),

    add: protectedProcedure
      .input(z.object({
        address: z.string(),
        chain: z.string(),
        isDefault: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createWallet({
          userId: ctx.user.id,
          ...input,
        });
      }),
  }),

  // Market Data (mock for now)
  market: router({
    prices: publicProcedure
      .input(z.object({
        symbols: z.array(z.string()),
      }))
      .query(async ({ input }) => {
        // Mock price data - in production, this would call real APIs
        const mockPrices: Record<string, { price: number; change24h: number; volume24h: number }> = {
          "BTC": { price: 95234.56, change24h: 2.34, volume24h: 28500000000 },
          "ETH": { price: 3456.78, change24h: -1.23, volume24h: 15200000000 },
          "SOL": { price: 142.34, change24h: 5.67, volume24h: 3400000000 },
          "ARB": { price: 1.23, change24h: 3.45, volume24h: 450000000 },
        };

        return input.symbols.map(symbol => ({
          symbol,
          ...mockPrices[symbol] || { price: 0, change24h: 0, volume24h: 0 },
        }));
      }),

    trending: publicProcedure.query(async () => {
      // Mock trending tokens
      return [
        { symbol: "BTC", name: "Bitcoin", price: 95234.56, change24h: 2.34 },
        { symbol: "ETH", name: "Ethereum", price: 3456.78, change24h: -1.23 },
        { symbol: "SOL", name: "Solana", price: 142.34, change24h: 5.67 },
        { symbol: "ARB", name: "Arbitrum", price: 1.23, change24h: 3.45 },
      ];
    }),
  }),
});

export type AppRouter = typeof appRouter;
