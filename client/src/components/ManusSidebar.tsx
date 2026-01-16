import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Bitcoin,
  Zap,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Instance {
  id: string;
  name: string;
  symbol: string;
  leverage: string;
  pnl: number;
  hasNotification: boolean;
  icon: React.ReactNode;
}

interface ManusSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onWalletConnect: () => void;
}

export default function ManusSidebar({ currentView, onViewChange, isCollapsed, setIsCollapsed, onWalletConnect }: ManusSidebarProps) {
  
  // 模拟副本数据
  const instances: Instance[] = [
    {
      id: "eth-3x",
      name: "ETH 3x Long",
      symbol: "ETH",
      leverage: "3x",
      pnl: 10.73,
      hasNotification: true,
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: "btc-2x",
      name: "BTC 2x Long",
      symbol: "BTC",
      leverage: "2x",
      pnl: -1.17,
      hasNotification: false,
      icon: <Bitcoin className="w-5 h-5" />
    },
    {
      id: "sol-5x",
      name: "SOL 5x Long",
      symbol: "SOL",
      leverage: "5x",
      pnl: 5.42,
      hasNotification: true,
      icon: <Zap className="w-5 h-5" />
    }
  ];

  return (
    <div
      className={cn(
        "relative h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-semibold text-gray-900">DeFi 交易</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* 总览 */}
        <button
          onClick={() => onViewChange("overview")}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 transition-colors",
            currentView === "overview"
              ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
              : "text-gray-700 hover:bg-gray-50"
          )}
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">总览</span>}
        </button>

        {/* 分隔线 */}
        <div className="my-2 px-4">
          <div className="h-px bg-gray-200" />
        </div>

        {/* 副本列表 */}
        {!isCollapsed && (
          <div className="px-4 py-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              交易副本
            </span>
          </div>
        )}

        {instances.map((instance) => (
          <button
            key={instance.id}
            onClick={() => onViewChange(instance.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 transition-colors relative",
              currentView === instance.id
                ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            {/* 红点提示 */}
            {instance.hasNotification && (
              <div className="absolute left-2 top-3 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
            
            <div className="flex-shrink-0">{instance.icon}</div>
            
            {!isCollapsed && (
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">{instance.symbol} {instance.leverage}</div>
                <div className={cn(
                  "text-xs",
                  instance.pnl >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {instance.pnl >= 0 ? "+" : ""}{instance.pnl.toFixed(2)}%
                </div>
              </div>
            )}
          </button>
        ))}

        {/* 开启新副本 */}
        <button
          onClick={() => onViewChange("new-instance")}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors mt-2"
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">开启新副本</span>}
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* 钱包连接按钮 */}
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={onWalletConnect}
        >
          <Wallet className="w-4 h-4" />
          {!isCollapsed && <span>连接钱包</span>}
        </Button>
        
        {/* 资产信息 */}
        {!isCollapsed ? (
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>总资产</span>
              <span className="font-semibold text-gray-900">$20,000</span>
            </div>
            <div className="flex justify-between">
              <span>总盈亏</span>
              <span className="font-semibold text-green-600">+$83.91</span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-xs font-bold">+4%</span>
          </div>
        )}
      </div>
    </div>
  );
}
