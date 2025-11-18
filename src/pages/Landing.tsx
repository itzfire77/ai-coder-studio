import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Zap, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-workspace.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 animate-glow">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground/80">AI-Powered Coding Workspace</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Build. Code. Deploy.
              <br />
              <span className="gradient-text">Lightning Fast.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The ultimate AI coding workspace with GitHub integration, multi-language execution, 
              and real-time collaboration. Build production-ready apps faster than ever.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="group hover-lift">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="secondary" className="hover-lift">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <img 
              src={heroImage} 
              alt="AI Coding Workspace"
              className="rounded-2xl border border-border shadow-2xl w-full animate-float"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Code Smarter</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built for developers who demand speed, security, and intelligence
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Code2 className="h-8 w-8 text-primary" />}
              title="AI Code Assistant"
              description="Generate, debug, and refactor code with advanced AI models. Your intelligent pair programmer."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-accent" />}
              title="Multi-Language Support"
              description="Execute Python, JavaScript, Java, C++ and more. Switch between languages seamlessly."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-primary" />}
              title="GitHub Integration"
              description="Import repos, commit changes, create PRs. Full version control at your fingertips."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="glass rounded-3xl p-12 text-center space-y-6 border border-primary/20 animate-glow">
            <h2 className="text-4xl font-bold">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join developers building the future with UltimateBot
            </p>
            <Link to="/auth">
              <Button size="lg" className="hover-lift">
                Start Coding Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <div className="glass rounded-2xl p-8 hover-lift group">
    <div className="mb-4 inline-block p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Landing;
