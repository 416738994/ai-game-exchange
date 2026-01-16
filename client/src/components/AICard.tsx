import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bot, TrendingUp, BarChart3, MessageSquare, Lightbulb } from "lucide-react";

export type AIRole = "commander" | "monitor" | "market" | "sentiment" | "strategy";
export type AIStatus = "working" | "thinking" | "standby" | "paused";

export interface AIMessage {
  id: string;
  timestamp: string;
  type: "log" | "mention" | "conclusion";
  content: string;
  mentionTo?: string; // @提及的 AI
}

interface AICardProps {
  role: AIRole;
  name: string;
  status: AIStatus;
  messages: AIMessage[];
  isCommander?: boolean; // 是否是总指挥 AI
  onSendMessage?: (message: string) => void; // 用户发送消息（仅总指挥）
}

const roleIcons: Record<AIRole, React.ReactNode> = {
  commander: <Bot className="w-5 h-5" />,
  monitor: <TrendingUp className="w-5 h-5" />,
  market: <BarChart3 className="w-5 h-5" />,
  sentiment: <MessageSquare className="w-5 h-5" />,
  strategy: <Lightbulb className="w-5 h-5" />
};

const statusLabels: Record<AIStatus, string> = {
  working: "工作中",
  thinking: "思考中",
  standby: "待命中",
  paused: "已暂停"
};

const statusColors: Record<AIStatus, string> = {
  working: "bg-green-500",
  thinking: "bg-blue-500",
  standby: "bg-gray-400",
  paused: "bg-orange-500"
};

export default function AICard({ 
  role, 
  name, 
  status, 
  messages, 
  isCommander = false,
  onSendMessage 
}: AICardProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <Card className={cn(
      "bg-white border-gray-200 overflow-hidden",
      isCommander && "border-2 border-blue-500"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              isCommander ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
            )}>
              {roleIcons[role]}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  statusColors[status],
                  status === "working" && "animate-pulse"
                )} />
                <span className="text-xs text-gray-600">{statusLabels[status]}</span>
              </div>
            </div>
          </div>
          {isCommander && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
              总指挥
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-2 max-h-64 overflow-y-auto bg-white">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            {isCommander ? "开始与 AI 对话..." : "暂无活动"}
          </p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <span className="text-gray-500 text-xs">[{msg.timestamp}]</span>
              {msg.type === "mention" && msg.mentionTo && (
                <span className="text-blue-600 font-semibold ml-1">@{msg.mentionTo}</span>
              )}
              <span className={cn(
                "ml-1",
                msg.type === "conclusion" ? "font-semibold text-gray-900" : "text-gray-700"
              )}>
                {msg.content}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input (only for commander) */}
      {isCommander && onSendMessage && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="输入消息与 AI 对话..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              发送
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
