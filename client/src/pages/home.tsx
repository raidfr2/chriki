import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import ChatDemo from "@/components/ChatDemo";

export default function Home() {

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="font-mono font-bold text-xl tracking-tight">CHRIKI</div>
              <div className="w-2 h-2 bg-foreground rounded-full animate-pulse"></div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
                data-testid="nav-features"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('demo')}
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
                data-testid="nav-demo"
              >
                Demo
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
                data-testid="nav-contact"
              >
                Contact
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="font-mono text-6xl sm:text-7xl md:text-8xl font-bold mb-6 tracking-tight dot-matrix">
              CHRIKI
            </div>
            <div className="font-mono text-lg sm:text-xl text-muted-foreground mb-8 tracking-wide">
              ALGERIAN.AI.CHATBOT.v1.0
            </div>
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight mb-8">
                The first AI that speaks<br/>
                <span className="font-bold">authentic Algerian</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-12 leading-relaxed">
                Experience conversations in true Algerian dialect.<br/>
                Chriki-1 understands your culture, your expressions, your way of speaking.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/chat">
                <Button 
                  size="lg" 
                  className="min-w-[200px] font-medium tracking-wide"
                  data-testid="button-try-now"
                >
                  TRY CHRIKI NOW
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => scrollToSection('demo')}
                className="min-w-[200px] font-medium tracking-wide border-2"
                data-testid="button-watch-demo"
              >
                WATCH DEMO
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="pt-8 pb-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">LIVE.DEMO</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Watch Chriki-1 in action with real-time conversation simulations
            </p>
          </div>

          <ChatDemo />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">FEATURES.CHRIKI-1</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for Algerians, by understanding Algeria. Every conversation feels natural and authentic.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            {[
              {
                icon: "💬",
                title: "AUTHENTIC.DIALECT",
                description: "Understands real Algerian expressions like \"Wach rak? Labas?\", \"Makansh mushkil\", and \"Hakda rebi\".",
                tech: "// NEURAL_LANGUAGE_MODEL_v2.1"
              },
              {
                icon: "🕌",
                title: "CULTURAL.CONTEXT",
                description: "Knows about Ramadan schedules, Eid celebrations, local customs and Algerian way of life.",
                tech: "// CULTURAL_DATABASE_v1.3"
              },
              {
                icon: "💭",
                title: "LOCAL.EXPRESSIONS",
                description: "Speaks with authentic phrases: \"Bsah\", \"Nchalah\", \"Wallah\", \"Baraka Allah fik\" naturally integrated.",
                tech: "// EXPRESSION_ENGINE_v1.8"
              },
              {
                icon: "🎤",
                title: "DARIJA.FLUENCY",
                description: "Seamlessly switches between Arabic, French and Berber influences like real Algerian speech.",
                tech: "// MULTILINGUAL_CORE_v3.0"
              },
              {
                icon: "🌍",
                title: "REGIONAL.AWARE",
                description: "Recognizes differences between Algiers, Oran, Constantine dialects and adapts accordingly.",
                tech: "// GEO_LINGUISTIC_v1.5"
              },
              {
                icon: "⚡",
                title: "INSTANT.RESPONSE",
                description: "Lightning-fast processing ensures natural conversation flow without awkward delays.",
                tech: "// RESPONSE_ENGINE_v2.7"
              },
              {
                icon: "🗺️",
                title: "LOCATION.SERVICES",
                description: "Find hospitals, restaurants, banks and more near you with integrated Google Maps search.",
                tech: "// LOCATION_ENGINE_v1.2"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-background border-2 border-foreground p-8 group hover:bg-foreground hover:text-background transition-all duration-300"
                data-testid={`feature-${feature.title.toLowerCase().replace('.', '-')}`}
              >
                <div className="mb-6 text-3xl">{feature.icon}</div>
                <h3 className="font-mono text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-sm leading-relaxed mb-4">{feature.description}</p>
                <div className="text-xs font-mono opacity-60">{feature.tech}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specs Section */}
      <section className="py-20 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">TECHNICAL.SPECIFICATIONS</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Built on cutting-edge AI architecture optimized for Algerian dialect processing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center" data-testid="stat-accuracy">
              <div className="font-mono text-4xl font-bold mb-2">99.7%</div>
              <div className="text-sm text-muted">DIALECT ACCURACY</div>
              <div className="text-xs font-mono text-muted mt-1">// ALGERIAN_CORPUS_v2.1</div>
            </div>
            
            <div className="text-center" data-testid="stat-response-time">
              <div className="font-mono text-4xl font-bold mb-2">&lt; 100ms</div>
              <div className="text-sm text-muted">RESPONSE TIME</div>
              <div className="text-xs font-mono text-muted mt-1">// OPTIMIZED_PROCESSING</div>
            </div>
            
            <div className="text-center" data-testid="stat-availability">
              <div className="font-mono text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm text-muted">AVAILABILITY</div>
              <div className="text-xs font-mono text-muted mt-1">// CLOUD_INFRASTRUCTURE</div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6 font-mono text-sm overflow-x-auto">
              <div className="text-green-400 mb-2">// CHRIKI-1 SYSTEM ARCHITECTURE</div>
              <div className="space-y-1">
                <div>Model: Transformer-based Neural Network</div>
                <div>Training Data: 50M+ Algerian conversations</div>
                <div>Languages: Arabic, French, Berber integration</div>
                <div>Regions: Algiers, Oran, Constantine, Annaba</div>
                <div>Context Window: 4096 tokens</div>
                <div>API Endpoints: RESTful + WebSocket</div>
                <div>Deployment: Multi-region cloud infrastructure</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-6 tracking-tight dot-matrix">READY.TO.START?</h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 leading-relaxed">
              Experience the first AI that truly understands Algerian culture and language.<br/>
              Join thousands of Algerians already using Chriki-1.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link href="/login">
                <Button 
                  size="lg" 
                  className="min-w-[250px] font-mono font-bold tracking-wide"
                  data-testid="button-start-chatting"
                >
                  START CHATTING NOW
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="min-w-[250px] font-mono font-bold tracking-wide border-2"
                data-testid="button-request-demo"
              >
                REQUEST DEMO
              </Button>
            </div>

            {/* Integration Options */}
            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                {
                  title: "WEB.INTEGRATION",
                  description: "Embed Chriki directly into your website with our JavaScript SDK",
                  code: "npm install @chriki/web-sdk"
                },
                {
                  title: "MOBILE.APPS",
                  description: "Native SDKs for iOS and Android applications",
                  code: "pod 'ChrikiSDK' // iOS\nimplementation 'com.chriki:android-sdk' // Android"
                },
                {
                  title: "API.ACCESS",
                  description: "RESTful API for custom implementations and integrations",
                  code: "curl -X POST api.chriki.ai/v1/chat"
                }
              ].map((integration, index) => (
                <div 
                  key={index}
                  className="border border-border p-6"
                  data-testid={`integration-${integration.title.toLowerCase().replace('.', '-')}`}
                >
                  <h3 className="font-mono font-bold text-lg mb-3">{integration.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                  <div className="font-mono text-xs text-muted-foreground whitespace-pre-line">
                    {integration.code}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">GET.IN.TOUCH</h2>
              <p className="text-lg text-muted-foreground">
                Questions about Chriki? Need custom implementation? We're here to help.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              {/* Contact Information */}
              <div className="space-y-8 text-center">
                <div>
                  <h3 className="font-mono font-bold text-lg mb-4">CONTACT.INFO</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-center space-x-3">
                      <span className="w-4">📸</span>
                      <span>@raidfr2</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <span className="w-4">📍</span>
                      <span>Algeria</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-mono font-bold text-lg mb-4">SUPPORT.HOURS</h3>
                  <div className="text-sm text-muted-foreground">
                    <div>Sunday - Thursday: 9:00 AM - 6:00 PM</div>
                    <div>Friday - Saturday: 2:00 PM - 8:00 PM</div>
                    <div className="mt-2 text-xs">(Algeria Standard Time - UTC+1)</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-mono font-bold text-lg mb-4">FOLLOW.US</h3>
                  <div className="flex justify-center">
                    <a
                      href="https://instagram.com/raidfr2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 border-2 border-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                      data-testid="instagram-link"
                      title="Follow @raidfr2 on Instagram"
                    >
                      📸
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="font-mono font-bold text-xl mb-4">CHRIKI</div>
              <p className="text-sm text-muted leading-relaxed">
                The first AI chatbot that speaks authentic Algerian dialect. Built for Algerians, by understanding Algeria.
              </p>
            </div>
            
            <div>
              <h4 className="font-mono font-bold mb-4">PRODUCT</h4>
              <div className="space-y-2 text-sm">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="block text-muted hover:text-background transition-colors text-left"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('demo')}
                  className="block text-muted hover:text-background transition-colors text-left"
                >
                  Demo
                </button>
                <div className="text-muted hover:text-background transition-colors cursor-pointer">Pricing</div>
                <div className="text-muted hover:text-background transition-colors cursor-pointer">API Documentation</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-mono font-bold mb-4">COMPANY</h4>
              <div className="space-y-2 text-sm">
                <div className="text-muted hover:text-background transition-colors cursor-pointer">About</div>
                <div className="text-muted hover:text-background transition-colors cursor-pointer">Blog</div>
                <div className="text-muted hover:text-background transition-colors cursor-pointer">Careers</div>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="block text-muted hover:text-background transition-colors text-left"
                >
                  Contact
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-mono font-bold mb-4">LEGAL</h4>
              <div className="space-y-2 text-sm">
                <div className="text-muted hover:text-background transition-colors cursor-pointer">Privacy Policy</div>
                <div className="text-muted hover:text-background transition-colors cursor-pointer">Terms of Service</div>
                <div className="text-muted hover:text-background transition-colors cursor-pointer">Cookie Policy</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-muted mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="font-mono text-xs text-muted">
              © 2024 CHRIKI.AI - ALL RIGHTS RESERVED
            </div>
            <div className="font-mono text-xs text-muted mt-4 md:mt-0">
              MADE.IN.ALGERIA.WITH.LOVE
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
