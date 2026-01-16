import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Activity, AlertCircle, Plus } from "lucide-react";
import CreateInstanceDialog, { InstanceData } from "@/components/CreateInstanceDialog";
import AIChiefAssistant from "@/components/AIChiefAssistant";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function OverviewPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleCreateInstance = (data: InstanceData) => {
    // TODO: 实现创建副本逻辑
    console.log("创建副本:", data);
    toast.success(`成功开启 ${data.asset} ${data.leverage}x 副本，投入 $${data.amount}`);
  };

  const handleInstanceClick = (instanceId: string) => {
    setLocation(`/instance/${instanceId}`);
  };
  // 模拟数据
  const stats = {
    totalAssets: 20000,
    totalPnL: 83.91,
    totalPnLPercent: 4.20,
    availableBalance: 18000,
    committedFunds: 2000,
    activeInstances: 3
  };

  const instances = [
    {
      id: "eth-3x",
      name: "ETH 3x Long",
      invested: 1000,
      currentValue: 1107.25,
      pnl: 107.25,
      pnlPercent: 10.73,
      health: 35.6,
      status: "盈利中"
    },
    {
      id: "btc-2x",
      name: "BTC 2x Long",
      invested: 2000,
      currentValue: 1976.66,
      pnl: -23.34,
      pnlPercent: -1.17,
      health: 32.5,
      status: "轻微亏损"
    },
    {
      id: "sol-5x",
      name: "SOL 5x Long",
      invested: 500,
      currentValue: 527.10,
      pnl: 27.10,
      pnlPercent: 5.42,
      health: 45.2,
      status: "盈利中"
    }
  ];

  const aiTeamStatus = [
    { name: "盯盘 AI", status: "监控中", activity: "正在监控 3 个副本的价格变化" },
    { name: "市场分析 AI", status: "分析中", activity: "分析 BTC 对整体市场的影响" },
    { name: "舆情分析 AI", status: "监控中", activity: "Twitter 情绪指数 78% 看涨" },
    { name: "策略 AI", status: "待命中", activity: "等待市场信号" }
  ];

  const alerts = [
    {
      type: "warning",
      message: "BTC 副本健康度较低 (32.5%)，建议补仓或止损",
      time: "2 分钟前"
    },
    {
      type: "success",
      message: "ETH 副本达到 +10% 盈利目标",
      time: "15 分钟前"
    },
    {
      type: "info",
      message: "SOL 突破关键阻力位 $145，建议关注",
      time: "30 分钟前"
    }
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">投资总览</h1>
        <p className="text-gray-600">查看所有副本和 AI 团队的整体状态</p>
      </div>

      {/* AI Chief Assistant Report */}
      <AIChiefAssistant />

      {/* 资产统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-white border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总资产</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${stats.totalAssets.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-600">可用余额:</span>
            <span className="font-semibold text-gray-900">${stats.availableBalance.toLocaleString()}</span>
          </div>
        </Card>

        <Card className="p-6 bg-white border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总盈亏</p>
              <p className={`text-2xl font-bold mt-1 ${stats.totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                {stats.totalPnL >= 0 ? "+" : ""}${stats.totalPnL.toFixed(2)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              stats.totalPnL >= 0 ? "bg-green-100" : "bg-red-100"
            }`}>
              {stats.totalPnL >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600" />
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-600">收益率:</span>
            <span className={`font-semibold ${stats.totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.totalPnL >= 0 ? "+" : ""}{stats.totalPnLPercent.toFixed(2)}%
            </span>
          </div>
        </Card>

        <Card className="p-6 bg-white border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">活跃副本</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeInstances}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">{stats.activeInstances}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-600">已委托:</span>
            <span className="font-semibold text-gray-900">${stats.committedFunds.toLocaleString()}</span>
          </div>
        </Card>
      </div>

      {/* 重要提醒 */}
      <Card className="p-6 bg-white border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">重要提醒</h2>
          <AlertCircle className="w-5 h-5 text-orange-500" />
        </div>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                alert.type === "warning"
                  ? "bg-orange-50 border-orange-200"
                  : alert.type === "success"
                  ? "bg-green-50 border-green-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-gray-900">{alert.message}</p>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 副本列表 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">所有副本</h2>
          <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            开启新副本
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instances.map((instance) => (
            <Card 
              key={instance.id} 
              className="p-6 bg-white border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleInstanceClick(instance.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{instance.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  instance.pnl >= 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {instance.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">投入资金</span>
                  <span className="font-semibold text-gray-900">${instance.invested.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">当前价值</span>
                  <span className="font-semibold text-gray-900">${instance.currentValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">盈亏</span>
                  <span className={`font-semibold ${instance.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {instance.pnl >= 0 ? "+" : ""}${instance.pnl.toFixed(2)} ({instance.pnl >= 0 ? "+" : ""}{instance.pnlPercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">健康度</span>
                  <span className={`font-semibold ${
                    instance.health > 50 ? "text-green-600" :
                    instance.health > 30 ? "text-orange-600" :
                    "text-red-600"
                  }`}>
                    {instance.health.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      instance.health > 50 ? "bg-green-500" :
                      instance.health > 30 ? "bg-orange-500" :
                      "bg-red-500"
                    }`}
                    style={{ width: `${instance.health}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* AI 团队状态 */}
      <Card className="p-6 bg-white border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI 团队状态</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiTeamStatus.map((ai, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-semibold text-sm text-gray-900">{ai.name}</span>
              </div>
              <p className="text-xs text-gray-600 mb-1">{ai.status}</p>
              <p className="text-xs text-gray-500">{ai.activity}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 开启新副本对话框 */}
      <CreateInstanceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateInstance={handleCreateInstance}
      />
    </div>
  );
}
