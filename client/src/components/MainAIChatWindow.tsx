import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, Minimize2 } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function MainAIChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "你好！我是你的 AI 投资助理。你可以问我关于投资策略、入金建议、风险评估等任何问题。",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // 模拟 AI 回复（后续集成真实 LLM API）
    setTimeout(() => {
      const aiResponse: Message = {
        role: "ai",
        content: getAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputValue("");
  };

  // 模拟 AI 回复逻辑（后续替换为真实 LLM）
  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("入金") || input.includes("投资")) {
      return "根据当前市场情况，建议您：\n\n1. **初始投资金额**：建议从 $500-$1000 开始，控制风险\n2. **资产配置**：ETH (50%) + BTC (30%) + SOL (20%)\n3. **杠杆选择**：新手建议使用 2x-3x 杠杆\n\n是否需要我帮您开启一个副本？";
    }
    
    if (input.includes("策略") || input.includes("建议")) {
      return "当前市场趋势看涨，我建议：\n\n✅ **ETH 副本**：突破 $3,600 阻力位，建议持有\n⚠️ **BTC 副本**：健康度较低，建议补仓或止损\n🚀 **SOL 副本**：突破关键阻力位，可以考虑加仓\n\n需要我执行某个策略吗？";
    }
    
    if (input.includes("风险") || input.includes("安全")) {
      return "风险评估：\n\n🔴 **高风险副本**：BTC 2x (健康度 32.5%)\n🟡 **中等风险**：SOL 5x (波动较大)\n🟢 **低风险**：ETH 3x (稳定盈利)\n\n建议优先关注 BTC 副本，考虑补仓或止损。";
    }
    
    if (input.includes("开启") || input.includes("创建")) {
      return "好的！开启新副本需要以下信息：\n\n1. 选择资产（ETH/BTC/SOL）\n2. 选择杠杆倍数（1x-10x）\n3. 投入金额\n\n您可以点击主页的「开启新副本」按钮，我会全程协助您。";
    }
    
    return "我理解您的问题。作为 AI 投资助理，我可以帮您：\n\n💡 分析市场趋势\n📊 评估投资风险\n🎯 制定投资策略\n⚡ 执行交易操作\n\n请告诉我您具体想了解什么？";
  };

  // 快捷问题按钮
  const quickQuestions = [
    "现在适合入金吗？",
    "推荐什么投资策略？",
    "当前有哪些风险？",
    "帮我开启一个副本"
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="p-4 bg-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">AI 投资助理</span>
            <span className="text-xs text-gray-500">({messages.length} 条消息)</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96">
      <Card className="bg-white shadow-2xl flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-white" />
            <h3 className="font-bold text-white">AI 投资助理</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {msg.timestamp.toLocaleTimeString("zh-CN", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600 mb-2">快捷问题：</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setInputValue(question);
                    handleSend();
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="输入您的问题..."
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
