import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Sobre from "./pages/Sobre";
import Eixos from "./pages/Eixos";
import Publicacoes from "./pages/Publicacoes";
import Eventos from "./pages/Eventos";
import ProcessoSeletivo from "./pages/ProcessoSeletivo";
import Calendario from "./pages/Calendario";
import Contato from "./pages/Contato";
import Links from "./pages/Links";
import Conceitos from "./pages/Conceitos";
import Privacidade from "./pages/Privacidade";
import Cookies from "./pages/Cookies";
import Termos from "./pages/Termos";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AreaMembros from "./pages/AreaMembros";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/eixos" element={<Eixos />} />
          <Route path="/publicacoes" element={<Publicacoes />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/processo-seletivo" element={<ProcessoSeletivo />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/links" element={<Links />} />
          <Route path="/conceitos" element={<Conceitos />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/membros" 
            element={
              <ProtectedRoute>
                <AreaMembros />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
