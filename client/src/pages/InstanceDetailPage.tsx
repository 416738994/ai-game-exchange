import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ManusSidebar from "@/components/ManusSidebar";
import AIRealtimeAnalysis from "@/components/AIRealtimeAnalysis";
import AIExecutionLog from "@/components/AIExecutionLog";
import CommanderChat from "@/components/CommanderChat";
import BattleView from "@/components/BattleView";

export default function InstanceDetailPage() {
  const params = useParams<{ id: string }>();
  const instanceId = params.id || "eth-3x";
  const [, setLocation] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true); // 副本页默认收缩侧边栏
  
  // TODO: 从钱包连接状态读取用户名，这里暂时使用模拟数据
  const walletName = undefined; // 未连接钱包，显示为"游客"
  
  // AI 区域高度比例（固定 30% / 50% / 20%）
  const zone1Height = 30;
  const zone2Height = 50;
  const zone3Height = 20;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <ManusSidebar 
        currentView={instanceId} 
        onViewChange={(view) => {
          if (view === "overview") {
            setLocation("/");
          }
        }}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onWalletConnect={() => {}}
      />
      
      <div className="flex flex-1 h-screen bg-gray-50">
        {/* Left: AI Panel (3 zones) - 缩小到 30% */}
        <div className="w-[30%] border-r border-gray-200 flex flex-col bg-white">
        {/* Zone 1: Real-time Analysis (30%) */}
        <div style={{ height: `${zone1Height}%` }} className="border-b border-gray-200">
          <AIRealtimeAnalysis instanceId={instanceId} />
        </div>

        {/* Divider 1 */}
        <div className="h-px bg-gray-200" />

        {/* Zone 2: Execution Log (50%) */}
        <div style={{ height: `${zone2Height}%` }} className="overflow-hidden">
          <AIExecutionLog instanceId={instanceId} />
        </div>

        {/* Divider 2 */}
        <div className="h-px bg-gray-200" />

        {/* Zone 3: Commander Chat (20%) */}
        <div style={{ height: `${zone3Height}%` }} className="overflow-hidden">
          <CommanderChat instanceId={instanceId} />
        </div>
      </div>

      {/* Right: Battle View */}
      <div className="flex-1 overflow-hidden">
        <BattleView instanceId={instanceId} walletName={walletName} />
      </div>
      </div>
    </div>
  );
}
