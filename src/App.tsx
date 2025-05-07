
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SimulatorProvider } from "./context/SimulatorContext";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import SimulationFormPage from "./pages/SimulationFormPage";
import SimulationResultsPage from "./pages/SimulationResultsPage";
import { preserveUrlParams } from "./utils/urlParamsUtils";
import { useIframeResizer } from "./hooks/useIframeResizer";

const queryClient = new QueryClient();

// Component that uses the iframe resizer hook
const IframeAwareApp = () => {
  useIframeResizer();
  
  return (
    <>
      <TooltipProvider>
        <SimulatorProvider>
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
      </TooltipProvider>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <IframeAwareApp />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
