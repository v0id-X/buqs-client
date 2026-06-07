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

const AppLoadingSkeleton = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-[#0f111a] flex flex-col p-6 animate-pulse transition-colors duration-300">
    <div className="flex justify-between items-center mb-8">
      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
      <div className="w-24 h-8 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
    </div>
    
    <div className="w-48 h-10 bg-slate-200 dark:bg-slate-800 rounded-md mb-6"></div>

    <div className="flex gap-3 mb-8">
      <div className="w-32 h-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
      <div className="w-24 h-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
    </div>

    <div className="flex flex-col gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="w-20 h-28 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          <div className="flex flex-col gap-2 flex-1">
            <div className="w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
            <div className="w-1/2 h-4 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <AppLoadingSkeleton />;

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
