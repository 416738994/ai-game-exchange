import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: prices } = trpc.market.prices.useQuery({ 
    symbols: ["BTC", "ETH", "SOL", "ARB"] 
  });
  const { data: positions } = trpc.positions.list.useQuery({ status: "open" });
  const { data: liquidityPositions } = trpc.liquidity.list.useQuery({ status: "active" });

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

  // Calculate portfolio stats
  const totalPositionValue = positions?.reduce((sum, pos) => {
    const value = parseFloat(pos.collateral) * pos.leverage;
    return sum + value;
  }, 0) || 0;

  const totalPnL = positions?.reduce((sum, pos) => {
    return sum + (parseFloat(pos.pnl || "0"));
  }, 0) || 0;

  const totalLiquidityValue = liquidityPositions?.reduce((sum, pos) => {
    return sum + parseFloat(pos.totalValue || "0");
  }, 0) || 0;

  const totalEarnedFees = liquidityPositions?.reduce((sum, pos) => {
    return sum + parseFloat(pos.earnedFees || "0");
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "Trader"}</h1>
          <p className="text-muted-foreground">Monitor your portfolio and market trends</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Position Value"
            value={`$${totalPositionValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={DollarSign}
            trend={totalPnL >= 0 ? "up" : "down"}
            trendValue={`${totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}%`}
          />
          <StatCard
            title="Unrealized P&L"
            value={`$${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={Activity}
            trend={totalPnL >= 0 ? "up" : "down"}
            className={totalPnL >= 0 ? "text-accent" : "text-destructive"}
          />
          <StatCard
            title="Liquidity Provided"
            value={`$${totalLiquidityValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={TrendingUp}
          />
          <StatCard
            title="Earned Fees"
            value={`$${totalEarnedFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={DollarSign}
            trend="up"
            className="text-accent"
          />
        </div>

        {/* Market Prices */}
        <Card className="p-6 mb-8 bg-card/50 backdrop-blur border-border/40">
          <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {prices?.map((token) => (
              <div key={token.symbol} className="p-4 rounded-lg bg-muted/30 border border-border/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{token.symbol}</span>
                  <span className={`text-sm ${token.change24h >= 0 ? "text-accent" : "text-destructive"}`}>
                    {token.change24h >= 0 ? "+" : ""}{token.change24h.toFixed(2)}%
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  ${token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Vol: ${(token.volume24h / 1e9).toFixed(2)}B
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Positions & Liquidity Tabs */}
        <Tabs defaultValue="positions" className="space-y-4">
          <TabsList className="bg-muted/30">
            <TabsTrigger value="positions">Open Positions ({positions?.length || 0})</TabsTrigger>
            <TabsTrigger value="liquidity">Liquidity Pools ({liquidityPositions?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="positions">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
              {positions && positions.length > 0 ? (
                <div className="space-y-4">
                  {positions.map((pos) => (
                    <div key={pos.id} className="p-4 rounded-lg bg-muted/20 border border-border/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-lg">{pos.symbol}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${pos.type === "long" ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"}`}>
                              {pos.leverage}x {pos.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Entry: ${parseFloat(pos.entryPrice).toFixed(2)} • Chain: {pos.chain}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            ${(parseFloat(pos.collateral) * pos.leverage).toFixed(2)}
                          </div>
                          <div className={`text-sm ${parseFloat(pos.pnl || "0") >= 0 ? "text-accent" : "text-destructive"}`}>
                            {parseFloat(pos.pnl || "0") >= 0 ? "+" : ""}${parseFloat(pos.pnl || "0").toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No open positions</p>
                  <p className="text-sm mt-2">Start trading to see your positions here</p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="liquidity">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
              {liquidityPositions && liquidityPositions.length > 0 ? (
                <div className="space-y-4">
                  {liquidityPositions.map((pos) => (
                    <div key={pos.id} className="p-4 rounded-lg bg-muted/20 border border-border/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg mb-1">{pos.poolName}</div>
                          <div className="text-sm text-muted-foreground">
                            {pos.protocol} • {pos.chain} • APY: {parseFloat(pos.apy || "0").toFixed(2)}%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            ${parseFloat(pos.totalValue || "0").toFixed(2)}
                          </div>
                          <div className="text-sm text-accent">
                            +${parseFloat(pos.earnedFees || "0").toFixed(2)} fees
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No active liquidity positions</p>
                  <p className="text-sm mt-2">Add liquidity to earn fees</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
  className?: string;
}

function StatCard({ title, value, icon: Icon, trend, trendValue, className }: StatCardProps) {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className={`text-2xl font-bold mb-1 ${className || ""}`}>{value}</div>
      {trend && trendValue && (
        <div className="flex items-center gap-1 text-sm">
          {trend === "up" ? (
            <TrendingUp className="w-4 h-4 text-accent" />
          ) : (
            <TrendingDown className="w-4 h-4 text-destructive" />
          )}
          <span className={trend === "up" ? "text-accent" : "text-destructive"}>
            {trendValue}
          </span>
        </div>
      )}
    </Card>
  );
}
