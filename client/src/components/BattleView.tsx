import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sword, 
  Heart, 
  Zap, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Flame,
  Skull,
  Target
} from "lucide-react";

interface BattleViewProps {
  instanceId: string;
  walletName?: string; // 钱包显示名，未连接则为 undefined
}

// Boss 类型
type BossType = "bear" | "bull" | "crab";

interface BossStatus {
  type: BossType;
  name: string;
  hp: number;
  maxHp: number;
  armor: number;
  attack: number;
  morale: "aggressive" | "neutral" | "weak";
  skills: string[];
}

interface PlayerStatus {
  weapon: string; // 杠杆倍数
  ammo: number; // 资金
  hp: number; // 健康度
  maxHp: number;
  position: number; // 持仓数量
  pnl: number;
  pnlPercent: number;
}

export default function BattleView({ instanceId, walletName }: BattleViewProps) {
  // 根据 instanceId 解析资产类型
  const getAssetInfo = (id: string) => {
    const upper = id.toUpperCase();
    if (upper.includes('ETH')) return { asset: 'ETH', name: 'ETH 牛魔王' };
    if (upper.includes('BTC')) return { asset: 'BTC', name: 'BTC 牛魔王' };
    if (upper.includes('SOL')) return { asset: 'SOL', name: 'SOL 牛魔王' };
    return { asset: 'ETH', name: 'ETH 牛魔王' };
  };
  
  const assetInfo = getAssetInfo(instanceId);
  const playerName = walletName || '游客';
  // 玩家状态
  const [player, setPlayer] = useState<PlayerStatus>({
    weapon: "3x 杠杆剑",
    ammo: 1000,
    hp: 35.6,
    maxHp: 100,
    position: 0.289,
    pnl: 107.25,
    pnlPercent: 10.73
  });

  // Boss 状态
  const [boss, setBoss] = useState<BossStatus>({
    type: "bull",
    name: assetInfo.name,
    hp: 65,
    maxHp: 100,
    armor: 3,
    attack: 45,
    morale: "aggressive",
    skills: ["突破阐力 (+$12M)", "成交量爆发 (340%)", "鲸鱼买入 (5K ETH)"]
  });

  // 战斗实况（世界 Boss + 资金流驱动）
  const [battleLog, setBattleLog] = useState<string[]>([
    `⚔️ 战斗开始！${playerName}使用 3x 杠杆剑挑战世界 Boss - ${assetInfo.name}`,
    `💰 ${playerName}投入 $1,000 弹药，加入多头阵营（当前总多头持仓 $45.2M）`,
    "📈 Boss 使用「突破阐力」（大额买单 +$12.3M 涌入，突破 $3,580 阐力位）",
    `✨ 团队暴击！所有多头持仓价值增加 +10.73%（${playerName}的收益 +$107.25）`,
    "🛡️ Boss 护甲层数：3 层（支撑位 $3,500 / $3,400 / $3,300，总买盘支撑 $38.6M）"
  ]);

  // 模拟战斗更新（世界 Boss + 资金流驱动）
  useEffect(() => {
    const interval = setInterval(() => {
      // 资金流驱动的事件（每个事件都包含资金流因子解释）
      const events = [
        "📊 Boss 使用「成交量爆发」（15分钟成交量暴增 340%，散户 FOMO 入场）",
        "💎 Boss 使用「鲸鱼买入」（巨鲸地址转入 5,000 ETH 至交易所，价格冲高 +3.2%）",
        "⚠️ Boss 使用「空头砸盘」（大额卖单 -$8.5M 砸盘，价格下跌 -2.1%，全体多头受伤）",
        "🎯 Boss 使用「突破阐力」（大额买单 +$12.3M 涌入，突破关键阐力位 $3,580）",
        "🔥 团队生命值恢复！（新增多头持仓 +$2.8M，更多玩家加入战斗）",
        "🛡️ Boss 护甲破裂！（支撑位 $3,500 被击穿，大额止损单 -$6.2M 触发）",
        "💥 Boss 使用「恐慌踩踏」（散户恐慌性抛售 -$4.7M，价格短时暴跌 -5.3%）",
        "✨ 团队暴击！（大量买入订单 +$15.6M 涌入，价格快速上涨 +4.8%）",
        "🐋 Boss 使用「机构出货」（机构大额减仓 -$9.8M，市场流动性枯竭）"
      ];

      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setBattleLog(prev => [...prev.slice(-4), randomEvent]);

      // 随机更新 Boss 状态
      setBoss(prev => ({
        ...prev,
        hp: Math.max(0, Math.min(100, prev.hp + (Math.random() - 0.5) * 10)),
        attack: Math.max(20, Math.min(80, prev.attack + (Math.random() - 0.5) * 10))
      }));

      // 随机更新玩家状态
      setPlayer(prev => ({
        ...prev,
        hp: Math.max(0, Math.min(100, prev.hp + (Math.random() - 0.5) * 5)),
        pnl: prev.pnl + (Math.random() - 0.5) * 20,
        pnlPercent: prev.pnlPercent + (Math.random() - 0.5) * 2
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, [instanceId]);

  const getBossIcon = (type: BossType) => {
    switch (type) {
      case "bull":
        return <TrendingUp className="w-8 h-8" />;
      case "bear":
        return <TrendingDown className="w-8 h-8" />;
      case "crab":
        return <Target className="w-8 h-8" />;
    }
  };

  const getBossColor = (type: BossType) => {
    switch (type) {
      case "bull":
        return "text-green-600 bg-green-100";
      case "bear":
        return "text-red-600 bg-red-100";
      case "crab":
        return "text-gray-600 bg-gray-100";
    }
  };

  const getMoraleColor = (morale: string) => {
    switch (morale) {
      case "aggressive":
        return "text-red-600";
      case "neutral":
        return "text-yellow-600";
      case "weak":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col">
      {/* Battle Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">⚔️ 战斗副本</h2>
        <p className="text-gray-600">{playerName} vs {boss.name}</p>
      </div>

      {/* Battle Arena */}
      <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Player Status */}
        <Card className="p-6 bg-white border-2 border-blue-200">
          <div className="flex items-center justify-between h-8 mb-4">
            <h3 className="text-lg font-bold text-blue-600">👤 {playerName}</h3>
            <div className="flex items-center gap-2">
              <Sword className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">{player.weapon}</span>
            </div>
          </div>

          {/* HP Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm h-5 mb-1">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-gray-700">生命值</span>
              </div>
              <span className={`font-bold ${
                player.hp > 50 ? "text-green-600" :
                player.hp > 30 ? "text-orange-600" :
                "text-red-600"
              }`}>
                {player.hp.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className={`h-full rounded-full transition-all ${
                  player.hp > 50 ? "bg-green-500" :
                  player.hp > 30 ? "bg-orange-500" :
                  "bg-red-500"
                }`}
                style={{ width: `${player.hp}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">💰 弹药（资金）</span>
              <span className="font-semibold text-gray-900">${player.ammo.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">📦 持仓</span>
              <span className="font-semibold text-gray-900">{player.position} ETH</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">💎 战果</span>
              <span className={`font-bold ${player.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                {player.pnl >= 0 ? "+" : ""}${player.pnl.toFixed(2)} ({player.pnl >= 0 ? "+" : ""}{player.pnlPercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Equipment Section */}
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-xs font-semibold text-gray-600 mb-3">⚔️ 装备栏</p>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 5, 10].map((leverage) => (
                <button
                  key={leverage}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    player.weapon === `${leverage}x 杠杆剑`
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    // TODO: 实现杠杆切换逻辑
                    console.log(`切换到 ${leverage}x 杠杆`);
                  }}
                >
                  {leverage}x
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Boss Status */}
        <Card className={`p-6 border-2 ${getBossColor(boss.type)}`}>
          <div className="flex items-center justify-between h-8 mb-4">
            <h3 className="text-lg font-bold text-gray-900">{boss.name}</h3>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getBossColor(boss.type)}`}>
              {getBossIcon(boss.type)}
            </div>
          </div>

          {/* HP Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm h-5 mb-1">
              <div className="flex items-center gap-1">
                <Skull className="w-4 h-4 text-gray-700" />
                <span className="font-semibold text-gray-700">Boss 血量</span>
              </div>
              <span className="font-bold text-gray-900">{boss.hp.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all"
                style={{ width: `${boss.hp}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">🛡️ 护甲层数</span>
              <span className="font-semibold text-gray-900">{boss.armor} 层</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">⚔️ 攻击力</span>
              <span className="font-semibold text-gray-900">{boss.attack.toFixed(0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">🔥 士气</span>
              <span className={`font-semibold ${getMoraleColor(boss.morale)}`}>
                {boss.morale === "aggressive" ? "高涨" : boss.morale === "neutral" ? "平稳" : "低落"}
              </span>
            </div>
          </div>

          {/* Boss Skills */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-2">Boss 技能</p>
            <div className="flex flex-wrap gap-2">
              {boss.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Battle Log */}
      <Card className="p-6 bg-white border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-600" />
          <h3 className="font-bold text-gray-900">实时战况</h3>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {battleLog.map((log, index) => (
            <p key={index} className="text-sm text-gray-700 leading-relaxed">
              {log}
            </p>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <Card className="p-6 bg-white border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">战斗操作</h3>
        <div className="grid grid-cols-4 gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            补充弹药
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Sword className="w-4 h-4" />
            更换武器
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            防御姿态
          </Button>
          <Button variant="destructive" className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            撤退
          </Button>
        </div>
      </Card>
    </div>
  );
}
