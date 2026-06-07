import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./Context/AuthContext.jsx";
import {GoogleOAuthProvider} from '@react-oauth/google';
import { SearchProvider } from "./Context/SearchContext.jsx";
import { BookProvider } from "./Context/BookContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { SettingsProvider } from "./Context/SettingsContext.jsx";

const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
<BrowserRouter>
<GoogleOAuthProvider clientId="686398180692-befspvm99depc2035iv1o4e1clv7tl26.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <SettingsProvider>
        <SearchProvider>
                <BookProvider>
                    <App />
                </BookProvider>
        </SearchProvider>
        </SettingsProvider>
    </AuthProvider>
    </QueryClientProvider>
</GoogleOAuthProvider>
</BrowserRouter>
);
