import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import VirtualCloset from "./pages/VirtualCloset";
import OutfitGenerator from "./pages/OutfitGenerator";
import Sustainability from "./pages/Sustainability";
import ThriftSwap from "./pages/ThriftSwap";
import CareRepairHub from "./pages/CareRepairHub";
import GarmentDetail from "./pages/GarmentDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/closet" element={<VirtualCloset />} />
            <Route path="/outfit-generator" element={<OutfitGenerator />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/thrift-swap" element={<ThriftSwap />} />
            <Route path="/garment/:id" element={<GarmentDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
