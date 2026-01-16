import { useEffect, useState } from "react";
import { AlertTriangle, TrendingUp, Shield } from "lucide-react";

interface AnalysisData {
  situation: string;
  strategy: string;
  risk: string;
  riskLevel: "low" | "medium" | "high";
}

interface AIRealtimeAnalysisProps {
  instanceId: string;
}

export default function AIRealtimeAnalysis({ instanceId }: AIRealtimeAnalysisProps) {
  const [analysis, setAnalysis] = useState<AnalysisData>({
    situation: "ETH 价格稳定在 $3,580 附近，买方力量占优",
    strategy: "建议持有当前仓位，设置止盈目标 +20% ($4,296)",
    risk: "健康度 35.6%，距离清算价格 $2,890 有充足缓冲",
    riskLevel: "low"
  });

  // 模拟实时更新
  useEffect(() => {
    const interval = setInterval(() => {
      const scenarios: AnalysisData[] = [
        {
          situation: "ETH 突破 $3,600，成交量放大，趋势向好",
          strategy: "建议继续持有，可考虑部分止盈锁定利润",
          risk: "健康度良好，风险可控",
          riskLevel: "low"
        },
        {
          situation: "市场波动加剧，BTC 回调影响 ETH",
          strategy: "密切监控价格变化，准备调整止损",
          risk: "健康度下降至 28%，需要关注",
          riskLevel: "medium"
        },
        {
          situation: "⚠️ 价格快速下跌，接近止损位",
          strategy: "建议立即减仓或平仓，保护本金",
          risk: "健康度 15%，高风险状态",
          riskLevel: "high"
        }
      ];

      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      setAnalysis(randomScenario);
    }, 10000);

    return () => clearInterval(interval);
  }, [instanceId]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-orange-600 bg-orange-50";
      case "high":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="h-full bg-white p-4 overflow-y-auto space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">实时战况分析</h3>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="实时更新中" />
      </div>

      {/* 当前形势 */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">当前形势</p>
            <p className="text-sm text-gray-900">{analysis.situation}</p>
          </div>
        </div>
      </div>

      {/* 策略建议 */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">策略建议</p>
            <p className="text-sm text-gray-900">{analysis.strategy}</p>
          </div>
        </div>
      </div>

      {/* 风险提示 */}
      <div className={`rounded-lg p-3 ${getRiskColor(analysis.riskLevel)}`}>
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold mb-1">风险提示</p>
            <p className="text-sm">{analysis.risk}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
