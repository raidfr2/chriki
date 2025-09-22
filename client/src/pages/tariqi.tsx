import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MapPin, Navigation, Clock, Compass } from "lucide-react";
import { useState } from "react";

export default function Tariqi() {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar' | 'fr'>('en');

  const translations = {
    en: {
      comingSoon: "COMING SOON",
      subtitle: "Your intelligent navigation companion for Algeria",
      description: "Tariqi will revolutionize how you navigate Algeria with real-time transport information, smart routing, and local insights.",
      features: {
        realTime: "Real-time Transport",
        realTimeDesc: "Live bus, tram, and metro schedules",
        smartRouting: "Smart Routing", 
        smartRoutingDesc: "Multimodal journey planning",
        localInsights: "Local Insights",
        localInsightsDesc: "Traffic patterns and shortcuts",
        accessibility: "Accessibility",
        accessibilityDesc: "Barrier-free route options"
      },
      backToHome: "Back to Home",
      stayTuned: "Stay tuned for the future of navigation in Algeria"
    },
    fr: {
      comingSoon: "BIENTÔT DISPONIBLE",
      subtitle: "Votre compagnon de navigation intelligent pour l'Algérie",
      description: "Tariqi révolutionnera votre façon de naviguer en Algérie avec des informations de transport en temps réel, un routage intelligent et des insights locaux.",
      features: {
        realTime: "Transport en Temps Réel",
        realTimeDesc: "Horaires en direct bus, tram et métro",
        smartRouting: "Routage Intelligent",
        smartRoutingDesc: "Planification de voyage multimodale",
        localInsights: "Insights Locaux",
        localInsightsDesc: "Modèles de trafic et raccourcis",
        accessibility: "Accessibilité",
        accessibilityDesc: "Options d'itinéraires sans barrières"
      },
      backToHome: "Retour à l'accueil",
      stayTuned: "Restez à l'écoute pour l'avenir de la navigation en Algérie"
    },
    ar: {
      comingSoon: "قريباً",
      subtitle: "رفيقك الذكي للتنقل في الجزائر",
      description: "طريقي سيثور طريقة تنقلك في الجزائر مع معلومات النقل في الوقت الفعلي والتوجيه الذكي والرؤى المحلية.",
      features: {
        realTime: "النقل في الوقت الفعلي",
        realTimeDesc: "جداول الحافلات والترام والمترو المباشرة",
        smartRouting: "التوجيه الذكي",
        smartRoutingDesc: "تخطيط الرحلات متعدد الوسائط",
        localInsights: "الرؤى المحلية",
        localInsightsDesc: "أنماط المرور والطرق المختصرة",
        accessibility: "إمكانية الوصول",
        accessibilityDesc: "خيارات الطرق الخالية من الحواجز"
      },
      backToHome: "العودة للرئيسية",
      stayTuned: "ترقبوا مستقبل التنقل في الجزائر"
    }
  };

  const t = translations[selectedLanguage];

  return (
    <div className="font-sans bg-background text-foreground min-h-screen relative overflow-hidden">
      {/* Blurred Map Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='map-pattern' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M10 0L20 10L10 20L0 10Z' fill='%23e5e7eb' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23map-pattern)'/%3E%3C/svg%3E")`,
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
      
      {/* Navigation Header */}
      <header className="relative z-10 bg-background/80 backdrop-blur-sm px-4 py-3 h-16 flex items-center border-b border-border/50">
        <div className="flex items-center space-x-3">
          {/* Empty left side for consistency */}
        </div>
        
        {/* Center Navigation Items - Absolutely centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
          <Link href="/chat">
            <div className="flex items-center space-x-2 font-mono font-bold text-lg tracking-tight transition-all duration-200 hover:scale-105 cursor-pointer hover:text-accent-foreground">
              <span>Chriki</span>
              <div className="w-2 h-2 rounded-full bg-transparent"></div>
            </div>
          </Link>
          <Link href="/tariqi">
            <div className="flex items-center space-x-2 font-mono font-bold text-lg tracking-tight transition-all duration-200 hover:scale-105 cursor-pointer text-accent-foreground">
              <span>Tariqi</span>
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            </div>
          </Link>
          <Link href="/wraqi">
            <div className="flex items-center space-x-2 font-mono font-bold text-lg tracking-tight transition-all duration-200 hover:scale-105 cursor-pointer hover:text-accent-foreground">
              <span>Wraqi</span>
              <div className="w-2 h-2 rounded-full bg-transparent"></div>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Translation button removed */}
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 text-center">
        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className="text-orange-500 font-mono text-sm font-medium">{t.comingSoon}</span>
        </div>

        {/* Main Title */}
        <div className="mb-6">
          <h1 className="font-mono text-6xl md:text-8xl font-bold tracking-tight dot-matrix mb-4 bg-gradient-to-r from-foreground via-accent-foreground to-foreground bg-clip-text text-transparent">
            TARIQI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          {t.description}
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 text-center hover:bg-background/70 transition-all duration-200">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-mono font-semibold mb-2">{t.features.realTime}</h3>
            <p className="text-sm text-muted-foreground">{t.features.realTimeDesc}</p>
          </div>

          <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 text-center hover:bg-background/70 transition-all duration-200">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Compass className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-mono font-semibold mb-2">{t.features.smartRouting}</h3>
            <p className="text-sm text-muted-foreground">{t.features.smartRoutingDesc}</p>
          </div>

          <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 text-center hover:bg-background/70 transition-all duration-200">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-mono font-semibold mb-2">{t.features.localInsights}</h3>
            <p className="text-sm text-muted-foreground">{t.features.localInsightsDesc}</p>
          </div>

          <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 text-center hover:bg-background/70 transition-all duration-200">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-mono font-semibold mb-2">{t.features.accessibility}</h3>
            <p className="text-sm text-muted-foreground">{t.features.accessibilityDesc}</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          <p className="text-muted-foreground font-medium">
            {t.stayTuned}
          </p>
          <Link href="/">
            <Button 
              variant="outline" 
              size="lg"
              className="font-mono font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {t.backToHome}
            </Button>
          </Link>
        </div>
      </div>

      {/* Floating Map Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500/20 rounded-full animate-pulse" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-green-500/20 rounded-full animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-20 w-5 h-5 bg-purple-500/20 rounded-full animate-pulse delay-2000" />
      <div className="absolute bottom-20 right-10 w-4 h-4 bg-orange-500/20 rounded-full animate-pulse delay-500" />
    </div>
  );
}
