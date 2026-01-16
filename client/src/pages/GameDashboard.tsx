import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import InstanceCard from '@/components/InstanceCard';
import LeverageSkills from '@/components/LeverageSkills';
import MarketRadar from '@/components/MarketRadar';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  Package, 
  History,
  Plus,
  TrendingUp,
  DollarSign
} from 'lucide-react';

// 模拟数据
const mockInstances = [
  {
    id: '1',
    symbol: 'ETH',
    leverage: 3,
    entryPrice: 3456.78,
    currentPrice: 3580.45,
    invested: 1000,
    pnl: 107.25,
    pnlPercent: 10.73,
    liquidationPrice: 2304.52,
    strategy: '3x Long - 中等风险策略',
    isLong: true
  },
  {
    id: '2',
    symbol: 'BTC',
    leverage: 2,
    entryPrice: 95234.56,
    currentPrice: 94123.45,
    invested: 2000,
    pnl: -23.34,
    pnlPercent: -1.17,
    liquidationPrice: 63489.71,
    strategy: '2x Long - 稳健策略',
    isLong: true
  }
];

export default function GameDashboard() {
  const [instances, setInstances] = useState(mockInstances);
  const [selectedLeverage, setSelectedLeverage] = useState(3);
  const [balance, setBalance] = useState(20000);

  // 模拟价格波动
  useEffect(() => {
    const interval = setInterval(() => {
      setInstances(prev => prev.map(instance => {
        // 随机价格变化 (-2% 到 +2%)
        const priceChange = (Math.random() - 0.5) * 0.04;
        const newPrice = instance.currentPrice * (1 + priceChange);
        
        // 计算新的盈亏
        const priceChangePercent = ((newPrice - instance.entryPrice) / instance.entryPrice);
        const newPnl = instance.invested * priceChangePercent * instance.leverage;
        const newPnlPercent = (newPnl / instance.invested) * 100;

        // 检测暴击（快速上涨 > 5%）或受击（快速下跌 > 5%）
        const quickChange = Math.abs(priceChange) > 0.05;
        if (quickChange && typeof window !== 'undefined' && (window as any).triggerScreenEffect) {
          (window as any).triggerScreenEffect(priceChange > 0 ? 'profit' : 'loss');
        }

        return {
          ...instance,
          currentPrice: newPrice,
          pnl: newPnl,
          pnlPercent: newPnlPercent
        };
      }));
    }, 3000); // 每3秒更新一次

    return () => clearInterval(interval);
  }, []);

  // 计算总盈亏
  const totalPnl = instances.reduce((sum, instance) => sum + instance.pnl, 0);
  const totalPnlPercent = instances.length > 0 
    ? (totalPnl / instances.reduce((sum, i) => sum + i.invested, 0)) * 100 
    : 0;

  return (
    <GameLayout>
      <div className="h-full overflow-auto">
        {/* 上部：特定区域 */}
        <div className="border-b border-border bg-card/30">
          <div className="container py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 市场雷达 */}
              <MarketRadar 
                sentiment="bullish"
                btcChange={2.3}
                ethChange={-1.2}
                totalMarketCap="$2.1T"
              />

              {/* AI 建议 */}
              <div className="bg-card border border-border rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">AI 建议</h3>
                    <p className="text-xs text-muted-foreground">实时交易机会</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-green-700 font-medium">📈 SOL 突破关键阻力位</p>
                    <p className="text-xs text-green-600 mt-1">建议 2-3x 做多</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded border border-blue-200">
                    <p className="text-blue-700 font-medium">💡 ETH 回调至支撑位</p>
                    <p className="text-xs text-blue-600 mt-1">可考虑加仓</p>
                  </div>
                </div>
              </div>

              {/* 投资目标 */}
              <div className="bg-card border border-border rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">投资目标</h3>
                    <p className="text-xs text-muted-foreground">本月目标进度</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">收益目标</span>
                      <span className="font-semibold">+20%</span>
                    </div>
                    <div className="health-bar h-3">
                      <div className="health-bar-fill safe" style={{ width: '53.65%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      已完成 {totalPnlPercent.toFixed(2)}% / 20%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 中部：战斗画面（副本展示） */}
        <div className="container py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">战斗画面</h2>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              开启新副本
            </Button>
          </div>

          {instances.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {instances.map(instance => (
                <InstanceCard
                  key={instance.id}
                  {...instance}
                  onClose={() => {
                    setInstances(prev => prev.filter(i => i.id !== instance.id));
                  }}
                  onChangeStrategy={() => {
                    console.log('更换策略', instance.id);
                  }}
                  onLetAITakeOver={() => {
                    console.log('让AI接管', instance.id);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="game-card p-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">暂无活跃副本</h3>
              <p className="text-sm text-muted-foreground mb-4">
                开启你的第一个副本，开始投资之旅
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-1" />
                开启新副本
              </Button>
            </div>
          )}
        </div>

        {/* 下部：状态栏 */}
        <div className="game-footer">
          <div className="container py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 余额（血条） */}
              <div className="bg-card border border-border rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">余额</span>
                </div>
                <p className="text-2xl font-bold">${balance.toLocaleString()}</p>
                <div className="health-bar mt-2">
                  <div className="health-bar-fill safe" style={{ width: '80%' }} />
                </div>
              </div>

              {/* 持仓（装备） */}
              <div className="bg-card border border-border rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">持仓</span>
                </div>
                <p className="text-2xl font-bold">{instances.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  总盈亏: <span className={totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)} USDT
                  </span>
                </p>
              </div>

              {/* 杠杆技能 */}
              <div className="game-card p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">杠杆技能</span>
                </div>
                <LeverageSkills 
                  selectedLeverage={selectedLeverage}
                  onSelect={setSelectedLeverage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
