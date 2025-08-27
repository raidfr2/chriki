import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import TransportTimeline from "@/components/transport/TransportTimeline";
import { demoRoutePlan } from "@/lib/transportTypes";
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
                onClick={() => scrollToSection('problem')}
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                Challenge
              </button>
              <button 
                onClick={() => scrollToSection('demo')}
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                Demo
              </button>
              <button 
                onClick={() => scrollToSection('solution')}
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                Solution
              </button>
              <button 
                onClick={() => scrollToSection('impact')}
                className="text-sm font-medium hover:text-muted-foreground transition-colors"
              >
                Impact
              </button>
              <Link href="/chat">
                <Button className="font-mono font-bold tracking-wide">
                  TRY DEMO
                </Button>
              </Link>
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
              Your partner for daily life in Algeria
            </div>
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight mb-8">
                Your personal assistant for<br/>
                <span className="font-bold">navigating life in Algeria</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-12 leading-relaxed">
                Your trusted partner for government services, transportation,<br/>
                and daily needs - all in authentic Algerian dialect.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/chat">
                <Button 
                  size="lg" 
                  className="min-w-[200px] font-medium tracking-wide"
                >
                  TRY CHRIKI NOW
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => scrollToSection('demo')}
                className="min-w-[200px] font-medium tracking-wide border-2"
              >
                WATCH DEMO
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
        <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight">EVERYDAY.CONVERSATION</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Chat naturally in Darija about daily life - from weather to recipes to local advice
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <ChatDemo initialConversation={0} />
        
        <div className="space-y-6">
          <h3 className="font-mono text-2xl font-bold">AUTHENTIC.ALGERIAN.AI</h3>
          <p className="text-muted-foreground">
            CHRIKI understands context, humor, and cultural nuances unique to Algeria
          </p>
          
          <div className="space-y-4">
            {[
              {
                icon: "🗣️",
                title: "CODE.SWITCHING",
                description: "Seamlessly mix Darija, French, and Arabic - just like real conversations"
              },
              {
                icon: "🎭",
                title: "CULTURAL.CONTEXT",
                description: "Understands local expressions, proverbs, and Algerian humor"
              },
              {
                icon: "☕",
                title: "DAILY.COMPANION",
                description: "From morning coffee tips to evening TV recommendations"
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
            <div className="font-mono text-xs mb-2">SAMPLE.TOPICS</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>• Couscous recipes</div>
              <div>• Weather chat</div>
              <div>• Football banter</div>
              <div>• Family advice</div>
              <div>• Local traditions</div>
              <div>• Daily greetings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Local Knowledge Demo */}
    <div className="mb-20">
      <div className="text-center mb-8">
        <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight">LOCAL.KNOWLEDGE</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your encyclopedia of Algeria - from historical sites to the best local markets
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 space-y-6">
          <h3 className="font-mono text-2xl font-bold">ALGERIA.EXPERT.SYSTEM</h3>
          <p className="text-muted-foreground">
            Deep knowledge about every wilaya, city, and neighborhood in Algeria
          </p>
          
          <div className="bg-muted border-2 border-foreground rounded-lg overflow-hidden">
            <div className="bg-foreground text-background p-3 font-mono font-bold text-sm">
              🗺️ KNOWLEDGE.CATEGORIES
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 text-sm">
              {[
                { emoji: "🏛️", label: "Historical Sites", example: "Casbah, Timgad" },
                { emoji: "🍽️", label: "Local Cuisine", example: "Best bourek spots" },
                { emoji: "🛍️", label: "Markets & Souks", example: "El Harrach prices" },
                { emoji: "🎨", label: "Cultural Events", example: "Festival dates" },
                { emoji: "🏖️", label: "Tourism Spots", example: "Hidden beaches" },
                { emoji: "📚", label: "Education", example: "University info" }
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
            <div className="font-mono text-xs text-muted-foreground mb-2">COVERAGE.STATS</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Wilayas covered:</span>
                <span className="font-mono font-bold">58/58</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Local businesses:</span>
                <span className="font-mono font-bold">10,000+</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Cultural sites:</span>
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
        <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight">LOCATION.SERVICES</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Real-time location finder with Google Maps integration for essential services
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <ChatDemo initialConversation={2} />
        
        <div className="space-y-6">
          <h3 className="font-mono text-2xl font-bold">SMART.PROXIMITY.SEARCH</h3>
          <p className="text-muted-foreground">
            Find what you need, when you need it - with real-time availability
          </p>
          
          <div className="bg-background border-2 border-foreground rounded-lg overflow-hidden">
            <div className="bg-foreground text-background p-3 font-mono font-bold text-sm">
              📍 LOCATION.CAPABILITIES
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted rounded p-2">
                  <div className="font-bold mb-1">🏥 Emergency Services</div>
                  <div className="text-muted-foreground">24/7 hospitals, clinics</div>
                </div>
                <div className="bg-muted rounded p-2">
                  <div className="font-bold mb-1">💊 Pharmacies</div>
                  <div className="text-muted-foreground">Night duty rotation</div>
                </div>
                <div className="bg-muted rounded p-2">
                  <div className="font-bold mb-1">🏛️ Gov Offices</div>
                  <div className="text-muted-foreground">Working hours, queues</div>
                </div>
                <div className="bg-muted rounded p-2">
                  <div className="font-bold mb-1">🏪 Essential Shops</div>
                  <div className="text-muted-foreground">Groceries, utilities</div>
                </div>
              </div>
              
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Powered by</span>
                  <span className="font-mono font-bold">GOOGLE.MAPS.API</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Real-time availability status</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Integrated navigation & directions</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Queue times & peak hours</span>
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
             <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">TRANSPORT.HUB</h2>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
               Live routing and real-time data integration — currently in development
             </p>
           </div>
           
           <div className="grid lg:grid-cols-2 gap-12 items-start">
             {/* Presentation Copy */}
             <div className="order-2 lg:order-1 space-y-6">
               <h3 className="font-mono text-2xl font-bold">TRANSPORT.FEATURE.OVERVIEW</h3>
               <p className="text-muted-foreground">
                 Preview of the upcoming transport feature. The UI is ready; live routing and data connectors
                 are currently being integrated.
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                 <div className="bg-background border border-border rounded p-3">
                   <div className="font-mono text-xs opacity-60 mb-1">PLANNED.CAPABILITIES</div>
                   <ul className="list-disc pl-5 space-y-1">
                     <li>Real-time schedules and headways</li>
                     <li>Multimodal routing: walk, bus, tram</li>
                     <li>Cost-aware ETA and fare hints</li>
                     <li>Accessibility: step‑free and safer options</li>
                     <li>Arabic/Darija localization</li>
                     <li>Offline fallback for low-connectivity</li>
                   </ul>
                 </div>
                 <div className="bg-background border border-border rounded p-3">
                   <div className="font-mono text-xs opacity-60 mb-1">WHY.IT.MATTERS</div>
                   <ul className="list-disc pl-5 space-y-1">
                     <li>Reduce uncertainty: clearer departures and arrivals</li>
                     <li>Improve inclusivity: simple, local-language UI</li>
                     <li>Save costs: choose cheaper, faster combinations</li>
                     <li>Support critical trips: hospitals, admin offices, schools</li>
                   </ul>
                 </div>
               </div>
               <div className="bg-background border border-border rounded p-3 text-sm">
                 <div className="font-mono text-xs opacity-60 mb-1">NEXT.UPGRADES</div>
                 <ul className="list-disc pl-5 space-y-1">
                   <li>Responsive polish across mobile → desktop</li>
                   <li>Expandable cards with stop details</li>
                   <li>Improved accessibility (ARIA, keyboard nav)</li>
                   <li>Theme tokens for mode colors + small legend</li>
                   <li>Subtle hover/expand animations</li>
                 </ul>
               </div>
               <div className="flex flex-wrap gap-3">
                 <Button disabled aria-disabled="true" className="font-mono font-bold tracking-wide opacity-60 cursor-not-allowed">COMING SOON</Button>
               </div>
             </div>
 
             {/* Timeline Widget */}
             <div className="order-1 lg:order-2">
               <TransportTimeline plan={demoRoutePlan} />
             </div>
           </div>

           {/* MULTIMODAL.ROUTING Section */}
           <div className="mt-12">
             <h3 className="font-mono text-2xl font-bold mb-3">MULTIMODAL.ROUTING</h3>
             <p className="text-muted-foreground mb-6">
               Combines all transport options to find your fastest, cheapest route
             </p>
             
             <div className="grid lg:grid-cols-2 gap-6">
               <div className="bg-muted border border-border rounded-lg p-4 h-fit">
                 <div className="font-mono text-xs text-muted-foreground mb-3">TRANSPORT.COVERAGE</div>
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
                 <div className="font-mono text-xs mb-2">SMART.FEATURES</div>
                 <ul className="text-sm space-y-1">
                   <li>• Real-time arrival predictions</li>
                   <li>• Fare calculation & payment options</li>
                   <li>• Accessibility-friendly routes</li>
                   <li>• Crowd density indicators</li>
                 </ul>
               </div>
             </div>
           </div>
 
           {/* Transport Features */}
           <div className="mt-16 grid md:grid-cols-3 gap-8">
             {[
               {
                 icon: "🚌",
                 title: "REAL.TIME.BUSES",
                 description: "Live bus schedules, routes, and arrival times for all Alger lines"
               },
               {
                 icon: "🚊",
                 title: "TRAM.NETWORK",
                 description: "Complete tram system coverage with station information and connections"
               },
               {
                 icon: "🚇",
                 title: "METRO.INTEGRATION",
                 description: "Seamless metro navigation with transfer points and accessibility info"
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
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">DOCUMENT.SEARCH.DEMO</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how CHRIKI helps citizens find document requirements instantly
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Chat Interface Mockup */}
            <div className="bg-muted border-2 border-foreground rounded-lg overflow-hidden">
              <div className="bg-foreground text-background p-4 font-mono font-bold">
                شريكي CHRIKI - Document Assistant
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
                <h3 className="font-mono text-2xl font-bold mb-6">INTELLIGENT.DOCUMENT.SEARCH</h3>
                
                {/* Document Preview */}
                <div className="bg-background border-2 border-foreground rounded-lg overflow-hidden mb-8">
                  <div className="bg-foreground text-background p-3 font-mono font-bold text-sm">
                    📄 PASSPORT.REQUIREMENTS.PDF
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="text-xs font-mono text-muted-foreground">OFFICIAL GOVERNMENT DOCUMENT</div>
                    <div className="space-y-2 text-sm">
                      <div className="font-bold">Documents Required for Passport Application:</div>
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div className="flex justify-between border-b border-border pb-1">
                          <span>• CIN (National ID)</span>
                          <span className="text-green-600">✓ Required</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-1">
                          <span>• Birth Certificate</span>
                          <span className="text-green-600">✓ Required</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-1">
                          <span>• 2 ID Photos</span>
                          <span className="text-green-600">✓ Required</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-1">
                          <span>• Residence Proof</span>
                          <span className="text-green-600">✓ Required</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• Processing Fee</span>
                          <span className="text-blue-600">6000 DA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services Grid Preview */}
                <div className="bg-muted border-2 border-foreground rounded-lg overflow-hidden">
                  <div className="bg-foreground text-background p-3 font-mono font-bold text-sm">
                    🌐 GOVERNMENT.SERVICES.PORTAL
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: "🛂", title: "PASSPORT", status: "Available Online", hasButton: true, url: "https://passeport.interieur.gov.dz/Fr/Informations_Fr/Pi%c3%a8ces_a_Fournir" },
                        { icon: "🆔", title: "CIN RENEWAL", status: "In-Person Only" },
                        { icon: "🏠", title: "RESIDENCE CERT", status: "In-Person Only" },
                        { icon: "🚗", title: "DRIVING LICENSE", status: "Appointment Required" },
                        { icon: "📜", title: "BIRTH CERT", status: "Available Online", hasButton: true, url: "https://etatcivil.interieur.gov.dz/" },
                        { icon: "💼", title: "BUSINESS REG", status: "In-Person Only" }
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
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">LOCATION.SERVICES.DEMO</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find nearby services and get directions with Google Maps integration
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Location Features */}
            <div className="space-y-8">
              <div>
                <h3 className="font-mono text-2xl font-bold mb-6">SMART.LOCATION.FINDER</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: "🏥",
                      title: "HEALTHCARE.LOCATOR",
                      description: "Find hospitals, clinics, pharmacies with real-time availability"
                    },
                    {
                      icon: "🏛️",
                      title: "GOVERNMENT.OFFICES",
                      description: "Locate commune offices, passport bureaus, tax centers"
                    },
                    {
                      icon: "🗺️",
                      title: "GOOGLE.MAPS.INTEGRATION",
                      description: "Get directions, traffic updates, and estimated travel time"
                    },
                    {
                      icon: "📱",
                      title: "MOBILE.OPTIMIZED",
                      description: "Works perfectly on any device with location services"
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
                        🗺️ OPEN IN GOOGLE MAPS
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
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">FUTURE.ROADMAP</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Building the ultimate digital companion for Algerians
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🌐",
                title: "BUSINESS.PARTNERSHIPS",
                description: "Partner with local businesses like Jumia to recommend quality products based on user needs",
                tech: "// COMMERCE_API_v1.0"
              },
              {
                icon: "🚌",
                title: "TRANSPORT.HUB",
                description: "Navigate public transport in Algiers, Oran, Constantine with real-time information",
                tech: "// TRANSPORT_ENGINE_v1.0"
              },
              {
                icon: "🎫",
                title: "TICKET.BOOKING",
                description: "Reserve train tickets, check prices, and get travel information instantly",
                tech: "// BOOKING_SYSTEM_v1.0"
              },
              {
                icon: "👥",
                title: "COMMUNITY.FEATURES",
                description: "Connect citizens, share experiences, and build a supportive digital community",
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
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 tracking-tight dot-matrix">SOCIAL.IMPACT</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Empowering every Algerian citizen with digital accessibility
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="font-mono text-4xl font-bold mb-2">1M+</div>
              <div className="text-sm text-muted">CITIZENS REACHED</div>
              <div className="text-xs font-mono text-muted mt-1">// POTENTIAL_USERS</div>
            </div>
            
            <div className="text-center">
              <div className="font-mono text-4xl font-bold mb-2">80%</div>
              <div className="text-sm text-muted">TIME SAVED</div>
              <div className="text-xs font-mono text-muted mt-1">// EFFICIENCY_GAIN</div>
            </div>
            
            <div className="text-center">
              <div className="font-mono text-4xl font-bold mb-2">100%</div>
              <div className="text-sm text-muted">ACCESSIBILITY</div>
              <div className="text-xs font-mono text-muted mt-1">// UNIVERSAL_ACCESS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-6 tracking-tight dot-matrix">READY.TO.START?</h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 leading-relaxed">
              Experience شريكي CHRIKI and see how we're making technology accessible for every Algerian.<br/>
              Join the digital revolution in Algeria.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/chat">
                <Button 
                  size="lg" 
                  className="min-w-[250px] font-mono font-bold tracking-wide"
                >
                  TRY LIVE DEMO
                </Button>
              </Link>
              <Link href="/">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="min-w-[250px] font-mono font-bold tracking-wide border-2"
                >
                  LEARN MORE
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
                Empowering Algerians through Technology
              </p>
              <p className="text-sm text-muted">
                
              </p>
            </div>
            
            <div className="border-t border-muted pt-8">
              <div className="font-mono text-xs text-muted">
                2024 CHRIKI.AI - MADE.IN.ALGERIA.WITH.LOVE
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
