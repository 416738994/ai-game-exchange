import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Trade() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [tradeType, setTradeType] = useState<"long" | "short">("long");
  const [leverage, setLeverage] = useState([10]);
  const [amount, setAmount] = useState("");
  const [collateral, setCollateral] = useState("");

  const { data: prices } = trpc.market.prices.useQuery({ 
    symbols: ["BTC", "ETH", "SOL", "ARB"] 
  });

  const createPositionMutation = trpc.positions.create.useMutation({
    onSuccess: () => {
      toast.success("Position opened successfully!");
      setAmount("");
      setCollateral("");
    },
    onError: (error) => {
      toast.error(`Failed to open position: ${error.message}`);
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

  const selectedPrice = prices?.find(p => p.symbol === selectedToken)?.price || 0;
  const positionSize = parseFloat(collateral || "0") * leverage[0];
  const liquidationPrice = tradeType === "long"
    ? selectedPrice * (1 - 0.9 / leverage[0])
    : selectedPrice * (1 + 0.9 / leverage[0]);

  const handleTrade = async () => {
    if (!collateral || parseFloat(collateral) <= 0) {
      toast.error("Please enter collateral amount");
      return;
    }

    await createPositionMutation.mutateAsync({
      symbol: `${selectedToken}/USDT`,
      chain: selectedChain,
      type: tradeType,
      leverage: leverage[0],
      entryPrice: selectedPrice.toString(),
      amount: (positionSize / selectedPrice).toString(),
      collateral: collateral,
      liquidationPrice: liquidationPrice.toString(),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Leverage Trading</h1>
          <p className="text-muted-foreground">Open leveraged positions on major cryptocurrencies</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trading Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
              <Tabs value={tradeType} onValueChange={(v) => setTradeType(v as "long" | "short")}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="long" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Long
                  </TabsTrigger>
                  <TabsTrigger value="short" className="data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive">
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Short
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={tradeType} className="space-y-6">
                  {/* Token Selection */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Asset</Label>
                      <Select value={selectedToken} onValueChange={setSelectedToken}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                          <SelectItem value="SOL">Solana (SOL)</SelectItem>
                          <SelectItem value="ARB">Arbitrum (ARB)</SelectItem>
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

                  {/* Current Price */}
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/20">
                    <div className="text-sm text-muted-foreground mb-1">Current Price</div>
                    <div className="text-3xl font-bold">
                      ${selectedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Leverage Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Leverage</Label>
                      <span className="text-2xl font-bold text-primary">{leverage[0]}x</span>
                    </div>
                    <Slider
                      value={leverage}
                      onValueChange={setLeverage}
                      min={1}
                      max={100}
                      step={1}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1x</span>
                      <span>25x</span>
                      <span>50x</span>
                      <span>100x</span>
                    </div>
                  </div>

                  {/* Collateral Input */}
                  <div className="space-y-2">
                    <Label>Collateral (USDT)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={collateral}
                      onChange={(e) => setCollateral(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  {/* Position Details */}
                  <div className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border/20">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Position Size</span>
                      <span className="font-semibold">${positionSize.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Entry Price</span>
                      <span className="font-semibold">${selectedPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Liquidation Price</span>
                      <span className="font-semibold text-destructive">${liquidationPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Est. Trading Fee</span>
                      <span className="font-semibold">${(positionSize * 0.001).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Risk Warning */}
                  <div className="flex gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-destructive mb-1">High Risk Warning</p>
                      <p className="text-muted-foreground">
                        Leverage trading carries significant risk. You may lose your entire collateral if the market moves against your position.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleTrade}
                    disabled={!collateral || createPositionMutation.isPending}
                    className={`w-full text-lg py-6 ${
                      tradeType === "long"
                        ? "bg-accent hover:bg-accent/90"
                        : "bg-destructive hover:bg-destructive/90"
                    }`}
                  >
                    {createPositionMutation.isPending ? "Opening Position..." : `Open ${tradeType.toUpperCase()} Position`}
                  </Button>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Market Info Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
              <h3 className="text-lg font-semibold mb-4">Market Prices</h3>
              <div className="space-y-4">
                {prices?.map((token) => (
                  <div
                    key={token.symbol}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedToken === token.symbol
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-muted/20 border border-border/20 hover:bg-muted/30"
                    }`}
                    onClick={() => setSelectedToken(token.symbol)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{token.symbol}</span>
                      <span className={`text-sm ${token.change24h >= 0 ? "text-accent" : "text-destructive"}`}>
                        {token.change24h >= 0 ? "+" : ""}{token.change24h.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-lg font-bold">
                      ${token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
              <h3 className="text-lg font-semibold mb-4">Trading Tips</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Start with lower leverage to manage risk</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Always set stop-loss orders</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Monitor liquidation price closely</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Never invest more than you can afford to lose</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
