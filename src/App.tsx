
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SimulatorProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/productos" element={<Index step="productos" />} />
            <Route path="/simulacion" element={<Navigate to={preserveUrlParams("/simulacion/form")} replace />} />
            <Route path="/simulacion/form" element={<Index step="simulacion-form" />} />
            <Route path="/simulacion/results" element={<Index step="simulacion-results" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SimulatorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
