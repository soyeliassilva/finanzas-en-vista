
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SimulatorProvider } from "./context/SimulatorContext";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

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
            <Route path="/simulacion" element={<Index step="simulacion" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SimulatorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
