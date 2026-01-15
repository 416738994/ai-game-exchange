import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Wallet, Plus, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Wallets() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const { data: wallets } = trpc.wallets.list.useQuery();

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

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleConnectWallet = () => {
    toast.info("Wallet connection feature coming soon!");
  };

  // Mock wallet balances
  const mockBalances: Record<string, { eth: number; usdt: number; btc: number }> = {
    ethereum: { eth: 2.5, usdt: 5000, btc: 0 },
    arbitrum: { eth: 1.2, usdt: 2500, btc: 0 },
    base: { eth: 0.8, usdt: 1500, btc: 0 },
    optimism: { eth: 0.5, usdt: 1000, btc: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Wallet Management</h1>
          <p className="text-muted-foreground">Connect and manage your multi-chain wallets</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Connected Wallets */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Connected Wallets</h2>
                <Button onClick={handleConnectWallet} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>

              {wallets && wallets.length > 0 ? (
                <div className="space-y-4">
                  {wallets.map((wallet) => (
                    <div key={wallet.id} className="p-4 rounded-lg bg-muted/20 border border-border/20">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold capitalize">{wallet.chain}</span>
                              {wallet.isDefault && (
                                <Badge variant="secondary" className="text-xs">Default</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground font-mono">
                              {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyAddress(wallet.address)}
                          >
                            {copiedAddress === wallet.address ? (
                              <Check className="w-4 h-4 text-accent" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <a
                              href={`https://etherscan.io/address/${wallet.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">ETH</div>
                          <div className="font-semibold">
                            {mockBalances[wallet.chain]?.eth.toFixed(4) || "0.0000"}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">USDT</div>
                          <div className="font-semibold">
                            {mockBalances[wallet.chain]?.usdt.toLocaleString() || "0"}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Total Value</div>
                          <div className="font-semibold text-accent">
                            ${((mockBalances[wallet.chain]?.eth || 0) * 3456.78 + (mockBalances[wallet.chain]?.usdt || 0)).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">No wallets connected</p>
                  <Button onClick={handleConnectWallet} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Connect Your First Wallet
                  </Button>
                </div>
              )}
            </Card>

            {/* Supported Chains */}
            <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
              <h3 className="text-lg font-semibold mb-4">Supported Networks</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {supportedChains.map((chain) => (
                  <div key={chain.id} className="p-4 rounded-lg bg-muted/20 border border-border/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="text-xs font-bold">{chain.symbol}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{chain.name}</div>
                        <div className="text-xs text-muted-foreground">{chain.type}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Gas: {chain.avgGas}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Wallet Info Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
              <h3 className="text-lg font-semibold mb-4">Security Tips</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Never share your private keys or seed phrase</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Always verify contract addresses before signing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Use hardware wallets for large amounts</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Enable 2FA on all connected services</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Keep your wallet software up to date</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/40">
              <h3 className="text-lg font-semibold mb-4">Wallet Features</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span>Multi-chain support</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span>Real-time balance tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span>Transaction history</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span>Gas optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span>Direct blockchain connection</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
              <h3 className="text-lg font-semibold mb-2">Your Keys, Your Crypto</h3>
              <p className="text-sm text-muted-foreground mb-4">
                All transactions are executed directly on-chain. We never have access to your funds.
              </p>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const supportedChains = [
  { id: "ethereum", name: "Ethereum", symbol: "ETH", type: "Layer 1", avgGas: "~$5-15" },
  { id: "arbitrum", name: "Arbitrum", symbol: "ARB", type: "Layer 2", avgGas: "~$0.10-0.50" },
  { id: "base", name: "Base", symbol: "BASE", type: "Layer 2", avgGas: "~$0.05-0.20" },
  { id: "optimism", name: "Optimism", symbol: "OP", type: "Layer 2", avgGas: "~$0.10-0.40" },
];
