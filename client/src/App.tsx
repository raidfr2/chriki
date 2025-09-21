import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/auth-context";
import { LocationProvider } from "./lib/location-context";
import { TutorialProvider } from "./lib/tutorial-context";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OnboardingRedirect } from "@/components/OnboardingRedirect";
import { useAccentColor } from "@/hooks/use-accent-color";
import Home from "@/pages/home";
import Presentation from "@/pages/presentation";
import Presentation2 from "@/pages/presentation2";
import Login from "@/pages/login";
import Chat from "@/pages/chat";
import Wraqi from "@/pages/wraqi";
import Tariqi from "@/pages/tariqi";
import ServiceDetail from './pages/service-detail';
import CategoryDetail from './pages/category-detail';
import Admin from "@/pages/admin";
import Onboarding from "@/pages/onboarding";
import NotFound from "@/pages/not-found";
import BrandIdentity from "@/pages/brand-identity";

function Router() {
  useAccentColor(); // Apply accent colors globally
  
  return (
    <OnboardingRedirect>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/presentation" component={Presentation} />
        <Route path="/presentation2" component={Presentation2} />
        <Route path="/login" component={Login} />
        <Route path="/chat" component={Chat} />
        <Route path="/wraqi" component={Wraqi} />
        <Route path="/wraqi/:id" component={ServiceDetail} />
        <Route path="/wraqi/categories/:categoryId" component={CategoryDetail} />
        <Route path="/tariqi" component={Tariqi} />
        <Route path="/admin">
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        </Route>
        <Route path="/brand-identity" component={BrandIdentity} />
        <Route path="/onboarding">
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </OnboardingRedirect>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocationProvider>
          <TutorialProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </TutorialProvider>
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
