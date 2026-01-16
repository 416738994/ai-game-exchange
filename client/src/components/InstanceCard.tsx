import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Settings,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InstanceCardProps {
  id: string;
  symbol: string;
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  invested: number;
  pnl: number;
  pnlPercent: number;
  liquidationPrice: number;
  strategy: string;
  isLong: boolean;
  onClose?: () => void;
  onChangeStrategy?: () => void;
  onLetAITakeOver?: () => void;
}

export default function InstanceCard({
  id,
  symbol,
  leverage,
  entryPrice,
  currentPrice,
  invested,
  pnl,
  pnlPercent,
  liquidationPrice,
  strategy,
  isLong,
  onClose,
  onChangeStrategy,
  onLetAITakeOver
}: InstanceCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // 计算健康度（距离清算价格的百分比）
  const healthPercent = isLong 
    ? ((currentPrice - liquidationPrice) / currentPrice) * 100
    : ((liquidationPrice - currentPrice) / currentPrice) * 100;
  
  const isDanger = healthPercent < 20;
  const isWarning = healthPercent < 40 && !isDanger;
  const isProfit = pnl > 0;

  // 健康度颜色
  const getHealthColor = () => {
    if (isDanger) return 'danger';
    if (isWarning) return 'warning';
    return 'safe';
  };

  return (
    <>
      <div 
        className={`instance-card ${isProfit ? 'profit' : 'loss'} ${isDanger ? 'danger-alert' : ''}
                   cursor-pointer`}
        onClick={() => setShowDetails(true)}
      >
        {/* 顶部：交易对和杠杆 */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">{symbol}</h3>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                isLong ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {leverage}x {isLong ? 'Long' : 'Short'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{strategy}</p>
          </div>
          
          {isDanger && (
            <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
          )}
        </div>

        {/* 中部：价格和盈亏 */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs text-muted-foreground">当前价格</p>
            <p className="text-sm font-semibold">${currentPrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">开仓价格</p>
            <p className="text-sm font-semibold">${entryPrice.toLocaleString()}</p>
          </div>
        </div>

        {/* 盈亏显示 */}
        <div className={`p-3 rounded-lg mb-3 ${
          isProfit ? 'bg-gradient-profit' : 'bg-gradient-loss'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">盈亏</span>
            <div className="flex items-center gap-1">
              {isProfit ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-lg font-bold ${
                isProfit ? 'text-green-600' : 'text-red-600'
              }`}>
                {isProfit ? '+' : ''}{pnl.toFixed(2)} USDT
              </span>
              <span className={`text-sm ${
                isProfit ? 'text-green-600' : 'text-red-600'
              }`}>
                ({isProfit ? '+' : ''}{pnlPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* 健康度血条 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">健康度</span>
            <span className="text-xs font-medium">{healthPercent.toFixed(1)}%</span>
          </div>
          <div className="health-bar">
            <div 
              className={`health-bar-fill ${getHealthColor()}`}
              style={{ width: `${Math.max(0, Math.min(100, healthPercent))}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            清算价格: ${liquidationPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 副本详情弹窗 */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{symbol}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                isLong ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {leverage}x {isLong ? 'Long' : 'Short'}
              </span>
            </DialogTitle>
            <DialogDescription>
              副本详情和操作选项
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* 详细信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">投入资源</p>
                <p className="text-lg font-semibold">{invested.toFixed(2)} USDT</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">当前价值</p>
                <p className="text-lg font-semibold">{(invested + pnl).toFixed(2)} USDT</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">开仓价格</p>
                <p className="text-lg font-semibold">${entryPrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">当前价格</p>
                <p className="text-lg font-semibold">${currentPrice.toLocaleString()}</p>
              </div>
            </div>

            {/* 盈亏 */}
            <div className={`p-4 rounded-lg ${
              isProfit ? 'bg-gradient-profit' : 'bg-gradient-loss'
            }`}>
              <p className="text-sm text-muted-foreground mb-1">总盈亏</p>
              <div className="flex items-center gap-2">
                {isProfit ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-2xl font-bold ${
                  isProfit ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isProfit ? '+' : ''}{pnl.toFixed(2)} USDT
                </span>
                <span className={`text-lg ${
                  isProfit ? 'text-green-600' : 'text-red-600'
                }`}>
                  ({isProfit ? '+' : ''}{pnlPercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* 策略信息 */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">当前策略</p>
              <p className="text-sm font-medium">{strategy}</p>
            </div>

            {/* 健康度 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">健康度</span>
                <span className={`text-sm font-bold ${
                  isDanger ? 'text-red-600' : isWarning ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {healthPercent.toFixed(1)}%
                </span>
              </div>
              <div className="health-bar h-3">
                <div 
                  className={`health-bar-fill ${getHealthColor()}`}
                  style={{ width: `${Math.max(0, Math.min(100, healthPercent))}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                清算价格: ${liquidationPrice.toLocaleString()}
              </p>
              {isDanger && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  ⚠️ 警告：距离清算价格较近，建议立即撤退或补充保证金！
                </p>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  onClose?.();
                  setShowDetails(false);
                }}
              >
                <X className="w-4 h-4 mr-1" />
                撤退
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  onChangeStrategy?.();
                  setShowDetails(false);
                }}
              >
                <Settings className="w-4 h-4 mr-1" />
                更换策略
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => {
                  onLetAITakeOver?.();
                  setShowDetails(false);
                }}
              >
                让AI接管
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
