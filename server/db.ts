import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  positions, Position, InsertPosition,
  trades, Trade, InsertTrade,
  liquidityPositions, LiquidityPosition, InsertLiquidityPosition,
  chatMessages, ChatMessage, InsertChatMessage,
  wallets, Wallet, InsertWallet
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============= User Operations =============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============= Position Operations =============

export async function createPosition(position: InsertPosition): Promise<Position> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(positions).values(position);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(positions).where(eq(positions.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getUserPositions(userId: number, status?: "open" | "closed" | "liquidated"): Promise<Position[]> {
  const db = await getDb();
  if (!db) return [];

  if (status) {
    return await db.select().from(positions)
      .where(and(eq(positions.userId, userId), eq(positions.status, status)))
      .orderBy(desc(positions.openedAt));
  }
  
  return await db.select().from(positions)
    .where(eq(positions.userId, userId))
    .orderBy(desc(positions.openedAt));
}

export async function updatePosition(id: number, updates: Partial<Position>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(positions).set(updates).where(eq(positions.id, id));
}

// ============= Trade Operations =============

export async function createTrade(trade: InsertTrade): Promise<Trade> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(trades).values(trade);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(trades).where(eq(trades.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getUserTrades(userId: number, limit: number = 50): Promise<Trade[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(trades)
    .where(eq(trades.userId, userId))
    .orderBy(desc(trades.createdAt))
    .limit(limit);
}

// ============= Liquidity Position Operations =============

export async function createLiquidityPosition(position: InsertLiquidityPosition): Promise<LiquidityPosition> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(liquidityPositions).values(position);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(liquidityPositions).where(eq(liquidityPositions.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getUserLiquidityPositions(userId: number, status?: "active" | "withdrawn"): Promise<LiquidityPosition[]> {
  const db = await getDb();
  if (!db) return [];

  if (status) {
    return await db.select().from(liquidityPositions)
      .where(and(eq(liquidityPositions.userId, userId), eq(liquidityPositions.status, status)))
      .orderBy(desc(liquidityPositions.addedAt));
  }
  
  return await db.select().from(liquidityPositions)
    .where(eq(liquidityPositions.userId, userId))
    .orderBy(desc(liquidityPositions.addedAt));
}

export async function updateLiquidityPosition(id: number, updates: Partial<LiquidityPosition>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(liquidityPositions).set(updates).where(eq(liquidityPositions.id, id));
}

// ============= Chat Message Operations =============

export async function createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(chatMessages).values(message);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(chatMessages).where(eq(chatMessages.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getUserChatMessages(userId: number, limit: number = 100): Promise<ChatMessage[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(chatMessages)
    .where(eq(chatMessages.userId, userId))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);
}

// ============= Wallet Operations =============

export async function createWallet(wallet: InsertWallet): Promise<Wallet> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(wallets).values(wallet);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(wallets).where(eq(wallets.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getUserWallets(userId: number): Promise<Wallet[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(wallets)
    .where(eq(wallets.userId, userId))
    .orderBy(desc(wallets.createdAt));
}
