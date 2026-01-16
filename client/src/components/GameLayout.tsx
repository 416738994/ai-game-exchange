import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  X, 
  ChevronRight,
  Wallet,
  TrendingUp,
  History,
  Settings
} from 'lucide-react';

interface GameLayoutProps {
  children: ReactNode;
  showAIChat?: boolean;
}

export default function GameLayout({ children, showAIChat = true }: GameLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [screenEffect, setScreenEffect] = useState<'profit' | 'loss' | null>(null);

  // 触发屏幕效果（暴击/受击）
  const triggerScreenEffect = (type: 'profit' | 'loss') => {
    setScreenEffect(type);
    setTimeout(() => setScreenEffect(null), 500);
  };

  // 暴露给子组件使用
  (window as any).triggerScreenEffect = triggerScreenEffect;

  return (
    <div className="game-layout">
      {/* 屏幕闪光效果 */}
      {screenEffect && (
        <div 
          className={`fixed inset-0 pointer-events-none z-50 ${
            screenEffect === 'profit' ? 'screen-flash-profit' : 'screen-flash-loss'
          }`}
        />
      )}

      {/* 顶部导航栏 */}
      <header className="game-header">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">AI DeFi</span>
            </div>

            {/* 右侧操作 */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Wallet className="w-4 h-4 mr-2" />
                连接钱包
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="game-content">
        {/* 左侧主内容 */}
        <main className="game-main">
          {children}
        </main>

        {/* 右侧 AI 对话面板 */}
        {showAIChat && (
          <aside className={`game-sidebar ${!isChatOpen ? 'collapsed' : ''}`}>
            {isChatOpen ? (
              <>
                {/* AI 对话头部 */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI 交易助手</h3>
                      <p className="text-xs text-muted-foreground">在线</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsChatOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* AI 对话内容 */}
                <div className="flex-1 overflow-auto p-4">
                  <div className="space-y-4">
                    {/* AI 欢迎消息 */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-card rounded-lg p-3 shadow-sm">
                          <p className="text-sm font-semibold mb-1">🎯 大吉大利，今晚吃鸡！</p>
                          <p className="text-sm text-muted-foreground mb-2">
                            欢迎来到 AI DeFi 战场
                          </p>
                          <div className="text-xs space-y-1 text-muted-foreground">
                            <p>今日市场状态：📈 温和上涨</p>
                            <p>BTC +2.3% | ETH -1.2% | SOL +5.6%</p>
                          </div>
                          <p className="text-sm mt-3">
                            准备好开启你的第一个副本了吗？
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            试试说："我想做多 ETH" 或 "帮我分析一下市场"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI 对话输入框 */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="输入你的指令..."
                      className="flex-1 px-3 py-2 bg-background border border-input rounded-lg
                               text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button size="sm">
                      发送
                    </Button>
                  </div>
                </div>
              </>
            ) : null}
          </aside>
        )}

        {/* AI 对话收起时的展开按钮 */}
        {showAIChat && !isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-40
                     w-12 h-12 rounded-full bg-primary text-primary-foreground
                     shadow-lg hover:scale-110 transition-transform
                     flex items-center justify-center"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
