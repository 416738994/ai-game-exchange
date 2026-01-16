import { TrendingUp, AlertTriangle, Target, Activity } from "lucide-react";

interface AIRealtimeAnalysisProps {
  instanceId: string;
}

export default function AIRealtimeAnalysis({ instanceId }: AIRealtimeAnalysisProps) {
  // 模拟实时解读数据
  const analysis = {
    battleStatus: "ETH 正在突破关键阻力位 $3,600，买方力量占优，成交量放大",
    strategy: "建议持有，目标 $3,800，止损 $3,400",
    risk: "健康度 65%，距离清算还安全，但需注意 $3,500 支撑位",
    capitalFlow: "+$2.3M/h",
    sentiment: "78% 看涨"
  };

  return (
    <div className="h-full bg-white border-b border-gray-200 p-4 space-y-4">
      {/* 当前战况分析 */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <div className="flex items-start gap-2">
          <Activity className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-blue-900 text-sm mb-1">当前战况</div>
            <p className="text-sm text-blue-800 leading-relaxed">{analysis.battleStatus}</p>
          </div>
        </div>
      </div>

      {/* 策略建议 */}
      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
        <div className="flex items-start gap-2">
          <Target className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-green-900 text-sm mb-1">策略建议</div>
            <p className="text-sm text-green-800 leading-relaxed">{analysis.strategy}</p>
          </div>
        </div>
      </div>

      {/* 风险提示 */}
      <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-amber-900 text-sm mb-1">风险提示</div>
            <p className="text-sm text-amber-800 leading-relaxed">{analysis.risk}</p>
          </div>
        </div>
      </div>

      {/* 关键数据 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-xs text-gray-600 mb-1">资金流</div>
          <div className="text-lg font-bold text-green-600">{analysis.capitalFlow}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-xs text-gray-600 mb-1">舆情</div>
          <div className="text-lg font-bold text-blue-600">{analysis.sentiment}</div>
        </div>
      </div>
    </div>
  );
}
