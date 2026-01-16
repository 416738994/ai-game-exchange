import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

type MarketSentiment = 'bullish' | 'bearish' | 'neutral';

interface MarketRadarProps {
  sentiment?: MarketSentiment;
  btcChange?: number;
  ethChange?: number;
  totalMarketCap?: string;
}

export default function MarketRadar({
  sentiment = 'bullish',
  btcChange = 2.3,
  ethChange = -1.2,
  totalMarketCap = '$2.1T'
}: MarketRadarProps) {
  const getSentimentConfig = () => {
    switch (sentiment) {
      case 'bullish':
        return {
          icon: TrendingUp,
          label: '牛市',
          description: '市场整体向好',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'bearish':
        return {
          icon: TrendingDown,
          label: '熊市',
          description: '市场整体下跌',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: Activity,
          label: '震荡',
          description: '市场横盘整理',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
    }
  };

  const config = getSentimentConfig();
  const Icon = config.icon;

  return (
    <div className={`bg-card border rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md ${config.borderColor}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${config.color}`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">市场雷达</h3>
              <p className="text-xs text-muted-foreground">{config.description}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">市场情绪</span>
              <span className={`font-semibold ${config.color}`}>{config.label}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">BTC</span>
                <span className={btcChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {btcChange >= 0 ? '+' : ''}{btcChange}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ETH</span>
                <span className={ethChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {ethChange >= 0 ? '+' : ''}{ethChange}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
              <span className="text-muted-foreground">总市值</span>
              <span className="font-semibold">{totalMarketCap}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
