import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play, Settings } from 'lucide-react';

interface AIEmployeeLayoutProps {
  children: ReactNode;
  aiPanel: ReactNode;
}

export default function AIEmployeeLayout({ children, aiPanel }: AIEmployeeLayoutProps) {
  const [aiPaused, setAiPaused] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* 左侧 AI 员工面板 (30%) */}
      <div className="w-[30%] border-r border-border flex flex-col bg-card">
        {/* AI 面板头部 */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h2 className="font-semibold text-lg">AI 投资经理</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className={aiPaused ? 'text-muted-foreground' : 'text-primary'}>
                    {aiPaused ? '已暂停' : '盯盘中'}
                  </span>
                  <span className={aiPaused ? '' : 'animate-pulse'}>
                    {aiPaused ? '⏸️' : '💼'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAiPaused(!aiPaused)}
                className="gap-1"
              >
                {aiPaused ? (
                  <>
                    <Play className="w-4 h-4" />
                    恢复
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    暂停
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {aiPaused && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              ⚠️ AI 已暂停自主操作，当前副本保持现状
            </div>
          )}
        </div>

        {/* AI 面板内容 */}
        <div className="flex-1 overflow-y-auto">
          {aiPanel}
        </div>
      </div>

      {/* 右侧主内容区 (70%) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
