import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/hooks/useSidebarToggle";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import Index from "./pages/Index.jsx";
import Auth from "./pages/Auth.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import BookDetails from "./pages/BookDetails.jsx";
import Library from "./pages/Library.jsx";
import Genre from "./pages/Genre.jsx";
import Notes from "./pages/Notes.jsx";
import NoteView from "./pages/NoteView.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useAuth } from "./Context/AuthContext.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import ForYou from "./pages/ForYou.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading....</div>;

  return user ? children : <Navigate to="/auth" />;
};

const App = () => (
  <ThemeProvider>
    <TooltipProvider>
      <SidebarProvider>
        <Sonner />
          <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/for-you" element={<ProtectedRoute><ForYou /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          <Route path="/notes/:id" element={<ProtectedRoute><NoteView /></ProtectedRoute>} />
          <Route path="/books/:isbn" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/genre/:slug" element={<ProtectedRoute><Genre /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SidebarProvider>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;