import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./Context/AuthContext.jsx";
<<<<<<< HEAD
import {GoogleOAuthProvider} from '@react-oauth/google';
=======
import { GoogleOAuthProvider } from '@react-oauth/google';
>>>>>>> 3b7bbfc575a473ccae7774cdf0c2d30a47c2c566
import { SearchProvider } from "./Context/SearchContext.jsx";
import { BookProvider } from "./Context/BookContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { SettingsProvider } from "./Context/SettingsContext.jsx";

const queryClient = new QueryClient({
<<<<<<< HEAD
  defaultOptions:{
    queries:{
=======
  defaultOptions: {
    queries: {
>>>>>>> 3b7bbfc575a473ccae7774cdf0c2d30a47c2c566
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

<<<<<<< HEAD
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
=======
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={googleClientId}>
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
>>>>>>> 3b7bbfc575a473ccae7774cdf0c2d30a47c2c566
