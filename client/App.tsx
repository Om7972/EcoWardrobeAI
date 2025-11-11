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
import FabricScanner from "./pages/FabricScanner";
import StyleCircles from "./pages/StyleCircles";
import ClosetCapsule from "./pages/ClosetCapsule";
import GarmentDetail from "./pages/GarmentDetail";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import GreenActionHub from "./pages/GreenActionHub";
import AIClimateAssistant from "./pages/AIClimateAssistant";
import EcoMarketplace from "./pages/EcoMarketplace";
import ImpactTracker from "./pages/ImpactTracker";
import EcoStore from "./pages/EcoStore";
import Community from "./pages/Community";
import AIServices from "./pages/AIServices";
import EcoStylist from "./pages/EcoStylist";
import ARFit from "./pages/ARFit";
import SwapEvents from "./pages/SwapEvents";
import FabricCare from "./pages/FabricCare";
import SustainabilityFeed from "./pages/SustainabilityFeed";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/closet" element={
              <ProtectedRoute>
                <VirtualCloset />
              </ProtectedRoute>
            } />
            <Route path="/outfit-generator" element={
              <ProtectedRoute>
                <OutfitGenerator />
              </ProtectedRoute>
            } />
            <Route path="/sustainability" element={
              <ProtectedRoute>
                <Sustainability />
              </ProtectedRoute>
            } />
            <Route path="/thrift-swap" element={
              <ProtectedRoute>
                <ThriftSwap />
              </ProtectedRoute>
            } />
            <Route path="/care-repair" element={
              <ProtectedRoute>
                <CareRepairHub />
              </ProtectedRoute>
            } />
            <Route path="/fabric-scanner" element={
              <ProtectedRoute>
                <FabricScanner />
              </ProtectedRoute>
            } />
            <Route path="/style-circles" element={
              <ProtectedRoute>
                <StyleCircles />
              </ProtectedRoute>
            } />
            <Route path="/closet-capsule" element={
              <ProtectedRoute>
                <ClosetCapsule />
              </ProtectedRoute>
            } />
            <Route path="/garment/:id" element={
              <ProtectedRoute>
                <GarmentDetail />
              </ProtectedRoute>
            } />
            <Route path="/green-action-hub" element={
              <ProtectedRoute>
                <GreenActionHub />
              </ProtectedRoute>
            } />
            <Route path="/ai-climate-assistant" element={
              <ProtectedRoute>
                <AIClimateAssistant />
              </ProtectedRoute>
            } />
            <Route path="/eco-marketplace" element={
              <ProtectedRoute>
                <EcoMarketplace />
              </ProtectedRoute>
            } />
            <Route path="/impact-tracker" element={
              <ProtectedRoute>
                <ImpactTracker />
              </ProtectedRoute>
            } />
            <Route path="/eco-store" element={
              <ProtectedRoute>
                <EcoStore />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } />
            <Route path="/ai-services" element={
              <ProtectedRoute>
                <AIServices />
              </ProtectedRoute>
            } />
            <Route path="/eco-stylist" element={
              <ProtectedRoute>
                <EcoStylist />
              </ProtectedRoute>
            } />
            <Route path="/ar-fit" element={
              <ProtectedRoute>
                <ARFit />
              </ProtectedRoute>
            } />
            <Route path="/swap-events" element={
              <ProtectedRoute>
                <SwapEvents />
              </ProtectedRoute>
            } />
            <Route path="/fabric-care" element={
              <ProtectedRoute>
                <FabricCare />
              </ProtectedRoute>
            } />
            <Route path="/sustainability-feed" element={
              <ProtectedRoute>
                <SustainabilityFeed />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}