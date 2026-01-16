import { Card } from "@/components/ui/card";
import { Bot, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

export default function AIChiefAssistant() {
  // 模拟数据
  const report = {
    summary: "当前共有 3 个活跃副本，总体表现良好。ETH 和 SOL 副本盈利中，BTC 副本需要关注。",
    marketTrend: "牛市",
    totalPnL: 83.91,
    totalPnLPercent: 4.20,
    risks: [
      {
        level: "warning",
        message: "BTC 副本健康度较低 (32.5%)，建议补仓或止损"
      }
    ],
    recommendations: [
      {
        type: "success",
        message: "ETH 副本已达到 +10% 盈利目标，建议设置止盈"
      },
      {
        type: "info",
        message: "SOL 突破关键阻力位 $145，可以考虑加仓"
      }
    ],
    activeInstances: [
      { id: "eth-3x", name: "ETH 3x Long", pnl: 107.25, pnlPercent: 10.73, health: 35.6 },
      { id: "btc-2x", name: "BTC 2x Long", pnl: -23.34, pnlPercent: -1.17, health: 32.5 },
      { id: "sol-5x", name: "SOL 5x Long", pnl: 27.10, pnlPercent: 5.42, health: 45.2 }
    ]
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
      <div className="flex items-start gap-4">
        {/* AI Avatar */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Bot className="w-8 h-8 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">🎯 AI 总助理战况汇报</h3>
            <p className="text-sm text-gray-700">{report.summary}</p>
          </div>

          {/* Market Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">市场趋势</p>
              <div className="flex items-center gap-2">
                {report.marketTrend === "牛市" ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-sm font-bold ${
                  report.marketTrend === "牛市" ? "text-green-600" : "text-red-600"
                }`}>
                  {report.marketTrend}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">总盈亏</p>
              <p className={`text-sm font-bold ${
                report.totalPnL >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {report.totalPnL >= 0 ? "+" : ""}${report.totalPnL.toFixed(2)}
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">收益率</p>
              <p className={`text-sm font-bold ${
                report.totalPnLPercent >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {report.totalPnLPercent >= 0 ? "+" : ""}{report.totalPnLPercent.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Instance Status */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">副本状态</p>
            <div className="grid grid-cols-3 gap-2">
              {report.activeInstances.map((instance) => (
                <div 
                  key={instance.id} 
                  className="bg-white rounded-lg p-2 border border-gray-200"
                >
                  <p className="text-xs font-semibold text-gray-900 mb-1">{instance.name}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold ${
                      instance.pnl >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {instance.pnl >= 0 ? "+" : ""}{instance.pnlPercent.toFixed(1)}%
                    </span>
                    <span className={`font-semibold ${
                      instance.health > 50 ? "text-green-600" :
                      instance.health > 30 ? "text-orange-600" :
                      "text-red-600"
                    }`}>
                      HP {instance.health.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risks & Recommendations */}
          <div className="grid grid-cols-2 gap-4">
            {/* Risks */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-orange-500" />
                风险提示
              </p>
              <div className="space-y-1">
                {report.risks.map((risk, index) => (
                  <div 
                    key={index}
                    className="bg-orange-50 border border-orange-200 rounded p-2"
                  >
                    <p className="text-xs text-gray-900">{risk.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                策略建议
              </p>
              <div className="space-y-1">
                {report.recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className={`rounded p-2 border ${
                      rec.type === "success" 
                        ? "bg-green-50 border-green-200" 
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <p className="text-xs text-gray-900">{rec.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
