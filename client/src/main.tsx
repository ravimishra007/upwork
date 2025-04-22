// Import proxy first to intercept all API calls
import "./services/proxy";
// Import queryClient next to set up React Query
import "./lib/queryClient";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize - this will load our client-side database solution
console.log("Starting application with client-side database access");

createRoot(document.getElementById("root")!).render(<App />);
