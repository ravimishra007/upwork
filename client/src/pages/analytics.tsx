import { useState, useEffect } from "react";
import ThemeToggle from "@/components/theme-toggle";
import AnalyticsDashboard from "@/components/analytics-dashboard";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Analytics() {
  // Track if dark mode is enabled
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for saved theme preference or use system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    setIsDarkMode(savedTheme === "dark" || (!savedTheme && prefersDark));
  }, []);

  // Toggle theme function
  const toggleTheme = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Button>
          </Link>
          <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
        </div>
        
        <AnalyticsDashboard />
        
        <Footer />
      </div>
    </div>
  );
}