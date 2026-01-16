import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface DecisionItem {
  id: string;
  title: string;
  description: string;
  options: string[];
  type: 'warning' | 'opportunity';
}

const mockDecisions: DecisionItem[] = [
  {
    id: '1',
    title: 'BTC 副本风险预警',
    description: '资金流转负，建议立即平仓止损 -1.17% 或补仓 $500 降低成本，赌反弹',
    options: ['立即平仓', '补仓 $500', '稍后决定'],
    type: 'warning',
  },
  {
    id: '2',
    title: 'SOL 新机会',
    description: '资金流 +$5.6M/h，舆情 82% 看涨，建议开启新副本 $1,000 @ 2x 做多',
    options: ['授权开仓', '调整金额', '暂不开仓'],
    type: 'opportunity',
  },
];

export default function AIDecisionRequest() {
  const [decisions, setDecisions] = useState<DecisionItem[]>(mockDecisions);

  const handleDecision = (decisionId: string, option: string) => {
    console.log(`Decision ${decisionId}: ${option}`);
    // 移除已决策的项目
    setDecisions((prev) => prev.filter((d) => d.id !== decisionId));
  };

  if (decisions.length === 0) {
    return (
      <div className="p-4">
        <Card className="p-4 text-center text-sm text-muted-foreground">
          ✅ 暂无需要决策的事项
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <h3 className="font-semibold text-sm">💡 需要您决策的点</h3>

      {decisions.map((decision) => (
        <Card
          key={decision.id}
          className={`p-4 space-y-3 ${
            decision.type === 'warning'
              ? 'border-red-200 bg-red-50/50'
              : 'border-green-200 bg-green-50/50'
          }`}
        >
          <div className="flex items-start gap-2">
            {decision.type === 'warning' ? (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            ) : (
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-semibold text-sm mb-1">{decision.title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                {decision.description}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {decision.options.map((option, index) => (
              <Button
                key={index}
                size="sm"
                variant={index === 0 ? 'default' : 'outline'}
                onClick={() => handleDecision(decision.id, option)}
                className="text-xs"
              >
                {option}
              </Button>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
