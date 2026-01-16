import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, ExternalLink, Check } from "lucide-react";
import { toast } from "sonner";

interface WalletConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (wallet: WalletInfo) => void;
}

export interface WalletInfo {
  address: string;
  chain: string;
  balance: number;
}

const CHAINS = [
  { id: "ethereum", name: "Ethereum", icon: "⟠" },
  { id: "arbitrum", name: "Arbitrum", icon: "🔷" },
  { id: "base", name: "Base", icon: "🔵" }
];

const WALLET_PROVIDERS = [
  { 
    id: "metamask", 
    name: "MetaMask", 
    icon: "🦊",
    description: "连接到 MetaMask 钱包"
  },
  { 
    id: "walletconnect", 
    name: "WalletConnect", 
    icon: "🔗",
    description: "使用 WalletConnect 协议"
  },
  { 
    id: "coinbase", 
    name: "Coinbase Wallet", 
    icon: "💼",
    description: "连接到 Coinbase 钱包"
  }
];

export default function WalletConnectDialog({ open, onOpenChange, onConnect }: WalletConnectDialogProps) {
  const [selectedChain, setSelectedChain] = useState<string>("ethereum");
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (providerId: string) => {
    setConnecting(providerId);
    
    // 模拟钱包连接
    setTimeout(() => {
      // TODO: 实现真实的 Web3 钱包连接逻辑
      const mockWallet: WalletInfo = {
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        chain: selectedChain,
        balance: 2.5
      };
      
      onConnect(mockWallet);
      toast.success(`成功连接到 ${WALLET_PROVIDERS.find(p => p.id === providerId)?.name}`);
      setConnecting(null);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>💼 连接钱包</DialogTitle>
          <DialogDescription>
            选择网络和钱包提供商来连接您的 Web3 钱包
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 选择网络 */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900">选择网络</label>
            <div className="grid grid-cols-3 gap-3">
              {CHAINS.map((chain) => (
                <button
                  key={chain.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedChain === chain.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedChain(chain.id)}
                >
                  <div className="text-2xl mb-2">{chain.icon}</div>
                  <div className="text-sm font-semibold text-gray-900">{chain.name}</div>
                  {selectedChain === chain.id && (
                    <Check className="w-4 h-4 text-blue-600 absolute top-2 right-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 选择钱包 */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900">选择钱包</label>
            <div className="space-y-2">
              {WALLET_PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
                  onClick={() => handleConnect(provider.id)}
                  disabled={connecting !== null}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{provider.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{provider.name}</div>
                      <div className="text-xs text-gray-500">{provider.description}</div>
                    </div>
                    {connecting === provider.id ? (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 提示信息 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Wallet className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600">
                <p className="font-semibold mb-1">安全提示</p>
                <ul className="space-y-1 text-xs">
                  <li>• 确保您正在连接到正确的网络</li>
                  <li>• 不要在不信任的网站上连接钱包</li>
                  <li>• 定期检查授权的应用程序</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
