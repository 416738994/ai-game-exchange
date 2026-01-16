import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AICard, { AIMessage, AIRole, AIStatus } from "@/components/AICard";
import { TrendingUp, TrendingDown, Activity, DollarSign, Target } from "lucide-react";

interface InstanceDetailPageProps {
  instanceId: string;
}

export default function InstanceDetailPage({ instanceId }: InstanceDetailPageProps) {
  // AI 消息状态
  const [commanderMessages, setCommanderMessages] = useState<AIMessage[]>([
    {
      id: "1",
      timestamp: "09:30:15",
      type: "log",
      content: "老板好！我是您的总指挥 AI，正在协调团队监控 ETH 3x Long 副本"
    }
  ]);

  const [monitorMessages, setMonitorMessages] = useState<AIMessage[]>([
    {
      id: "1",
      timestamp: "09:30:20",
      type: "log",
      content: "正在监控 ETH 价格... 当前 $3,580.45"
    }
  ]);

  const [marketMessages, setMarketMessages] = useState<AIMessage[]>([
    {
      id: "1",
      timestamp: "09:30:25",
      type: "log",
      content: "分析 BTC 走势对 ETH 的影响..."
    }
  ]);

  const [sentimentMessages, setSentimentMessages] = useState<AIMessage[]>([
    {
      id: "1",
      timestamp: "09:30:30",
      type: "log",
      content: "监控 Twitter 情绪... 当前 78% 看涨"
    }
  ]);

  const [strategyMessages, setStrategyMessages] = useState<AIMessage[]>([
    {
      id: "1",
      timestamp: "09:30:35",
      type: "log",
      content: "当前策略：持有并观察，止盈目标 +20%"
    }
  ]);

  // 模拟 AI 协作对话
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
      
      const scenarios = [
        // 盯盘 AI 发现异常
        () => {
          setMonitorMessages(prev => [...prev, {
            id: Date.now().toString(),
            timestamp,
            type: "log",
            content: "⚠️ 注意！ETH 价格突破 $3,600，波动加剧"
          }]);
          
          setTimeout(() => {
            setStrategyMessages(prev => [...prev, {
              id: Date.now().toString(),
              timestamp: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${(now.getSeconds() + 2).toString().padStart(2, "0")}`,
              type: "mention",
              content: "收到！正在评估是否需要调整止盈目标",
              mentionTo: "盯盘AI"
            }]);
          }, 2000);
        },
        
        // 市场 AI 提供分析
        () => {
          setMarketMessages(prev => [...prev, {
            id: Date.now().toString(),
            timestamp,
            type: "log",
            content: "BTC 正在突破阻力位 $96,000，可能带动 ETH 上涨"
          }]);
          
          setTimeout(() => {
            setStrategyMessages(prev => [...prev, {
              id: Date.now().toString(),
              timestamp: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${(now.getSeconds() + 3).toString().padStart(2, "0")}`,
              type: "mention",
              content: "好消息！建议继续持有",
              mentionTo: "市场分析AI"
            }]);
          }, 3000);
        },
        
        // 舆情 AI 报告
        () => {
          setSentimentMessages(prev => [...prev, {
            id: Date.now().toString(),
            timestamp,
            type: "log",
            content: "Twitter 情绪转为看涨，V 神刚发推讨论 ETH 升级"
          }]);
          
          setTimeout(() => {
            setCommanderMessages(prev => [...prev, {
              id: Date.now().toString(),
              timestamp: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${(now.getSeconds() + 4).toString().padStart(2, "0")}`,
              type: "conclusion",
              content: "老板，团队综合判断：ETH 短期看涨，建议持有"
            }]);
          }, 4000);
        }
      ];
      
      // 随机选择一个场景
      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      scenario();
    }, 15000); // 每 15 秒触发一次

    return () => clearInterval(interval);
  }, []);

  // 用户发送消息给总指挥 AI
  const handleUserMessage = (message: string) => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    
    // 添加用户消息
    setCommanderMessages(prev => [...prev, {
      id: Date.now().toString(),
      timestamp,
      type: "log",
      content: `用户：${message}`
    }]);
    
    // 模拟 AI 回复
    setTimeout(() => {
      setCommanderMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        timestamp: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${(now.getSeconds() + 2).toString().padStart(2, "0")}`,
        type: "conclusion",
        content: "收到！我会立即执行您的指令"
      }]);
    }, 2000);
  };

  // 模拟副本数据
  const instanceData = {
    name: "ETH 3x Long",
    symbol: "ETH",
    leverage: "3x",
    invested: 1000,
    currentValue: 1107.25,
    pnl: 107.25,
    pnlPercent: 10.73,
    currentPrice: 3580.45,
    entryPrice: 3456.78,
    position: 0.289,
    health: 35.6,
    liquidationPrice: 2890.12
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left: AI Team Panel */}
      <div className="w-2/5 border-r border-gray-200 overflow-y-auto p-6 space-y-4 bg-white">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">{instanceData.name} - AI 团队</h2>
          <p className="text-sm text-gray-600 mt-1">5 个 AI 正在协作管理这个副本</p>
        </div>

        {/* Commander AI */}
        <AICard
          role="commander"
          name="总指挥 AI"
          status="working"
          messages={commanderMessages}
          isCommander={true}
          onSendMessage={handleUserMessage}
        />

        {/* Monitor AI */}
        <AICard
          role="monitor"
          name="盯盘 AI"
          status="working"
          messages={monitorMessages}
        />

        {/* Market AI */}
        <AICard
          role="market"
          name="市场分析 AI"
          status="thinking"
          messages={marketMessages}
        />

        {/* Sentiment AI */}
        <AICard
          role="sentiment"
          name="舆情分析 AI"
          status="working"
          messages={sentimentMessages}
        />

        {/* Strategy AI */}
        <AICard
          role="strategy"
          name="策略 AI"
          status="standby"
          messages={strategyMessages}
        />
      </div>

      {/* Right: Instance Data */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{instanceData.name}</h2>
          <p className="text-gray-600 mt-1">实时数据和操作面板</p>
        </div>

        {/* Price and P&L */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 bg-white border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">当前价格</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${instanceData.currentPrice.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              开仓价格: ${instanceData.entryPrice.toLocaleString()}
            </div>
          </Card>

          <Card className="p-6 bg-white border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">盈亏</p>
                <p className={`text-2xl font-bold mt-1 ${instanceData.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {instanceData.pnl >= 0 ? "+" : ""}${instanceData.pnl.toFixed(2)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                instanceData.pnl >= 0 ? "bg-green-100" : "bg-red-100"
              }`}>
                {instanceData.pnl >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
            <div className="mt-4 text-sm">
              <span className={`font-semibold ${instanceData.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                {instanceData.pnl >= 0 ? "+" : ""}{instanceData.pnlPercent.toFixed(2)}%
              </span>
            </div>
          </Card>
        </div>

        {/* Position Info */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-white border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">投入资金</span>
            </div>
            <p className="text-xl font-bold text-gray-900">${instanceData.invested.toLocaleString()}</p>
          </Card>

          <Card className="p-4 bg-white border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">当前价值</span>
            </div>
            <p className="text-xl font-bold text-gray-900">${instanceData.currentValue.toLocaleString()}</p>
          </Card>

          <Card className="p-4 bg-white border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">持仓数量</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{instanceData.position} {instanceData.symbol}</p>
          </Card>
        </div>

        {/* Health and Leverage */}
        <Card className="p-6 bg-white border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">风险指标</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">健康度</span>
                <span className={`font-semibold ${
                  instanceData.health > 50 ? "text-green-600" :
                  instanceData.health > 30 ? "text-orange-600" :
                  "text-red-600"
                }`}>
                  {instanceData.health.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    instanceData.health > 50 ? "bg-green-500" :
                    instanceData.health > 30 ? "bg-orange-500" :
                    "bg-red-500"
                  }`}
                  style={{ width: `${instanceData.health}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">当前杠杆</span>
                <p className="font-semibold text-gray-900 mt-1">{instanceData.leverage}</p>
              </div>
              <div>
                <span className="text-gray-600">清算价格</span>
                <p className="font-semibold text-red-600 mt-1">${instanceData.liquidationPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card className="p-6 bg-white border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">操作</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              手动补仓
            </Button>
            <Button variant="outline" className="w-full">
              调整杠杆
            </Button>
            <Button variant="outline" className="w-full">
              部分平仓
            </Button>
            <Button variant="destructive" className="w-full">
              强制平仓
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
