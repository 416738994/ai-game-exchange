import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, ArrowDownRight, TrendingUp, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";
import { format } from "date-fns";

export default function History() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: trades } = trpc.trades.list.useQuery({ limit: 50 });
  const { data: positions } = trpc.positions.list.useQuery();

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

  const closedPositions = positions?.filter(p => p.status === "closed") || [];
  const totalPnL = closedPositions.reduce((sum, pos) => sum + parseFloat(pos.pnl || "0"), 0);
  const winningTrades = closedPositions.filter(p => parseFloat(p.pnl || "0") > 0).length;
  const winRate = closedPositions.length > 0 ? (winningTrades / closedPositions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trading History</h1>
          <p className="text-muted-foreground">Review your past trades and performance</p>
        </div>

        {/* Performance Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
            <div className="text-sm text-muted-foreground mb-2">Total Trades</div>
            <div className="text-3xl font-bold">{closedPositions.length}</div>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
            <div className="text-sm text-muted-foreground mb-2">Win Rate</div>
            <div className="text-3xl font-bold text-accent">{winRate.toFixed(1)}%</div>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
            <div className="text-sm text-muted-foreground mb-2">Total P&L</div>
            <div className={`text-3xl font-bold ${totalPnL >= 0 ? "text-accent" : "text-destructive"}`}>
              {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
            </div>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
            <div className="text-sm text-muted-foreground mb-2">Best Trade</div>
            <div className="text-3xl font-bold text-accent">
              +${Math.max(...closedPositions.map(p => parseFloat(p.pnl || "0")), 0).toFixed(2)}
            </div>
          </Card>
        </div>

        {/* History Tabs */}
        <Tabs defaultValue="trades" className="space-y-6">
          <TabsList className="bg-muted/30">
            <TabsTrigger value="trades">All Trades ({trades?.length || 0})</TabsTrigger>
            <TabsTrigger value="closed">Closed Positions ({closedPositions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="trades">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
              {trades && trades.length > 0 ? (
                <div className="space-y-3">
                  {trades.map((trade) => (
                    <div key={trade.id} className="p-4 rounded-lg bg-muted/20 border border-border/20 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            trade.action === "open" 
                              ? "bg-primary/20" 
                              : trade.action === "close"
                              ? "bg-accent/20"
                              : "bg-destructive/20"
                          }`}>
                            {trade.type === "long" ? (
                              <ArrowUpRight className={`w-5 h-5 ${
                                trade.action === "open" ? "text-primary" : "text-accent"
                              }`} />
                            ) : (
                              <ArrowDownRight className={`w-5 h-5 ${
                                trade.action === "open" ? "text-primary" : "text-destructive"
                              }`} />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{trade.symbol}</span>
                              <Badge variant={trade.type === "long" ? "default" : "destructive"} className="text-xs">
                                {trade.leverage}x {trade.type.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {trade.action}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(trade.createdAt), "MMM dd, yyyy HH:mm")} • {trade.chain}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${parseFloat(trade.price).toFixed(2)}
                          </div>
                          {trade.pnl && (
                            <div className={`text-sm ${parseFloat(trade.pnl) >= 0 ? "text-accent" : "text-destructive"}`}>
                              {parseFloat(trade.pnl) >= 0 ? "+" : ""}${parseFloat(trade.pnl).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No trading history yet</p>
                  <p className="text-sm mt-2">Start trading to see your history here</p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="closed">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
              {closedPositions.length > 0 ? (
                <div className="space-y-3">
                  {closedPositions.map((position) => {
                    const pnl = parseFloat(position.pnl || "0");
                    const pnlPercent = (pnl / parseFloat(position.collateral)) * 100;
                    
                    return (
                      <div key={position.id} className="p-4 rounded-lg bg-muted/20 border border-border/20">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-lg">{position.symbol}</span>
                              <Badge variant={position.type === "long" ? "default" : "destructive"} className="text-xs">
                                {position.leverage}x {position.type.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Opened: {format(new Date(position.openedAt), "MMM dd, yyyy")} • 
                              Closed: {position.closedAt ? format(new Date(position.closedAt), "MMM dd, yyyy") : "N/A"}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xl font-bold ${pnl >= 0 ? "text-accent" : "text-destructive"}`}>
                              {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                            </div>
                            <div className={`text-sm ${pnl >= 0 ? "text-accent" : "text-destructive"}`}>
                              {pnl >= 0 ? "+" : ""}{pnlPercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Entry</div>
                            <div className="font-semibold">${parseFloat(position.entryPrice).toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Exit</div>
                            <div className="font-semibold">${parseFloat(position.currentPrice || "0").toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Size</div>
                            <div className="font-semibold">${(parseFloat(position.collateral) * position.leverage).toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Chain</div>
                            <div className="font-semibold capitalize">{position.chain}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No closed positions yet</p>
                  <p className="text-sm mt-2">Close some positions to see them here</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
