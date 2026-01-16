import { useState } from 'react';
import AIEmployeeLayout from '@/components/AIEmployeeLayout';
import AIBattleReport from '@/components/AIBattleReport';
import AIThinkingChain from '@/components/AIThinkingChain';
import AIDecisionRequest from '@/components/AIDecisionRequest';
import MarketRadar from '@/components/MarketRadar';
import InstanceCard from '@/components/InstanceCard';
import InstanceDetailBar from '@/components/InstanceDetailBar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function GameDashboardV2() {
  const [selectedInstance, setSelectedInstance] = useState<any>(null);

  const mockInstances = [
    {
      id: '1',
      symbol: 'ETH',
      leverage: 3,
      strategy: '3x Long - 中等风险策略',
      currentPrice: 3580.45,
      entryPrice: 3456.78,
      invested: 1000,
      pnl: 107.25,
      pnlPercent: 10.73,
      health: 35.6,
      liquidationPrice: 2304.52,
      position: '0.289 ETH',
      isLong: true,
    },
    {
      id: '2',
      symbol: 'BTC',
      leverage: 2,
      strategy: '2x Long - 稳健策略',
      currentPrice: 94123.45,
      entryPrice: 95234.56,
      invested: 2000,
      pnl: -23.34,
      pnlPercent: -1.17,
      health: 32.5,
      liquidationPrice: 63489.71,
      position: '0.021 BTC',
      isLong: true,
    },
  ];

  const handleInstanceClick = (instance: any) => {
    setSelectedInstance({
      name: `${instance.symbol} ${instance.leverage}x Long`,
      committedFunds: instance.invested,
      currentValue: instance.invested + instance.pnl,
      profitPercent: instance.pnlPercent,
      position: instance.position,
      entryPrice: instance.entryPrice,
      currentLeverage: instance.leverage,
      health: instance.health,
      liquidationPrice: instance.liquidationPrice,
      strategy: {
        stopProfit: '+20% 自动平仓',
        stopLoss: '-5% 或健康度 < 20%',
        capitalFlow: '+$2.3M/h ✅',
        sentiment: '78% 看涨 ✅',
      },
    });
  };

  // AI 面板内容
  const aiPanel = (
    <div className="space-y-0">
      <AIBattleReport />
      <AIThinkingChain />
      <AIDecisionRequest />
    </div>
  );

  return (
    <AIEmployeeLayout aiPanel={aiPanel}>
      {/* 上部区域 */}
      <div className="p-6 border-b bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <MarketRadar />
            {/* 其他上部组件可以在这里添加 */}
          </div>
        </div>
      </div>

      {/* 中部：交易副本 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">交易副本</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              开启新副本
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {mockInstances.map((instance) => (
              <div
                key={instance.id}
                onClick={() => handleInstanceClick(instance)}
                className="cursor-pointer transition-all hover:scale-[1.02]"
              >
                <InstanceCard {...instance} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 下部：副本详情状态栏 */}
      <InstanceDetailBar
        instance={selectedInstance}
        onClose={() => setSelectedInstance(null)}
      />
    </AIEmployeeLayout>
  );
}
