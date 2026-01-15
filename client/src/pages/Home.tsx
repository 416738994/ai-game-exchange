import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ArrowRight, Bot, TrendingUp, Shield, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Redirect to dashboard if already logged in
    window.location.href = "/dashboard";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-xl bg-background/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI DeFi Platform
            </span>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <a href={getLoginUrl()}>
              Launch App <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Zap className="w-4 h-4" />
            <span>AI-Powered DeFi Trading</span>
          </div>
          
          <h1 className="text-6xl font-bold leading-tight">
            Trade Smarter with{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of decentralized trading. Let AI guide your investment decisions 
            with real-time market analysis, risk assessment, and automated strategy execution.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-lg px-8">
              <a href={getLoginUrl()}>
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need for professional DeFi trading
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-card/50 backdrop-blur border-border/40 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="p-12 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of traders using AI to maximize their DeFi investments
          </p>
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-lg px-8">
            <a href={getLoginUrl()}>
              Launch Platform <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>© 2026 AI DeFi Platform. Built with cutting-edge technology.</p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Bot,
    title: "AI Trading Assistant",
    description: "Converse with AI to analyze markets, get strategy recommendations, and execute trades through natural language.",
  },
  {
    icon: TrendingUp,
    title: "Leverage Trading",
    description: "Access up to 100x leverage on major cryptocurrencies with advanced risk management and liquidation protection.",
  },
  {
    icon: Shield,
    title: "Multi-Chain Support",
    description: "Trade seamlessly across Ethereum, Arbitrum, Base, and more. Your keys, your assets, complete control.",
  },
  {
    icon: Zap,
    title: "Real-Time Analytics",
    description: "Monitor live prices, track your portfolio, and analyze market trends with institutional-grade data.",
  },
  {
    icon: TrendingUp,
    title: "Liquidity Provision",
    description: "Earn passive income by providing liquidity to DeFi protocols. Transparent APY calculations and IL tracking.",
  },
  {
    icon: Shield,
    title: "Security First",
    description: "Audited smart contracts, multi-signature protection, and comprehensive risk assessments for every trade.",
  },
];
