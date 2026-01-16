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

export default function BattleView({ instanceId }: BattleViewProps) {
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
    name: "ETH 牛魔王",
    hp: 65,
    maxHp: 100,
    armor: 3,
    attack: 45,
    morale: "aggressive",
    skills: ["突破阻力", "成交量爆发", "鲸鱼买入"]
  });

  // 战斗实况
  const [battleLog, setBattleLog] = useState<string[]>([
    "⚔️ 战斗开始！你使用 3x 杠杆剑挑战 ETH 牛魔王",
    "💰 你投入 $1,000 弹药，开始进攻",
    "📈 Boss 使用技能「突破阻力」，价格上涨至 $3,580",
    "✨ 暴击！你的持仓价值增加 +10.73%",
    "🛡️ Boss 护甲层数：3 层（支撑位 $3,500 / $3,400 / $3,300）"
  ]);

  // 模拟战斗更新
  useEffect(() => {
    const interval = setInterval(() => {
      const events = [
        "📊 Boss 使用「成交量爆发」，攻击力提升",
        "💎 鲸鱼入场！Boss 士气高涨",
        "⚠️ Boss 发动反击，价格回调 -2%",
        "🎯 你的策略奏效，Boss HP 下降",
        "🔥 连击！持仓价值持续增长",
        "🛡️ Boss 护甲破裂，支撑位被击穿"
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
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 space-y-6">
      {/* Battle Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">⚔️ 战斗副本</h2>
        <p className="text-gray-600">你 vs {boss.name}</p>
      </div>

      {/* Battle Arena */}
      <div className="grid grid-cols-2 gap-6">
        {/* Player Status */}
        <Card className="p-6 bg-white border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-blue-600">👤 你</h3>
            <div className="flex items-center gap-2">
              <Sword className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">{player.weapon}</span>
            </div>
          </div>

          {/* HP Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
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
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
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
        </Card>

        {/* Boss Status */}
        <Card className={`p-6 border-2 ${getBossColor(boss.type)}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">{boss.name}</h3>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getBossColor(boss.type)}`}>
              {getBossIcon(boss.type)}
            </div>
          </div>

          {/* HP Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center gap-1">
                <Skull className="w-4 h-4 text-gray-700" />
                <span className="font-semibold text-gray-700">Boss 血量</span>
              </div>
              <span className="font-bold text-gray-900">{boss.hp.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all"
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
