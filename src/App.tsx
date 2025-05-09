
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SimulatorProvider } from "./context/SimulatorContext";
import { useAppInitializer } from "./hooks/useAppInitializer";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import { preserveUrlParams } from "./utils/urlParamsUtils";
import { useEffect } from "react";
import { useHeightManager } from "./hooks/useHeightManager";

const queryClient = new QueryClient();

// Route change listener to help with height management
const RouteChangeListener = () => {
  const location = useLocation();
  const { resetAllHeightUpdated } = useHeightManager();
  
  useEffect(() => {
    // Reset height update tracking on route change to ensure proper height updates
    resetAllHeightUpdated();
  }, [location.pathname, resetAllHeightUpdated]);
  
  return null;
};

// App wrapper to handle initialization
const AppContent = () => {
  // Initialize app and send 'init' message only (not current step)
  useAppInitializer();
  
  return (
    <SimulatorProvider>
      <RouteChangeListener />
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/productos" element={<Index step="productos" />} />
        <Route path="/simulacion" element={<Navigate to={preserveUrlParams("/simulacion/form")} replace />} />
        <Route path="/simulacion/form" element={<Index step="simulacion-form" />} />
        <Route path="/simulacion/results" element={<Index step="simulacion-results" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SimulatorProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
