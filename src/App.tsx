import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import TopicsPage from "./pages/TopicsPage";
import ComparePage from "./pages/ComparePage";
import UnderstandingPage from "./pages/UnderstandingPage";
import ScriptureReaderPage from "./pages/ScriptureReaderPage";
import QueryDetailPage from "./pages/QueryDetailPage";
import TopicDetailPage from "./pages/TopicDetailPage";
import NotFound from "./pages/NotFound";
import AdminImport from "./pages/AdminImport";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Initialize theme on load
function ThemeInitializer() {
  useEffect(() => {
    const saved = localStorage.getItem('su-theme') || 'scriptura';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeInitializer />
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/results" element={<SearchResultsPage />} />
          <Route path="/query/:queryId" element={<QueryDetailPage />} />
          <Route path="/topic/:topicSlug" element={<TopicDetailPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/topics/:topicId" element={<TopicsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/understanding" element={<UnderstandingPage />} />
          <Route path="/read/:type" element={<ScriptureReaderPage />} />
          <Route path="/read/:type/:bookSlug" element={<ScriptureReaderPage />} />
          <Route path="/read/:type/:bookSlug/:chapter" element={<ScriptureReaderPage />} />
          <Route path="/scripture/:type" element={<ScriptureReaderPage />} />
          <Route path="/scripture/:type/:bookSlug" element={<ScriptureReaderPage />} />
          <Route path="/scripture/:type/:bookSlug/:chapter" element={<ScriptureReaderPage />} />
          <Route path="/admin/import" element={<AdminImport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
