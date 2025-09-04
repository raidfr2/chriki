import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import TransportTimeline from "@/components/transport/TransportTimeline";
import { demoRoutePlan } from "@/lib/transportTypes";
import ChatDemo from "@/components/ChatDemo";
import { useState } from "react";
import { Globe } from "lucide-react";

// Complete translation strings
const translations = {
  en: {
    nav: {
      challenge: "Challenge",
      demo: "Demo",
      solution: "Solution",
      impact: "Impact",
      tryDemo: "TRY DEMO"
    },
    hero: {
      subtitle: "Your partner for daily life in Algeria",
      title1: "Your personal assistant for",
      title2: "navigating life in Algeria",
      description: "Your trusted partner for government services, transportation, and daily needs - all in authentic Algerian dialect.",
      tryNow: "TRY CHRIKI NOW",
      watchDemo: "WATCH DEMO"
    },
    sections: {
      everydayConversation: "EVERYDAY.CONVERSATION",
      everydayDesc: "Chat naturally in Darija about daily life - from weather to recipes to local advice",
      authenticAI: "AUTHENTIC.ALGERIAN.AI",
      authenticDesc: "CHRIKI understands context, humor, and cultural nuances unique to Algeria",
      codeSwitching: "CODE.SWITCHING",
      codeSwitchingDesc: "Seamlessly mix Darija, French, and Arabic - just like real conversations",
      culturalContext: "CULTURAL.CONTEXT",
      culturalContextDesc: "Understands local expressions, proverbs, and Algerian humor",
      dailyCompanion: "DAILY.COMPANION",
      dailyCompanionDesc: "From morning coffee tips to evening TV recommendations",
      sampleTopics: "SAMPLE.TOPICS",
      couscousRecipes: "Couscous recipes",
      weatherChat: "Weather chat",
      footballBanter: "Football banter",
      familyAdvice: "Family advice",
      localTraditions: "Local traditions",
      dailyGreetings: "Daily greetings",
      
      localKnowledge: "LOCAL.KNOWLEDGE",
      localDesc: "Your encyclopedia of Algeria - from historical sites to the best local markets",
      expertSystem: "ALGERIA.EXPERT.SYSTEM",
      expertDesc: "Deep knowledge about every wilaya, city, and neighborhood in Algeria",
      knowledgeCategories: "KNOWLEDGE.CATEGORIES",
      historicalSites: "Historical Sites",
      localCuisine: "Local Cuisine",
      marketsSouks: "Markets & Souks",
      culturalEvents: "Cultural Events",
      tourismSpots: "Tourism Spots",
      education: "Education",
      coverageStats: "COVERAGE.STATS",
      wilayasCovered: "Wilayas covered",
      localBusinesses: "Local businesses",
      culturalSites: "Cultural sites",
      
      locationServices: "LOCATION.SERVICES",
      locationDesc: "Real-time location finder with Google Maps integration for essential services",
      smartProximity: "SMART.PROXIMITY.SEARCH",
      smartProximityDesc: "Find what you need, when you need it - with real-time availability",
      locationCapabilities: "LOCATION.CAPABILITIES",
      emergencyServices: "Emergency Services",
      emergencyDesc: "24/7 hospitals, clinics",
      pharmacies: "Pharmacies",
      pharmaciesDesc: "Night duty rotation",
      govOffices: "Gov Offices",
      govOfficesDesc: "Working hours, queues",
      essentialShops: "Essential Shops",
      essentialShopsDesc: "Groceries, utilities",
      poweredBy: "Powered by",
      realTimeStatus: "Real-time availability status",
      integratedNav: "Integrated navigation & directions",
      queueTimes: "Queue times & peak hours",
      
      transportHub: "TRANSPORT.HUB",
      transportDesc: "Live routing and real-time data integration — currently in development",
      transportProblem: "THE.PROBLEM",
      transportProblemDesc: "Public transportation in Algeria lacks real-time information, making trip planning uncertain and inefficient. Citizens struggle with unpredictable schedules and route changes.",
      transportSolution: "OUR.SOLUTION",
      transportSolutionDesc: "Integrated multimodal routing system with live schedules, fare calculation, and accessibility-friendly options for buses, trams, and metro across major Algerian cities.",
      transportOverview: "TRANSPORT.FEATURE.OVERVIEW",
      transportPreview: "Preview of the upcoming transport feature. The UI is ready; live routing and data connectors are currently being integrated.",
      plannedCapabilities: "PLANNED.CAPABILITIES",
      realTimeSchedules: "Real-time schedules and headways",
      multimodalRouting: "Multimodal routing: walk, bus, tram",
      costAware: "Cost-aware ETA and fare hints",
      transportAccessibility: "Accessibility: step‑free and safer options",
      localization: "Arabic/Darija localization",
      offlineFallback: "Offline fallback for low-connectivity",
      whyItMatters: "WHY.IT.MATTERS",
      reduceUncertainty: "Reduce uncertainty: clearer departures and arrivals",
      improveInclusivity: "Improve inclusivity: simple, local-language UI",
      saveCosts: "Save costs: choose cheaper, faster combinations",
      supportTrips: "Support critical trips: hospitals, admin offices, schools",
      nextUpgrades: "NEXT.UPGRADES",
      responsivePolish: "Responsive polish across mobile → desktop",
      expandableCards: "Expandable cards with stop details",
      improvedAccessibility: "Improved accessibility (ARIA, keyboard nav)",
      themeTokens: "Theme tokens for mode colors + small legend",
      animations: "Subtle hover/expand animations",
      comingSoon: "COMING SOON",
      
      multimodalRoutingTitle: "MULTIMODAL.ROUTING",
      multimodalDesc: "Combines all transport options to find your fastest, cheapest route",
      transportCoverage: "TRANSPORT.COVERAGE",
      smartFeatures: "SMART.FEATURES",
      realTimeArrivals: "Real-time arrival predictions",
      fareCalculation: "Fare calculation & payment options",
      accessibilityRoutes: "Accessibility-friendly routes",
      crowdDensity: "Crowd density indicators",
      realTimeBuses: "REAL.TIME.BUSES",
      realTimeBusesDesc: "Live bus schedules, routes, and arrival times for all Alger lines",
      tramNetwork: "TRAM.NETWORK",
      tramNetworkDesc: "Complete tram system coverage with station information and connections",
      metroIntegration: "METRO.INTEGRATION",
      metroIntegrationDesc: "Seamless metro navigation with transfer points and accessibility info",
      
      documentSearch: "DOCUMENT.SEARCH.DEMO",
      documentDesc: "See how CHRIKI helps citizens find document requirements instantly",
      intelligentSearch: "INTELLIGENT.DOCUMENT.SEARCH",
      documentAssistant: "Document Assistant",
      officialDocument: "OFFICIAL GOVERNMENT DOCUMENT",
      documentsRequired: "Documents Required for Passport Application",
      nationalId: "CIN (National ID)",
      birthCertificate: "Birth Certificate",
      idPhotos: "2 ID Photos",
      residenceProof: "Residence Proof",
      processingFee: "Processing Fee",
      required: "Required",
      govServicesPortal: "GOVERNMENT.SERVICES.PORTAL",
      passport: "PASSPORT",
      availableOnline: "Available Online",
      cinRenewal: "CIN RENEWAL",
      inPersonOnly: "In-Person Only",
      residenceCert: "RESIDENCE CERT",
      drivingLicense: "DRIVING LICENSE",
      appointmentRequired: "Appointment Required",
      birthCert: "BIRTH CERT",
      businessReg: "BUSINESS REG",
      
      locationDemo: "LOCATION.SERVICES.DEMO",
      locationDemoDesc: "Find nearby services and get directions with Google Maps integration",
      locationProblem: "THE.PROBLEM",
      locationProblemDesc: "Citizens waste time searching for essential services like pharmacies, hospitals, and government offices without knowing their availability, queue times, or exact locations.",
      locationSolution: "OUR.SOLUTION",
      locationSolutionDesc: "Smart proximity search with Google Maps integration providing real-time availability, queue information, and turn-by-turn navigation to essential services.",
      smartLocationFinder: "SMART.LOCATION.FINDER",
      healthcareLocator: "HEALTHCARE.LOCATOR",
      healthcareDesc: "Find hospitals, clinics, pharmacies with real-time availability",
      governmentOffices: "GOVERNMENT.OFFICES",
      governmentDesc: "Locate commune offices, passport bureaus, tax centers",
      googleMapsIntegration: "GOOGLE.MAPS.INTEGRATION",
      googleMapsDesc: "Get directions, traffic updates, and estimated travel time",
      mobileOptimized: "MOBILE.OPTIMIZED",
      mobileDesc: "Works perfectly on any device with location services",
      openInMaps: "OPEN IN GOOGLE MAPS",
      
      futureRoadmap: "FUTURE.ROADMAP",
      futureDesc: "Building the ultimate digital companion for Algerians",
      businessPartnerships: "BUSINESS.PARTNERSHIPS",
      businessDesc: "Partner with local businesses like Jumia to recommend quality products based on user needs",
      transportHubFuture: "TRANSPORT.HUB",
      transportHubDesc: "Navigate public transport in Algiers, Oran, Constantine with real-time information",
      ticketBooking: "TICKET.BOOKING",
      ticketDesc: "Reserve train tickets, check prices, and get travel information instantly",
      communityFeatures: "COMMUNITY.FEATURES",
      communityDesc: "Connect citizens, share experiences, and build a supportive digital community",
      
      socialImpact: "SOCIAL.IMPACT",
      socialDesc: "Empowering every Algerian citizen with digital accessibility",
      citizensReached: "CITIZENS REACHED",
      potentialUsers: "POTENTIAL_USERS",
      timeSaved: "TIME SAVED",
      efficiencyGain: "EFFICIENCY_GAIN",
      accessibilityImpact: "ACCESSIBILITY",
      universalAccess: "UNIVERSAL_ACCESS",
      
      readyToStart: "READY.TO.START?",
      readyDesc: "Experience شريكي CHRIKI and see how we're making technology accessible for every Algerian. Join the digital revolution in Algeria.",
      tryLiveDemo: "TRY LIVE DEMO",
      learnMore: "LEARN MORE"
    },
    footer: {
      empowering: "Empowering Algerians through Technology",
      madeWith: "2024 CHRIKI.AI - MADE.IN.ALGERIA.WITH.LOVE"
    }
  },
  fr: {
    nav: {
      challenge: "Défi",
      demo: "Démo",
      solution: "Solution",
      impact: "Impact",
      tryDemo: "ESSAYER DÉMO"
    },
    hero: {
      subtitle: "Votre partenaire pour la vie quotidienne en Algérie",
      title1: "Votre assistant personnel pour",
      title2: "naviguer dans la vie en Algérie",
      description: "Votre partenaire de confiance pour les services gouvernementaux, les transports et les besoins quotidiens - le tout en dialecte algérien authentique.",
      tryNow: "ESSAYER CHRIKI",
      watchDemo: "VOIR LA DÉMO"
    },
    sections: {
      everydayConversation: "CONVERSATION.QUOTIDIENNE",
      everydayDesc: "Discutez naturellement en Darija sur la vie quotidienne - de la météo aux recettes en passant par les conseils locaux",
      authenticAI: "IA.ALGÉRIENNE.AUTHENTIQUE",
      authenticDesc: "CHRIKI comprend le contexte, l'humour et les nuances culturelles propres à l'Algérie",
      codeSwitching: "ALTERNANCE.LINGUISTIQUE",
      codeSwitchingDesc: "Mélangez sans effort la Darija, le français et l'arabe - comme dans les vraies conversations",
      culturalContext: "CONTEXTE.CULTUREL",
      culturalContextDesc: "Comprend les expressions locales, les proverbes et l'humour algérien",
      dailyCompanion: "COMPAGNON.QUOTIDIEN",
      dailyCompanionDesc: "Des conseils pour le café du matin aux recommandations TV du soir",
      sampleTopics: "SUJETS.EXEMPLES",
      couscousRecipes: "Recettes de couscous",
      weatherChat: "Discussion météo",
      footballBanter: "Plaisanteries football",
      familyAdvice: "Conseils familiaux",
      localTraditions: "Traditions locales",
      dailyGreetings: "Salutations quotidiennes",
      
      localKnowledge: "CONNAISSANCES.LOCALES",
      localDesc: "Votre encyclopédie de l'Algérie - des sites historiques aux meilleurs marchés locaux",
      expertSystem: "SYSTÈME.EXPERT.ALGÉRIE",
      expertDesc: "Connaissance approfondie de chaque wilaya, ville et quartier d'Algérie",
      knowledgeCategories: "CATÉGORIES.DE.CONNAISSANCES",
      historicalSites: "Sites Historiques",
      localCuisine: "Cuisine Locale",
      marketsSouks: "Marchés et Souks",
      culturalEvents: "Événements Culturels",
      tourismSpots: "Sites Touristiques",
      education: "Éducation",
      coverageStats: "STATISTIQUES.COUVERTURE",
      wilayasCovered: "Wilayas couvertes",
      localBusinesses: "Entreprises locales",
      culturalSites: "Sites culturels",
      
      locationServices: "SERVICES.DE.LOCALISATION",
      locationDesc: "Localisateur en temps réel avec intégration Google Maps pour les services essentiels",
      smartProximity: "RECHERCHE.PROXIMITÉ.INTELLIGENTE",
      smartProximityDesc: "Trouvez ce dont vous avez besoin, quand vous en avez besoin - avec disponibilité en temps réel",
      locationCapabilities: "CAPACITÉS.LOCALISATION",
      emergencyServices: "Services d'Urgence",
      emergencyDesc: "Hôpitaux 24/7, cliniques",
      pharmacies: "Pharmacies",
      pharmaciesDesc: "Rotation garde de nuit",
      govOffices: "Bureaux Gouvernementaux",
      govOfficesDesc: "Heures d'ouverture, files",
      essentialShops: "Magasins Essentiels",
      essentialShopsDesc: "Épiceries, services publics",
      poweredBy: "Propulsé par",
      realTimeStatus: "Statut de disponibilité en temps réel",
      integratedNav: "Navigation et directions intégrées",
      queueTimes: "Temps d'attente et heures de pointe",
      
      transportHub: "HUB.TRANSPORT",
      transportDesc: "Routage en direct et intégration de données en temps réel — actuellement en développement",
      transportProblem: "LE.PROBLÈME",
      transportProblemDesc: "Les transports publics en Algérie manquent d'informations en temps réel, rendant la planification de trajets incertaine et inefficace. Les citoyens luttent avec des horaires imprévisibles et changements d'itinéraires.",
      transportSolution: "NOTRE.SOLUTION",
      transportSolutionDesc: "Système de routage multimodal intégré avec horaires en direct, calcul des tarifs et options accessibles pour bus, trams et métro dans les grandes villes algériennes.",
      transportOverview: "APERÇU.FONCTIONNALITÉ.TRANSPORT",
      transportPreview: "Aperçu de la prochaine fonctionnalité de transport. L'interface est prête; le routage en direct et les connecteurs de données sont en cours d'intégration.",
      plannedCapabilities: "CAPACITÉS.PRÉVUES",
      realTimeSchedules: "Horaires et fréquences en temps réel",
      multimodalRouting: "Routage multimodal: marche, bus, tram",
      costAware: "ETA et tarifs sensibles aux coûts",
      transportAccessibility: "Accessibilité: options sans marches et plus sûres",
      localization: "Localisation arabe/Darija",
      offlineFallback: "Mode hors ligne pour faible connectivité",
      whyItMatters: "POURQUOI.C'EST.IMPORTANT",
      reduceUncertainty: "Réduire l'incertitude: départs et arrivées plus clairs",
      improveInclusivity: "Améliorer l'inclusivité: interface simple en langue locale",
      saveCosts: "Économiser: choisir des combinaisons moins chères et plus rapides",
      supportTrips: "Soutenir les trajets critiques: hôpitaux, bureaux administratifs, écoles",
      nextUpgrades: "PROCHAINES.AMÉLIORATIONS",
      responsivePolish: "Finition responsive mobile → bureau",
      expandableCards: "Cartes extensibles avec détails des arrêts",
      improvedAccessibility: "Accessibilité améliorée (ARIA, navigation clavier)",
      themeTokens: "Jetons de thème pour couleurs de mode + petite légende",
      animations: "Animations subtiles au survol/expansion",
      comingSoon: "BIENTÔT DISPONIBLE",
      
      multimodalRoutingTitle: "ROUTAGE.MULTIMODAL",
      multimodalDesc: "Combine toutes les options de transport pour trouver votre itinéraire le plus rapide et économique",
      transportCoverage: "COUVERTURE.TRANSPORT",
      smartFeatures: "FONCTIONNALITÉS.INTELLIGENTES",
      realTimeArrivals: "Prédictions d'arrivée en temps réel",
      fareCalculation: "Calcul des tarifs et options de paiement",
      accessibilityRoutes: "Itinéraires adaptés à l'accessibilité",
      crowdDensity: "Indicateurs de densité de foule",
      realTimeBuses: "BUS.TEMPS.RÉEL",
      realTimeBusesDesc: "Horaires, itinéraires et heures d'arrivée en direct pour toutes les lignes d'Alger",
      tramNetwork: "RÉSEAU.TRAM",
      tramNetworkDesc: "Couverture complète du système de tramway avec informations sur les stations et connexions",
      metroIntegration: "INTÉGRATION.MÉTRO",
      metroIntegrationDesc: "Navigation métro fluide avec points de transfert et informations d'accessibilité",
      
      documentSearch: "DÉMO.RECHERCHE.DOCUMENTS",
      documentDesc: "Découvrez comment CHRIKI aide les citoyens à trouver instantanément les exigences documentaires",
      intelligentSearch: "RECHERCHE.INTELLIGENTE.DOCUMENTS",
      documentAssistant: "Assistant Documents",
      officialDocument: "DOCUMENT GOUVERNEMENTAL OFFICIEL",
      documentsRequired: "Documents requis pour la demande de passeport",
      nationalId: "CIN (Carte d'identité nationale)",
      birthCertificate: "Acte de naissance",
      idPhotos: "2 Photos d'identité",
      residenceProof: "Justificatif de résidence",
      processingFee: "Frais de traitement",
      required: "Requis",
      govServicesPortal: "PORTAIL.SERVICES.GOUVERNEMENTAUX",
      passport: "PASSEPORT",
      availableOnline: "Disponible en ligne",
      cinRenewal: "RENOUVELLEMENT CIN",
      inPersonOnly: "En personne seulement",
      residenceCert: "CERTIFICAT RÉSIDENCE",
      drivingLicense: "PERMIS CONDUIRE",
      appointmentRequired: "Rendez-vous requis",
      birthCert: "ACTE NAISSANCE",
      businessReg: "ENREGISTREMENT ENTREPRISE",
      
      locationDemo: "DÉMO.SERVICES.LOCALISATION",
      locationDemoDesc: "Trouvez des services à proximité et obtenez des directions avec l'intégration Google Maps",
      locationProblem: "LE.PROBLÈME",
      locationProblemDesc: "Les citoyens perdent du temps à chercher des services essentiels comme pharmacies, hôpitaux et bureaux gouvernementaux sans connaître leur disponibilité, temps d'attente ou emplacements exacts.",
      locationSolution: "NOTRE.SOLUTION",
      locationSolutionDesc: "Recherche de proximité intelligente avec intégration Google Maps fournissant disponibilité en temps réel, informations sur les files d'attente et navigation vers les services essentiels.",
      smartLocationFinder: "LOCALISATEUR.INTELLIGENT",
      healthcareLocator: "LOCALISATEUR.SANTÉ",
      healthcareDesc: "Trouvez hôpitaux, cliniques, pharmacies avec disponibilité en temps réel",
      governmentOffices: "BUREAUX.GOUVERNEMENTAUX",
      governmentDesc: "Localisez bureaux communaux, bureaux de passeports, centres fiscaux",
      googleMapsIntegration: "INTÉGRATION.GOOGLE.MAPS",
      googleMapsDesc: "Obtenez directions, infos trafic et temps de trajet estimé",
      mobileOptimized: "OPTIMISÉ.MOBILE",
      mobileDesc: "Fonctionne parfaitement sur tout appareil avec services de localisation",
      openInMaps: "OUVRIR DANS GOOGLE MAPS",
      
      futureRoadmap: "FEUILLE.DE.ROUTE",
      futureDesc: "Construire le compagnon numérique ultime pour les Algériens",
      businessPartnerships: "PARTENARIATS.COMMERCIAUX",
      businessDesc: "Partenariat avec des entreprises locales comme Jumia pour recommander des produits de qualité selon les besoins",
      transportHubFuture: "HUB.TRANSPORT",
      transportHubDesc: "Naviguer dans les transports publics à Alger, Oran, Constantine avec informations en temps réel",
      ticketBooking: "RÉSERVATION.BILLETS",
      ticketDesc: "Réservez billets de train, consultez prix et obtenez informations de voyage instantanément",
      communityFeatures: "FONCTIONNALITÉS.COMMUNAUTÉ",
      communityDesc: "Connecter les citoyens, partager expériences et construire une communauté numérique solidaire",
      
      socialImpact: "IMPACT.SOCIAL",
      socialDesc: "Autonomiser chaque citoyen algérien avec l'accessibilité numérique",
      citizensReached: "CITOYENS ATTEINTS",
      potentialUsers: "UTILISATEURS_POTENTIELS",
      timeSaved: "TEMPS ÉCONOMISÉ",
      efficiencyGain: "GAIN_EFFICACITÉ",
      accessibilityImpact: "ACCESSIBILITÉ",
      universalAccess: "ACCÈS_UNIVERSEL",
      
      readyToStart: "PRÊT.À.COMMENCER?",
      readyDesc: "Découvrez شريكي CHRIKI et voyez comment nous rendons la technologie accessible à tous les Algériens. Rejoignez la révolution numérique en Algérie.",
      tryLiveDemo: "ESSAYER LA DÉMO",
      learnMore: "EN SAVOIR PLUS"
    },
    footer: {
      empowering: "Autonomiser les Algériens grâce à la technologie",
      madeWith: "2024 CHRIKI.AI - FAIT.EN.ALGÉRIE.AVEC.AMOUR"
    }
  },
  ar: {
    nav: {
      challenge: "التحدي",
      demo: "عرض توضيحي",
      solution: "الحل",
      impact: "التأثير",
      tryDemo: "جرب العرض"
    },
    hero: {
      subtitle: "شريكك في الحياة اليومية في الجزائر",
      title1: "مساعدك الشخصي في",
      title2: "التنقل في الحياة بالجزائر",
      description: "شريكك الموثوق للخدمات الحكومية والنقل والاحتياجات اليومية - كل ذلك باللهجة الجزائرية الأصيلة.",
      tryNow: "جرب شريكي الآن",
      watchDemo: "شاهد العرض"
    },
    sections: {
      everydayConversation: "المحادثة.اليومية",
      everydayDesc: "تحدث بشكل طبيعي بالدارجة عن الحياة اليومية - من الطقس إلى الوصفات إلى النصائح المحلية",
      authenticAI: "ذكاء.اصطناعي.جزائري.أصيل",
      authenticDesc: "شريكي يفهم السياق والفكاهة والفروق الثقافية الفريدة للجزائر",
      codeSwitching: "التبديل.اللغوي",
      codeSwitchingDesc: "امزج بسلاسة بين الدارجة والفرنسية والعربية - تمامًا مثل المحادثات الحقيقية",
      culturalContext: "السياق.الثقافي",
      culturalContextDesc: "يفهم التعبيرات المحلية والأمثال والفكاهة الجزائرية",
      dailyCompanion: "الرفيق.اليومي",
      dailyCompanionDesc: "من نصائح قهوة الصباح إلى توصيات التلفزيون المسائية",
      sampleTopics: "مواضيع.نموذجية",
      couscousRecipes: "وصفات الكسكس",
      weatherChat: "دردشة الطقس",
      footballBanter: "مزاح كرة القدم",
      familyAdvice: "نصائح عائلية",
      localTraditions: "التقاليد المحلية",
      dailyGreetings: "التحيات اليومية",
      
      localKnowledge: "المعرفة.المحلية",
      localDesc: "موسوعتك عن الجزائر - من المواقع التاريخية إلى أفضل الأسواق المحلية",
      expertSystem: "نظام.خبير.الجزائر",
      expertDesc: "معرفة عميقة بكل ولاية ومدينة وحي في الجزائر",
      knowledgeCategories: "فئات.المعرفة",
      historicalSites: "المواقع التاريخية",
      localCuisine: "المأكولات المحلية",
      marketsSouks: "الأسواق والبازارات",
      culturalEvents: "الأحداث الثقافية",
      tourismSpots: "المواقع السياحية",
      education: "التعليم",
      coverageStats: "إحصائيات.التغطية",
      wilayasCovered: "الولايات المغطاة",
      localBusinesses: "الأعمال المحلية",
      culturalSites: "المواقع الثقافية",
      
      locationServices: "خدمات.الموقع",
      locationDesc: "محدد المواقع في الوقت الفعلي مع تكامل خرائط جوجل للخدمات الأساسية",
      smartProximity: "بحث.القرب.الذكي",
      smartProximityDesc: "ابحث عما تحتاجه، عندما تحتاجه - مع التوفر في الوقت الفعلي",
      locationCapabilities: "قدرات.الموقع",
      emergencyServices: "خدمات الطوارئ",
      emergencyDesc: "مستشفيات 24/7، عيادات",
      pharmacies: "الصيدليات",
      pharmaciesDesc: "دوران المناوبة الليلية",
      govOffices: "المكاتب الحكومية",
      govOfficesDesc: "ساعات العمل، الطوابير",
      essentialShops: "المتاجر الأساسية",
      essentialShopsDesc: "البقالة، المرافق",
      poweredBy: "مدعوم من",
      realTimeStatus: "حالة التوفر في الوقت الفعلي",
      integratedNav: "الملاحة والاتجاهات المتكاملة",
      queueTimes: "أوقات الانتظار وساعات الذروة",
      
      transportHub: "مركز.النقل",
      transportDesc: "التوجيه المباشر وتكامل البيانات في الوقت الفعلي - قيد التطوير حاليًا",
      transportProblem: "المشكلة",
      transportProblemDesc: "يفتقر النقل العام في الجزائر إلى المعلومات في الوقت الفعلي، مما يجعل تخطيط الرحلات غير مؤكد وغير فعال. يعاني المواطنون من الجداول الزمنية غير المتوقعة وتغييرات المسارات.",
      transportSolution: "حلنا",
      transportSolutionDesc: "نظام توجيه متعدد الوسائط متكامل مع جداول زمنية مباشرة وحساب الأجرة وخيارات مناسبة لذوي الاحتياجات الخاصة للحافلات والترام والمترو في المدن الجزائرية الكبرى.",
      transportOverview: "نظرة.عامة.ميزة.النقل",
      transportPreview: "معاينة ميزة النقل القادمة. الواجهة جاهزة؛ التوجيه المباشر وموصلات البيانات قيد التكامل حاليًا.",
      plannedCapabilities: "القدرات.المخططة",
      realTimeSchedules: "الجداول والترددات في الوقت الفعلي",
      multimodalRouting: "التوجيه متعدد الوسائط: المشي، الحافلة، الترام",
      costAware: "الوقت المقدر للوصول وتلميحات الأجرة الواعية بالتكلفة",
      transportAccessibility: "إمكانية الوصول: خيارات خالية من الدرجات وأكثر أمانًا",
      localization: "توطين عربي/دارجة",
      offlineFallback: "وضع احتياطي دون اتصال للاتصال الضعيف",
      whyItMatters: "لماذا.يهم",
      reduceUncertainty: "تقليل عدم اليقين: مغادرات ووصول أوضح",
      improveInclusivity: "تحسين الشمولية: واجهة بسيطة باللغة المحلية",
      saveCosts: "توفير التكاليف: اختر مجموعات أرخص وأسرع",
      supportTrips: "دعم الرحلات الحرجة: المستشفيات، المكاتب الإدارية، المدارس",
      nextUpgrades: "الترقيات.القادمة",
      responsivePolish: "تحسين الاستجابة عبر الجوال ← سطح المكتب",
      expandableCards: "بطاقات قابلة للتوسيع مع تفاصيل المحطات",
      improvedAccessibility: "تحسين إمكانية الوصول (ARIA، التنقل بلوحة المفاتيح)",
      themeTokens: "رموز السمة لألوان الوضع + وسيلة إيضاح صغيرة",
      animations: "رسوم متحركة خفية عند التمرير/التوسيع",
      comingSoon: "قريبًا",
      
      multimodalRoutingTitle: "التوجيه.متعدد.الوسائط",
      multimodalDesc: "يجمع جميع خيارات النقل للعثور على أسرع وأرخص طريق لك",
      transportCoverage: "تغطية.النقل",
      smartFeatures: "الميزات.الذكية",
      realTimeArrivals: "توقعات الوصول في الوقت الفعلي",
      fareCalculation: "حساب الأجرة وخيارات الدفع",
      accessibilityRoutes: "طرق صديقة لذوي الاحتياجات الخاصة",
      crowdDensity: "مؤشرات كثافة الحشود",
      realTimeBuses: "الحافلات.في.الوقت.الفعلي",
      realTimeBusesDesc: "الجداول الزمنية والطرق وأوقات الوصول المباشرة لجميع خطوط الجزائر",
      tramNetwork: "شبكة.الترام",
      tramNetworkDesc: "تغطية كاملة لنظام الترام مع معلومات المحطات والاتصالات",
      metroIntegration: "تكامل.المترو",
      metroIntegrationDesc: "التنقل السلس في المترو مع نقاط النقل ومعلومات إمكانية الوصول",
      
      documentSearch: "عرض.البحث.عن.المستندات",
      documentDesc: "اكتشف كيف يساعد شريكي المواطنين في العثور على متطلبات الوثائق فورًا",
      intelligentSearch: "البحث.الذكي.عن.المستندات",
      documentAssistant: "مساعد المستندات",
      officialDocument: "وثيقة حكومية رسمية",
      documentsRequired: "المستندات المطلوبة لطلب جواز السفر",
      nationalId: "بطاقة الهوية الوطنية",
      birthCertificate: "شهادة الميلاد",
      idPhotos: "صورتان شخصيتان",
      residenceProof: "إثبات الإقامة",
      processingFee: "رسوم المعالجة",
      required: "مطلوب",
      govServicesPortal: "بوابة.الخدمات.الحكومية",
      passport: "جواز السفر",
      availableOnline: "متاح عبر الإنترنت",
      cinRenewal: "تجديد البطاقة",
      inPersonOnly: "شخصيًا فقط",
      residenceCert: "شهادة الإقامة",
      drivingLicense: "رخصة القيادة",
      appointmentRequired: "يتطلب موعد",
      birthCert: "شهادة الميلاد",
      businessReg: "تسجيل الأعمال",
      
      locationDemo: "عرض.خدمات.الموقع",
      locationDemoDesc: "ابحث عن الخدمات القريبة واحصل على الاتجاهات مع تكامل خرائط جوجل",
      locationProblem: "المشكلة",
      locationProblemDesc: "يضيع المواطنون الوقت في البحث عن الخدمات الأساسية مثل الصيدليات والمستشفيات والمكاتب الحكومية دون معرفة توفرها أو أوقات الانتظار أو مواقعها الدقيقة.",
      locationSolution: "حلنا",
      locationSolutionDesc: "بحث القرب الذكي مع تكامل خرائط جوجل يوفر التوفر في الوقت الفعلي ومعلومات الطوابير والتنقل إلى الخدمات الأساسية.",
      smartLocationFinder: "محدد.الموقع.الذكي",
      healthcareLocator: "محدد.موقع.الرعاية.الصحية",
      healthcareDesc: "ابحث عن المستشفيات والعيادات والصيدليات مع التوفر في الوقت الفعلي",
      governmentOffices: "المكاتب.الحكومية",
      governmentDesc: "حدد موقع مكاتب البلدية ومكاتب جوازات السفر والمراكز الضريبية",
      googleMapsIntegration: "تكامل.خرائط.جوجل",
      googleMapsDesc: "احصل على الاتجاهات ومعلومات حركة المرور والوقت المقدر للسفر",
      mobileOptimized: "محسّن.للجوال",
      mobileDesc: "يعمل بشكل مثالي على أي جهاز مع خدمات الموقع",
      openInMaps: "فتح في خرائط جوجل",
      
      futureRoadmap: "خارطة.الطريق",
      futureDesc: "بناء الرفيق الرقمي النهائي للجزائريين",
      businessPartnerships: "الشراكات.التجارية",
      businessDesc: "الشراكة مع الشركات المحلية مثل جوميا للتوصية بمنتجات عالية الجودة بناءً على احتياجات المستخدم",
      transportHubFuture: "مركز.النقل",
      transportHubDesc: "التنقل في وسائل النقل العام في الجزائر العاصمة ووهران وقسنطينة مع معلومات في الوقت الفعلي",
      ticketBooking: "حجز.التذاكر",
      ticketDesc: "احجز تذاكر القطار، تحقق من الأسعار، واحصل على معلومات السفر فورًا",
      communityFeatures: "ميزات.المجتمع",
      communityDesc: "ربط المواطنين، مشاركة التجارب، وبناء مجتمع رقمي داعم",
      
      socialImpact: "التأثير.الاجتماعي",
      socialDesc: "تمكين كل مواطن جزائري من خلال إمكانية الوصول الرقمي",
      citizensReached: "المواطنون المستفيدون",
      potentialUsers: "المستخدمون_المحتملون",
      timeSaved: "الوقت الموفر",
      efficiencyGain: "زيادة_الكفاءة",
      accessibilityImpact: "إمكانية الوصول",
      universalAccess: "الوصول_الشامل",
      
      readyToStart: "مستعد.للبدء؟",
      readyDesc: "جرب شريكي واكتشف كيف نجعل التكنولوجيا في متناول كل جزائري. انضم إلى الثورة الرقمية في الجزائر.",
      tryLiveDemo: "جرب العرض المباشر",
      learnMore: "اعرف أكثر"
    },
    footer: {
      empowering: "تمكين الجزائريين من خلال التكنولوجيا",
      madeWith: "2024 CHRIKI.AI - صنع.في.الجزائر.بحب"
    }
  }
};

export default function Home() {
  const [lang, setLang] = useState<'en' | 'fr' | 'ar'>('en');
  const t = translations[lang];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const LanguageSelector = () => (
    <div className="relative group">
      <button className="flex items-center gap-1 p-2 hover:bg-muted rounded-md transition-colors">
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">{lang.toUpperCase()}</span>
      </button>
      <div className="absolute right-0 mt-1 w-32 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <button
          onClick={() => setLang('en')}
          className={`w-full text-left px-3 py-2 text-sm hover:bg-muted ${lang === 'en' ? 'bg-muted' : ''}`}
        >
          English
        </button>
        <button
          onClick={() => setLang('fr')}
          className={`w-full text-left px-3 py-2 text-sm hover:bg-muted ${lang === 'fr' ? 'bg-muted' : ''}`}
        >
          Français
        </button>
        <button
          onClick={() => setLang('ar')}
          className={`w-full text-left px-3 py-2 text-sm hover:bg-muted ${lang === 'ar' ? 'bg-muted' : ''}`}
          dir="rtl"
        >
          العربية
        </button>
      </div>
    </div>
  );

  return (
    <div className="font-sans bg-background text-foreground" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
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
                onClick={() => scrollToSection('problem')}
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                {t.nav.challenge}
              </button>
              <button 
                onClick={() => scrollToSection('demo')}
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                {t.nav.demo}
              </button>
              <button 
                onClick={() => scrollToSection('solution')}
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                {t.nav.solution}
              </button>
              <button 
                onClick={() => scrollToSection('impact')}
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                {t.nav.impact}
              </button>
              <Link href="/chat">
                <Button className="font-mono font-bold tracking-wide">
                  {t.nav.tryDemo}
                </Button>
              </Link>
              <LanguageSelector />
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
              {t.hero.subtitle}
            </div>
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight mb-8">
                {t.hero.title1}<br/>
                <span className="font-bold">{t.hero.title2}</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-12 leading-relaxed">
                {t.hero.description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/chat">
                <Button 
                  size="lg" 
                  className="min-w-[200px] font-medium tracking-wide"
                >
                  {t.hero.tryNow}
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => scrollToSection('demo')}
                className="min-w-[200px] font-medium tracking-wide border-2"
              >
                {t.hero.watchDemo}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Sections */}
      <section id="demo" className="pt-8 pb-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Everyday Conversation Demo */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight">{t.sections.everydayConversation}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.sections.everydayDesc}
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <ChatDemo initialConversation={0} />
              
              <div className="space-y-6">
                <h3 className="font-mono text-2xl font-bold">{t.sections.authenticAI}</h3>
                <p className="text-muted-foreground">
                  {t.sections.authenticDesc}
                </p>
                
                <div className="space-y-4">
                  {[
                    {
                      icon: "🗣️",
                      title: t.sections.codeSwitching,
                      description: t.sections.codeSwitchingDesc
                    },
                    {
                      icon: "🎭",
                      title: t.sections.culturalContext,
                      description: t.sections.culturalContextDesc
                    },
                    {
                      icon: "☕",
                      title: t.sections.dailyCompanion,
                      description: t.sections.dailyCompanionDesc
                    }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="text-2xl">{feature.icon}</div>
                      <div>
                        <h4 className="font-mono font-bold text-sm mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-background border-2 border-foreground p-4">
                  <div className="font-mono text-xs mb-2">{t.sections.sampleTopics}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>• {t.sections.couscousRecipes}</div>
                    <div>• {t.sections.weatherChat}</div>
                    <div>• {t.sections.footballBanter}</div>
                    <div>• {t.sections.familyAdvice}</div>
                    <div>• {t.sections.localTraditions}</div>
                    <div>• {t.sections.dailyGreetings}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Local Knowledge Demo */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight">{t.sections.localKnowledge}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.sections.localDesc}
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 space-y-6">
                <h3 className="font-mono text-2xl font-bold">{t.sections.expertSystem}</h3>
                <p className="text-muted-foreground">
                  {t.sections.expertDesc}
                </p>
                
                <div className="bg-muted border-2 border-foreground rounded-lg overflow-hidden">
                  <div className="bg-foreground text-background p-3 font-mono font-bold text-sm">
                    🗺️ {t.sections.knowledgeCategories}
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-3 text-sm">
                    {[
                      { emoji: "🏛️", label: t.sections.historicalSites, example: "Casbah, Timgad" },
                      { emoji: "🍽️", label: t.sections.localCuisine, example: "Best bourek spots" },
                      { emoji: "🛍️", label: t.sections.marketsSouks, example: "El Harrach prices" },
                      { emoji: "🎨", label: t.sections.culturalEvents, example: "Festival dates" },
                      { emoji: "🏖️", label: t.sections.tourismSpots, example: "Hidden beaches" },
                      { emoji: "📚", label: t.sections.education, example: "University info" }
                    ].map((cat, index) => (
                      <div key={index} className="bg-background border border-border rounded p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{cat.emoji}</span>
                          <span className="font-mono font-bold text-xs">{cat.label}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{cat.example}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-background border border-border rounded p-4">
                  <div className="font-mono text-xs text-muted-foreground mb-2">{t.sections.coverageStats}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t.sections.wilayasCovered}:</span>
                      <span className="font-mono font-bold">58/58</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t.sections.localBusinesses}:</span>
                      <span className="font-mono font-bold">10,000+</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t.sections.culturalSites}:</span>
                      <span className="font-mono font-bold">500+</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <ChatDemo initialConversation={1} />
              </div>
            </div>
          </div>
          
          {/* Location Services Demo */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight">{t.sections.locationServices}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.sections.locationDesc}
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <ChatDemo initialConversation={2} />
              
              <div className="space-y-6">
                <h3 className="font-mono text-2xl font-bold">{t.sections.smartProximity}</h3>
                <p className="text-muted-foreground">
                  {t.sections.smartProximityDesc}
                </p>
                
                <div className="bg-background border-2 border-foreground rounded-lg overflow-hidden">
                  <div className="bg-foreground text-background p-3 font-mono font-bold text-sm">
                    📍 {t.sections.locationCapabilities}
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-muted rounded p-2">
                        <div className="font-bold mb-1">🏥 {t.sections.emergencyServices}</div>
                        <div className="text-muted-foreground">{t.sections.emergencyDesc}</div>
                      </div>
                      <div className="bg-muted rounded p-2">
                        <div className="font-bold mb-1">💊 {t.sections.pharmacies}</div>
                        <div className="text-muted-foreground">{t.sections.pharmaciesDesc}</div>
                      </div>
                      <div className="bg-muted rounded p-2">
                        <div className="font-bold mb-1">🏛️ {t.sections.govOffices}</div>
                        <div className="text-muted-foreground">{t.sections.govOfficesDesc}</div>
                      </div>
                      <div className="bg-muted rounded p-2">
                        <div className="font-bold mb-1">🏪 {t.sections.essentialShops}</div>
                        <div className="text-muted-foreground">{t.sections.essentialShopsDesc}</div>
                      </div>
                    </div>
                    
                    <div className="border-t border-border pt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{t.sections.poweredBy}</span>
                        <span className="font-mono font-bold">GOOGLE.MAPS.API</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{t.sections.realTimeStatus}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{t.sections.integratedNav}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>{t.sections.queueTimes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Transportation Hub Demo */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">{t.sections.transportHub}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.sections.transportDesc}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-red-50 border border-red-500 rounded-lg p-6">
              <h3 className="font-mono text-xl font-bold text-red-600 mb-4">{t.sections.transportProblem}</h3>
              <p className="text-red-700">{t.sections.transportProblemDesc}</p>
            </div>
            <div className="bg-green-50 border border-green-500 rounded-lg p-6">
              <h3 className="font-mono text-xl font-bold text-green-600 mb-4">{t.sections.transportSolution}</h3>
              <p className="text-green-700">{t.sections.transportSolutionDesc}</p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Presentation Copy */}
            <div className="order-2 lg:order-1 space-y-6">
              <h3 className="font-mono text-2xl font-bold">{t.sections.transportOverview}</h3>
              <p className="text-muted-foreground">
                {t.sections.transportPreview}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-background border border-border rounded p-3">
                  <div className="font-mono text-xs opacity-60 mb-1">{t.sections.plannedCapabilities}</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t.sections.realTimeSchedules}</li>
                    <li>{t.sections.multimodalRouting}</li>
                    <li>{t.sections.costAware}</li>
                    <li>{t.sections.transportAccessibility}</li>
                    <li>{t.sections.localization}</li>
                    <li>{t.sections.offlineFallback}</li>
                  </ul>
                </div>
                <div className="bg-background border border-border rounded p-3">
                  <div className="font-mono text-xs opacity-60 mb-1">{t.sections.whyItMatters}</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t.sections.reduceUncertainty}</li>
                    <li>{t.sections.improveInclusivity}</li>
                    <li>{t.sections.saveCosts}</li>
                    <li>{t.sections.supportTrips}</li>
                  </ul>
                </div>
              </div>
              <div className="bg-background border border-border rounded p-3 text-sm">
                <div className="font-mono text-xs opacity-60 mb-1">{t.sections.nextUpgrades}</div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>{t.sections.responsivePolish}</li>
                  <li>{t.sections.expandableCards}</li>
                  <li>{t.sections.improvedAccessibility}</li>
                  <li>{t.sections.themeTokens}</li>
                  <li>{t.sections.animations}</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button disabled aria-disabled="true" className="font-mono font-bold tracking-wide opacity-60 cursor-not-allowed">{t.sections.comingSoon}</Button>
              </div>
            </div>

            {/* Timeline Widget */}
            <div className="order-1 lg:order-2">
              <TransportTimeline plan={demoRoutePlan} />
            </div>
          </div>

          {/* MULTIMODAL.ROUTING Section */}
          <div className="mt-12">
            <h3 className="font-mono text-2xl font-bold mb-3">{t.sections.multimodalRouting}</h3>
            <p className="text-muted-foreground mb-6">
              {t.sections.multimodalDesc}
            </p>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-muted border border-border rounded-lg p-4 h-fit">
                <div className="font-mono text-xs text-muted-foreground mb-3">{t.sections.transportCoverage}</div>
                <div className="space-y-2">
                  {[
                    {
                      city: "ALGIERS",
                      modes: ["🚇 Metro (1 line)", "🚊 Tram (2 lines)", "🚌 100+ bus routes"],
                      status: "LIVE"
                    },
                    {
                      city: "ORAN",
                      modes: ["🚊 Tram (1 line)", "🚌 50+ bus routes"],
                      status: "COMING SOON"
                    },
                    {
                      city: "CONSTANTINE",
                      modes: ["🚊 Tram (1 line)", "🚡 Cable car", "🚌 40+ bus routes"],
                      status: "PLANNED"
                    }
                  ].map((city, index) => (
                    <div key={index} className="bg-background rounded p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono font-bold text-sm">{city.city}</span>
                        <span className={`text-xs px-2 py-1 rounded font-mono ${
                          city.status === 'LIVE' ? 'bg-green-500/20 text-green-600' : 
                          'bg-yellow-500/20 text-yellow-600'
                        }`}>
                          {city.status}
                        </span>
                      </div>
                      <div className="text-xs space-y-0.5">
                        {city.modes.map((mode, i) => (
                          <div key={i}>{mode}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-background border-2 border-foreground p-4 h-fit">
                <div className="font-mono text-xs mb-2">{t.sections.smartFeatures}</div>
                <ul className="text-sm space-y-1">
                  <li>• {t.sections.realTimeArrivals}</li>
                  <li>• {t.sections.fareCalculation}</li>
                  <li>• {t.sections.accessibilityRoutes}</li>
                  <li>• {t.sections.crowdDensity}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Transport Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚌",
                title: t.sections.realTimeBuses,
                description: t.sections.realTimeBusesDesc
              },
              {
                icon: "🚊",
                title: t.sections.tramNetwork,
                description: t.sections.tramNetworkDesc
              },
              {
                icon: "🚇",
                title: t.sections.metroIntegration,
                description: t.sections.metroIntegrationDesc
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-mono font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Search Example */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">{t.sections.documentSearch}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.sections.documentDesc}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Chat Interface Mockup */}
            <div className="bg-muted border-2 border-foreground rounded-lg overflow-hidden">
              <div className="bg-foreground text-background p-4 font-mono font-bold">
                شريكي CHRIKI - {t.sections.documentAssistant}
              </div>
              <div className="p-6 space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-foreground text-background p-3 rounded-lg max-w-xs font-mono text-sm">
                    "Kifach ndir passport? Wach men documents khassni?"
                  </div>
                </div>
                
                {/* CHRIKI Response */}
                <div className="flex justify-start">
                  <div className="bg-card border border-border p-4 rounded-lg max-w-md">
                    <div className="font-mono font-bold text-sm mb-2">CHRIKI:</div>
                    <div className="text-sm space-y-3">
                      <p>"Ahlan! Bech tdir passport, khassek had l'documents:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>CIN (Carte d'identité nationale)</li>
                        <li>Birth certificate (Acte de naissance)</li>
                        <li>2 photos d'identité récentes</li>
                        <li>Justificatif de résidence</li>
                        <li>6000 DA (frais de dossier)</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2">
                        Tji l'bureau passport f'commune dyalek, walla dir rendez-vous online!"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Follow-up Question */}
                <div className="flex justify-end">
                  <div className="bg-foreground text-background p-3 rounded-lg max-w-xs font-mono text-sm">
                    "Winek nlaqa bureau passport qrib meni?"
                  </div>
                </div>

                {/* CHRIKI Location Response */}
                <div className="flex justify-start">
                  <div className="bg-card border border-border p-4 rounded-lg max-w-md">
                    <div className="font-mono font-bold text-sm mb-2">CHRIKI:</div>
                    <div className="text-sm">
                      <p>"Warilek Google Maps bach tlaqa bureau passport qrib minek!</p>
                      <div className="mt-2 p-2 bg-muted rounded text-xs">
                        📍 Bureau des Passeports - Commune Alger Centre<br/>
                        📍 Bureau des Passeports - Bab El Oued<br/>
                        📍 Bureau des Passeports - Hussein Dey
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Preview & Services Grid */}
            <div className="space-y-8">
              <div>
                <h3 className="font-mono text-2xl font-bold mb-6">{t.sections.intelligentSearch}</h3>
                
                {/* Document Preview */}
                <div className="bg-background border-2 border-foreground rounded-lg overflow-hidden mb-8">
                  <div className="bg-foreground text-background p-3 font-mono font-bold text-sm">
                    📄 PASSPORT.REQUIREMENTS.PDF
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="text-xs font-mono text-muted-foreground">{t.sections.officialDocument}</div>
                    <div className="space-y-2 text-sm">
                      <div className="font-bold">{t.sections.documentsRequired}:</div>
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div className="flex justify-between border-b border-border pb-1">
                          <span>• {t.sections.nationalId}</span>
                          <span className="text-green-600">✓ {t.sections.required}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-1">
                          <span>• {t.sections.birthCertificate}</span>
                          <span className="text-green-600">✓ {t.sections.required}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-1">
                          <span>• {t.sections.idPhotos}</span>
                          <span className="text-green-600">✓ {t.sections.required}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-1">
                          <span>• {t.sections.residenceProof}</span>
                          <span className="text-green-600">✓ {t.sections.required}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• {t.sections.processingFee}</span>
                          <span className="text-blue-600">6000 DA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services Grid Preview */}
                <div className="bg-muted border-2 border-foreground rounded-lg overflow-hidden">
                  <div className="bg-foreground text-background p-3 font-mono font-bold text-sm">
                    🌐 {t.sections.govServicesPortal}
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: "🛂", title: t.sections.passport, status: t.sections.availableOnline, hasButton: true, url: "https://passeport.interieur.gov.dz/Fr/Informations_Fr/Pi%c3%a8ces_a_Fournir" },
                        { icon: "🆔", title: t.sections.cinRenewal, status: t.sections.inPersonOnly },
                        { icon: "🏠", title: t.sections.residenceCert, status: t.sections.inPersonOnly },
                        { icon: "🚗", title: t.sections.drivingLicense, status: t.sections.appointmentRequired },
                        { icon: "📜", title: t.sections.birthCert, status: t.sections.availableOnline, hasButton: true, url: "https://etatcivil.interieur.gov.dz/" },
                        { icon: "💼", title: t.sections.businessReg, status: t.sections.inPersonOnly }
                      ].map((service, index) => (
                        <div key={index} className="bg-background border border-border rounded p-2">
                          <div className="text-lg mb-1">{service.icon}</div>
                          <div className="font-mono font-bold text-xs mb-1">{service.title}</div>
                          <div className="text-xs text-muted-foreground mb-2">{service.status}</div>
                          {service.hasButton && (
                            <a 
                              href={service.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-block bg-foreground text-background px-2 py-1 rounded text-xs font-mono font-bold hover:opacity-80 transition-opacity"
                            >
                              GO →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Services Example */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">{t.sections.locationDemo}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.sections.locationDemoDesc}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-red-50 border border-red-500 rounded-lg p-6">
              <h3 className="font-mono text-xl font-bold text-red-600 mb-4">{t.sections.locationProblem}</h3>
              <p className="text-red-700">{t.sections.locationProblemDesc}</p>
            </div>
            <div className="bg-green-50 border border-green-500 rounded-lg p-6">
              <h3 className="font-mono text-xl font-bold text-green-600 mb-4">{t.sections.locationSolution}</h3>
              <p className="text-green-700">{t.sections.locationSolutionDesc}</p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Location Features */}
            <div className="space-y-8">
              <div>
                <h3 className="font-mono text-2xl font-bold mb-6">{t.sections.smartLocationFinder}</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: "🏥",
                      title: t.sections.healthcareLocator,
                      description: t.sections.healthcareDesc
                    },
                    {
                      icon: "🏛️",
                      title: t.sections.governmentOffices,
                      description: t.sections.governmentDesc
                    },
                    {
                      icon: "🗺️",
                      title: t.sections.googleMapsIntegration,
                      description: t.sections.googleMapsDesc
                    },
                    {
                      icon: "📱",
                      title: t.sections.mobileOptimized,
                      description: t.sections.mobileDesc
                    }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="text-2xl">{feature.icon}</div>
                      <div>
                        <h4 className="font-mono font-bold text-sm mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-muted border-2 border-foreground rounded-lg p-4">
                <div className="font-mono text-xs mb-2">🗺️ GOOGLE MAPS PREVIEW</div>
                <div className="text-sm">
                  <p>Interactive map with real-time directions</p>
                  <div className="mt-2 bg-background p-2 rounded text-xs">
                    📍 Alger Centre → Mustapha Pacha<br/>
                    🛣️ Distance: 1.2 km<br/>
                    ⏱️ ETA: 5 min driving
                  </div>
                </div>
              </div>
              <div className="bg-muted border-2 border-foreground rounded-lg p-4">
                <div className="font-mono text-xs mb-2">⚡ REAL-TIME UPDATES</div>
                <div className="text-sm">
                  <p>Live availability and queue times</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Hospital: Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Pharmacy: 15 min wait</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Chat Interface */}
            <div className="bg-background border-2 border-foreground rounded-lg overflow-hidden">
              <div className="bg-foreground text-background p-4 font-mono font-bold">
                شريكي CHRIKI - Location Services
              </div>
              <div className="p-6 space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-foreground text-background p-3 rounded-lg max-w-xs font-mono text-sm">
                    "Winek nlaqa hospital qrib meni? Ana f'Alger Centre"
                  </div>
                </div>
                
                {/* CHRIKI Response */}
                <div className="flex justify-start">
                  <div className="bg-card border border-border p-4 rounded-lg max-w-md">
                    <div className="font-mono font-bold text-sm mb-2">CHRIKI:</div>
                    <div className="text-sm space-y-3">
                      <p>"Ana nwarilek l'hospitals li qrib minek f'Alger Centre:</p>
                      
                      <div className="space-y-2">
                        <div className="p-2 bg-muted rounded text-xs">
                          <div className="font-bold">🏥 Hôpital Mustapha Pacha</div>
                          <div className="text-muted-foreground">📍 1.2 km - 5 min driving</div>
                          <div className="text-green-600">✅ Emergency available 24/7</div>
                        </div>
                        
                        <div className="p-2 bg-muted rounded text-xs">
                          <div className="font-bold">🏥 CHU Beni Messous</div>
                          <div className="text-muted-foreground">📍 8.5 km - 15 min driving</div>
                          <div className="text-blue-600">ℹ️ Specialized services</div>
                        </div>
                        
                        <div className="p-2 bg-muted rounded text-xs">
                          <div className="font-bold">💊 Pharmacie Centrale</div>
                          <div className="text-muted-foreground">📍 0.3 km - 2 min walking</div>
                          <div className="text-green-600">✅ Open until 22:00</div>
                        </div>
                      </div>
                      
                      <button className="w-full bg-foreground text-background p-2 rounded text-xs font-mono">
                        🗺️ {t.sections.openInMaps}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Follow-up */}
                <div className="flex justify-end">
                  <div className="bg-foreground text-background p-3 rounded-lg max-w-xs font-mono text-sm">
                    "Wach kayen transport public li ywaselni l'Mustapha?"
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-card border border-border p-4 rounded-lg max-w-md">
                    <div className="font-mono font-bold text-sm mb-2">CHRIKI:</div>
                    <div className="text-sm">
                      <p>"Ayeh! Kayen barcha transport:</p>
                      <div className="mt-2 space-y-1 text-xs">
                        <div>🚌 Bus 65: Men Place des Martyrs</div>
                        <div>🚇 Metro M1: 1 Mai Station</div>
                        <div>🚕 Taxi: ~200 DA men centre ville</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">{t.sections.futureRoadmap}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.sections.futureDesc}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🌐",
                title: t.sections.businessPartnerships,
                description: t.sections.businessDesc,
                tech: "// COMMERCE_API_v1.0"
              },
              {
                icon: "🚌",
                title: t.sections.transportHubFuture,
                description: t.sections.transportHubDesc,
                tech: "// TRANSPORT_ENGINE_v1.0"
              },
              {
                icon: "🎫",
                title: t.sections.ticketBooking,
                description: t.sections.ticketDesc,
                tech: "// BOOKING_SYSTEM_v1.0"
              },
              {
                icon: "👥",
                title: t.sections.communityFeatures,
                description: t.sections.communityDesc,
                tech: "// SOCIAL_ENGINE_v1.0"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-background border-2 border-foreground p-8 group hover:bg-foreground hover:text-background transition-all duration-300"
              >
                <div className="mb-6 text-3xl">{feature.icon}</div>
                <h3 className="font-mono text-lg font-bold mb-4">{feature.title}</h3>
                <p className="text-sm leading-relaxed mb-4">{feature.description}</p>
                <div className="text-xs font-mono opacity-60">{feature.tech}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="py-20 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">{t.sections.socialImpact}</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              {t.sections.socialDesc}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="font-mono text-4xl font-bold mb-2">1M+</div>
              <div className="text-sm text-muted">{t.sections.citizensReached}</div>
              <div className="text-xs font-mono text-muted mt-1">// {t.sections.potentialUsers}</div>
            </div>
            
            <div className="text-center">
              <div className="font-mono text-4xl font-bold mb-2">80%</div>
              <div className="text-sm text-muted">{t.sections.timeSaved}</div>
              <div className="text-xs font-mono text-muted mt-1">// {t.sections.efficiencyGain}</div>
            </div>
            
            <div className="text-center">
              <div className="font-mono text-4xl font-bold mb-2">100%</div>
              <div className="text-sm text-muted">{t.sections.accessibilityImpact}</div>
              <div className="text-xs font-mono text-muted mt-1">// {t.sections.universalAccess}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-6 tracking-tight dot-matrix">{t.sections.readyToStart}</h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 leading-relaxed">
              {t.sections.readyDesc}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/chat">
                <Button 
                  size="lg" 
                  className="min-w-[250px] font-mono font-bold tracking-wide"
                >
                  {t.sections.tryLiveDemo}
                </Button>
              </Link>
              <Link href="/">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="min-w-[250px] font-mono font-bold tracking-wide border-2"
                >
                  {t.sections.learnMore}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="font-mono font-bold text-xl">شريكي CHRIKI</div>
              <div className="w-2 h-2 bg-background rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-2 mb-8">
              <p className="font-mono text-sm text-muted">
                {t.footer.empowering}
              </p>
            </div>
            
            <div className="border-t border-muted pt-8">
              <div className="font-mono text-xs text-muted">
                {t.footer.madeWith}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}