import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import TransportTimeline from "@/components/transport/TransportTimeline";
import { demoRoutePlan } from "@/lib/transportTypes";
import ChatDemo from "@/components/ChatDemo";
import { Globe } from "lucide-react";

// Helper function to render markdown text
const renderMarkdown = (text: string) => {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

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
      
      // Local Algerian Solutions Promotion - ALL Categories
      ecommerceSetupComparison: "LOCAL.ALGERIAN.SOLUTIONS",
      ecommerceSetupComparisonDesc: "See how CHRIKI promotes Algerian products and services across ALL categories - from e-commerce to education, healthcare to entertainment",
      ecommerceIntro: "ALGERIAN.FIRST.APPROACH",
      ecommerceIntroDesc: "Every recommendation prioritizes local Algerian businesses, products, and services. CHRIKI understands the local market and connects you with trusted Algerian solutions across all categories.",
      localEcommercePromotion: "LOCAL.E-COMMERCE.SOLUTIONS",
      localEcommercePromotionDesc: "CHRIKI recommends integrated Algerian solutions that work together seamlessly",
      genericBot: "GENERIC BOT",
      chrikiBot: "CHRIKI",
      // Multi-turn conversation questions
      storeQuestion: "How can I sell my local Algerian products online?",
      paymentQuestion: "What payment gateway should I use for Algerian customers?",
      deliveryQuestion: "What about delivery services for local products?",
      
      // Generic bot responses
      genericStoreResponse: "I recommend Shopify. It's a popular platform with many templates and easy setup.",
      genericPaymentResponse: "For payments, use PayPal or Stripe. They're widely accepted internationally.",
      genericDeliveryResponse: "For shipping, DHL or FedEx are reliable global options.",
      
      // CHRIKI responses
      chrikiStoreResponse: "Perfect! Ana n9oullek 3la **Guidini** - platform dz li ysahel 3lik bzef l'baye3 produits dz m3a local customers. Ykhdem m3a local banks w yfahem l-marché dz!",
      chrikiPaymentResponse: "For payment, khdem m3a **UbexPay** - local gateway li ykhdem m3a banques dz w ysahel l'clients dz ykhalso bi dinars. W kaman **BaridiMob** integration!",
      chrikiDeliveryResponse: "W for delivery, **Yalidine Express** - fast delivery fi kol l-wilayas! Plus **local pickup points** fi kol blasa.",
      supportingLocal: "SUPPORTING LOCAL ECOSYSTEM",
      supportingLocalDesc: "Complete local solutions that work together seamlessly",
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
      documentDarijaExplanation: "CHRIKI.EXPLAINS.IN.DARIJA",
      documentDarijaText: "تحتاج باسبور ولا كارت الهوية؟ شريكي راح يقولك بالضبط واش من الوثائق خاصك تجيب، وين تروح، وقداش الوقت يخد. كلشي بالدارجة باش تفهم مليح!",
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
      learnMore: "LEARN MORE",
      
      // Monetization section
      businessModel: "BUSINESS.MODEL",
      businessModelDesc: "Building a sustainable platform through smart partnerships and value-driven services",
      revenueStreams: "REVENUE.STREAMS",
      partnershipCommissions: "PARTNERSHIP.COMMISSIONS",
      partnershipDesc: "Earn commission by connecting users with trusted partners like Herd Academy for courses and Jumia for products",
      sponsoredPartners: "SPONSORED.PARTNERS",
      sponsoredPartnersDesc: "Premium placement for trusted Algerian brands in relevant search results",
      sponsoredExample: "SPONSORED.EXAMPLE",
      sponsoredExampleDesc: "When users ask for restaurants or schools, sponsored partners like Djezzy appear at the top with special highlighting",
      customerService: "B2B.CUSTOMER.SERVICE",
      customerServiceDesc: "Companies integrate CHRIKI for customer support with custom instructions and guided problem-solving",
      smartRecommendations: "SMART.RECOMMENDATIONS",
      smartRecommendationsDesc: "AI analyzes user interests from conversations to provide personalized product and service recommendations",
      sustainableGrowth: "SUSTAINABLE.GROWTH",
      sustainableGrowthDesc: "Revenue model that grows with user engagement while maintaining free core services for all Algerians",
      
      // Introduction section
      introTitle: "INTRODUCING.CHRIKI",
      introSubtitle: "THE.DIGITAL.REVOLUTION.FOR.ALGERIA",
      introDescription: "CHRIKI is more than just an AI assistant - it's your digital companion designed specifically for Algerians, by Algerians. We understand the unique challenges citizens face when navigating daily life, from government services to transportation, and we're here to bridge the gap between technology and authentic Algerian culture.",
      whyNow: "WHY.NOW?",
      whyNowDesc: "Algeria is experiencing a digital transformation, but existing solutions don't speak our language - literally and culturally. CHRIKI changes that by offering a truly localized experience that respects our heritage while embracing innovation.",
      ourMission: "OUR.MISSION",
      ourMissionDesc: "To empower every Algerian citizen with technology that feels natural, accessible, and genuinely helpful in their daily lives.",
      
      // Extended introduction content
      algeriaContext: "ALGERIA.IN.2024",
      algeriaContextDesc: "With 45 million citizens across 58 wilayas, Algeria represents the largest country in Africa and a rapidly growing digital economy. Yet language barriers and cultural disconnect remain major obstacles to technology adoption.",
      marketInsights: "MARKET.INSIGHTS",
      digitalGap: "DIGITAL.GAP.CHALLENGE",
      digitalGapDesc: "73% of Algerians prefer communicating in Darija, but only 12% of digital services support it effectively",
      languageBarrier: "LANGUAGE.BARRIER",
      languageBarrierDesc: "85% report difficulty with French/English-only interfaces",
      culturalDisconnect: "CULTURAL.DISCONNECT", 
      culturalDisconnectDesc: "68% feel current AI doesn't understand Algerian context",
      serviceAccess: "SERVICE.ACCESS.ISSUES",
      serviceAccessDesc: "62% waste time finding government services and local information",
      
      teamStory: "OUR.STORY",
      teamStoryDesc: "Founded by Algerian engineers who experienced firsthand the frustration of using technology that doesn't understand our culture, CHRIKI was born from a simple belief: technology should adapt to people, not the other way around.",
      foundedIn: "FOUNDED.IN.ALGERIA",
      foundedDesc: "Built in the heart of North Africa with deep understanding of local needs",
      algerianTeam: "100%.ALGERIAN.TEAM",
      algerianTeamDesc: "Native speakers who live the culture we're building for",
      localFirst: "LOCAL.FIRST.APPROACH",
      localFirstDesc: "Every feature designed with Algerian users as the primary focus",
      
      visionStatement: "OUR.VISION",
      visionDesc: "To become the digital backbone of Algeria - the first platform every citizen turns to for daily needs, government services, and local information.",
      coreValues: "CORE.VALUES",
      authenticityValue: "AUTHENTICITY",
      authenticityValueDesc: "Genuine Algerian experience, not a translation",
      accessibilityValue: "ACCESSIBILITY", 
      accessibilityValueDesc: "Technology for everyone, regardless of education or tech skills",
      communityValue: "COMMUNITY",
      communityValueDesc: "Building connections between Algerians nationwide",
      innovationValue: "INNOVATION",
      innovationValueDesc: "Cutting-edge AI with deep cultural understanding",
      
      techApproach: "TECHNICAL.APPROACH",
      techApproachDesc: "CHRIKI combines advanced natural language processing with extensive cultural training data, real-time local information APIs, and user-centered design principles.",
      aiTraining: "AI.TRAINING.METHODOLOGY",
      aiTrainingDesc: "Trained on authentic Algerian conversations, cultural contexts, and local knowledge",
      dataPrivacy: "DATA.PRIVACY.FIRST",
      dataPrivacyDesc: "Your conversations stay private with end-to-end encryption",
      localInfrastructure: "LOCAL.INFRASTRUCTURE",
      localInfrastructureDesc: "Servers in Algeria for faster response times and data sovereignty",
      
      // Problem and Solution sections
      conversationProblem: "THE.PROBLEM",
      conversationProblemDesc: "Existing AI assistants don't understand Algerian culture, dialect mixing, or local context. Citizens struggle with technology that feels foreign and disconnected from their daily reality.",
      conversationSolution: "OUR.SOLUTION",
      conversationSolutionDesc: "CHRIKI speaks authentic Darija, understands cultural nuances, and seamlessly handles code-switching between Arabic, French, and Berber - just like real Algerian conversations.",
      
      knowledgeProblem: "THE.PROBLEM",
      knowledgeProblemDesc: "Finding reliable information about local services, cultural sites, and regional specifics in Algeria is fragmented across multiple sources and often outdated or inaccurate.",
      knowledgeSolution: "OUR.SOLUTION",
      knowledgeSolutionDesc: "Comprehensive local knowledge base covering all 58 wilayas with real-time updates on cultural events, historical sites, local businesses, and regional specialties.",
      
      locationProblem: "THE.PROBLEM",
      locationProblemDesc: "Citizens waste time searching for essential services like pharmacies, hospitals, and government offices without knowing their availability, queue times, or exact locations.",
      locationSolution: "OUR.SOLUTION",
      locationSolutionDesc: "Smart proximity search with Google Maps integration providing real-time availability, queue information, and turn-by-turn navigation to essential services.",
      
      transportProblem: "THE.PROBLEM",
      transportProblemDesc: "Public transportation in Algeria lacks real-time information, making trip planning uncertain and inefficient. Citizens struggle with unpredictable schedules and route changes.",
      transportDarijaExplanation: "CHRIKI.EXPLAINS.IN.DARIJA",
      transportDarijaText: "سما في بلاصة ما تدي الطاكسي، شريكي راح يقترحلك أحسن طريق بالباص والترام والمترو، ويقولك وقتاش يوصل والثمن قداش. كل شي بالوقت الحقيقي باش ما تبقاش تستنى في البرد!",
      transportSolution: "OUR.SOLUTION",
      transportSolutionDesc: "Integrated multimodal routing system with live schedules, fare calculation, and accessibility-friendly options for buses, trams, and metro across major Algerian cities.",
      
      documentProblem: "THE.PROBLEM",
      documentProblemDesc: "Citizens face complex bureaucratic processes for documents beyond basic passport/CIN - from business licenses to property deeds, tax certificates to marriage registrations. They waste time not knowing which services are available online vs requiring office visits, what supporting documents are needed, or current processing delays. CHRIKI tells you exactly what's available online, what requires office visits, all required documents, current wait times, and step-by-step instructions in Darija.",
      documentSolution: "OUR.SOLUTION",
      documentSolutionDesc: "Complete guidance for all government services - from simple online renewals you can do from home to complex multi-step processes. CHRIKI tells you exactly what's available online, what requires office visits, all required documents, current wait times, and step-by-step instructions in Darija.",
      
      dailyLifeProblem: "THE.PROBLEM",
      dailyLifeProblemDesc: "People struggle with daily decisions - what to cook with available ingredients, how to manage time effectively, understanding health symptoms, learning new skills, or solving everyday problems. Information is scattered across multiple sources and often not personalized.",
      dailyLifeDarijaExplanation: "CHRIKI.EXPLAINS.IN.DARIJA",
      dailyLifeDarijaText: "عندك مشكلة في الدار؟ ما تعرفش واش تطبخ؟ والا عندك سؤال على الصحة؟ شريكي هنا باش يساعدك في كلشي - من الطبخ للدراسة، من الصحة للشغل. كلشي بالدارجة وبطريقة بسيطة!",
      dailyLifeSolution: "OUR.SOLUTION",
      dailyLifeSolutionDesc: "Your personal AI companion for all life questions - cooking recipes with what you have, health guidance, study help, career advice, problem-solving, and daily planning. All explained simply in Darija with practical, actionable advice."
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
      
      // Solutions Algériennes Locales - TOUTES Catégories
      ecommerceSetupComparison: "SOLUTIONS.ALGÉRIENNES.LOCALES",
      ecommerceSetupComparisonDesc: "Voyez comment CHRIKI promeut les produits et services algériens dans TOUTES les catégories - du e-commerce à l'éducation, de la santé au divertissement",
      ecommerceIntro: "APPROCHE.ALGÉRIE.D'ABORD",
      ecommerceIntroDesc: "Chaque recommandation privilégie les entreprises, produits et services algériens locaux. CHRIKI comprend le marché local et vous connecte avec des solutions algériennes de confiance dans toutes les catégories.",
      localEcommercePromotion: "SOLUTIONS.E-COMMERCE.LOCALES",
      localEcommercePromotionDesc: "CHRIKI recommande des solutions algériennes intégrées qui fonctionnent ensemble de manière transparente",
      genericBot: "BOT GÉNÉRIQUE",
      chrikiBot: "CHRIKI",
      // Multi-turn conversation questions
      storeQuestion: "Comment vendre mes produits algériens locaux en ligne?",
      paymentQuestion: "Quelle passerelle de paiement utiliser pour les clients algériens?",
      deliveryQuestion: "Et pour les services de livraison de produits locaux?",
      
      // Generic bot responses
      genericStoreResponse: "Je recommande Shopify. C'est une plateforme populaire avec de nombreux modèles et une configuration facile.",
      genericPaymentResponse: "Pour les paiements, utilisez PayPal ou Stripe. Ils sont largement acceptés internationalement.",
      genericDeliveryResponse: "Pour l'expédition, DHL ou FedEx sont des options mondiales fiables.",
      
      // CHRIKI responses
      chrikiStoreResponse: "Perfect! Ana n9oullek 3la **Guidini** - platform dz li ysahel 3lik bzef l'baye3 produits dz m3a local customers. Ykhdem m3a local banks w yfahem l-marché dz!",
      chrikiPaymentResponse: "For payment, khdem m3a **UbexPay** - local gateway li ykhdem m3a banques dz w ysahel l'clients dz ykhalso bi dinars. W kaman **BaridiMob** integration!",
      chrikiDeliveryResponse: "W for delivery, **Yalidine Express** - fast delivery fi kol l-wilayas! Plus **local pickup points** fi kol blasa.",
      supportingLocal: "SOUTIEN.ÉCOSYSTÈME.LOCAL",
      supportingLocalDesc: "Solutions locales complètes qui fonctionnent ensemble de manière transparente",
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
      documentDarijaExplanation: "CHRIKI.EXPLIQUE.EN.DARIJA",
      documentDarijaText: "تحتاج باسبور ولا كارت الهوية؟ شريكي راح يقولك بالضبط واش من الوثائق خاصك تجيب، وين تروح، وقداش الوقت يخد. كلشي بالدارجة باش تفهم مليح!",
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
      learnMore: "EN SAVOIR PLUS",
      
      // Monetization section
      businessModel: "MODÈLE.ÉCONOMIQUE",
      businessModelDesc: "Construire une plateforme durable grâce à des partenariats intelligents et des services axés sur la valeur",
      revenueStreams: "SOURCES.DE.REVENUS",
      partnershipCommissions: "COMMISSIONS.PARTENARIATS",
      partnershipDesc: "Gagner des commissions en connectant les utilisateurs avec des partenaires de confiance comme Herd Academy pour les cours et Jumia pour les produits",
      sponsoredPartners: "PARTENAIRES.SPONSORISÉS",
      sponsoredPartnersDesc: "Placement premium pour les marques algériennes de confiance dans les résultats de recherche pertinents",
      sponsoredExample: "EXEMPLE.SPONSORISÉ",
      sponsoredExampleDesc: "Quand les utilisateurs demandent des restaurants ou écoles, les partenaires sponsorisés comme Djezzy apparaissent en haut avec mise en évidence spéciale",
      customerService: "SERVICE.CLIENT.B2B",
      customerServiceDesc: "Les entreprises intègrent CHRIKI pour le support client avec des instructions personnalisées et une résolution guidée des problèmes",
      smartRecommendations: "RECOMMANDATIONS.INTELLIGENTES",
      smartRecommendationsDesc: "L'IA analyse les intérêts des utilisateurs à partir des conversations pour fournir des recommandations personnalisées de produits et services",
      sustainableGrowth: "CROISSANCE.DURABLE",
      sustainableGrowthDesc: "Modèle de revenus qui croît avec l'engagement des utilisateurs tout en maintenant les services de base gratuits pour tous les Algériens",
      
      // Introduction section
      introTitle: "PRÉSENTATION.DE.CHRIKI",
      introSubtitle: "LA.RÉVOLUTION.NUMÉRIQUE.POUR.L'ALGÉRIE",
      introDescription: "CHRIKI est plus qu'un simple assistant IA - c'est votre compagnon numérique conçu spécifiquement pour les Algériens, par des Algériens. Nous comprenons les défis uniques auxquels font face les citoyens dans leur vie quotidienne, des services gouvernementaux aux transports, et nous sommes là pour combler le fossé entre la technologie et la culture algérienne authentique.",
      whyNow: "POURQUOI.MAINTENANT?",
      whyNowDesc: "L'Algérie connaît une transformation numérique, mais les solutions existantes ne parlent pas notre langue - littéralement et culturellement. CHRIKI change cela en offrant une expérience véritablement localisée qui respecte notre patrimoine tout en embrassant l'innovation.",
      ourMission: "NOTRE.MISSION",
      ourMissionDesc: "Autonomiser chaque citoyen algérien avec une technologie qui se sent naturelle, accessible et véritablement utile dans leur vie quotidienne.",
      
      // Extended introduction content
      algeriaContext: "L'ALGÉRIE.EN.2024",
      algeriaContextDesc: "Avec 45 millions de citoyens répartis sur 58 wilayas, l'Algérie représente le plus grand pays d'Afrique et une économie numérique en croissance rapide. Pourtant, les barrières linguistiques et la déconnexion culturelle restent des obstacles majeurs à l'adoption technologique.",
      marketInsights: "APERÇUS.DU.MARCHÉ",
      digitalGap: "DÉFI.FOSSÉ.NUMÉRIQUE",
      digitalGapDesc: "73% des Algériens préfèrent communiquer en Darija, mais seulement 12% des services numériques le supportent efficacement",
      languageBarrier: "BARRIÈRE.LINGUISTIQUE",
      languageBarrierDesc: "85% signalent des difficultés avec les interfaces uniquement en français/anglais",
      culturalDisconnect: "DÉCONNEXION.CULTURELLE",
      culturalDisconnectDesc: "68% estiment que l'IA actuelle ne comprend pas le contexte algérien",
      serviceAccess: "PROBLÈMES.ACCÈS.SERVICES",
      serviceAccessDesc: "62% perdent du temps à chercher des services gouvernementaux et des informations locales",
      
      teamStory: "NOTRE.HISTOIRE",
      teamStoryDesc: "Fondé par des ingénieurs algériens qui ont vécu de première main la frustration d'utiliser une technologie qui ne comprend pas notre culture, CHRIKI est né d'une conviction simple : la technologie doit s'adapter aux gens, pas l'inverse.",
      foundedIn: "FONDÉ.EN.ALGÉRIE",
      foundedDesc: "Construit au cœur de l'Afrique du Nord avec une compréhension profonde des besoins locaux",
      algerianTeam: "ÉQUIPE.100%.ALGÉRIENNE",
      algerianTeamDesc: "Locuteurs natifs qui vivent la culture pour laquelle nous construisons",
      localFirst: "APPROCHE.LOCAL.D'ABORD",
      localFirstDesc: "Chaque fonctionnalité conçue avec les utilisateurs algériens comme focus principal",
      
      visionStatement: "NOTRE.VISION",
      visionDesc: "Devenir l'épine dorsale numérique de l'Algérie - la première plateforme vers laquelle chaque citoyen se tourne pour ses besoins quotidiens, services gouvernementaux et informations locales.",
      coreValues: "VALEURS.FONDAMENTALES",
      authenticityValue: "AUTHENTICITÉ",
      authenticityValueDesc: "Expérience algérienne authentique, pas une traduction",
      accessibilityValue: "ACCESSIBILITÉ",
      accessibilityValueDesc: "Technologie pour tous, quel que soit le niveau d'éducation ou de compétences techniques",
      communityValue: "COMMUNAUTÉ",
      communityValueDesc: "Construire des connexions entre Algériens à l'échelle nationale",
      innovationValue: "INNOVATION",
      innovationValueDesc: "IA de pointe avec compréhension culturelle profonde",
      
      techApproach: "APPROCHE.TECHNIQUE",
      techApproachDesc: "CHRIKI combine le traitement avancé du langage naturel avec des données d'entraînement culturel étendues, des API d'informations locales en temps réel et des principes de conception centrés sur l'utilisateur.",
      aiTraining: "MÉTHODOLOGIE.FORMATION.IA",
      aiTrainingDesc: "Formé sur des conversations algériennes authentiques, des contextes culturels et des connaissances locales",
      dataPrivacy: "CONFIDENTIALITÉ.D'ABORD",
      dataPrivacyDesc: "Vos conversations restent privées avec chiffrement de bout en bout",
      localInfrastructure: "INFRASTRUCTURE.LOCALE",
      localInfrastructureDesc: "Serveurs en Algérie pour des temps de réponse plus rapides et la souveraineté des données",
      
      // Problem and Solution sections
      conversationProblem: "LE.PROBLÈME",
      conversationProblemDesc: "Les assistants IA existants ne comprennent pas la culture algérienne, le mélange dialectal ou le contexte local. Les citoyens luttent avec une technologie qui semble étrangère et déconnectée de leur réalité quotidienne.",
      conversationSolution: "NOTRE.SOLUTION",
      conversationSolutionDesc: "CHRIKI parle la Darija authentique, comprend les nuances culturelles et gère parfaitement l'alternance entre l'arabe, le français et le berbère - comme de vraies conversations algériennes.",
      
      knowledgeProblem: "LE.PROBLÈME",
      knowledgeProblemDesc: "Trouver des informations fiables sur les services locaux, sites culturels et spécificités régionales en Algérie est fragmenté entre plusieurs sources et souvent obsolète ou inexact.",
      knowledgeSolution: "NOTRE.SOLUTION",
      knowledgeSolutionDesc: "Base de connaissances locales complète couvrant les 58 wilayas avec mises à jour en temps réel sur les événements culturels, sites historiques, entreprises locales et spécialités régionales.",
      
      locationProblem: "LE.PROBLÈME",
      locationProblemDesc: "Les citoyens perdent du temps à chercher des services essentiels comme pharmacies, hôpitaux et bureaux gouvernementaux sans connaître leur disponibilité, temps d'attente ou emplacements exacts.",
      locationSolution: "NOTRE.SOLUTION",
      locationSolutionDesc: "Recherche de proximité intelligente avec intégration Google Maps fournissant disponibilité en temps réel, informations sur les files d'attente et navigation vers les services essentiels.",
      
      transportProblem: "LE.PROBLÈME",
      transportProblemDesc: "Les transports publics en Algérie manquent d'informations en temps réel, rendant la planification de trajets incertaine et inefficace. Les citoyens luttent avec des horaires imprévisibles et changements d'itinéraires.",
      transportDarijaExplanation: "CHRIKI.EXPLIQUE.EN.DARIJA",
      transportDarijaText: "سما في بلاصة ما تدي الطاكسي، شريكي راح يقترحلك أحسن طريق بالباص والترام والمترو، ويقولك وقتاش يوصل والثمن قداش. كل شي بالوقت الحقيقي باش ما تبقاش تستنى في البرد!",
      transportSolution: "NOTRE.SOLUTION",
      transportSolutionDesc: "Système de routage multimodal intégré avec horaires en direct, calcul des tarifs et options accessibles pour bus, trams et métro dans les grandes villes algériennes.",
      
      documentProblem: "LE.PROBLÈME",
      documentProblemDesc: "Les citoyens font face à des processus bureaucratiques complexes pour des documents au-delà du passeport/CIN de base - des licences commerciales aux actes de propriété, certificats fiscaux aux enregistrements de mariage. Ils perdent du temps sans savoir quels services sont disponibles en ligne vs nécessitant des visites de bureau, quels documents de soutien sont nécessaires, ou les retards de traitement actuels.",
      documentSolution: "NOTRE.SOLUTION",
      documentSolutionDesc: "Guidance complète pour tous les services gouvernementaux - des simples renouvellements en ligne que vous pouvez faire de chez vous aux processus complexes en plusieurs étapes. CHRIKI vous dit exactement ce qui est disponible en ligne, ce qui nécessite des visites de bureau, tous les documents requis, les temps d'attente actuels, et instructions étape par étape en Darija.",
      
      dailyLifeProblem: "LE.PROBLÈME",
      dailyLifeProblemDesc: "Les gens luttent avec les décisions quotidiennes - quoi cuisiner avec les ingrédients disponibles, comment gérer le temps efficacement, comprendre les symptômes de santé, apprendre de nouvelles compétences, ou résoudre les problèmes quotidiens. L'information est dispersée sur plusieurs sources et souvent pas personnalisée.",
      dailyLifeDarijaExplanation: "CHRIKI.EXPLIQUE.EN.DARIJA",
      dailyLifeDarijaText: "عندك مشكلة في الدار؟ ما تعرفش واش تطبخ؟ والا عندك سؤال على الصحة؟ شريكي هنا باش يساعدك في كلشي - من الطبخ للدراسة، من الصحة للشغل. كلشي بالدارجة وبطريقة بسيطة!",
      dailyLifeSolution: "NOTRE.SOLUTION",
      dailyLifeSolutionDesc: "Votre compagnon IA personnel pour toutes les questions de la vie - recettes de cuisine avec ce que vous avez, conseils santé, aide aux études, conseils de carrière, résolution de problèmes, et planification quotidienne. Tout expliqué simplement en Darija avec des conseils pratiques et réalisables."
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
      
      // الحلول الجزائرية المحلية - جميع الفئات
      ecommerceSetupComparison: "الحلول.الجزائرية.المحلية",
      ecommerceSetupComparisonDesc: "شاهد كيف يروج شريكي للمنتجات والخدمات الجزائرية في جميع الفئات - من التجارة الإلكترونية إلى التعليم، من الصحة إلى الترفيه",
      ecommerceIntro: "نهج.الجزائر.أولاً",
      ecommerceIntroDesc: "كل توصية تعطي الأولوية للشركات والمنتجات والخدمات الجزائرية المحلية. شريكي يفهم السوق المحلي ويربطك بحلول جزائرية موثوقة في جميع الفئات.",
      localEcommercePromotion: "حلول.التجارة.الإلكترونية.المحلية",
      localEcommercePromotionDesc: "شريكي يوصي بحلول جزائرية متكاملة تعمل معاً بسلاسة",
      genericBot: "بوت عادي",
      chrikiBot: "شريكي",
      // Multi-turn conversation questions
      storeQuestion: "كيف أنشئ متجر إلكتروني؟",
      paymentQuestion: "ما بوابة الدفع التي يجب استخدامها؟",
      deliveryQuestion: "وماذا عن خدمات التوصيل؟",
      
      // Generic bot responses
      genericStoreResponse: "أنصح بـ Shopify. إنها منصة شائعة مع العديد من القوالب والإعداد السهل.",
      genericPaymentResponse: "للمدفوعات، استخدم PayPal أو Stripe. هما مقبولان على نطاق واسع دولياً.",
      genericDeliveryResponse: "للشحن، DHL أو FedEx خيارات عالمية موثوقة.",
      
      // CHRIKI responses
      chrikiStoreResponse: "Perfect! Ana n9oullek 3la **Guidini** - platform dz li ysahel 3lik bzef. Ykhdem m3a local banks w yfahem l-marché dz!",
      chrikiPaymentResponse: "For payment, khdem m3a **UbexPay** - local gateway li ykhdem m3a banques dz. W kaman **BaridiMob** integration!",
      chrikiDeliveryResponse: "W for delivery, **Yalidine Express** - fast delivery fi kol l-wilayas! Plus **local pickup points** fi kol blasa.",
      supportingLocal: "دعم.النظام.البيئي.المحلي",
      supportingLocalDesc: "حلول محلية شاملة تعمل معاً بسلاسة",
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
      documentDarijaExplanation: "شريكي.يشرح.بالدارجة",
      documentDarijaText: "تحتاج باسبور ولا كارت الهوية؟ شريكي راح يقولك بالضبط واش من الوثائق خاصك تجيب، وين تروح، وقداش الوقت يخد. كلشي بالدارجة باش تفهم مليح!",
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
      learnMore: "اعرف أكثر",
      
      // Monetization section
      businessModel: "النموذج.التجاري",
      businessModelDesc: "بناء منصة مستدامة من خلال الشراكات الذكية والخدمات القائمة على القيمة",
      revenueStreams: "مصادر.الإيرادات",
      partnershipCommissions: "عمولات.الشراكة",
      partnershipDesc: "كسب العمولة من خلال ربط المستخدمين بشركاء موثوقين مثل أكاديمية هيرد للدورات وجوميا للمنتجات",
      sponsoredPartners: "الشركاء.الراعون",
      sponsoredPartnersDesc: "وضع مميز للعلامات التجارية الجزائرية الموثوقة في نتائج البحث ذات الصلة",
      sponsoredExample: "مثال.الرعاية",
      sponsoredExampleDesc: "عندما يسأل المستخدمون عن المطاعم أو المدارس، يظهر الشركاء الراعون مثل جيزي في الأعلى مع تمييز خاص",
      customerService: "خدمة.العملاء.للشركات",
      customerServiceDesc: "الشركات تدمج شريكي لدعم العملاء مع تعليمات مخصصة وحل المشاكل الموجه",
      smartRecommendations: "التوصيات.الذكية",
      smartRecommendationsDesc: "الذكاء الاصطناعي يحلل اهتمامات المستخدمين من المحادثات لتقديم توصيات شخصية للمنتجات والخدمات",
      sustainableGrowth: "النمو.المستدام",
      sustainableGrowthDesc: "نموذج إيرادات ينمو مع تفاعل المستخدمين مع الحفاظ على الخدمات الأساسية مجانية لجميع الجزائريين",
      
      // Darija explanation
      darijaExplanation: "شريكي.يشرح.بالدارجة",
      darijaBusinessText: "شريكي يربح الفلوس كيفاش؟ بسيط! كي تسقسي على حاجة - مثلاً 'واش كاين تليفون مليح ب 30 ألف؟' - شريكي يحفظ إنك تحب التليفونات. بعدها يقترحلك منتجات من جوميا ولا ويدكنيس. كي تشري من الرابط لي عطاهولك، شريكي ياخد عمولة صغيرة. نفس الحاجة مع الكورسات - تسقسي على 'كيفاش نتعلم المونتاج؟' يقترحلك كورس من هيرد أكاديمي. الشركات تقدر تستعمل شريكي كخدمة عملاء - يجاوب على الزبائن بالدارجة ويحلهم مشاكلهم. كلشي يربح: إنت تاخد المساعدة، الشركة تخدم زبائنها مليح، وشريكي يربح باش يبقى مجاني للكل.",
      
      // Introduction section
      introTitle: "تعرف.على.شريكي",
      introSubtitle: "الثورة.الرقمية.للجزائر",
      introDescription: "شريكي أكثر من مجرد مساعد ذكي - إنه رفيقك الرقمي المصمم خصيصاً للجزائريين، من قبل الجزائريين. نحن نفهم التحديات الفريدة التي يواجهها المواطنون في حياتهم اليومية، من الخدمات الحكومية إلى النقل، ونحن هنا لسد الفجوة بين التكنولوجيا والثقافة الجزائرية الأصيلة.",
      whyNow: "لماذا.الآن؟",
      whyNowDesc: "الجزائر تشهد تحولاً رقمياً، لكن الحلول الموجودة لا تتحدث لغتنا - حرفياً وثقافياً. شريكي يغير ذلك من خلال تقديم تجربة محلية حقيقية تحترم تراثنا وتحتضن الابتكار.",
      ourMission: "مهمتنا",
      ourMissionDesc: "تمكين كل مواطن جزائري بتكنولوجيا تبدو طبيعية ومتاحة ومفيدة حقاً في حياتهم اليومية.",
      
      // Extended introduction content
      algeriaContext: "الجزائر.في.2024",
      algeriaContextDesc: "مع 45 مليون مواطن عبر 58 ولاية، تمثل الجزائر أكبر دولة في أفريقيا واقتصاد رقمي سريع النمو. ومع ذلك، تبقى الحواجز اللغوية والانفصال الثقافي عقبات رئيسية أمام اعتماد التكنولوجيا.",
      marketInsights: "رؤى.السوق",
      digitalGap: "تحدي.الفجوة.الرقمية",
      digitalGapDesc: "73% من الجزائريين يفضلون التواصل بالدارجة، لكن 12% فقط من الخدمات الرقمية تدعمها بفعالية",
      languageBarrier: "الحاجز.اللغوي",
      languageBarrierDesc: "85% يبلغون عن صعوبة مع الواجهات بالفرنسية/الإنجليزية فقط",
      culturalDisconnect: "الانفصال.الثقافي",
      culturalDisconnectDesc: "68% يشعرون أن الذكاء الاصطناعي الحالي لا يفهم السياق الجزائري",
      serviceAccess: "مشاكل.الوصول.للخدمات",
      serviceAccessDesc: "62% يضيعون الوقت في البحث عن الخدمات الحكومية والمعلومات المحلية",
      
      teamStory: "قصتنا",
      teamStoryDesc: "تأسست من قبل مهندسين جزائريين عاشوا بأنفسهم إحباط استخدام تكنولوجيا لا تفهم ثقافتنا، وُلد شريكي من اعتقاد بسيط: التكنولوجيا يجب أن تتكيف مع الناس، وليس العكس.",
      foundedIn: "تأسس.في.الجزائر",
      foundedDesc: "بُني في قلب شمال أفريقيا مع فهم عميق للاحتياجات المحلية",
      algerianTeam: "فريق.جزائري.100%",
      algerianTeamDesc: "متحدثون أصليون يعيشون الثقافة التي نبني لها",
      localFirst: "نهج.المحلي.أولاً",
      localFirstDesc: "كل ميزة مصممة مع المستخدمين الجزائريين كتركيز أساسي",
      
      visionStatement: "رؤيتنا",
      visionDesc: "أن نصبح العمود الفقري الرقمي للجزائر - المنصة الأولى التي يلجأ إليها كل مواطن لاحتياجاته اليومية والخدمات الحكومية والمعلومات المحلية.",
      coreValues: "القيم.الأساسية",
      authenticityValue: "الأصالة",
      authenticityValueDesc: "تجربة جزائرية حقيقية، وليس ترجمة",
      accessibilityValue: "إمكانية.الوصول",
      accessibilityValueDesc: "تكنولوجيا للجميع، بغض النظر عن التعليم أو المهارات التقنية",
      communityValue: "المجتمع",
      communityValueDesc: "بناء روابط بين الجزائريين على المستوى الوطني",
      innovationValue: "الابتكار",
      innovationValueDesc: "ذكاء اصطناعي متطور مع فهم ثقافي عميق",
      
      techApproach: "النهج.التقني",
      techApproachDesc: "يجمع شريكي بين معالجة اللغة الطبيعية المتقدمة مع بيانات التدريب الثقافي الواسعة وواجهات برمجة التطبيقات للمعلومات المحلية الفورية ومبادئ التصميم المتمحورة حول المستخدم.",
      aiTraining: "منهجية.تدريب.الذكاء.الاصطناعي",
      aiTrainingDesc: "مدرب على محادثات جزائرية أصيلة وسياقات ثقافية ومعرفة محلية",
      dataPrivacy: "الخصوصية.أولاً",
      dataPrivacyDesc: "محادثاتك تبقى خاصة مع التشفير من طرف إلى طرف",
      localInfrastructure: "البنية.التحتية.المحلية",
      localInfrastructureDesc: "خوادم في الجزائر لأوقات استجابة أسرع وسيادة البيانات",
      
      // Problem and Solution sections
      conversationProblem: "المشكلة",
      conversationProblemDesc: "المساعدين الذكيين الحاليين لا يفهمون الثقافة الجزائرية أو خلط اللهجات أو السياق المحلي. المواطنون يكافحون مع تكنولوجيا تبدو غريبة ومنفصلة عن واقعهم اليومي.",
      conversationSolution: "حلنا",
      conversationSolutionDesc: "شريكي يتحدث الدارجة الأصيلة، يفهم الفروق الثقافية، ويتعامل بسلاسة مع التبديل بين العربية والفرنسية والأمازيغية - تماماً مثل المحادثات الجزائرية الحقيقية.",
      
      knowledgeProblem: "المشكلة",
      knowledgeProblemDesc: "العثور على معلومات موثوقة حول الخدمات المحلية والمواقع الثقافية والخصائص الإقليمية في الجزائر مجزأ عبر مصادر متعددة وغالباً ما يكون قديماً أو غير دقيق.",
      knowledgeSolution: "حلنا",
      knowledgeSolutionDesc: "قاعدة معرفة محلية شاملة تغطي جميع الولايات الـ58 مع تحديثات فورية للأحداث الثقافية والمواقع التاريخية والأعمال المحلية والتخصصات الإقليمية.",
      
      locationProblem: "المشكلة",
      locationProblemDesc: "المواطنون يضيعون الوقت في البحث عن الخدمات الأساسية مثل الصيدليات والمستشفيات والمكاتب الحكومية دون معرفة توفرها أو أوقات الانتظار أو مواقعها الدقيقة.",
      locationSolution: "حلنا",
      locationSolutionDesc: "بحث ذكي بالقرب مع تكامل خرائط جوجل يوفر التوفر الفوري ومعلومات الطوابير والملاحة المباشرة للخدمات الأساسية.",
      
      transportProblem: "المشكلة",
      transportProblemDesc: "وسائل النقل العامة في الجزائر تفتقر للمعلومات الفورية، مما يجعل تخطيط الرحلات غير مؤكد وغير فعال. المواطنون يكافحون مع جداول غير متوقعة وتغييرات في المسارات.",
      transportDarijaExplanation: "شريكي.يشرح.بالدارجة",
      transportDarijaText: "سما في بلاصة ما تدي الطاكسي، شريكي راح يقترحلك أحسن طريق بالباص والترام والمترو، ويقولك وقتاش يوصل والثمن قداش. كل شي بالوقت الحقيقي باش ما تبقاش تستنى في البرد!",
      transportSolution: "حلنا",
      transportSolutionDesc: "نظام توجيه متعدد الوسائط متكامل مع جداول مباشرة وحساب الأجرة وخيارات إمكانية الوصول للحافلات والترام والمترو في المدن الجزائرية الكبرى.",
      
      documentProblem: "المشكلة",
      documentProblemDesc: "المواطنون يواجهون عمليات بيروقراطية معقدة للوثائق أكثر من جواز السفر/بطاقة الهوية الأساسية - من تراخيص الأعمال إلى سندات الملكية، الشهادات الضريبية إلى تسجيلات الزواج. يضيعون الوقت دون معرفة أي الخدمات متاحة عبر الإنترنت مقابل تتطلب زيارات المكاتب، ما هي الوثائق الداعمة المطلوبة، أو التأخيرات الحالية في المعالجة.",
      documentSolution: "حلنا",
      documentSolutionDesc: "إرشاد كامل لجميع الخدمات الحكومية - من التجديدات البسيطة عبر الإنترنت التي يمكنك القيام بها من المنزل إلى العمليات المعقدة متعددة الخطوات. شريكي يخبرك بالضبط ما هو متاح عبر الإنترنت، ما يتطلب زيارات المكاتب، جميع الوثائق المطلوبة، أوقات الانتظار الحالية، وتعليمات خطوة بخطوة بالدارجة.",
      
      dailyLifeProblem: "المشكلة",
      dailyLifeProblemDesc: "الناس يكافحون مع القرارات اليومية - ماذا يطبخون بالمكونات المتاحة، كيف يديرون الوقت بفعالية، فهم أعراض الصحة، تعلم مهارات جديدة، أو حل المشاكل اليومية. المعلومات مبعثرة عبر مصادر متعددة وغالباً غير شخصية.",
      dailyLifeDarijaExplanation: "شريكي.يشرح.بالدارجة",
      dailyLifeDarijaText: "عندك مشكلة في الدار؟ ما تعرفش واش تطبخ؟ والا عندك سؤال على الصحة؟ شريكي هنا باش يساعدك في كلشي - من الطبخ للدراسة، من الصحة للشغل. كلشي بالدارجة وبطريقة بسيطة!",
      dailyLifeSolution: "حلنا",
      dailyLifeSolutionDesc: "رفيقك الذكي الشخصي لجميع أسئلة الحياة - وصفات الطبخ بما لديك، إرشادات صحية، مساعدة في الدراسة، نصائح مهنية، حل المشاكل، والتخطيط اليومي. كل شيء مشروح ببساطة بالدارجة مع نصائح عملية قابلة للتطبيق."
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

      {/* Introduction Section - MASSIVELY EXPANDED */}
      <section className="py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Title */}
          <div className="text-center mb-20">
            <h2 className="font-mono text-6xl md:text-7xl font-bold mb-8 text-blue-700 dark:text-blue-400 tracking-tight">{t.sections.introTitle}</h2>
            <div className="w-40 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-10 rounded-full"></div>
            <p className="font-mono text-2xl md:text-3xl text-blue-600 dark:text-blue-300 mb-12 tracking-wide">{t.sections.introSubtitle}</p>
            <div className="max-w-5xl mx-auto">
              <p className="text-xl md:text-2xl text-blue-600 dark:text-blue-300 leading-relaxed font-light">
                {t.sections.introDescription}
              </p>
            </div>
          </div>

          {/* Algeria Context */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h3 className="font-mono text-4xl font-bold text-blue-700 dark:text-blue-400 mb-6">{t.sections.algeriaContext}</h3>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <div className="bg-white dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🌍</span>
                  </div>
                  <h4 className="font-mono text-xl font-bold text-blue-700 dark:text-blue-400">45M CITIZENS</h4>
                </div>
                <p className="text-blue-600 dark:text-blue-300 text-center">Across 58 wilayas in Africa's largest country</p>
              </div>
              
              <div className="bg-white dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📱</span>
                  </div>
                  <h4 className="font-mono text-xl font-bold text-blue-700 dark:text-blue-400">DIGITAL GROWTH</h4>
                </div>
                <p className="text-blue-600 dark:text-blue-300 text-center">Rapidly expanding digital economy with unique needs</p>
              </div>
              
              <div className="bg-white dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🗣️</span>
                  </div>
                  <h4 className="font-mono text-xl font-bold text-blue-700 dark:text-blue-400">LANGUAGE GAP</h4>
                </div>
                <p className="text-blue-600 dark:text-blue-300 text-center">Cultural disconnect remains a major tech barrier</p>
              </div>
            </div>
          </div>

          {/* Market Statistics */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h3 className="font-mono text-4xl font-bold text-blue-700 dark:text-blue-400 mb-6">{t.sections.marketInsights}</h3>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/30 p-8 rounded-2xl border border-red-200 dark:border-red-700 shadow-xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">73%</div>
                  <h4 className="font-mono text-sm font-bold text-red-700 dark:text-red-400 mb-3">{t.sections.digitalGap}</h4>
                  <p className="text-xs text-red-600 dark:text-red-300">{t.sections.digitalGapDesc}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/30 p-8 rounded-2xl border border-orange-200 dark:border-orange-700 shadow-xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">85%</div>
                  <h4 className="font-mono text-sm font-bold text-orange-700 dark:text-orange-400 mb-3">{t.sections.languageBarrier}</h4>
                  <p className="text-xs text-orange-600 dark:text-orange-300">{t.sections.languageBarrierDesc}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/30 p-8 rounded-2xl border border-yellow-200 dark:border-yellow-700 shadow-xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">68%</div>
                  <h4 className="font-mono text-sm font-bold text-yellow-700 dark:text-yellow-400 mb-3">{t.sections.culturalDisconnect}</h4>
                  <p className="text-xs text-yellow-600 dark:text-yellow-300">{t.sections.culturalDisconnectDesc}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/30 p-8 rounded-2xl border border-purple-200 dark:border-purple-700 shadow-xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">62%</div>
                  <h4 className="font-mono text-sm font-bold text-purple-700 dark:text-purple-400 mb-3">{t.sections.serviceAccess}</h4>
                  <p className="text-xs text-purple-600 dark:text-purple-300">{t.sections.serviceAccessDesc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Story */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h3 className="font-mono text-4xl font-bold text-blue-700 dark:text-blue-400 mb-6">{t.sections.teamStory}</h3>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white dark:bg-blue-900/20 p-12 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🚀</span>
                  </div>
                  <h4 className="font-mono text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">BORN FROM NECESSITY</h4>
                </div>
                <p className="text-lg text-blue-600 dark:text-blue-300 leading-relaxed text-center">
                  {t.sections.teamStoryDesc}
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🇩🇿</span>
                    </div>
                    <h4 className="font-mono text-lg font-bold text-blue-700 dark:text-blue-400">{t.sections.foundedIn}</h4>
                  </div>
                  <p className="text-blue-600 dark:text-blue-300">{t.sections.foundedDesc}</p>
                </div>
                
                <div className="bg-white dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                    <h4 className="font-mono text-lg font-bold text-blue-700 dark:text-blue-400">{t.sections.algerianTeam}</h4>
                  </div>
                  <p className="text-blue-600 dark:text-blue-300">{t.sections.algerianTeamDesc}</p>
                </div>
                
                <div className="bg-white dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h4 className="font-mono text-lg font-bold text-blue-700 dark:text-blue-400">{t.sections.localFirst}</h4>
                  </div>
                  <p className="text-blue-600 dark:text-blue-300">{t.sections.localFirstDesc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vision Statement */}
          <div className="mb-24">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 p-16 rounded-3xl text-white text-center shadow-2xl">
              <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-5xl">🌟</span>
              </div>
              <h3 className="font-mono text-3xl md:text-4xl font-bold mb-8">{t.sections.visionStatement}</h3>
              <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto font-light">
                {t.sections.visionDesc}
              </p>
            </div>
          </div>

          {/* Core Values Grid */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h3 className="font-mono text-4xl font-bold text-blue-700 dark:text-blue-400 mb-6">{t.sections.coreValues}</h3>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white dark:bg-blue-900/20 p-10 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🎭</span>
                  </div>
                  <h4 className="font-mono text-xl font-bold text-blue-700 dark:text-blue-400 mb-4">{t.sections.authenticityValue}</h4>
                  <p className="text-blue-600 dark:text-blue-300 text-sm leading-relaxed">{t.sections.authenticityValueDesc}</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-blue-900/20 p-10 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 dark:bg-purple-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">♿</span>
                  </div>
                  <h4 className="font-mono text-xl font-bold text-blue-700 dark:text-blue-400 mb-4">{t.sections.accessibilityValue}</h4>
                  <p className="text-blue-600 dark:text-blue-300 text-sm leading-relaxed">{t.sections.accessibilityValueDesc}</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-blue-900/20 p-10 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 dark:bg-orange-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🤝</span>
                  </div>
                  <h4 className="font-mono text-xl font-bold text-blue-700 dark:text-blue-400 mb-4">{t.sections.communityValue}</h4>
                  <p className="text-blue-600 dark:text-blue-300 text-sm leading-relaxed">{t.sections.communityValueDesc}</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-blue-900/20 p-10 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <h4 className="font-mono text-xl font-bold text-blue-700 dark:text-blue-400 mb-4">{t.sections.innovationValue}</h4>
                  <p className="text-blue-600 dark:text-blue-300 text-sm leading-relaxed">{t.sections.innovationValueDesc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Approach */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h3 className="font-mono text-4xl font-bold text-blue-700 dark:text-blue-400 mb-6">{t.sections.techApproach}</h3>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
            </div>
            
            <div className="bg-white dark:bg-blue-900/20 p-12 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-2xl mb-12">
              <p className="text-xl text-blue-600 dark:text-blue-300 text-center leading-relaxed mb-12">
                {t.sections.techApproachDesc}
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🧠</span>
                  </div>
                  <h4 className="font-mono text-lg font-bold text-blue-700 dark:text-blue-400 mb-4">{t.sections.aiTraining}</h4>
                  <p className="text-blue-600 dark:text-blue-300 text-sm">{t.sections.aiTrainingDesc}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🔒</span>
                  </div>
                  <h4 className="font-mono text-lg font-bold text-blue-700 dark:text-blue-400 mb-4">{t.sections.dataPrivacy}</h4>
                  <p className="text-blue-600 dark:text-blue-300 text-sm">{t.sections.dataPrivacyDesc}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 dark:bg-purple-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🏗️</span>
                  </div>
                  <h4 className="font-mono text-lg font-bold text-blue-700 dark:text-blue-400 mb-4">{t.sections.localInfrastructure}</h4>
                  <p className="text-blue-600 dark:text-blue-300 text-sm">{t.sections.localInfrastructureDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Sections */}
      <section id="demo" className="pt-8 pb-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Everyday Conversation Demo */}
          <div className="mb-20">
            {/* Problem Section - Infographic Style */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/30 border-2 border-red-200 dark:border-red-800 p-12 rounded-2xl mb-12 shadow-2xl">
              <div className="text-center mb-12">
                <h3 className="font-mono text-4xl font-bold mb-6 text-red-700 dark:text-red-400">{t.sections.conversationProblem}</h3>
                <div className="w-24 h-1 bg-red-500 mx-auto mb-8"></div>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8 mb-12">
                {/* Current AI Limitations */}
                <div className="bg-white dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <h4 className="font-mono text-lg font-bold text-red-700 dark:text-red-400 mb-3">CURRENT AI ASSISTANTS</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-red-600 dark:text-red-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">❌</span>
                      <span>No Darija understanding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">❌</span>
                      <span>Cultural context missing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">❌</span>
                      <span>Code-switching confusion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">❌</span>
                      <span>Generic responses</span>
                    </li>
                  </ul>
                </div>
                
                {/* User Frustration Stats */}
                <div className="bg-white dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📊</span>
                    </div>
                    <h4 className="font-mono text-lg font-bold text-red-700 dark:text-red-400 mb-3">USER FRUSTRATION</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-600 dark:text-red-300">Language Barriers</span>
                        <span className="text-red-700 dark:text-red-400 font-bold">85%</span>
                      </div>
                      <div className="w-full bg-red-200 dark:bg-red-800/30 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-600 dark:text-red-300">Cultural Disconnect</span>
                        <span className="text-red-700 dark:text-red-400 font-bold">78%</span>
                      </div>
                      <div className="w-full bg-red-200 dark:bg-red-800/30 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: '78%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-600 dark:text-red-300">Abandonment Rate</span>
                        <span className="text-red-700 dark:text-red-400 font-bold">62%</span>
                      </div>
                      <div className="w-full bg-red-200 dark:bg-red-800/30 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: '62%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Language Complexity */}
                <div className="bg-white dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🗣️</span>
                    </div>
                    <h4 className="font-mono text-lg font-bold text-red-700 dark:text-red-400 mb-3">ALGERIAN COMPLEXITY</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 dark:text-red-300">3+ Languages Mixed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 dark:text-red-300">Regional Dialects</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 dark:text-red-300">Cultural References</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 dark:text-red-300">Context Switching</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-red-900/20 p-8 rounded-xl border border-red-200 dark:border-red-700">
                <h4 className="font-mono text-xl font-bold text-red-700 dark:text-red-400 mb-4 text-center">THE CORE PROBLEM</h4>
                <p className="text-red-600 dark:text-red-300 text-lg text-center max-w-4xl mx-auto leading-relaxed">
                  {t.sections.conversationProblemDesc}
                </p>
              </div>
            </div>
            
            {/* Solution Section - Infographic Style */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/30 border-2 border-green-200 dark:border-green-800 p-12 rounded-2xl mb-12 shadow-2xl">
              <div className="text-center mb-12">
                <h3 className="font-mono text-4xl font-bold mb-6 text-green-700 dark:text-green-400">{t.sections.conversationSolution}</h3>
                <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8 mb-12">
                {/* CHRIKI Capabilities */}
                <div className="bg-white dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🧠</span>
                    </div>
                    <h4 className="font-mono text-lg font-bold text-green-700 dark:text-green-400 mb-3">CHRIKI CAPABILITIES</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-green-600 dark:text-green-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✅</span>
                      <span>Native Darija fluency</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✅</span>
                      <span>Cultural context awareness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✅</span>
                      <span>Seamless code-switching</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✅</span>
                      <span>Personalized responses</span>
                    </li>
                  </ul>
                </div>
                
                {/* Language Support */}
                <div className="bg-white dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <h4 className="font-mono text-lg font-bold text-green-700 dark:text-green-400 mb-3">LANGUAGE SUPPORT</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-600 dark:text-green-300">Darija Accuracy</span>
                        <span className="text-green-700 dark:text-green-400 font-bold">95%</span>
                      </div>
                      <div className="w-full bg-green-200 dark:bg-green-800/30 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-600 dark:text-green-300">Code-Switching</span>
                        <span className="text-green-700 dark:text-green-400 font-bold">92%</span>
                      </div>
                      <div className="w-full bg-green-200 dark:bg-green-800/30 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-600 dark:text-green-300">Cultural Context</span>
                        <span className="text-green-700 dark:text-green-400 font-bold">88%</span>
                      </div>
                      <div className="w-full bg-green-200 dark:bg-green-800/30 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '88%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* User Satisfaction */}
                <div className="bg-white dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">😊</span>
                    </div>
                    <h4 className="font-mono text-lg font-bold text-green-700 dark:text-green-400 mb-3">USER SATISFACTION</h4>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">4.8/5</div>
                    <div className="flex justify-center mb-3">
                      <span className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</span>
                    </div>
                    <div className="space-y-2 text-sm text-green-600 dark:text-green-300">
                      <div>"Finally understands me!"</div>
                      <div>"Like talking to a friend"</div>
                      <div>"Authentic Algerian AI"</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-green-900/20 p-8 rounded-xl border border-green-200 dark:border-green-700">
                <h4 className="font-mono text-xl font-bold text-green-700 dark:text-green-400 mb-4 text-center">OUR SOLUTION</h4>
                <p className="text-green-600 dark:text-green-300 text-lg text-center max-w-4xl mx-auto leading-relaxed">
                  {t.sections.conversationSolutionDesc}
                </p>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight">{t.sections.everydayConversation}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.sections.everydayDesc}
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Static Chat Interface - Complete Conversation */}
              <div className="max-w-4xl mx-auto h-[750px] flex flex-col">
                <div className="text-center mb-8 flex-shrink-0">
                  <h3 className="font-mono text-xl font-bold mb-2">Everyday Conversation</h3>
                  <p className="text-muted-foreground text-sm">Darija & French Mix</p>
                </div>
                
                <div className="bg-background border-2 border-foreground rounded-lg overflow-hidden shadow-2xl flex-1 flex flex-col min-h-0">
                  <div className="bg-foreground text-background px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="font-mono font-bold text-sm">CHRIKI</div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="text-xs font-mono opacity-80">// PRESENTATION MODE</div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 min-h-[500px]">
                    {/* Complete conversation messages */}
                    <div className="flex justify-start">
                      <div className="bg-background border border-border px-4 py-3 rounded-lg max-w-[70%]">
                        <div className="text-sm whitespace-pre-line" dir="auto" style={{ textAlign: 'left' }}>
                          Ahla w sahla! Ana Chriki, kifach n3awnek?
                        </div>
                        <div className="text-xs mt-2 opacity-60 text-muted-foreground">
                          14:32
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-foreground text-background px-4 py-3 rounded-lg max-w-[70%]">
                        <div className="text-sm whitespace-pre-line" dir="auto" style={{ textAlign: 'left' }}>
                          Salam khoya! Ndir wahad l'présentation demain w khalas ma 3andi inspiration
                        </div>
                        <div className="text-xs mt-2 opacity-60 text-background/80">
                          14:33
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-background border border-border px-4 py-3 rounded-lg max-w-[70%]">
                        <div className="text-sm whitespace-pre-line" dir="auto" style={{ textAlign: 'left' }}>
                          Maliche! Goulili 3la ach presentation mte3k? Ana n3awnek bech tdirlha structure w ideas bzef!
                        </div>
                        <div className="text-xs mt-2 opacity-60 text-muted-foreground">
                          14:33
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-foreground text-background px-4 py-3 rounded-lg max-w-[70%]">
                        <div className="text-sm whitespace-pre-line" dir="auto" style={{ textAlign: 'left' }}>
                          C'est à propos digital marketing f Algeria
                        </div>
                        <div className="text-xs mt-2 opacity-60 text-background/80">
                          14:34
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-background border border-border px-4 py-3 rounded-lg max-w-[70%]">
                        <div className="text-sm whitespace-pre-line" dir="auto" style={{ textAlign: 'left' }}>
                          Perfect! Digital marketing fi Algeria hadhi mawdo3 interessant bzef! Rani n9oullek plan wa7ed:
                        </div>
                        <div className="text-xs mt-2 opacity-60 text-muted-foreground">
                          14:34
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border p-4 bg-background flex-shrink-0">
                    <div className="flex space-x-3">
                      <div className="flex-1 px-3 py-2 border border-border rounded-lg bg-muted/50 text-muted-foreground font-mono text-sm">
                        Type your message in Darija...
                      </div>
                      <button className="px-4 py-2 bg-foreground text-background rounded-lg font-mono text-sm">
                        SEND
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
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
            {/* Problem Section - Infographic Style */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/30 border-2 border-red-200 dark:border-red-800 p-12 rounded-2xl mb-12 shadow-2xl">
              <div className="text-center mb-12">
                <h3 className="font-mono text-4xl font-bold mb-6 text-red-700 dark:text-red-400">{t.sections.knowledgeProblem}</h3>
                <div className="w-24 h-1 bg-red-500 mx-auto mb-8"></div>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8 mb-12">
                {/* Information Fragmentation */}
                <div className="bg-white dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🧩</span>
                    </div>
                    <h4 className="font-mono text-lg font-bold text-red-700 dark:text-red-400 mb-3">FRAGMENTED SOURCES</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-red-600 dark:text-red-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">❌</span>
                      <span>Multiple outdated websites</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">❌</span>
                      <span>Inconsistent information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">❌</span>
                      <span>No real-time updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">❌</span>
                      <span>Language barriers</span>
                    </li>
                  </ul>
                </div>
                
                {/* Search Difficulty Stats */}
                <div className="bg-white dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <h4 className="font-mono text-lg font-bold text-red-700 dark:text-red-400 mb-3">SEARCH CHALLENGES</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-600 dark:text-red-300">Time Wasted Searching</span>
                        <span className="text-red-700 dark:text-red-400 font-bold">73%</span>
                      </div>
                      <div className="w-full bg-red-200 dark:bg-red-800/30 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: '73%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-600 dark:text-red-300">Outdated Information</span>
                        <span className="text-red-700 dark:text-red-400 font-bold">68%</span>
                      </div>
                      <div className="w-full bg-red-200 dark:bg-red-800/30 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: '68%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-600 dark:text-red-300">Give Up Rate</span>
                        <span className="text-red-700 dark:text-red-400 font-bold">45%</span>
                      </div>
                      <div className="w-full bg-red-200 dark:bg-red-800/30 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: '45%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Information Gaps */}
                <div className="bg-white dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🕳️</span>
                    </div>
                    <h4 className="font-mono text-lg font-bold text-red-700 dark:text-red-400 mb-3">MISSING INFO</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 dark:text-red-300">Local business hours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 dark:text-red-300">Cultural event details</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 dark:text-red-300">Regional specialties</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 dark:text-red-300">Historical context</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                  <h4 className="font-mono text-lg font-bold text-red-700 dark:text-red-400 mb-4">ALGERIA'S 58 WILAYAS</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">2.4M km²</div>
                    <div className="text-sm text-red-600 dark:text-red-300 mb-4">Diverse regions, scattered info</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-red-50 dark:bg-red-800/20 p-2 rounded">North: 4 regions</div>
                      <div className="bg-red-50 dark:bg-red-800/20 p-2 rounded">Highlands: 22 wilayas</div>
                      <div className="bg-red-50 dark:bg-red-800/20 p-2 rounded">South: 32 wilayas</div>
                      <div className="bg-red-50 dark:bg-red-800/20 p-2 rounded">Sahara: Vast areas</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                  <h4 className="font-mono text-lg font-bold text-red-700 dark:text-red-400 mb-4">INFORMATION CHAOS</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-red-600 dark:text-red-300 text-sm">Government Sites</span>
                      <span className="bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-400 px-2 py-1 rounded text-xs">Outdated</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-600 dark:text-red-300 text-sm">Tourism Portals</span>
                      <span className="bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-400 px-2 py-1 rounded text-xs">Incomplete</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-600 dark:text-red-300 text-sm">Social Media</span>
                      <span className="bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-400 px-2 py-1 rounded text-xs">Unreliable</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-600 dark:text-red-300 text-sm">Local Forums</span>
                      <span className="bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-400 px-2 py-1 rounded text-xs">Scattered</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-red-900/20 p-8 rounded-xl border border-red-200 dark:border-red-700">
                <h4 className="font-mono text-xl font-bold text-red-700 dark:text-red-400 mb-4 text-center">THE CORE PROBLEM</h4>
                <p className="text-red-600 dark:text-red-300 text-lg text-center max-w-4xl mx-auto leading-relaxed">
                  {t.sections.knowledgeProblemDesc}
                </p>
              </div>
            </div>
            
            {/* Solution Section */}
            <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 p-8 rounded-r-lg mb-12">
              <div className="text-center">
                <h3 className="font-mono text-2xl font-bold mb-4 text-green-700 dark:text-green-400">{t.sections.knowledgeSolution}</h3>
                <p className="text-green-600 dark:text-green-300 text-lg max-w-4xl mx-auto">
                  {t.sections.knowledgeSolutionDesc}
                </p>
              </div>
            </div>
            
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
                {/* Static Chat Interface - Local Knowledge Conversation */}
                <div className="max-w-4xl mx-auto h-[750px] flex flex-col">
                  <div className="text-center mb-8 flex-shrink-0">
                    <h3 className="font-mono text-xl font-bold mb-2">Local Knowledge</h3>
                    <p className="text-muted-foreground text-sm">Algerian Context & Culture</p>
                  </div>
                  
                  <div className="bg-background border-2 border-foreground rounded-lg overflow-hidden shadow-2xl flex-1 flex flex-col min-h-0">
                    <div className="bg-foreground text-background px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="font-mono font-bold text-sm">CHRIKI</div>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="text-xs font-mono opacity-80">// PRESENTATION MODE</div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 min-h-[500px]">
                      {/* Complete conversation messages */}
                      <div className="flex justify-end">
                        <div className="bg-foreground text-background px-4 py-3 rounded-lg max-w-[70%]">
                          <div className="text-sm whitespace-pre-line" dir="auto" style={{ textAlign: 'left' }}>
                            Chriki, wach rak ta3ref 3la Oran?
                          </div>
                          <div className="text-xs mt-2 opacity-60 text-background/80">
                            14:35
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="bg-background border border-border px-4 py-3 rounded-lg max-w-[70%]">
                          <div className="text-sm whitespace-pre-line" dir="auto" style={{ textAlign: 'left' }}>
                            Oran? Ya salam! Wahran l'bahia, bled l'raï w Santa Cruz! T7ebb ta3ref 3la ach? Restaurants, sorties, wala histoire mte3ha?
                          </div>
                          <div className="text-xs mt-2 opacity-60 text-muted-foreground">
                            14:35
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="bg-foreground text-background px-4 py-3 rounded-lg max-w-[70%]">
                          <div className="text-sm whitespace-pre-line" dir="auto" style={{ textAlign: 'left' }}>
                            Restaurants tradionnels li yaklo fihom makla 7aloua
                          </div>
                          <div className="text-xs mt-2 opacity-60 text-background/80">
                            14:36
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="bg-background border border-border px-4 py-3 rounded-lg max-w-[70%]">
                          <div className="text-sm whitespace-pre-line" dir="auto" style={{ textAlign: 'left' }}>
                            Ah perfect! Fi Wahran 3andek restaurants bzef:

🍽️ **Chez Ferhat** - Chorba, couscous royal
🥘 **Le Petit Poucet** - Makla 3arabiya traditionelle  
🍖 **Restaurant Es-Salam** - L7am l7alal w tajine

Kamlin fi Medina Jdida, qrib men Place d'Armes!
                          </div>
                          <div className="text-xs mt-2 opacity-60 text-muted-foreground">
                            14:36
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border p-4 bg-background flex-shrink-0">
                      <div className="flex space-x-3">
                        <div className="flex-1 px-3 py-2 border border-border rounded-lg bg-muted/50 text-muted-foreground font-mono text-sm">
                          Type your message in Darija...
                        </div>
                        <button className="px-4 py-2 bg-foreground text-background rounded-lg font-mono text-sm">
                          SEND
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Methods Comparison Section */}
            <div className="mt-16 mb-12">
              {/* Introduction */}
              <div className="text-center mb-12">
                <h3 className="font-mono text-2xl font-bold mb-4">{t.sections.ecommerceIntro}</h3>
                <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
                  {t.sections.ecommerceIntroDesc}
                </p>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="font-mono text-2xl font-bold mb-4">{t.sections.ecommerceSetupComparison}</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {t.sections.ecommerceSetupComparisonDesc}
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Generic Bot */}
                <div className="bg-gray-50 dark:bg-gray-900/20 border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <div className="font-mono font-bold text-sm">{t.sections.genericBot}</div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/10 min-h-[400px]">
                    {/* Question 1: Store */}
                    <div className="flex justify-end">
                      <div className="bg-gray-600 text-white px-4 py-3 rounded-lg max-w-[80%]">
                        <div className="text-sm">
                          {t.sections.storeQuestion}
                        </div>
                        <div className="text-xs mt-2 opacity-60">
                          14:40
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-lg max-w-[80%]">
                        <div className="text-sm text-gray-800 dark:text-gray-200">
                          {t.sections.genericStoreResponse}
                        </div>
                        <div className="text-xs mt-2 opacity-60 text-gray-500">
                          14:40
                        </div>
                      </div>
                    </div>

                    {/* Question 2: Payment */}
                    <div className="flex justify-end">
                      <div className="bg-gray-600 text-white px-4 py-3 rounded-lg max-w-[80%]">
                        <div className="text-sm">
                          {t.sections.paymentQuestion}
                        </div>
                        <div className="text-xs mt-2 opacity-60">
                          14:41
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-lg max-w-[80%]">
                        <div className="text-sm text-gray-800 dark:text-gray-200">
                          {t.sections.genericPaymentResponse}
                        </div>
                        <div className="text-xs mt-2 opacity-60 text-gray-500">
                          14:41
                        </div>
                      </div>
                    </div>

                    {/* Question 3: Delivery */}
                    <div className="flex justify-end">
                      <div className="bg-gray-600 text-white px-4 py-3 rounded-lg max-w-[80%]">
                        <div className="text-sm">
                          {t.sections.deliveryQuestion}
                        </div>
                        <div className="text-xs mt-2 opacity-60">
                          14:42
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-lg max-w-[80%]">
                        <div className="text-sm text-gray-800 dark:text-gray-200">
                          {t.sections.genericDeliveryResponse}
                        </div>
                        <div className="text-xs mt-2 opacity-60 text-gray-500">
                          14:42
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                      <div className="text-xs font-mono text-red-600 dark:text-red-400 mb-2">❌ ISSUES:</div>
                      <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                        <li>• International solutions only</li>
                        <li>• No local payment integration</li>
                        <li>• Expensive international shipping</li>
                        <li>• Complex setup for DZ market</li>
                        <li>• Currency conversion issues</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* CHRIKI Bot */}
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-lg overflow-hidden">
                  <div className="bg-green-600 text-white px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <div className="font-mono font-bold text-sm">{t.sections.chrikiBot}</div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4 bg-green-50/50 dark:bg-green-900/10 min-h-[400px]">
                    {/* Question 1: Store */}
                    <div className="flex justify-end">
                      <div className="bg-gray-600 text-white px-4 py-3 rounded-lg max-w-[80%]">
                        <div className="text-sm">
                          {t.sections.storeQuestion}
                        </div>
                        <div className="text-xs mt-2 opacity-60">
                          14:40
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 px-4 py-3 rounded-lg max-w-[80%]">
                        <div className="text-sm text-green-800 dark:text-green-200">
                          {renderMarkdown(t.sections.chrikiStoreResponse)}
                        </div>
                        <div className="text-xs mt-2 opacity-60 text-green-600 dark:text-green-400">
                          14:40
                        </div>
                      </div>
                    </div>

                    {/* Question 2: Payment */}
                    <div className="flex justify-end">
                      <div className="bg-gray-600 text-white px-4 py-3 rounded-lg max-w-[80%]">
                        <div className="text-sm">
                          {t.sections.paymentQuestion}
                        </div>
                        <div className="text-xs mt-2 opacity-60">
                          14:41
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 px-4 py-3 rounded-lg max-w-[80%]">
                        <div className="text-sm text-green-800 dark:text-green-200">
                          {renderMarkdown(t.sections.chrikiPaymentResponse)}
                        </div>
                        <div className="text-xs mt-2 opacity-60 text-green-600 dark:text-green-400">
                          14:41
                        </div>
                      </div>
                    </div>

                    {/* Question 3: Delivery */}
                    <div className="flex justify-end">
                      <div className="bg-gray-600 text-white px-4 py-3 rounded-lg max-w-[80%]">
                        <div className="text-sm">
                          {t.sections.deliveryQuestion}
                        </div>
                        <div className="text-xs mt-2 opacity-60">
                          14:42
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 px-4 py-3 rounded-lg max-w-[80%]">
                        <div className="text-sm text-green-800 dark:text-green-200">
                          {renderMarkdown(t.sections.chrikiDeliveryResponse)}
                        </div>
                        <div className="text-xs mt-2 opacity-60 text-green-600 dark:text-green-400">
                          14:42
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-3 bg-green-100 dark:bg-green-800/20 border border-green-300 dark:border-green-600 rounded-lg">
                      <div className="text-xs font-mono text-green-700 dark:text-green-400 mb-2">✅ {t.sections.supportingLocal}:</div>
                      <ul className="text-xs text-green-700 dark:text-green-400 space-y-1">
                        <li>• Complete Algerian ecosystem</li>
                        <li>• Local payment integration (Dinars)</li>
                        <li>• Fast local delivery network</li>
                        <li>• Marketplace connections</li>
                        <li>• Explains everything in Darija</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 border border-green-200 dark:border-green-700 rounded-lg p-6">
                  <h4 className="font-mono text-lg font-bold mb-3 text-green-700 dark:text-green-400">
                    {t.sections.localEcommercePromotion}
                  </h4>
                  <p className="text-green-600 dark:text-green-300 text-sm max-w-2xl mx-auto">
                    {t.sections.localEcommercePromotionDesc}
                  </p>
                  <div className="mt-4 text-xs text-green-600 dark:text-green-400">
                    {t.sections.supportingLocalDesc}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Location Services Demo */}
          <div className="mb-20">
            {/* Problem Section */}
            <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-8 rounded-r-lg mb-8">
              <div className="text-center">
                <h3 className="font-mono text-2xl font-bold mb-4 text-red-700 dark:text-red-400">{t.sections.locationProblem}</h3>
                <p className="text-red-600 dark:text-red-300 text-lg max-w-4xl mx-auto">
                  {t.sections.locationProblemDesc}
                </p>
              </div>
            </div>
            
            {/* Solution Section */}
            <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 p-8 rounded-r-lg mb-12">
              <div className="text-center">
                <h3 className="font-mono text-2xl font-bold mb-4 text-green-700 dark:text-green-400">{t.sections.locationSolution}</h3>
                <p className="text-green-600 dark:text-green-300 text-lg max-w-4xl mx-auto">
                  {t.sections.locationSolutionDesc}
                </p>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight">{t.sections.locationServices}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.sections.locationDesc}
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Static Chat Interface - Location Services Conversation */}
              <div className="max-w-6xl mx-auto h-[980px] flex flex-col">
                <div className="text-center mb-8 flex-shrink-0">
                  <h3 className="font-mono text-xl font-bold mb-2">Location Services</h3>
                  <p className="text-muted-foreground text-sm">Find Places Near You</p>
                </div>
                
                <div className="bg-background border-2 border-foreground rounded-lg overflow-hidden shadow-2xl flex-1 flex flex-col min-h-0">
                  <div className="bg-foreground text-background px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="font-mono font-bold text-sm">CHRIKI</div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="text-xs font-mono opacity-80">// PRESENTATION MODE</div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 min-h-[500px]">
                    {/* Complete conversation messages */}
                    <div className="flex justify-end">
                      <div className="bg-foreground text-background px-4 py-3 rounded-lg max-w-[70%]">
                        <div className="text-sm whitespace-pre-line" dir="auto" style={{ textAlign: 'left' }}>
                          Salam! fin wrili mustashfa qrib?
                        </div>
                        <div className="text-xs mt-2 opacity-60 text-background/80">
                          14:37
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-background border border-border px-4 py-3 rounded-lg max-w-[95%]">
                        <div className="text-sm mb-3" dir="auto" style={{ textAlign: 'left' }}>
                          Perfect! Hani nwarilek l-mustashfayat l-qrib mink:
                        </div>
                        
                        {/* Hospital Search Interface */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          {/* Search Header */}
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 relative">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 text-gray-600">📍</div>
                              <span className="font-semibold text-sm">Nearby hospital</span>
                              <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">2 found</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <span className="mr-1">✓</span>
                              <span>Near: my location</span>
                            </div>
                            <button className="absolute top-3 right-3 bg-gray-800 text-white px-3 py-1 rounded text-xs font-medium">
                              Open Maps
                            </button>
                          </div>

                          {/* Map Placeholder */}
                          <div className="h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                            <div className="text-gray-400 text-6xl">🗺️</div>
                          </div>

                          {/* Hospital Results */}
                          <div className="p-4 space-y-4">
                            {/* Hôpital Mustapha Pacha */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-sm">Hôpital Mustapha Pacha</h3>
                                <div className="flex items-center space-x-1">
                                  <span className="text-yellow-500">⭐</span>
                                  <span className="text-xs font-medium">4.2</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Place du 1er Mai, Sidi M'Hamed, Alger</p>
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-6">
                                  <span className="font-medium">0.8 km</span>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-green-600 dark:text-green-400">Open</span>
                                  </div>
                                  <span className="text-blue-600 dark:text-blue-400">📞 021 23 35 15</span>
                                </div>
                                <button className="text-blue-600 dark:text-blue-400 font-medium ml-4">Directions</button>
                              </div>
                            </div>

                            {/* CHU Beni Messous */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-sm">CHU Beni Messous</h3>
                                <div className="flex items-center space-x-1">
                                  <span className="text-yellow-500">⭐</span>
                                  <span className="text-xs font-medium">4.5</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Route de Ouled Fayet, Beni Messous, Alger</p>
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-6">
                                  <span className="font-medium">1.2 km</span>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-green-600 dark:text-green-400">Open</span>
                                  </div>
                                  <span className="text-blue-600 dark:text-blue-400">📞 021 93 15 50</span>
                                </div>
                                <button className="text-blue-600 dark:text-blue-400 font-medium ml-4">Directions</button>
                              </div>
                            </div>
                          </div>

                          {/* Footer timestamp */}
                          <div className="text-right text-xs text-gray-400 p-3 border-t border-gray-200 dark:border-gray-700">
                            14:32
                          </div>
                        </div>
                        
                        <div className="text-xs mt-2 opacity-60 text-muted-foreground">
                          14:38
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="border-t border-border p-4 bg-background flex-shrink-0">
                    <div className="flex space-x-3">
                      <div className="flex-1 px-3 py-2 border border-border rounded-lg bg-muted/50 text-muted-foreground font-mono text-sm">
                        Type your message in Darija...
                      </div>
                      <button className="px-4 py-2 bg-foreground text-background rounded-lg font-mono text-sm">
                        SEND
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
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

      {/* Transport Hub Demo */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Problem Section */}
          <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-8 rounded-r-lg mb-8">
            <div className="text-center">
              <h3 className="font-mono text-2xl font-bold mb-4 text-red-700 dark:text-red-400">{t.sections.transportProblem}</h3>
              <p className="text-red-600 dark:text-red-300 text-lg max-w-4xl mx-auto">
                {t.sections.transportProblemDesc}
              </p>
            </div>
          </div>
          
          {/* Darija Explanation Section */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-8 rounded-r-lg mb-8">
            <div className="text-center">
              <h3 className="font-mono text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">{t.sections.transportDarijaExplanation}</h3>
              <p className="text-blue-600 dark:text-blue-300 text-xl max-w-4xl mx-auto font-arabic leading-relaxed">
                {t.sections.transportDarijaText}
              </p>
            </div>
          </div>
          
          {/* Solution Section */}
          <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 p-8 rounded-r-lg mb-16">
            <div className="text-center">
              <h3 className="font-mono text-2xl font-bold mb-4 text-green-700 dark:text-green-400">{t.sections.transportSolution}</h3>
              <p className="text-green-600 dark:text-green-300 text-lg max-w-4xl mx-auto">
                {t.sections.transportSolutionDesc}
              </p>
            </div>
          </div>
          
          <div className="text-center mb-16">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">{t.sections.transportHub}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.sections.transportDesc}
            </p>
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
          
          {/* Problem Section */}
          <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-8 rounded-r-lg mb-8">
            <div className="text-center">
              <h3 className="font-mono text-2xl font-bold mb-4 text-red-700 dark:text-red-400">{t.sections.documentProblem}</h3>
              <p className="text-red-600 dark:text-red-300 text-lg max-w-4xl mx-auto">
                {t.sections.documentProblemDesc}
              </p>
            </div>
          </div>
          
          {/* Darija Explanation Section */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-8 rounded-r-lg mb-8">
            <div className="text-center">
              <h3 className="font-mono text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">{t.sections.documentDarijaExplanation}</h3>
              <p className="text-blue-600 dark:text-blue-300 text-xl max-w-4xl mx-auto font-arabic leading-relaxed">
                {t.sections.documentDarijaText}
              </p>
            </div>
          </div>
          
          {/* Solution Section */}
          <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 p-8 rounded-r-lg mb-16">
            <div className="text-center">
              <h3 className="font-mono text-2xl font-bold mb-4 text-green-700 dark:text-green-400">{t.sections.documentSolution}</h3>
              <p className="text-green-600 dark:text-green-300 text-lg max-w-4xl mx-auto">
                {t.sections.documentSolutionDesc}
              </p>
            </div>
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

      {/* Daily Life Assistant Demo */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">DAILY.LIFE.ASSISTANT</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your personal companion for everyday questions and decisions
            </p>
          </div>
          
          {/* Problem Section */}
          <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-8 rounded-r-lg mb-8">
            <div className="text-center">
              <h3 className="font-mono text-2xl font-bold mb-4 text-red-700 dark:text-red-400">{t.sections.dailyLifeProblem}</h3>
              <p className="text-red-600 dark:text-red-300 text-lg max-w-4xl mx-auto">
                {t.sections.dailyLifeProblemDesc}
              </p>
            </div>
          </div>
          
          {/* Darija Explanation Section */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-8 rounded-r-lg mb-8">
            <div className="text-center">
              <h3 className="font-mono text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">{t.sections.dailyLifeDarijaExplanation}</h3>
              <p className="text-blue-600 dark:text-blue-300 text-xl max-w-4xl mx-auto font-arabic leading-relaxed">
                {t.sections.dailyLifeDarijaText}
              </p>
            </div>
          </div>
          
          {/* Solution Section */}
          <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 p-8 rounded-r-lg mb-16">
            <div className="text-center">
              <h3 className="font-mono text-2xl font-bold mb-4 text-green-700 dark:text-green-400">{t.sections.dailyLifeSolution}</h3>
              <p className="text-green-600 dark:text-green-300 text-lg max-w-4xl mx-auto">
                {t.sections.dailyLifeSolutionDesc}
              </p>
            </div>
          </div>
          
          {/* Daily Life Categories with Alternating Layout */}
          <div className="space-y-16">
            
            {/* 1. Cooking & Recipes - Left Description, Right Demo */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">🍳</div>
                  <h3 className="font-mono text-2xl font-bold">COOKING & RECIPES</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  Turn your available ingredients into delicious meals. Get traditional Algerian recipes, cooking tips, dietary advice, and creative solutions for what's in your kitchen right now.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Recipe suggestions with available ingredients
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Traditional Algerian dishes and modern twists
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Dietary restrictions and healthy alternatives
                  </div>
                </div>
              </div>
              <div className="bg-muted border-2 border-foreground rounded-lg overflow-hidden">
                <div className="bg-foreground text-background p-3 font-mono font-bold text-sm">
                  شريكي CHRIKI - Cooking Assistant
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-foreground text-background p-3 rounded-lg max-w-xs shadow-md">
                      <div className="text-sm font-medium" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.5'}}>
                        عندي طماطم وبصل وبيض، واش نطبخ؟
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-background border border-border p-3 rounded-lg max-w-xs shadow-md">
                      <div className="text-sm space-y-2">
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">شكشوكة جزائرية:</strong> <span className="text-foreground/80">قلي البصل في زيت الزيتون، زيدي الطماطم والفلفل الحار، خليها تطبخ 10 دقائق، ثم كسري البيض فوقها</span></div>
                        </div>
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">عجة بالخضار:</strong> <span className="text-foreground/80">اضربي 4 بيضات مع ملح وفلفل أسود، قلي البصل والطماطم واخلطيهم مع البيض</span></div>
                        </div>
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">نصيحة:</strong> <span className="text-foreground/80">زيدي شوية جبن وبقدونس على العجة قبل ما تطويها</span></div>
                        </div>
                        <div className="text-muted-foreground text-center mt-3 pt-2 border-t border-border/50" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          بالهناء والشفاء! وقت الطبخ 15 دقيقة
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Health & Wellness - Right Description, Left Demo */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-muted border-2 border-foreground rounded-lg overflow-hidden lg:order-1">
                <div className="bg-foreground text-background p-3 font-mono font-bold text-sm">
                  شريكي CHRIKI - Health Assistant
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-foreground text-background p-3 rounded-lg max-w-xs shadow-md">
                      <div className="text-sm font-medium" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.5'}}>
                        عندي صداع ومتعب، واش نعمل؟
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-background border border-border p-3 rounded-lg max-w-xs shadow-md">
                      <div className="text-sm space-y-2">
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">اشربي ماء كثير:</strong> <span className="text-foreground/80">3-4 أكواب ماء، واحد على الريق كل 30 دقيقة. الجفاف سبب رئيسي للصداع</span></div>
                        </div>
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">استريحي في مكان هادئ:</strong> <span className="text-foreground/80">اقفلي النور واتركي التليفون. حطي كمادة باردة على رأسك وجبهتك</span></div>
                        </div>
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">علامات خطر:</strong> <span className="text-foreground/80">إذا الصداع شديد أو مع حمى أو غثيان، روحي للطبيب فوراً</span></div>
                        </div>
                        <div className="text-muted-foreground text-center mt-3 pt-2 border-t border-border/50" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          الله يشافيك! إذا ما تحسنتيش في 24 ساعة، استشيري طبيب
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:order-2">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">🏥</div>
                  <h3 className="font-mono text-2xl font-bold">HEALTH & WELLNESS</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  Get reliable health guidance for everyday symptoms and wellness questions. Understand when to rest, when to see a doctor, and how to maintain good health habits.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Symptom assessment and first aid advice
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    When to seek professional medical help
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Mental health support and wellness tips
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Learning & Education - Left Description, Right Demo */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">📚</div>
                  <h3 className="font-mono text-2xl font-bold">LEARNING & EDUCATION</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  Accelerate your learning journey with personalized study plans, skill development guidance, and career advice. From languages to technical skills, we'll help you grow.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Language learning strategies and resources
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Study techniques and exam preparation
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Career guidance and skill development
                  </div>
                </div>
              </div>
              <div className="bg-muted border-2 border-foreground rounded-lg overflow-hidden">
                <div className="bg-foreground text-background p-3 font-mono font-bold text-sm">
                  شريكي CHRIKI - Learning Assistant
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-foreground text-background p-3 rounded-lg max-w-xs shadow-md">
                      <div className="text-sm font-medium" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.5'}}>
                        بغيت نتعلم الانجليزية، كيفاش نبدا؟
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-background border border-border p-3 rounded-lg max-w-xs shadow-md">
                      <div className="text-sm space-y-2">
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">تطبيقات مجانية:</strong> <span className="text-foreground/80">Duolingo (للمفردات)، Busuu (للمحادثة)، HelloTalk (للتحدث مع أشخاص حقيقيين)</span></div>
                        </div>
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">ابدئي بالمسلسلات:</strong> <span className="text-foreground/80">Friends, The Office بترجمة عربية أولاً، ثم بترجمة إنجليزية، ثم بدون ترجمة</span></div>
                        </div>
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">قراءة يومية:</strong> <span className="text-foreground/80">BBC Learning English, VOA Learning English - مقالات قصيرة 5 دقائق</span></div>
                        </div>
                        <div className="text-muted-foreground text-center mt-3 pt-2 border-t border-border/50" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          خطة 3 أشهر: الشهر الأول مفردات، الثاني جمل، الثالث محادثة
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Time & Productivity - Right Description, Left Demo */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-muted border-2 border-foreground rounded-lg overflow-hidden lg:order-1">
                <div className="bg-foreground text-background p-3 font-mono font-bold text-sm">
                  شريكي CHRIKI - Productivity Assistant
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-foreground text-background p-3 rounded-lg max-w-xs shadow-md">
                      <div className="text-sm font-medium" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.5'}}>
                        ما نقدرش ننظم وقتي، كيفاش؟
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-background border border-border p-3 rounded-lg max-w-xs shadow-md">
                      <div className="text-sm space-y-2">
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">روتين الصباح:</strong> <span className="text-foreground/80">قومي في نفس الوقت، اكتبي 3 مهام مهمة لليوم. ابدئي بالأصعب أولاً</span></div>
                        </div>
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">تقنية بومودورو:</strong> <span className="text-foreground/80">25 دقيقة تركيز كامل + 5 دقائق راحة. بعد 4 جلسات، راحة 30 دقيقة</span></div>
                        </div>
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">قانون الهاتف:</strong> <span className="text-foreground/80">حطيه في غرفة ثانية وقت الشغل. استعملي تطبيق Focus لحجب المواقع</span></div>
                        </div>
                        <div className="text-muted-foreground text-center mt-3 pt-2 border-t border-border/50" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          العادة تتكون في 21 يوم. ابدئي بعادة واحدة فقط!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:order-2">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">⏰</div>
                  <h3 className="font-mono text-2xl font-bold">TIME & PRODUCTIVITY</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  Master your time and boost productivity with proven techniques. Learn to prioritize, focus, and build habits that help you achieve your goals efficiently.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Daily planning and priority setting
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Focus techniques and distraction management
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Habit building and work-life balance
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Money & Budgeting - Left Description, Right Demo */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">💰</div>
                  <h3 className="font-mono text-2xl font-bold">MONEY & BUDGETING</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  Take control of your finances with practical budgeting advice, saving strategies, and investment guidance tailored to your situation and goals.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Budget planning and expense tracking
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Saving strategies and emergency funds
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Investment basics and financial planning
                  </div>
                </div>
              </div>
              <div className="bg-muted border-2 border-foreground rounded-lg overflow-hidden">
                <div className="bg-foreground text-background p-3 font-mono font-bold text-sm">
                  شريكي CHRIKI - Finance Assistant
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-foreground text-background p-3 rounded-lg max-w-xs shadow-md">
                      <div className="text-sm font-medium" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.5'}}>
                        كيفاش نوفر فلوس من راتبي؟
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-background border border-border p-3 rounded-lg max-w-xs shadow-md">
                      <div className="text-sm space-y-2">
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">قاعدة 50/30/20:</strong> <span className="text-foreground/80">50% ضروريات (أكل، سكن، مواصلات)، 30% رغبات، 20% توفير واستثمار</span></div>
                        </div>
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">تتبع مصاريفك:</strong> <span className="text-foreground/80">استعملي تطبيق Money Manager أو اكتبي في دفتر. سجلي كل مصروف فور ما تعمليه</span></div>
                        </div>
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">استراتيجية التوفير:</strong> <span className="text-foreground/80">حولي تلقائياً 10% من راتبك لحساب منفصل. ابدئي بصندوق طوارئ = 3 شهور مصاريف</span></div>
                        </div>
                        <div className="text-muted-foreground text-center mt-3 pt-2 border-t border-border/50" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          المال المحفوظ نصف المال المكسوب! ابدئي بمبلغ بسيط
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Problem Solving - Right Description, Left Demo */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-muted border-2 border-foreground rounded-lg overflow-hidden lg:order-1">
                <div className="bg-foreground text-background p-3 font-mono font-bold text-sm">
                  شريكي CHRIKI - Problem Solver
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-foreground text-background p-3 rounded-lg max-w-xs shadow-md">
                      <div className="text-sm font-medium" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.5'}}>
                        الواي فاي ما يخدمش، واش نعمل؟
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-background border border-border p-3 rounded-lg max-w-xs shadow-md">
                      <div className="text-sm space-y-2">
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">أعيدي تشغيل الراوتر:</strong> <span className="text-foreground/80">افصلي الراوتر 30 ثانية، ثم شغليه. انتظري 2-3 دقائق باش يبدأ يشتغل</span></div>
                        </div>
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">تحققي من الإشارة:</strong> <span className="text-foreground/80">اقتربي من الراوتر، تأكدي من الأجهزة الأخرى. جربي نقطة اتصال هاتفك</span></div>
                        </div>
                        <div className="flex items-start gap-2" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          <div><strong className="text-primary">اتصلي بالدعم الفني:</strong> <span className="text-foreground/80">إذا ما اشتغلش بعد هذه الخطوات، اتصلي بمزود الخدمة وقوليلهم الخطوات اللي عملتيها</span></div>
                        </div>
                        <div className="text-muted-foreground text-center mt-3 pt-2 border-t border-border/50" dir="rtl" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                          90% من مشاكل الواي فاي تتحل بإعادة التشغيل!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:order-2">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">🔧</div>
                  <h3 className="font-mono text-2xl font-bold">PROBLEM SOLVING</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  Get step-by-step solutions for everyday problems. From tech troubleshooting to DIY fixes, creative thinking, and decision-making support.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Tech troubleshooting and device fixes
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    DIY solutions and home repairs
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Decision-making frameworks and creative solutions
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

      {/* Business Model */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 border-t-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix text-green-800">{t.sections.businessModel}</h2>
            <p className="text-lg text-green-700 max-w-2xl mx-auto">
              {t.sections.businessModelDesc}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Revenue Streams */}
            <div className="space-y-8">
              <h3 className="font-mono text-2xl font-bold mb-6 text-green-800">{t.sections.revenueStreams}</h3>
              
              <div className="space-y-6">
                {[
                  {
                    icon: "🤝",
                    title: t.sections.partnershipCommissions,
                    description: t.sections.partnershipDesc,
                    examples: ["Herd Academy courses", "Jumia products", "Ouedkniss marketplace"]
                  },
                  {
                    icon: "🏢",
                    title: t.sections.customerService,
                    description: t.sections.customerServiceDesc,
                    examples: ["Custom AI instructions", "Brand integration", "Analytics dashboard"]
                  },
                  {
                    icon: "🎯",
                    title: t.sections.smartRecommendations,
                    description: t.sections.smartRecommendationsDesc,
                    examples: ["Interest tracking", "Personalized suggestions", "Privacy-first approach"]
                  },
                  {
                    icon: "⭐",
                    title: t.sections.sponsoredPartners,
                    description: t.sections.sponsoredPartnersDesc,
                    examples: ["Djezzy premium placement", "Local brand visibility", "Targeted advertising"]
                  }
                ].map((stream, index) => (
                  <div key={index} className="bg-white border-2 border-green-200 rounded-lg p-6 shadow-lg">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{stream.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-mono font-bold text-lg mb-2 text-green-800">{stream.title}</h4>
                        <p className="text-green-700 mb-4">{stream.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {stream.examples.map((example, i) => (
                            <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-mono">
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Model Visualization */}
            <div className="bg-white border-2 border-green-200 rounded-lg p-8 shadow-lg">
              <h3 className="font-mono text-xl font-bold mb-6 text-green-800 text-center">Revenue Flow Examples</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Course Example */}
                <div className="space-y-4">
                  <h4 className="font-mono text-sm font-bold text-green-700 text-center">Course Recommendation</h4>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-3">
                        <div className="text-xl mb-1">👤</div>
                        <div className="font-mono text-xs text-blue-800">"Kifash nta3lam video editing?"</div>
                      </div>
                      <div className="text-lg text-green-600">↓</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-3">
                        <div className="text-xl mb-1">🤖</div>
                        <div className="font-mono text-xs text-purple-800">CHRIKI saves: "video editing interest"</div>
                      </div>
                      <div className="text-lg text-green-600">↓</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-3">
                        <div className="text-xl mb-1">💡</div>
                        <div className="font-mono text-xs text-orange-800">Recommends Herd Academy course</div>
                      </div>
                      <div className="text-lg text-green-600">↓</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3">
                        <div className="text-xl mb-1">💰</div>
                        <div className="font-mono text-xs text-green-800">15% commission earned</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone Example */}
                <div className="space-y-4">
                  <h4 className="font-mono text-sm font-bold text-green-700 text-center">Product Recommendation</h4>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-3">
                        <div className="text-xl mb-1">👤</div>
                        <div className="font-mono text-xs text-blue-800">"Wach kayen telephone b 30000 DA?"</div>
                      </div>
                      <div className="text-lg text-green-600">↓</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-3">
                        <div className="text-xl mb-1">🤖</div>
                        <div className="font-mono text-xs text-purple-800">CHRIKI saves: "phone budget 30k DA"</div>
                      </div>
                      <div className="text-lg text-green-600">↓</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-3">
                        <div className="text-xl mb-1">📱</div>
                        <div className="font-mono text-xs text-orange-800">Shows Jumia/Ouedkniss phones</div>
                      </div>
                      <div className="text-lg text-green-600">↓</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3">
                        <div className="text-xl mb-1">💰</div>
                        <div className="font-mono text-xs text-green-800">5% commission on purchase</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sponsored Partners Chat Demo */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-8 shadow-lg mb-16">
            <div className="text-center mb-8">
              <h3 className="font-mono text-2xl font-bold text-yellow-800 mb-2">{t.sections.sponsoredExample}</h3>
              <p className="text-yellow-700 max-w-2xl mx-auto">{t.sections.sponsoredExampleDesc}</p>
            </div>

            {/* Chat Interface using same style as top demos */}
            <div className="max-w-4xl mx-auto h-[900px] flex flex-col">
              <div className="text-center mb-8 flex-shrink-0">
                <h3 className="font-mono text-xl font-bold mb-2">Sponsored Partners Demo</h3>
                <p className="text-muted-foreground text-sm">SIM Card Provider Query</p>
              </div>
              
              <div className="bg-background border-2 border-foreground rounded-lg overflow-hidden shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="bg-foreground text-background px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="font-mono font-bold text-sm">CHRIKI</div>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-xs font-mono opacity-80">// SPONSORED DEMO</div>
                  </div>
                </div>

                <div className="flex-1 p-4 space-y-4 bg-muted/20 min-h-[700px]">
                  {/* CHRIKI Welcome */}
                  <div className="flex justify-start">
                    <div className="bg-background border border-border px-4 py-3 rounded-lg max-w-[70%]">
                      <div className="text-sm whitespace-pre-line" dir="auto" style={{ textAlign: 'left' }}>
                        Ahla w sahla! Ana CHRIKI, kifach n3awnek?
                      </div>
                      <div className="text-xs mt-2 opacity-60 text-muted-foreground">
                        14:30
                      </div>
                    </div>
                  </div>

                  {/* User Question */}
                  <div className="flex justify-end">
                    <div className="bg-foreground text-background px-4 py-3 rounded-lg max-w-[70%]">
                      <div className="text-sm whitespace-pre-line" dir="auto" style={{ textAlign: 'left' }}>
                        Salam CHRIKI! What are some good SIM card providers in Algeria?
                      </div>
                      <div className="text-xs mt-2 opacity-60 text-background/80">
                        14:31
                      </div>
                    </div>
                  </div>

                  {/* CHRIKI Response with Sponsored Content */}
                  <div className="flex justify-start">
                    <div className="bg-background border border-border px-4 py-3 rounded-lg max-w-[85%]">
                      <div className="space-y-3">
                        {/* Sponsored Partner - Djezzy */}
                        <div className="bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300 rounded-lg p-3 relative">
                          <div className="absolute -top-2 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-mono">
                            ⭐ SPONSORED
                          </div>
                          <div className="pt-2">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-lg">📶</div>
                              <div className="font-mono text-sm font-bold text-red-800">Djezzy - Algeria's #1 Network</div>
                            </div>
                            <div className="text-sm text-red-700 mb-2">
                              "Best coverage across all 58 wilayas! Trusted by millions of Algerians 🇩🇿"
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-800">
                              <strong>Special Offer:</strong> 100GB + Unlimited calls for 2000 DA/month
                            </div>
                          </div>
                        </div>

                        {/* Regular Results */}
                        <div className="text-sm">
                          <div className="font-mono font-bold mb-2">📱 Other SIM providers in Algeria:</div>
                          <div className="space-y-2 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span>🟠</span>
                              <span><strong>Ooredoo</strong> - Good 4G coverage, competitive prices</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>🔵</span>
                              <span><strong>Mobilis</strong> - State-owned, reliable network</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>💡</span>
                              <span><em>All providers offer prepaid and postpaid options</em></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs mt-3 opacity-60 text-muted-foreground">
                        14:32
                      </div>
                    </div>
                  </div>

                  {/* User Follow-up */}
                  <div className="flex justify-end">
                    <div className="bg-foreground text-background px-4 py-3 rounded-lg max-w-[70%]">
                      <div className="text-sm whitespace-pre-line" dir="auto" style={{ textAlign: 'left' }}>
                        Choukran! The Djezzy offer looks interesting. How's their coverage in Algiers?
                      </div>
                      <div className="text-xs mt-2 opacity-60 text-background/80">
                        14:33
                      </div>
                    </div>
                  </div>

                  {/* CHRIKI Response about Djezzy */}
                  <div className="flex justify-start">
                    <div className="bg-background border border-border px-4 py-3 rounded-lg max-w-[70%]">
                      <div className="text-sm whitespace-pre-line" dir="auto" style={{ textAlign: 'left' }}>
                        Djezzy has excellent coverage in Algiers! 📶 They have the most 4G towers in the capital. Perfect for streaming, social media, and video calls. Their customer service is also available in Darija, Arabic, and French.
                      </div>
                      <div className="text-xs mt-2 opacity-60 text-muted-foreground">
                        14:34
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Revenue Explanation */}
            <div className="mt-8 bg-white border-2 border-yellow-200 rounded-lg p-6 shadow-lg">
              <div className="text-center">
                <h4 className="font-mono text-lg font-bold text-yellow-800 mb-4">💰 How Sponsored Partners Work</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="font-mono text-sm font-bold text-yellow-800">CONTEXTUAL MATCHING</div>
                    <div className="text-xs text-yellow-600">Restaurant query → Dining data plan<br/>School query → Student package</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">⭐</div>
                    <div className="font-mono text-sm font-bold text-yellow-800">PREMIUM PLACEMENT</div>
                    <div className="text-xs text-yellow-600">Sponsored content appears first<br/>Clearly labeled as "SPONSORED"</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">💰</div>
                    <div className="font-mono text-sm font-bold text-yellow-800">REVENUE GENERATION</div>
                    <div className="text-xs text-yellow-600">Partners pay for visibility<br/>CHRIKI stays free for users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hotel Sponsorship Demo - Separate Chat */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg p-8 shadow-lg mb-16">
            <div className="text-center mb-8">
              <h3 className="font-mono text-2xl font-bold text-blue-800 mb-2">Hotel Sponsorship Example</h3>
              <p className="text-blue-700 max-w-2xl mx-auto">See how hotels can sponsor relevant travel queries</p>
            </div>

            {/* Hotel Chat Interface */}
            <div className="max-w-4xl mx-auto h-[700px] flex flex-col">
              <div className="text-center mb-8 flex-shrink-0">
                <h3 className="font-mono text-xl font-bold mb-2">Hotel Booking Demo</h3>
                <p className="text-muted-foreground text-sm">Accommodation in Oran Query</p>
              </div>
              
              <div className="bg-background border-2 border-foreground rounded-lg overflow-hidden shadow-2xl flex-1 flex flex-col min-h-0">
                <div className="bg-foreground text-background px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="font-mono font-bold text-sm">CHRIKI</div>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-xs font-mono opacity-80">// HOTEL DEMO</div>
                  </div>
                </div>

                <div className="flex-1 p-4 space-y-4 bg-muted/20 min-h-[500px]">
                  {/* CHRIKI Welcome */}
                  <div className="flex justify-start">
                    <div className="bg-background border border-border px-4 py-3 rounded-lg max-w-[70%]">
                      <div className="text-sm whitespace-pre-line" dir="auto" style={{ textAlign: 'left' }}>
                        Ahla w sahla! Ana CHRIKI, kifach n3awnek?
                      </div>
                      <div className="text-xs mt-2 opacity-60 text-muted-foreground">
                        15:20
                      </div>
                    </div>
                  </div>

                  {/* User Hotel Question */}
                  <div className="flex justify-end">
                    <div className="bg-foreground text-background px-4 py-3 rounded-lg max-w-[70%]">
                      <div className="text-sm whitespace-pre-line" dir="auto" style={{ textAlign: 'left' }}>
                        Salam CHRIKI! Can you recommend good hotels in Oran?
                      </div>
                      <div className="text-xs mt-2 opacity-60 text-background/80">
                        15:21
                      </div>
                    </div>
                  </div>

                  {/* CHRIKI Response with Hotel Sponsored Content */}
                  <div className="flex justify-start">
                    <div className="bg-background border border-border px-4 py-3 rounded-lg max-w-[85%]">
                      <div className="space-y-3">
                        {/* Sponsored Partner - Rodina Hotel */}
                        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-lg p-3 relative">
                          <div className="absolute -top-2 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-mono">
                            ⭐ SPONSORED
                          </div>
                          <div className="pt-2">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-lg">🏨</div>
                              <div className="font-mono text-sm font-bold text-blue-800">Rodina Hotel - Premium Stay in Oran</div>
                            </div>
                            <div className="text-sm text-blue-700 mb-2">
                              "Experience luxury in the heart of Oran! Modern amenities with Algerian hospitality 🇩🇿"
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
                              <div className="flex items-center justify-between mb-1">
                                <span><strong>Rating:</strong> 4.8⭐ (1,247 reviews)</span>
                                <span><strong>📞</strong> +213 41 13 71 37</span>
                              </div>
                              <div className="text-blue-600">
                                <strong>Special Rate:</strong> 15,000 DA/night - Free breakfast & WiFi included!
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Regular Results */}
                        <div className="text-sm">
                          <div className="font-mono font-bold mb-2">🏨 Other hotels in Oran:</div>
                          <div className="space-y-2 text-muted-foreground">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span>🏨</span>
                                <span><strong>Hotel Sheraton Oran</strong> - 4.6⭐</span>
                              </div>
                              <span className="text-xs">📞 +213 41 59 02 59</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span>🏨</span>
                                <span><strong>Royal Hotel Oran</strong> - 4.3⭐</span>
                              </div>
                              <span className="text-xs">📞 +213 41 29 17 17</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs mt-3 opacity-60 text-muted-foreground">
                        15:22
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>
          
          {/* Sustainable Growth */}
          <div className="text-center bg-white border-2 border-green-200 rounded-lg p-8 shadow-lg">
            <h3 className="font-mono text-2xl font-bold mb-4 text-green-800">{t.sections.sustainableGrowth}</h3>
            <p className="text-green-700 max-w-3xl mx-auto mb-6">{t.sections.sustainableGrowthDesc}</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🆓</div>
                <div className="font-mono text-sm font-bold text-green-800">FREE CORE SERVICES</div>
                <div className="text-xs text-green-600">Always accessible to all</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <div className="font-mono text-sm font-bold text-green-800">SCALABLE REVENUE</div>
                <div className="text-xs text-green-600">Grows with user base</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🤝</div>
                <div className="font-mono text-sm font-bold text-green-800">WIN-WIN PARTNERSHIPS</div>
                <div className="text-xs text-green-600">Value for all stakeholders</div>
              </div>
            </div>
          </div>
          
          {/* Darija Explanation with Visual Connections */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-8 shadow-lg relative">
            <div className="text-center mb-8">
              <h3 className="font-mono text-xl font-bold text-blue-800 mb-2">CHRIKI.EXPLAINS.IN.DARIJA</h3>
              <div className="w-16 h-1 bg-blue-500 mx-auto"></div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 relative">
              {/* Phone Revenue Explanation */}
              <div className="relative">
                <div className="bg-white border-2 border-orange-300 rounded-lg p-4 shadow-lg relative">
                  <div className="absolute -top-3 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-mono">
                    📱 PHONE FLOW
                  </div>
                  <div className="pt-4 text-sm leading-relaxed text-orange-900" dir="rtl">
                    <p className="mb-3">
                      <strong>مثال التليفون:</strong><br/>
                      تسقسي: "واش كاين تليفون مليح ب 30 ألف؟"
                    </p>
                    <p className="mb-3">
                      شريكي يحفظ إنك تحب التليفونات ويقترحلك من جوميا ولا ويدكنيس.
                    </p>
                    <p className="text-green-700 font-bold">
                      كي تشري → شريكي ياخد 5% عمولة
                    </p>
                  </div>
                </div>
                
                {/* Connecting Line to Phone Flow */}
                <div className="hidden lg:block absolute -top-32 left-1/2 transform -translate-x-1/2">
                  <div className="w-0.5 h-24 bg-gradient-to-b from-orange-400 to-orange-600 relative">
                    <div className="absolute -top-2 -left-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-2 -left-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Course Revenue Explanation */}
              <div className="relative">
                <div className="bg-white border-2 border-purple-300 rounded-lg p-4 shadow-lg relative">
                  <div className="absolute -top-3 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-mono">
                    🎓 COURSE FLOW
                  </div>
                  <div className="pt-4 text-sm leading-relaxed text-purple-900" dir="rtl">
                    <p className="mb-3">
                      <strong>مثال الكورسات:</strong><br/>
                      تسقسي: "كيفاش نتعلم المونتاج؟"
                    </p>
                    <p className="mb-3">
                      شريكي يقترحلك كورس من هيرد أكاديمي ولا منصات أخرى.
                    </p>
                    <p className="text-green-700 font-bold">
                      كي تسجل → شريكي ياخد 15% عمولة
                    </p>
                  </div>
                </div>
                
                {/* Connecting Line to Course Flow */}
                <div className="hidden lg:block absolute -top-32 left-1/2 transform -translate-x-1/2">
                  <div className="w-0.5 h-24 bg-gradient-to-b from-purple-400 to-purple-600 relative">
                    <div className="absolute -top-2 -left-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-2 -left-1 w-3 h-3 bg-purple-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* B2B Service Explanation */}
              <div className="relative">
                <div className="bg-white border-2 border-green-300 rounded-lg p-4 shadow-lg relative">
                  <div className="absolute -top-3 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-mono">
                    🏢 B2B SERVICE
                  </div>
                  <div className="pt-4 text-sm leading-relaxed text-green-900" dir="rtl">
                    <p className="mb-3">
                      <strong>خدمة الشركات:</strong><br/>
                      الشركات تدفع باش شريكي يخدم زبائنها.
                    </p>
                    <p className="mb-3">
                      يجاوب بالدارجة ويحل مشاكل العملاء حسب تعليمات الشركة.
                    </p>
                    <p className="text-green-700 font-bold">
                      اشتراك شهري → دخل ثابت
                    </p>
                  </div>
                </div>
                
                {/* Connecting Line to B2B Service */}
                <div className="hidden lg:block absolute -top-32 left-1/2 transform -translate-x-1/2">
                  <div className="w-0.5 h-24 bg-gradient-to-b from-green-400 to-green-600 relative">
                    <div className="absolute -top-2 -left-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-2 -left-1 w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Central Summary */}
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="bg-white border-2 border-blue-300 rounded-lg p-6 shadow-inner relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-mono">
                  💡 الخلاصة
                </div>
                <div className="pt-4 text-center text-blue-900" dir="rtl">
                  <p className="text-lg mb-4">
                    كلشي يربح: إنت تاخد المساعدة، الشركات تخدم زبائنها مليح، وشريكي يربح باش يبقى مجاني للكل.
                  </p>
                  <div className="text-sm text-blue-700 font-mono bg-blue-50 p-3 rounded-lg">
                    خدمات مجانية للشعب + أرباح من الشراكات = نجاح للجميع 🚀
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Circuit Lines */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 800 400">
                <defs>
                  <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.3"/>
                  </linearGradient>
                </defs>
                <path d="M 100 80 Q 400 60 700 80" stroke="url(#circuitGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
                </path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Live Recommendation Demo */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">LIVE.RECOMMENDATION.DEMO</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how CHRIKI identifies interests and makes smart recommendations in real conversations
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Phone Recommendation Demo */}
            <div className="bg-background border-2 border-foreground rounded-lg overflow-hidden">
              <div className="bg-foreground text-background p-4 font-mono font-bold flex items-center">
                <span className="mr-2">📱</span>
                Phone Recommendation Demo
              </div>
              <div className="p-6 space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-foreground text-background p-3 rounded-lg max-w-xs font-mono text-sm">
                    "Salam CHRIKI, wach kayen telephone mlieh b 30000 DA? Ana student w nheb gaming"
                  </div>
                </div>
                
                {/* CHRIKI Response */}
                <div className="flex justify-start">
                  <div className="bg-card border border-border p-4 rounded-lg max-w-md">
                    <div className="font-mono font-bold text-sm mb-2">CHRIKI:</div>
                    <div className="text-sm space-y-3">
                      <p>"Ahlan! Ana fahamt belli theb gaming w 3andek budget 30k DA. Hadi ahsan phones li naqtarhom:"</p>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-muted border border-border rounded-lg">
                          <div className="font-bold">🎮 Xiaomi Redmi Note 12</div>
                          <div className="text-xs text-muted-foreground mb-2">Perfect for gaming students</div>
                          <div className="text-sm text-muted-foreground mb-2">• Snapdragon processor • 6GB RAM • 5000mAh battery</div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-green-600">28,500 DA</span>
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Jumia</span>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-muted border border-border rounded-lg">
                          <div className="font-bold">🎮 Samsung Galaxy A34</div>
                          <div className="text-xs text-muted-foreground mb-2">Great display for gaming</div>
                          <div className="text-sm text-muted-foreground mb-2">• AMOLED screen • 8GB RAM • Fast charging</div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-green-600">29,900 DA</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Ouedkniss</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-2">💡 CHRIKI saves your interests:</div>
                        <div className="flex flex-wrap gap-1">
                          <span className="bg-card border border-border px-2 py-1 rounded-full text-xs">Gaming phones</span>
                          <span className="bg-card border border-border px-2 py-1 rounded-full text-xs">30k budget</span>
                          <span className="bg-card border border-border px-2 py-1 rounded-full text-xs">Student</span>
                        </div>
                      </div>
                      
                      <button className="w-full bg-foreground text-background p-2 rounded text-sm font-mono hover:opacity-80 transition-opacity">
                        🛒 View on Partner Sites
                      </button>
                    </div>
                  </div>
                </div>

                {/* Revenue Indicator */}
                <div className="text-center">
                  <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-mono">
                    💰 5% commission earned on purchase
                  </div>
                </div>
              </div>
            </div>

            {/* Course Recommendation Demo */}
            <div className="bg-background border-2 border-foreground rounded-lg overflow-hidden">
              <div className="bg-foreground text-background p-4 font-mono font-bold flex items-center">
                <span className="mr-2">🎓</span>
                Course Recommendation Demo
              </div>
              <div className="p-6 space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-foreground text-background p-3 rounded-lg max-w-xs font-mono text-sm">
                    "CHRIKI, ana nheb nta3lam video editing bach n3amel content f social media"
                  </div>
                </div>
                
                {/* CHRIKI Response */}
                <div className="flex justify-start">
                  <div className="bg-card border border-border p-4 rounded-lg max-w-md">
                    <div className="font-mono font-bold text-sm mb-2">CHRIKI:</div>
                    <div className="text-sm space-y-3">
                      <p>"Marhaba! Video editing w social media content - hadi domain mlieh! Hado ahsan courses li naqtarhom:"</p>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-muted border border-border rounded-lg">
                          <div className="font-bold">🎬 Complete Video Editing Mastery</div>
                          <div className="text-xs text-muted-foreground mb-2">Herd Academy - Arabic Content</div>
                          <div className="text-sm text-muted-foreground mb-2">• Adobe Premiere Pro • After Effects • Social Media Optimization</div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-green-600">15,000 DA</span>
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Certificate</span>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-muted border border-border rounded-lg">
                          <div className="font-bold">📱 Social Media Content Creation</div>
                          <div className="text-xs text-muted-foreground mb-2">Local Academy Partner</div>
                          <div className="text-sm text-muted-foreground mb-2">• Mobile editing • Instagram Reels • TikTok strategies</div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-green-600">8,500 DA</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Beginner</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-2">💡 CHRIKI saves your interests:</div>
                        <div className="flex flex-wrap gap-1">
                          <span className="bg-card border border-border px-2 py-1 rounded-full text-xs">Video editing</span>
                          <span className="bg-card border border-border px-2 py-1 rounded-full text-xs">Social media</span>
                          <span className="bg-card border border-border px-2 py-1 rounded-full text-xs">Content creation</span>
                        </div>
                      </div>
                      
                      <button className="w-full bg-foreground text-background p-2 rounded text-sm font-mono hover:opacity-80 transition-opacity">
                        📚 Enroll Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Revenue Indicator */}
                <div className="text-center">
                  <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-mono">
                    💰 15% commission earned on enrollment
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Demo Insights */}
          <div className="mt-12 bg-background border-2 border-foreground rounded-lg p-8">
            <h3 className="font-mono text-xl font-bold text-center mb-6">HOW.IT.WORKS</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">👂</span>
                </div>
                <h4 className="font-mono text-sm font-bold mb-2">LISTEN</h4>
                <p className="text-xs text-muted-foreground">CHRIKI analyzes conversation context and identifies user interests</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🧠</span>
                </div>
                <h4 className="font-mono text-sm font-bold mb-2">UNDERSTAND</h4>
                <p className="text-xs text-muted-foreground">AI processes preferences, budget, and specific needs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🎯</span>
                </div>
                <h4 className="font-mono text-sm font-bold mb-2">RECOMMEND</h4>
                <p className="text-xs text-muted-foreground">Suggests relevant products/courses from trusted partners</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">💰</span>
                </div>
                <h4 className="font-mono text-sm font-bold mb-2">EARN</h4>
                <p className="text-xs text-muted-foreground">Commission earned helps keep CHRIKI free for everyone</p>
              </div>
            </div>
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