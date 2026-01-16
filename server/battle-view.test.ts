import { describe, it, expect } from "vitest";

/**
 * 战斗视图系统测试
 * 
 * 测试 Boss 拟态化计算逻辑和游戏化数据转换
 */

// Boss 类型
type BossType = "bear" | "bull" | "crab";

// Boss 状态接口
interface BossStatus {
  type: BossType;
  name: string;
  hp: number;
  maxHp: number;
  armor: number;
  attack: number;
  morale: "aggressive" | "neutral" | "weak";
}

// 玩家状态接口
interface PlayerStatus {
  weapon: string;
  ammo: number;
  hp: number;
  maxHp: number;
  position: number;
  pnl: number;
  pnlPercent: number;
}

// 市场数据接口
interface MarketData {
  currentPrice: number;
  entryPrice: number;
  priceChange: number;
  volume24h: number;
  volatility: number;
  resistance: number[];
  support: number[];
}

// 交易数据接口
interface TradeData {
  leverage: number;
  invested: number;
  currentValue: number;
  position: number;
  liquidationPrice: number;
}

/**
 * 计算 Boss 类型
 * 基于价格变化趋势判断
 */
function calculateBossType(priceChange: number): BossType {
  if (priceChange > 5) return "bull";
  if (priceChange < -5) return "bear";
  return "crab";
}

/**
 * 计算 Boss 血量
 * 基于卖方压力（订单簿深度）
 * 简化版本：使用价格距离阻力位的百分比
 */
function calculateBossHP(currentPrice: number, resistance: number): number {
  const distance = ((resistance - currentPrice) / currentPrice) * 100;
  // 距离阻力位越近，Boss 血量越低（反转逻辑）
  // 距离 0% = Boss 血量 0%，距离 10% = Boss 血量 100%
  return Math.max(0, Math.min(100, distance * 10));
}

/**
 * 计算 Boss 护甲层数
 * 基于阻力位数量
 */
function calculateBossArmor(resistanceLevels: number[]): number {
  return resistanceLevels.length;
}

/**
 * 计算 Boss 攻击力
 * 基于波动率
 */
function calculateBossAttack(volatility: number): number {
  // 波动率越高，攻击力越强
  return Math.min(100, volatility * 100);
}

/**
 * 计算 Boss 士气
 * 基于价格趋势和成交量
 */
function calculateBossMorale(priceChange: number, volume: number): "aggressive" | "neutral" | "weak" {
  if (priceChange > 3 && volume > 1000000) return "aggressive";
  if (priceChange < -3 || volume < 500000) return "weak";
  return "neutral";
}

/**
 * 计算玩家生命值（健康度）
 * 基于距离清算价格的百分比
 */
function calculatePlayerHP(currentPrice: number, liquidationPrice: number): number {
  const distance = ((currentPrice - liquidationPrice) / liquidationPrice) * 100;
  return Math.max(0, Math.min(100, distance));
}

/**
 * 生成 Boss 状态
 */
function generateBossStatus(marketData: MarketData): BossStatus {
  const type = calculateBossType(marketData.priceChange);
  const hp = calculateBossHP(marketData.currentPrice, marketData.resistance[0] || marketData.currentPrice * 1.1);
  const armor = calculateBossArmor(marketData.resistance);
  const attack = calculateBossAttack(marketData.volatility);
  const morale = calculateBossMorale(marketData.priceChange, marketData.volume24h);

  const names = {
    bull: "牛魔王",
    bear: "熊霸天",
    crab: "蟹将军"
  };

  return {
    type,
    name: `ETH ${names[type]}`,
    hp,
    maxHp: 100,
    armor,
    attack,
    morale
  };
}

/**
 * 生成玩家状态
 */
function generatePlayerStatus(tradeData: TradeData, marketData: MarketData): PlayerStatus {
  const hp = calculatePlayerHP(marketData.currentPrice, tradeData.liquidationPrice);
  const pnl = tradeData.currentValue - tradeData.invested;
  const pnlPercent = (pnl / tradeData.invested) * 100;

  return {
    weapon: `${tradeData.leverage}x 杠杆剑`,
    ammo: tradeData.invested,
    hp,
    maxHp: 100,
    position: tradeData.position,
    pnl,
    pnlPercent
  };
}

describe("战斗视图 - Boss 拟态化系统", () => {
  describe("Boss 类型判断", () => {
    it("价格上涨超过 5% 应该是牛 Boss", () => {
      const type = calculateBossType(6);
      expect(type).toBe("bull");
    });

    it("价格下跌超过 5% 应该是熊 Boss", () => {
      const type = calculateBossType(-6);
      expect(type).toBe("bear");
    });

    it("价格波动在 -5% 到 5% 之间应该是蟹 Boss", () => {
      const type1 = calculateBossType(2);
      const type2 = calculateBossType(-2);
      expect(type1).toBe("crab");
      expect(type2).toBe("crab");
    });
  });

  describe("Boss 血量计算", () => {
    it("价格接近阻力位时 Boss 血量应该较低", () => {
      const hp = calculateBossHP(3500, 3600);
      expect(hp).toBeLessThan(50);
    });

    it("价格远离阻力位时 Boss 血量应该较高", () => {
      const hp = calculateBossHP(3000, 3600);
      expect(hp).toBeGreaterThan(50);
    });

    it("Boss 血量应该在 0-100 之间", () => {
      const hp1 = calculateBossHP(3500, 3600);
      const hp2 = calculateBossHP(2000, 3600);
      expect(hp1).toBeGreaterThanOrEqual(0);
      expect(hp1).toBeLessThanOrEqual(100);
      expect(hp2).toBeGreaterThanOrEqual(0);
      expect(hp2).toBeLessThanOrEqual(100);
    });
  });

  describe("Boss 护甲计算", () => {
    it("阻力位越多，护甲层数越多", () => {
      const armor1 = calculateBossArmor([3600, 3700, 3800]);
      const armor2 = calculateBossArmor([3600]);
      expect(armor1).toBe(3);
      expect(armor2).toBe(1);
    });

    it("没有阻力位时护甲为 0", () => {
      const armor = calculateBossArmor([]);
      expect(armor).toBe(0);
    });
  });

  describe("Boss 攻击力计算", () => {
    it("波动率越高，攻击力越强", () => {
      const attack1 = calculateBossAttack(0.5);
      const attack2 = calculateBossAttack(0.1);
      expect(attack1).toBeGreaterThan(attack2);
    });

    it("攻击力应该在 0-100 之间", () => {
      const attack1 = calculateBossAttack(0.5);
      const attack2 = calculateBossAttack(1.5);
      expect(attack1).toBeLessThanOrEqual(100);
      expect(attack2).toBeLessThanOrEqual(100);
    });
  });

  describe("Boss 士气计算", () => {
    it("价格大涨且成交量大时士气高涨", () => {
      const morale = calculateBossMorale(5, 2000000);
      expect(morale).toBe("aggressive");
    });

    it("价格大跌或成交量小时士气低落", () => {
      const morale1 = calculateBossMorale(-5, 1000000);
      const morale2 = calculateBossMorale(2, 300000);
      expect(morale1).toBe("weak");
      expect(morale2).toBe("weak");
    });

    it("正常情况下士气平稳", () => {
      const morale = calculateBossMorale(1, 800000);
      expect(morale).toBe("neutral");
    });
  });

  describe("玩家生命值计算", () => {
    it("价格远离清算价格时生命值应该较高", () => {
      const hp = calculatePlayerHP(3500, 2500);
      expect(hp).toBeGreaterThan(30);
    });

    it("价格接近清算价格时生命值应该较低", () => {
      const hp = calculatePlayerHP(2600, 2500);
      expect(hp).toBeLessThan(10);
    });

    it("生命值应该在 0-100 之间", () => {
      const hp1 = calculatePlayerHP(3500, 2500);
      const hp2 = calculatePlayerHP(2400, 2500);
      expect(hp1).toBeGreaterThanOrEqual(0);
      expect(hp1).toBeLessThanOrEqual(100);
      expect(hp2).toBeGreaterThanOrEqual(0);
      expect(hp2).toBeLessThanOrEqual(100);
    });
  });

  describe("Boss 状态生成", () => {
    it("应该正确生成完整的 Boss 状态", () => {
      const marketData: MarketData = {
        currentPrice: 3500,
        entryPrice: 3400,
        priceChange: 6,
        volume24h: 2000000,
        volatility: 0.4,
        resistance: [3600, 3700, 3800],
        support: [3400, 3300, 3200]
      };

      const boss = generateBossStatus(marketData);

      expect(boss.type).toBe("bull");
      expect(boss.name).toContain("牛魔王");
      expect(boss.hp).toBeGreaterThanOrEqual(0);
      expect(boss.hp).toBeLessThanOrEqual(100);
      expect(boss.armor).toBe(3);
      expect(boss.attack).toBeGreaterThan(0);
      expect(boss.morale).toBe("aggressive");
    });
  });

  describe("玩家状态生成", () => {
    it("应该正确生成完整的玩家状态", () => {
      const tradeData: TradeData = {
        leverage: 3,
        invested: 1000,
        currentValue: 1100,
        position: 0.289,
        liquidationPrice: 2890
      };

      const marketData: MarketData = {
        currentPrice: 3500,
        entryPrice: 3400,
        priceChange: 6,
        volume24h: 2000000,
        volatility: 0.4,
        resistance: [3600, 3700, 3800],
        support: [3400, 3300, 3200]
      };

      const player = generatePlayerStatus(tradeData, marketData);

      expect(player.weapon).toBe("3x 杠杆剑");
      expect(player.ammo).toBe(1000);
      expect(player.hp).toBeGreaterThan(0);
      expect(player.position).toBe(0.289);
      expect(player.pnl).toBe(100);
      expect(player.pnlPercent).toBe(10);
    });
  });

  describe("战斗场景模拟", () => {
    it("牛市场景：Boss 高士气，玩家盈利", () => {
      const marketData: MarketData = {
        currentPrice: 3600,
        entryPrice: 3400,
        priceChange: 5.88,
        volume24h: 2500000,
        volatility: 0.3,
        resistance: [3700, 3800],
        support: [3500, 3400]
      };

      const tradeData: TradeData = {
        leverage: 3,
        invested: 1000,
        currentValue: 1176,
        position: 0.289,
        liquidationPrice: 2890
      };

      const boss = generateBossStatus(marketData);
      const player = generatePlayerStatus(tradeData, marketData);

      expect(boss.type).toBe("bull");
      expect(boss.morale).toBe("aggressive");
      expect(player.pnl).toBeGreaterThan(0);
      expect(player.hp).toBeGreaterThan(20);
    });

    it("熊市场景：Boss 攻击力强，玩家亏损", () => {
      const marketData: MarketData = {
        currentPrice: 3200,
        entryPrice: 3400,
        priceChange: -5.88,
        volume24h: 1800000,
        volatility: 0.6,
        resistance: [3300, 3400],
        support: [3100, 3000]
      };

      const tradeData: TradeData = {
        leverage: 3,
        invested: 1000,
        currentValue: 824,
        position: 0.289,
        liquidationPrice: 2890
      };

      const boss = generateBossStatus(marketData);
      const player = generatePlayerStatus(tradeData, marketData);

      expect(boss.type).toBe("bear");
      expect(boss.attack).toBeGreaterThan(50);
      expect(player.pnl).toBeLessThan(0);
      expect(player.hp).toBeLessThan(15);
    });

    it("横盘场景：Boss 士气平稳，玩家小幅盈利", () => {
      const marketData: MarketData = {
        currentPrice: 3420,
        entryPrice: 3400,
        priceChange: 0.59,
        volume24h: 800000,
        volatility: 0.15,
        resistance: [3500, 3600],
        support: [3300, 3200]
      };

      const tradeData: TradeData = {
        leverage: 3,
        invested: 1000,
        currentValue: 1018,
        position: 0.289,
        liquidationPrice: 2890
      };

      const boss = generateBossStatus(marketData);
      const player = generatePlayerStatus(tradeData, marketData);

      expect(boss.type).toBe("crab");
      expect(boss.morale).toBe("neutral");
      expect(player.pnl).toBeGreaterThanOrEqual(0);
      expect(player.pnl).toBeLessThan(50);
    });
  });
});
