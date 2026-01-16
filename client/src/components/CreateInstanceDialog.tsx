import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

interface CreateInstanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateInstance: (data: InstanceData) => void;
}

export interface InstanceData {
  asset: string;
  leverage: number;
  amount: number;
}

const ASSETS = [
  { symbol: "ETH", name: "Ethereum", currentPrice: 3580.45 },
  { symbol: "BTC", name: "Bitcoin", currentPrice: 95234.67 },
  { symbol: "SOL", name: "Solana", currentPrice: 145.23 }
];

const LEVERAGE_OPTIONS = [1, 2, 3, 5, 10];

export default function CreateInstanceDialog({ open, onOpenChange, onCreateInstance }: CreateInstanceDialogProps) {
  const [asset, setAsset] = useState<string>("ETH");
  const [leverage, setLeverage] = useState<number>(3);
  const [amount, setAmount] = useState<string>("");

  const selectedAsset = ASSETS.find(a => a.symbol === asset);
  const investmentAmount = parseFloat(amount) || 0;
  
  // 计算清算价格
  const calculateLiquidationPrice = () => {
    if (!selectedAsset || investmentAmount === 0) return 0;
    // 简化计算：清算价格 = 当前价格 * (1 - 1/杠杆 * 0.9)
    // 0.9 是安全系数，实际清算会在更早触发
    const liquidationRatio = 1 - (1 / leverage) * 0.9;
    return selectedAsset.currentPrice * liquidationRatio;
  };

  const liquidationPrice = calculateLiquidationPrice();
  const positionSize = investmentAmount > 0 ? (investmentAmount * leverage) / (selectedAsset?.currentPrice || 1) : 0;

  const handleCreate = () => {
    if (investmentAmount === 0) return;
    
    onCreateInstance({
      asset,
      leverage,
      amount: investmentAmount
    });
    
    // 重置表单
    setAsset("ETH");
    setLeverage(3);
    setAmount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>⚔️ 开启新副本</DialogTitle>
          <DialogDescription>
            选择资产、杠杆倍数和投资金额，开始你的战斗之旅
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 选择资产 */}
          <div className="space-y-2">
            <Label htmlFor="asset">选择资产</Label>
            <Select value={asset} onValueChange={setAsset}>
              <SelectTrigger id="asset">
                <SelectValue placeholder="选择资产" />
              </SelectTrigger>
              <SelectContent>
                {ASSETS.map((a) => (
                  <SelectItem key={a.symbol} value={a.symbol}>
                    {a.symbol} - {a.name} (${a.currentPrice.toLocaleString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 选择杠杆 */}
          <div className="space-y-2">
            <Label>杠杆倍数</Label>
            <div className="grid grid-cols-5 gap-2">
              {LEVERAGE_OPTIONS.map((lev) => (
                <button
                  key={lev}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    leverage === lev
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setLeverage(lev)}
                >
                  {lev}x
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              杠杆越高，收益和风险都会放大
            </p>
          </div>

          {/* 投资金额 */}
          <div className="space-y-2">
            <Label htmlFor="amount">投资金额 (USD)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="输入投资金额"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="100"
            />
          </div>

          {/* 预览信息 */}
          {investmentAmount > 0 && selectedAsset && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">持仓价值</span>
                <span className="font-semibold text-gray-900">
                  ${(investmentAmount * leverage).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">持仓数量</span>
                <span className="font-semibold text-gray-900">
                  {positionSize.toFixed(4)} {asset}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">清算价格</span>
                <span className="font-semibold text-red-600">
                  ${liquidationPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="flex items-start gap-2 mt-3 pt-3 border-t border-gray-200">
                <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-600">
                  当价格跌至清算价格时，您的仓位将被强制平仓，损失全部投资金额
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button
            className="flex-1"
            onClick={handleCreate}
            disabled={investmentAmount === 0}
          >
            开启副本
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
