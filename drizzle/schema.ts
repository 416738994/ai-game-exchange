import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Trading positions table
 */
export const positions = mysqlTable("positions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  symbol: varchar("symbol", { length: 20 }).notNull(), // e.g., "ETH/USDT"
  chain: varchar("chain", { length: 20 }).notNull(), // e.g., "ethereum", "arbitrum"
  type: mysqlEnum("type", ["long", "short"]).notNull(),
  leverage: int("leverage").notNull(), // e.g., 3 for 3x
  entryPrice: decimal("entryPrice", { precision: 20, scale: 8 }).notNull(),
  currentPrice: decimal("currentPrice", { precision: 20, scale: 8 }),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  collateral: decimal("collateral", { precision: 20, scale: 8 }).notNull(),
  liquidationPrice: decimal("liquidationPrice", { precision: 20, scale: 8 }),
  pnl: decimal("pnl", { precision: 20, scale: 8 }),
  status: mysqlEnum("status", ["open", "closed", "liquidated"]).default("open").notNull(),
  openedAt: timestamp("openedAt").defaultNow().notNull(),
  closedAt: timestamp("closedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Position = typeof positions.$inferSelect;
export type InsertPosition = typeof positions.$inferInsert;

/**
 * Trading history table
 */
export const trades = mysqlTable("trades", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  positionId: int("positionId"),
  symbol: varchar("symbol", { length: 20 }).notNull(),
  chain: varchar("chain", { length: 20 }).notNull(),
  type: mysqlEnum("type", ["long", "short"]).notNull(),
  action: mysqlEnum("action", ["open", "close", "liquidate"]).notNull(),
  leverage: int("leverage").notNull(),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  collateral: decimal("collateral", { precision: 20, scale: 8 }).notNull(),
  pnl: decimal("pnl", { precision: 20, scale: 8 }),
  fee: decimal("fee", { precision: 20, scale: 8 }),
  txHash: varchar("txHash", { length: 66 }), // Blockchain transaction hash
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Trade = typeof trades.$inferSelect;
export type InsertTrade = typeof trades.$inferInsert;

/**
 * Liquidity pool positions
 */
export const liquidityPositions = mysqlTable("liquidityPositions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  poolName: varchar("poolName", { length: 50 }).notNull(), // e.g., "ETH/USDT"
  chain: varchar("chain", { length: 20 }).notNull(),
  protocol: varchar("protocol", { length: 30 }).notNull(), // e.g., "Uniswap V3"
  token0: varchar("token0", { length: 20 }).notNull(),
  token1: varchar("token1", { length: 20 }).notNull(),
  amount0: decimal("amount0", { precision: 20, scale: 8 }).notNull(),
  amount1: decimal("amount1", { precision: 20, scale: 8 }).notNull(),
  lpTokens: decimal("lpTokens", { precision: 20, scale: 8 }).notNull(),
  apy: decimal("apy", { precision: 10, scale: 2 }), // Annual Percentage Yield
  totalValue: decimal("totalValue", { precision: 20, scale: 8 }),
  earnedFees: decimal("earnedFees", { precision: 20, scale: 8 }).default("0"),
  impermanentLoss: decimal("impermanentLoss", { precision: 20, scale: 8 }),
  status: mysqlEnum("status", ["active", "withdrawn"]).default("active").notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
  withdrawnAt: timestamp("withdrawnAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LiquidityPosition = typeof liquidityPositions.$inferSelect;
export type InsertLiquidityPosition = typeof liquidityPositions.$inferInsert;

/**
 * AI chat messages
 */
export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * User wallets
 */
export const wallets = mysqlTable("wallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  address: varchar("address", { length: 42 }).notNull(),
  chain: varchar("chain", { length: 20 }).notNull(),
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = typeof wallets.$inferInsert;
