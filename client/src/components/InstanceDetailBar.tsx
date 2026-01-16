import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, Minus, X, RefreshCw } from 'lucide-react';

interface InstanceDetail {
  name: string;
  committedFunds: number;
  currentValue: number;
  profitPercent: number;
  position: string;
  entryPrice: number;
  currentLeverage: number;
  health: number;
  liquidationPrice: number;
  strategy: {
    stopProfit: string;
    stopLoss: string;
    capitalFlow: string;
    sentiment: string;
  };
}

interface InstanceDetailBarProps {
  instance: InstanceDetail | null;
  onClose: () => void;
}

export default function InstanceDetailBar({ instance, onClose }: InstanceDetailBarProps) {
  if (!instance) {
    // 总览模式
    return (
      <div className="border-t bg-card p-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">💰 总资金</div>
              <div className="text-2xl font-bold">$20,000</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">📈 已委托给 AI</div>
              <div className="text-2xl font-bold">$2,000</div>
              <div className="text-xs text-muted-foreground mt-1">2 个副本</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">📊 总盈亏</div>
              <div className="text-2xl font-bold text-green-600">+$83.91</div>
              <div className="text-xs text-green-600 mt-1">(+4.20%)</div>
            </Card>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline">查看所有副本</Button>
            <Button>开启新副本</Button>
            <Button variant="outline">追加委托资金</Button>
          </div>
        </div>
      </div>
    );
  }

  // 副本详情模式
  return (
    <div className="border-t bg-card p-4">
      <div className="container mx-auto space-y-4">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h3 className="font-semibold text-lg">[{instance.name} 副本] - AI 自主管理中</h3>
          </div>
        </div>

        {/* 资金和持仓信息 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-3">
            <div className="text-xs text-muted-foreground mb-1">💰 委托资金</div>
            <div className="font-semibold">${instance.committedFunds.toFixed(2)}</div>
          </Card>
          <Card className="p-3">
            <div className="text-xs text-muted-foreground mb-1">当前价值</div>
            <div className={`font-semibold ${instance.profitPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${instance.currentValue.toFixed(2)}
            </div>
            <div className={`text-xs ${instance.profitPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ({instance.profitPercent >= 0 ? '+' : ''}{instance.profitPercent.toFixed(2)}%)
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-xs text-muted-foreground mb-1">⚔️ 持仓</div>
            <div className="font-semibold text-sm">{instance.position}</div>
            <div className="text-xs text-muted-foreground">@ ${instance.entryPrice.toFixed(2)}</div>
          </Card>
          <Card className="p-3">
            <div className="text-xs text-muted-foreground mb-1">🎯 当前杠杆</div>
            <div className="font-semibold text-lg">{instance.currentLeverage}x</div>
            <div className="text-xs text-muted-foreground">健康度: {instance.health.toFixed(1)}%</div>
          </Card>
        </div>

        {/* AI 当前策略 */}
        <Card className="p-4 bg-blue-50">
          <div className="text-sm font-medium mb-2">🤖 AI 当前策略：</div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">止盈目标：</span>
              <span className="text-green-600 font-medium ml-1">{instance.strategy.stopProfit}</span>
            </div>
            <div>
              <span className="text-muted-foreground">止损线：</span>
              <span className="text-red-600 font-medium ml-1">{instance.strategy.stopLoss}</span>
            </div>
            <div>
              <span className="text-muted-foreground">资金流：</span>
              <span className="ml-1">{instance.strategy.capitalFlow}</span>
            </div>
            <div>
              <span className="text-muted-foreground">舆情：</span>
              <span className="ml-1">{instance.strategy.sentiment}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            清算价格: ${instance.liquidationPrice.toFixed(2)}
          </div>
        </Card>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            手动补仓
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            调整杠杆
          </Button>
          <Button variant="outline" size="sm">
            <Minus className="w-4 h-4 mr-1" />
            部分平仓
          </Button>
          <Button variant="destructive" size="sm">
            <X className="w-4 h-4 mr-1" />
            强制平仓
          </Button>
        </div>
      </div>
    </div>
  );
}
