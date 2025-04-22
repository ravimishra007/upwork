import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import Footer from "@/components/footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Blog from "@/pages/blog";
import BlogDetail from "@/pages/blog-detail";
import Gallery from "@/pages/gallery";
import Analytics from "@/pages/analytics";
import Apps from "@/pages/apps";
import Datasets from "@/pages/datasets";
import { useEffect, useState } from "react";
import { DatasetModalProvider } from "./contexts/DatasetModalContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogDetail} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/apps" component={Apps} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/datasets/:type?" component={Datasets} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Check for saved theme preference or use system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Function to toggle theme
  const toggleTheme = (isDark: boolean) => {
    if (isDark) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <DatasetModalProvider>
        <div className="theme-provider min-h-screen flex flex-col" data-theme={theme}>
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
          <Toaster />
        </div>
      </DatasetModalProvider>
    </QueryClientProvider>
  );
}

export default App;
