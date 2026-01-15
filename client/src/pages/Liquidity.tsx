import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Droplets, TrendingUp, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Liquidity() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedPool, setSelectedPool] = useState("ETH/USDT");
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [selectedProtocol, setSelectedProtocol] = useState("Uniswap V3");
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");

  const { data: liquidityPositions } = trpc.liquidity.list.useQuery({ status: "active" });

  const addLiquidityMutation = trpc.liquidity.add.useMutation({
    onSuccess: () => {
      toast.success("Liquidity added successfully!");
      setAmount0("");
      setAmount1("");
    },
    onError: (error) => {
      toast.error(`Failed to add liquidity: ${error.message}`);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  const [token0, token1] = selectedPool.split("/");
  const totalValue = (parseFloat(amount0 || "0") * 3456.78) + (parseFloat(amount1 || "0") * 1);
  const estimatedAPY = 12.5; // Mock APY

  const handleAddLiquidity = async () => {
    if (!amount0 || !amount1 || parseFloat(amount0) <= 0 || parseFloat(amount1) <= 0) {
      toast.error("Please enter valid amounts for both tokens");
      return;
    }

    await addLiquidityMutation.mutateAsync({
      poolName: selectedPool,
      chain: selectedChain,
      protocol: selectedProtocol,
      token0,
      token1,
      amount0,
      amount1,
      lpTokens: (Math.sqrt(parseFloat(amount0) * parseFloat(amount1))).toString(),
      apy: estimatedAPY.toString(),
      totalValue: totalValue.toString(),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Liquidity Pools</h1>
          <p className="text-muted-foreground">Provide liquidity and earn trading fees</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Add Liquidity Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Add Liquidity</h2>
              </div>

              <div className="space-y-6">
                {/* Pool Selection */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Pool</Label>
                    <Select value={selectedPool} onValueChange={setSelectedPool}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                        <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                        <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
                        <SelectItem value="ARB/USDT">ARB/USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Protocol</Label>
                    <Select value={selectedProtocol} onValueChange={setSelectedProtocol}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Uniswap V3">Uniswap V3</SelectItem>
                        <SelectItem value="Curve">Curve</SelectItem>
                        <SelectItem value="Balancer">Balancer</SelectItem>
                        <SelectItem value="SushiSwap">SushiSwap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Chain</Label>
                    <Select value={selectedChain} onValueChange={setSelectedChain}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="arbitrum">Arbitrum</SelectItem>
                        <SelectItem value="base">Base</SelectItem>
                        <SelectItem value="optimism">Optimism</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Token Amounts */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{token0} Amount</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount0}
                      onChange={(e) => setAmount0(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <div className="flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">+</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{token1} Amount</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount1}
                      onChange={(e) => setAmount1(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                </div>

                {/* Pool Details */}
                <div className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Value</span>
                    <span className="font-semibold">${totalValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated APY</span>
                    <span className="font-semibold text-accent">{estimatedAPY.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pool Share</span>
                    <span className="font-semibold">0.01%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Daily Earnings</span>
                    <span className="font-semibold text-accent">${(totalValue * estimatedAPY / 100 / 365).toFixed(2)}</span>
                  </div>
                </div>

                {/* Impermanent Loss Warning */}
                <div className="flex gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-amber-500 mb-1">Impermanent Loss Risk</p>
                    <p className="text-muted-foreground">
                      Providing liquidity may result in impermanent loss if token prices diverge significantly. Consider this risk before proceeding.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleAddLiquidity}
                  disabled={!amount0 || !amount1 || addLiquidityMutation.isPending}
                  className="w-full text-lg py-6 bg-primary hover:bg-primary/90"
                >
                  {addLiquidityMutation.isPending ? "Adding Liquidity..." : "Add Liquidity"}
                </Button>
              </div>
            </Card>

            {/* Active Positions */}
            <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
              <h3 className="text-lg font-semibold mb-4">Your Liquidity Positions</h3>
              {liquidityPositions && liquidityPositions.length > 0 ? (
                <div className="space-y-4">
                  {liquidityPositions.map((pos) => (
                    <div key={pos.id} className="p-4 rounded-lg bg-muted/20 border border-border/20">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-lg">{pos.poolName}</div>
                          <div className="text-sm text-muted-foreground">
                            {pos.protocol} • {pos.chain}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            ${parseFloat(pos.totalValue || "0").toFixed(2)}
                          </div>
                          <div className="text-sm text-accent">
                            APY: {parseFloat(pos.apy || "0").toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Earned Fees</div>
                          <div className="font-semibold text-accent">
                            +${parseFloat(pos.earnedFees || "0").toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">LP Tokens</div>
                          <div className="font-semibold">
                            {parseFloat(pos.lpTokens).toFixed(4)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No active liquidity positions</p>
                </div>
              )}
            </Card>
          </div>

          {/* Pool Stats Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
              <h3 className="text-lg font-semibold mb-4">Top Pools</h3>
              <div className="space-y-4">
                {topPools.map((pool, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-muted/20 border border-border/20 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setSelectedPool(pool.name)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{pool.name}</span>
                      <span className="text-sm text-accent">{pool.apy}% APY</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      TVL: ${pool.tvl}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
              <h3 className="text-lg font-semibold mb-4">Benefits</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <TrendingUp className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Earn passive income from trading fees</span>
                </li>
                <li className="flex gap-2">
                  <TrendingUp className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Compound your earnings automatically</span>
                </li>
                <li className="flex gap-2">
                  <TrendingUp className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Withdraw anytime without lock-up periods</span>
                </li>
                <li className="flex gap-2">
                  <TrendingUp className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Support DeFi ecosystem growth</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const topPools = [
  { name: "ETH/USDT", apy: 12.5, tvl: "1.2B" },
  { name: "BTC/USDT", apy: 8.3, tvl: "890M" },
  { name: "SOL/USDT", apy: 18.7, tvl: "450M" },
  { name: "ARB/USDT", apy: 22.1, tvl: "320M" },
];
