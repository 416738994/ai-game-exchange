import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ThinkingLog {
  time: string;
  icon: string;
  message: string;
  type: 'monitor' | 'analyze' | 'decision' | 'alert' | 'execute';
}

const initialLogs: ThinkingLog[] = [
  { time: '08:45:32', icon: '📊', message: '正在监控 ETH 价格变化...', type: 'monitor' },
  { time: '08:45:35', icon: '🔍', message: '分析资金流数据...', type: 'analyze' },
  { time: '08:45:38', icon: '📈', message: 'ETH +2.3%，资金流 +$2.3M/h，持续看涨', type: 'decision' },
  { time: '08:46:10', icon: '⚠️', message: '注意！BTC 跌破支撑位 $94,000', type: 'alert' },
  { time: '08:46:15', icon: '🤔', message: '思考中：是否需要调整 BTC 副本策略...', type: 'analyze' },
  { time: '08:46:20', icon: '💡', message: '决策：准备止损预案，等待确认信号', type: 'decision' },
  { time: '08:46:25', icon: '📊', message: '继续监控中...', type: 'monitor' },
];

export default function AIThinkingChain() {
  const [logs, setLogs] = useState<ThinkingLog[]>(initialLogs);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 模拟实时更新思维链
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog: ThinkingLog = generateRandomLog();
      setLogs((prev) => [...prev, newLog]);
    }, 5000); // 每 5 秒添加一条新日志

    return () => clearInterval(interval);
  }, []);

  // 自动滚动到最新消息
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">💭 实时动态</h3>
        <span className="text-xs text-muted-foreground">
          {logs.length} 条记录
        </span>
      </div>

      <ScrollArea className="h-[300px] rounded-lg border bg-muted/30 p-3">
        <div ref={scrollRef} className="space-y-2">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`text-xs flex gap-2 p-2 rounded ${getLogStyle(log.type)}`}
            >
              <span className="text-muted-foreground font-mono">[{log.time}]</span>
              <span>{log.icon}</span>
              <span className="flex-1">{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function generateRandomLog(): ThinkingLog {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const logTemplates = [
    { icon: '📊', message: '监控 ETH 价格波动...', type: 'monitor' as const },
    { icon: '📊', message: '监控 BTC 资金流变化...', type: 'monitor' as const },
    { icon: '🔍', message: '分析市场情绪数据...', type: 'analyze' as const },
    { icon: '🔍', message: '评估持仓风险...', type: 'analyze' as const },
    { icon: '📈', message: 'SOL 突破阻力位，资金流增强', type: 'decision' as const },
    { icon: '💡', message: '决策：维持当前策略', type: 'decision' as const },
    { icon: '⚠️', message: 'BTC 健康度下降至 30%', type: 'alert' as const },
    { icon: '✅', message: 'ETH 副本达到止盈目标附近', type: 'execute' as const },
  ];

  return {
    time,
    ...logTemplates[Math.floor(Math.random() * logTemplates.length)],
  };
}

function getLogStyle(type: ThinkingLog['type']): string {
  switch (type) {
    case 'monitor':
      return 'bg-blue-50 text-blue-900';
    case 'analyze':
      return 'bg-purple-50 text-purple-900';
    case 'decision':
      return 'bg-green-50 text-green-900';
    case 'alert':
      return 'bg-red-50 text-red-900';
    case 'execute':
      return 'bg-orange-50 text-orange-900';
    default:
      return 'bg-gray-50 text-gray-900';
  }
}
