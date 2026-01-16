import { useEffect, useRef, useState } from "react";
import { Eye, TrendingUp, MessageSquare, Brain } from "lucide-react";

interface LogEntry {
  id: string;
  aiType: "monitor" | "market" | "sentiment" | "strategy";
  message: string;
  timestamp: string;
}

interface AIExecutionLogProps {
  instanceId: string;
}

const AI_ICONS = {
  monitor: { icon: Eye, label: "盯盘AI", color: "text-blue-600" },
  market: { icon: TrendingUp, label: "市场AI", color: "text-purple-600" },
  sentiment: { icon: MessageSquare, label: "舆情AI", color: "text-green-600" },
  strategy: { icon: Brain, label: "策略AI", color: "text-orange-600" }
};

export default function AIExecutionLog({ instanceId }: AIExecutionLogProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 模拟 AI 日志生成
  useEffect(() => {
    const initialLogs: LogEntry[] = [
      {
        id: "1",
        aiType: "monitor",
        message: "正在监控 ETH 价格变化...",
        timestamp: "22:10:32"
      },
      {
        id: "2",
        aiType: "market",
        message: "分析 BTC 走势对 ETH 的影响...",
        timestamp: "22:10:35"
      },
      {
        id: "3",
        aiType: "sentiment",
        message: "Twitter 情绪 78% 看涨，V 神刚发推",
        timestamp: "22:10:38"
      },
      {
        id: "4",
        aiType: "strategy",
        message: "综合判断，建议持有并设置止盈 +20%",
        timestamp: "22:10:42"
      },
      {
        id: "5",
        aiType: "monitor",
        message: "价格突破 $3,580，买方力量增强",
        timestamp: "22:10:45"
      }
    ];
    setLogs(initialLogs);

    // 每 5 秒添加新日志
    const interval = setInterval(() => {
      const aiTypes: Array<"monitor" | "market" | "sentiment" | "strategy"> = ["monitor", "market", "sentiment", "strategy"];
      const messages = {
        monitor: [
          "监控到价格波动 +0.5%",
          "成交量放大，关注中",
          "价格测试阻力位 $3,600"
        ],
        market: [
          "BTC 保持强势，利好 ETH",
          "整体市场情绪偏多",
          "资金持续流入"
        ],
        sentiment: [
          "社交媒体讨论热度上升",
          "大V 发表看涨观点",
          "舆情指标保持乐观"
        ],
        strategy: [
          "当前策略有效，继续执行",
          "监控止盈位 $3,800",
          "准备部分止盈方案"
        ]
      };

      const randomAI = aiTypes[Math.floor(Math.random() * aiTypes.length)];
      const randomMessage = messages[randomAI][Math.floor(Math.random() * messages[randomAI].length)];
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        aiType: randomAI,
        message: randomMessage,
        timestamp
      }]);
    }, 5000);

    return () => clearInterval(interval);
  }, [instanceId]);

  // 自动滚动到最新消息
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div 
      ref={scrollRef}
      className="h-full bg-gray-50 border-b border-gray-200 p-4 overflow-y-auto space-y-2"
    >
      {logs.map((log) => {
        const aiConfig = AI_ICONS[log.aiType];
        const Icon = aiConfig.icon;
        
        return (
          <div 
            key={log.id}
            className="flex items-start gap-2 text-sm"
          >
            <span className="text-xs text-gray-500 font-mono flex-shrink-0 w-16">
              {log.timestamp}
            </span>
            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${aiConfig.color}`} />
            <span className={`font-semibold flex-shrink-0 ${aiConfig.color}`}>
              {aiConfig.label}:
            </span>
            <span className="text-gray-700">{log.message}</span>
          </div>
        );
      })}
    </div>
  );
}
