import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AIChat from "./pages/AIChat";
import Trade from "./pages/Trade";
import Liquidity from "./pages/Liquidity";
import Wallets from "./pages/Wallets";
import History from "./pages/History";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      
      {/* Protected routes with layout */}
      <Route path="/dashboard">
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </Route>
      
      <Route path="/ai-chat">
        <AppLayout>
          <AIChat />
        </AppLayout>
      </Route>
      
      <Route path="/trade">
        <AppLayout>
          <Trade />
        </AppLayout>
      </Route>
      
      <Route path="/liquidity">
        <AppLayout>
          <Liquidity />
        </AppLayout>
      </Route>
      
      <Route path="/wallets">
        <AppLayout>
          <Wallets />
        </AppLayout>
      </Route>
      
      <Route path="/history">
        <AppLayout>
          <History />
        </AppLayout>
      </Route>
      
      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
