import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LeverageSkill {
  multiplier: number;
  label: string;
  description: string;
  risk: 'low' | 'medium' | 'high' | 'extreme';
}

const leverageSkills: LeverageSkill[] = [
  {
    multiplier: 1,
    label: '1x 保守',
    description: '无杠杆，最安全，收益 1:1',
    risk: 'low'
  },
  {
    multiplier: 2,
    label: '2x 稳健',
    description: '低风险，收益放大 2 倍，适合稳健投资',
    risk: 'low'
  },
  {
    multiplier: 3,
    label: '3x 平衡',
    description: '中等风险，收益放大 3 倍，清算风险适中',
    risk: 'medium'
  },
  {
    multiplier: 5,
    label: '5x 激进',
    description: '较高风险，收益放大 5 倍，需要密切关注',
    risk: 'high'
  },
  {
    multiplier: 10,
    label: '10x 极限',
    description: '极高风险，收益放大 10 倍，轻微波动即可能清算',
    risk: 'extreme'
  }
];

interface LeverageSkillsProps {
  selectedLeverage?: number;
  onSelect?: (leverage: number) => void;
}

export default function LeverageSkills({ selectedLeverage, onSelect }: LeverageSkillsProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'border-gray-400 bg-gray-50 text-gray-700 hover:bg-gray-100';
      case 'medium': return 'border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100';
      case 'high': return 'border-orange-400 bg-orange-50 text-orange-700 hover:bg-orange-100';
      case 'extreme': return 'border-red-400 bg-red-50 text-red-700 hover:bg-red-100';
      default: return '';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'low': return '低风险';
      case 'medium': return '中等风险';
      case 'high': return '高风险';
      case 'extreme': return '极高风险';
      default: return '';
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {leverageSkills.map((skill) => (
        <Tooltip key={skill.multiplier}>
          <TooltipTrigger asChild>
            <button
              onClick={() => onSelect?.(skill.multiplier)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
                         border-2 hover:scale-105 active:scale-95 cursor-pointer
                         ${getRiskColor(skill.risk)} ${
                selectedLeverage === skill.multiplier ? 'ring-2 ring-offset-2 ring-primary' : ''
              }`}
            >
              <div className="text-center">
                <div className="font-bold">{skill.multiplier}x</div>
                <div className="text-xs opacity-75">{skill.label.split(' ')[1]}</div>
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-semibold">{skill.label}</p>
              <p className="text-xs text-muted-foreground">{skill.description}</p>
              <p className={`text-xs font-medium ${
                skill.risk === 'low' ? 'text-gray-600' :
                skill.risk === 'medium' ? 'text-blue-600' :
                skill.risk === 'high' ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {getRiskLabel(skill.risk)}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
