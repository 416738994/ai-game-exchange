import { useState } from "react";
import { useLocation } from "wouter";
import ManusSidebar from "@/components/ManusSidebar";
import OverviewPage from "@/pages/OverviewPage";
import WalletConnectDialog, { WalletInfo } from "@/components/WalletConnectDialog";
import { toast } from "sonner";

export default function MainApp() {
  const [currentView, setCurrentView] = useState("overview");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<WalletInfo | null>(null);

  const handleWalletConnect = (wallet: WalletInfo) => {
    setConnectedWallet(wallet);
    toast.success(`已连接到 ${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`);
  };

  const [, setLocation] = useLocation();

  // 处理导航切换
  const handleViewChange = (view: string) => {
    if (view === "overview") {
      setCurrentView("overview");
    } else if (view === "new-instance") {
      setCurrentView("new-instance");
    } else {
      // 副本详情页通过路由跳转
      setLocation(`/instance/${view}`);
    }
  };

  const renderContent = () => {
    if (currentView === "overview") {
      return <OverviewPage />;
    } else if (currentView === "new-instance") {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">开启新副本</h2>
            <p className="text-gray-600">功能开发中...</p>
          </div>
        </div>
      );
    }
    return <OverviewPage />;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ManusSidebar 
        currentView={currentView} 
        onViewChange={handleViewChange}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onWalletConnect={() => setWalletDialogOpen(true)}
      />
      <WalletConnectDialog
        open={walletDialogOpen}
        onOpenChange={setWalletDialogOpen}
        onConnect={handleWalletConnect}
      />
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
