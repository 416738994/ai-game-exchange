import { useState } from "react";
import ManusSidebar from "@/components/ManusSidebar";
import OverviewPage from "@/pages/OverviewPage";
import InstanceDetailPage from "@/pages/InstanceDetailPage";
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

  // 点击副本时自动收缩侧边栏
  const handleViewChange = (view: string) => {
    setCurrentView(view);
    // 如果不是总览页，自动收缩侧边栏
    if (view !== "overview" && view !== "new-instance") {
      setIsCollapsed(true);
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
    } else {
      // 副本详情页
      return <InstanceDetailPage />;
    }
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
