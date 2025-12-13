import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "./pages/Home";
import AuthPage from "./pages/Auth";
import SearchPage from "./pages/Search";
import ReelsPage from "./pages/Reels";
import ProfilePage from "./pages/Profile";
import MessagesPage from "./pages/Messages";
import CreatePage from "./pages/Create";
import NotificationsPage from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/reels" element={<ReelsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:uid" element={<ProfilePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
