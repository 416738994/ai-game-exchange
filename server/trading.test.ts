import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Market Data", () => {
  it("should return prices for requested symbols", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.market.prices({ symbols: ["BTC", "ETH"] });

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty("symbol");
    expect(result[0]).toHaveProperty("price");
    expect(result[0]).toHaveProperty("change24h");
    expect(result[0]).toHaveProperty("volume24h");
  });

  it("should return trending tokens", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.market.trending();

    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("symbol");
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("price");
  });
});

describe("Position Management", () => {
  it("should create a new position", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const position = await caller.positions.create({
      symbol: "ETH/USDT",
      chain: "ethereum",
      type: "long",
      leverage: 10,
      entryPrice: "3456.78",
      amount: "1.5",
      collateral: "500",
      liquidationPrice: "3110.10",
    });

    expect(position).toHaveProperty("id");
    expect(position.symbol).toBe("ETH/USDT");
    expect(position.type).toBe("long");
    expect(position.leverage).toBe(10);
    expect(position.status).toBe("open");
  });

  it("should list user positions", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Create a position first
    await caller.positions.create({
      symbol: "BTC/USDT",
      chain: "arbitrum",
      type: "short",
      leverage: 5,
      entryPrice: "95234.56",
      amount: "0.1",
      collateral: "1000",
      liquidationPrice: "104758.02",
    });

    const positions = await caller.positions.list({ status: "open" });

    expect(positions.length).toBeGreaterThan(0);
    expect(positions[0]).toHaveProperty("symbol");
    expect(positions[0]).toHaveProperty("type");
    expect(positions[0]).toHaveProperty("leverage");
  });

  it("should close a position", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Create a position
    const position = await caller.positions.create({
      symbol: "SOL/USDT",
      chain: "base",
      type: "long",
      leverage: 3,
      entryPrice: "142.34",
      amount: "10",
      collateral: "500",
      liquidationPrice: "94.89",
    });

    // Close the position
    const result = await caller.positions.close({
      id: position.id,
      currentPrice: "150.50",
      pnl: "250.00",
    });

    expect(result.success).toBe(true);

    // Verify position is closed
    const closedPositions = await caller.positions.list({ status: "closed" });
    const closedPosition = closedPositions.find(p => p.id === position.id);
    
    expect(closedPosition).toBeDefined();
    expect(closedPosition?.status).toBe("closed");
    expect(parseFloat(closedPosition?.pnl || "0")).toBeCloseTo(250, 2);
  });
});

describe("Liquidity Positions", () => {
  it("should add liquidity to a pool", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const liquidityPosition = await caller.liquidity.add({
      poolName: "ETH/USDT",
      chain: "ethereum",
      protocol: "Uniswap V3",
      token0: "ETH",
      token1: "USDT",
      amount0: "2.5",
      amount1: "8642.00",
      lpTokens: "147.56",
      apy: "12.5",
      totalValue: "17284.00",
    });

    expect(liquidityPosition).toHaveProperty("id");
    expect(liquidityPosition.poolName).toBe("ETH/USDT");
    expect(liquidityPosition.protocol).toBe("Uniswap V3");
    expect(liquidityPosition.status).toBe("active");
  });

  it("should list user liquidity positions", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const positions = await caller.liquidity.list({ status: "active" });

    expect(Array.isArray(positions)).toBe(true);
  });

  it("should withdraw liquidity", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Add liquidity first
    const position = await caller.liquidity.add({
      poolName: "BTC/USDT",
      chain: "arbitrum",
      protocol: "Curve",
      token0: "BTC",
      token1: "USDT",
      amount0: "0.5",
      amount1: "47617.28",
      lpTokens: "154.89",
      apy: "8.3",
      totalValue: "95234.56",
    });

    // Withdraw liquidity
    const result = await caller.liquidity.withdraw({
      id: position.id,
      earnedFees: "125.50",
      impermanentLoss: "15.20",
    });

    expect(result.success).toBe(true);

    // Verify position is withdrawn
    const withdrawnPositions = await caller.liquidity.list({ status: "withdrawn" });
    const withdrawnPosition = withdrawnPositions.find(p => p.id === position.id);
    
    expect(withdrawnPosition).toBeDefined();
    expect(withdrawnPosition?.status).toBe("withdrawn");
    expect(parseFloat(withdrawnPosition?.earnedFees || "0")).toBeCloseTo(125.5, 2);
  });
});

describe("Wallet Management", () => {
  it("should add a new wallet", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const wallet = await caller.wallets.add({
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      chain: "ethereum",
      isDefault: true,
    });

    expect(wallet).toHaveProperty("id");
    expect(wallet.address).toBe("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
    expect(wallet.chain).toBe("ethereum");
    expect(wallet.isDefault).toBe(true);
  });

  it("should list user wallets", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const wallets = await caller.wallets.list();

    expect(Array.isArray(wallets)).toBe(true);
  });
});

describe("Trade History", () => {
  it("should list user trades", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const trades = await caller.trades.list({ limit: 10 });

    expect(Array.isArray(trades)).toBe(true);
  });
});
