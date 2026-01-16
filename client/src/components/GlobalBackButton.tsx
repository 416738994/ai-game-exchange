import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function GlobalBackButton() {
  const [location, setLocation] = useLocation();

  // 如果在主页，不显示后退按钮
  if (location === "/") {
    return null;
  }

  const handleBack = () => {
    // 使用浏览器历史记录后退
    window.history.back();
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2 bg-white shadow-md hover:shadow-lg transition-shadow"
        onClick={handleBack}
      >
        <ArrowLeft className="w-4 h-4" />
        后退
      </Button>
    </div>
  );
}
