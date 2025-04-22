// Import proxy first to intercept all API calls
import "./services/proxy";
// Import queryClient next to set up React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize - this will load our client-side database solution
console.log("Starting application with client-side database access");

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
