import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Brain, DollarSign } from 'lucide-react';

interface InstanceReport {
  name: string;
  currentProfit: number;
  currentProfitPercent: number;
  maxProfit: number;
  maxProfitPercent: number;
  maxProfitTime: string;
  minLoss: number;
  minLossPercent: number;
  minLossTime: string;
  whyNotExitAtPeak: string;
  capitalFlowFactor: string;
  sentimentFactor: string;
  currentStrategy: string;
  stopProfit: string;
  stopLoss: string;
}

const mockReports: InstanceReport[] = [
  {
    name: 'ETH 3x Long',
    currentProfit: 107.25,
    currentProfitPercent: 10.73,
    maxProfit: 156.80,
    maxProfitPercent: 15.68,
    maxProfitTime: '02:34 AM',
    minLoss: -23.50,
    minLossPercent: -2.35,
    minLossTime: '11:20 PM',
    whyNotExitAtPeak: '资金流因子显示持续流入 (+$2.3M/h)，舆情因子 Twitter 情绪 78% 看涨，判断短期回调后会继续上涨',
    capitalFlowFactor: '+$2.3M/h ✅',
    sentimentFactor: '78% 看涨 ✅',
    currentStrategy: '持有并观察，设置止盈 +20% 自动平仓',
    stopProfit: '+20%',
    stopLoss: '-5% 或健康度 < 20%',
  },
  {
    name: 'BTC 2x Long',
    currentProfit: -23.34,
    currentProfitPercent: -1.17,
    maxProfit: 45.20,
    maxProfitPercent: 2.26,
    maxProfitTime: '01:15 AM',
    minLoss: -67.89,
    minLossPercent: -3.39,
    minLossTime: '10:45 PM',
    whyNotExitAtPeak: '资金流因子显示机构持续买入，舆情因子 Coinbase 溢价 +1.2%，判断突破 $96,000 概率 > 70%',
    capitalFlowFactor: '-$1.2M/h ⚠️',
    sentimentFactor: '45% 看涨 ⚠️',
    currentStrategy: '🚨 准备调整！资金流转负，考虑减仓或平仓',
    stopProfit: '+15%',
    stopLoss: '跌破 $93,500 立即平仓',
  },
];

export default function AIBattleReport() {
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">📊 战报汇报</h3>
        <p className="text-sm text-muted-foreground">您离线期间的副本情况</p>
      </div>

      {mockReports.map((report, index) => (
        <Card key={index} className="p-4 space-y-3">
          <div className="font-semibold text-base border-b pb-2">
            【{report.name} 副本】
          </div>

          {/* 当前盈亏 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">💰 当前盈亏：</span>
            <span className={`font-semibold ${report.currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {report.currentProfit >= 0 ? '+' : ''}{report.currentProfit.toFixed(2)} USDT
              ({report.currentProfitPercent >= 0 ? '+' : ''}{report.currentProfitPercent.toFixed(2)}%)
            </span>
          </div>

          {/* 最高盈利 */}
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
            <div className="flex-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">最高盈利：</span>
                <span className="text-green-600 font-medium">
                  +{report.maxProfit.toFixed(2)} USDT (+{report.maxProfitPercent.toFixed(2)}%)
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">@ {report.maxProfitTime}</div>
            </div>
          </div>

          {/* 最低亏损 */}
          <div className="flex items-start gap-2">
            <TrendingDown className="w-4 h-4 text-red-600 mt-0.5" />
            <div className="flex-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">最低亏损：</span>
                <span className="text-red-600 font-medium">
                  {report.minLoss.toFixed(2)} USDT ({report.minLossPercent.toFixed(2)}%)
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">@ {report.minLossTime}</div>
            </div>
          </div>

          {/* 决策原因 */}
          <div className="bg-blue-50 p-3 rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <Brain className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-900 mb-1">
                  🤔 为什么没在最高点撤？
                </div>
                <div className="text-xs text-blue-800 leading-relaxed">
                  {report.whyNotExitAtPeak}
                </div>
              </div>
            </div>
          </div>

          {/* 当前策略 */}
          <div className="space-y-2 pt-2 border-t">
            <div className="text-sm font-medium">📋 当前策略：</div>
            <div className="text-sm text-muted-foreground pl-4">
              {report.currentStrategy}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pl-4">
              <div>
                <span className="text-muted-foreground">止盈：</span>
                <span className="text-green-600 font-medium ml-1">{report.stopProfit}</span>
              </div>
              <div>
                <span className="text-muted-foreground">止损：</span>
                <span className="text-red-600 font-medium ml-1">{report.stopLoss}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pl-4">
              <div>
                <span className="text-muted-foreground">资金流：</span>
                <span className="ml-1">{report.capitalFlowFactor}</span>
              </div>
              <div>
                <span className="text-muted-foreground">舆情：</span>
                <span className="ml-1">{report.sentimentFactor}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
