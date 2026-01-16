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
  
  // AI 区域高度比例（默认 30% / 50% / 20%）
  const [zone1Height, setZone1Height] = useState(30);
  const [zone2Height, setZone2Height] = useState(50);
  const [zone3Height, setZone3Height] = useState(20);

  // 拖拽调整高度（简化版本，后续可以优化）
  const handleDragDivider = (dividerIndex: number, deltaY: number) => {
    const totalHeight = window.innerHeight;
    const deltaPercent = (deltaY / totalHeight) * 100;

    if (dividerIndex === 1) {
      // 调整 zone1 和 zone2
      const newZone1 = Math.max(15, Math.min(50, zone1Height + deltaPercent));
      const newZone2 = Math.max(30, Math.min(70, zone2Height - deltaPercent));
      setZone1Height(newZone1);
      setZone2Height(newZone2);
    } else if (dividerIndex === 2) {
      // 调整 zone2 和 zone3
      const newZone2 = Math.max(30, Math.min(70, zone2Height + deltaPercent));
      const newZone3 = Math.max(15, Math.min(40, zone3Height - deltaPercent));
      setZone2Height(newZone2);
      setZone3Height(newZone3);
    }
  };

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
          {/* Back Button */}
          <div className="p-4 border-b border-gray-200">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="w-4 h-4" />
              返回主页
            </Button>
          </div>
        {/* Zone 1: Real-time Analysis (30%) */}
        <div style={{ height: `${zone1Height}%` }} className="border-b border-gray-200">
          <AIRealtimeAnalysis instanceId={instanceId} />
        </div>

        {/* Divider 1 */}
        <div
          className="h-1 bg-gray-300 hover:bg-blue-500 cursor-row-resize transition-colors"
          draggable
          onDrag={(e) => {
            if (e.clientY > 0) {
              handleDragDivider(1, e.movementY);
            }
          }}
        />

        {/* Zone 2: Execution Log (50%) */}
        <div style={{ height: `${zone2Height}%` }} className="overflow-hidden">
          <AIExecutionLog instanceId={instanceId} />
        </div>

        {/* Divider 2 */}
        <div
          className="h-1 bg-gray-300 hover:bg-blue-500 cursor-row-resize transition-colors"
          draggable
          onDrag={(e) => {
            if (e.clientY > 0) {
              handleDragDivider(2, e.movementY);
            }
          }}
        />

        {/* Zone 3: Commander Chat (20%) */}
        <div style={{ height: `${zone3Height}%` }} className="overflow-hidden">
          <CommanderChat instanceId={instanceId} />
        </div>
      </div>

      {/* Right: Battle View */}
      <div className="flex-1 overflow-y-auto">
        <BattleView instanceId={instanceId} />
      </div>
      </div>
    </div>
  );
}
