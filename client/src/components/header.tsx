import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, Search, ArrowRight, FileText, Music, Film, Smartphone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Define result types
type ResultType = 'page' | 'blog' | 'music' | 'movie' | 'section';

// Interface for search content 
interface SearchItem {
  title: string;
  url: string;
  keywords: string[];
  type: ResultType;
  image?: string;
}

// Content sources for search
const searchableContent: SearchItem[] = [
  // Main pages
  { title: "Home", url: "/", keywords: ["home", "main", "profile", "social", "links", "cv", "resume"], type: 'page' },
  { title: "About", url: "/about", keywords: ["about", "bio", "skills", "experience", "education", "projects"], type: 'page' },
  { title: "Blog", url: "/blog", keywords: ["blog", "articles", "posts", "writing", "latest"], type: 'page' },
  { title: "Gallery", url: "/gallery", keywords: ["gallery", "portfolio", "work", "projects", "designs", "images"], type: 'page' },
  { title: "Analytics", url: "/analytics", keywords: ["analytics", "stats", "clicks", "data", "tracking"], type: 'page' },
  
  // Home page sections
  { title: "Profile Information", url: "/", keywords: ["profile", "bio", "name", "picture", "location"], type: 'section' },
  { title: "CV Download", url: "/", keywords: ["cv", "resume", "download", "career", "job"], type: 'section' },
  { title: "Social Media Links", url: "/", keywords: ["social", "links", "facebook", "twitter", "linkedin", "github"], type: 'section' },
  
  // Blog posts
  { title: "Building Responsive Layouts with CSS Grid", url: "/blog", keywords: ["css", "grid", "responsive", "layout", "web design"], type: 'blog' },
  { title: "Getting Started with TypeScript in 2025", url: "/blog", keywords: ["typescript", "javascript", "development", "coding"], type: 'blog' },
  { title: "The Future of React: What's Coming in React 20", url: "/blog", keywords: ["react", "javascript", "frontend", "components"], type: 'blog' },
  { title: "Build a Full-Stack App with the MERN Stack", url: "/blog", keywords: ["mern", "mongodb", "express", "react", "node", "full-stack"], type: 'blog' },
  { title: "Advanced State Management Patterns in React Applications", url: "/blog", keywords: ["react", "state management", "context", "hooks"], type: 'blog' },
  { title: "Web Accessibility Best Practices", url: "/blog", keywords: ["accessibility", "a11y", "inclusive", "web standards"], type: 'blog' },
  { title: "The Complete Guide to Modern CSS Reset", url: "/blog", keywords: ["css", "reset", "styling", "best practices"], type: 'blog' },
  
  // Music entries (from the music-list component)
  { title: "Thriller - Michael Jackson", url: "/#music", keywords: ["michael jackson", "thriller", "pop", "1982"], type: 'music' },
  { title: "Bohemian Rhapsody - Queen", url: "/#music", keywords: ["queen", "bohemian rhapsody", "rock", "1975"], type: 'music' },
  { title: "Imagine - John Lennon", url: "/#music", keywords: ["john lennon", "imagine", "rock", "1971"], type: 'music' },
  { title: "Billie Jean - Michael Jackson", url: "/#music", keywords: ["michael jackson", "billie jean", "pop", "1983"], type: 'music' },
  { title: "Like a Rolling Stone - Bob Dylan", url: "/#music", keywords: ["bob dylan", "like a rolling stone", "rock", "1965"], type: 'music' },
  { title: "Smells Like Teen Spirit - Nirvana", url: "/#music", keywords: ["nirvana", "smells like teen spirit", "grunge", "1991"], type: 'music' },
  { title: "Hotel California - Eagles", url: "/#music", keywords: ["eagles", "hotel california", "rock", "1976"], type: 'music' },
  
  // Movie entries (from the movie-list component)
  { title: "The Shawshank Redemption (1994)", url: "/#movies", keywords: ["shawshank redemption", "frank darabont", "drama", "prison"], type: 'movie' },
  { title: "The Godfather (1972)", url: "/#movies", keywords: ["godfather", "coppola", "crime", "mafia", "drama"], type: 'movie' },
  { title: "The Dark Knight (2008)", url: "/#movies", keywords: ["dark knight", "christopher nolan", "batman", "joker", "action"], type: 'movie' },
  { title: "Pulp Fiction (1994)", url: "/#movies", keywords: ["pulp fiction", "quentin tarantino", "crime", "drama"], type: 'movie' },
  { title: "Inception (2010)", url: "/#movies", keywords: ["inception", "christopher nolan", "sci-fi", "dreams", "action"], type: 'movie' },
  { title: "The Matrix (1999)", url: "/#movies", keywords: ["matrix", "wachowskis", "sci-fi", "action", "neo"], type: 'movie' },
  
  // App entries (from the apps page)
  { title: "Android: Spotify", url: "/apps", keywords: ["spotify", "music", "audio", "streaming", "android", "app"], type: 'section' },
  { title: "Android: Duolingo", url: "/apps", keywords: ["duolingo", "language", "learning", "education", "android", "app"], type: 'section' },
  { title: "Windows: Visual Studio Code", url: "/apps", keywords: ["vscode", "code editor", "developer", "programming", "windows", "app"], type: 'section' },
  { title: "Windows: Adobe Photoshop", url: "/apps", keywords: ["photoshop", "design", "photo editing", "creative", "windows", "app"], type: 'section' }
];

// Desktop navigation link
function NavLink({ 
  href, 
  isActive, 
  onClick, 
  children 
}: { 
  href: string; 
  isActive: boolean; 
  onClick: () => void; 
  children: React.ReactNode 
}) {
  return (
    <Link href={href}>
      <div
        onClick={onClick}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
          isActive 
            ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50" 
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        {children}
      </div>
    </Link>
  );
}

// Mobile navigation link
function MobileNavLink({ 
  href, 
  isActive, 
  onClick, 
  children 
}: { 
  href: string; 
  isActive: boolean; 
  onClick: () => void; 
  children: React.ReactNode 
}) {
  return (
    <Link href={href}>
      <div
        onClick={onClick}
        className={`py-2 px-3 rounded-md font-medium block cursor-pointer ${
          isActive 
            ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50" 
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        {children}
      </div>
    </Link>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof searchableContent>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [location] = useLocation();

  // Check for saved theme preference or use system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    setIsDarkMode(savedTheme === "dark" || (!savedTheme && prefersDark));
  }, []);

  // Focus search input when dialog opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Toggle theme function
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Toggle menu for mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when navigating
  const handleNavigation = () => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  // Search function
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();
    
    // Filter results based on title and keywords
    const results = searchableContent.filter(item => 
      item.title.toLowerCase().includes(normalizedQuery) || 
      item.keywords.some(keyword => keyword.includes(normalizedQuery))
    );
    
    setSearchResults(results);
  };

  // Check if a link is active
  const isActive = (path: string) => location === path;

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/">
              <div className="text-xl font-bold text-gray-900 dark:text-white flex items-center cursor-pointer">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
                  Stanislav Nikov
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <NavLink href="/" isActive={isActive("/")} onClick={handleNavigation}>
                Home
              </NavLink>
              <NavLink href="/about" isActive={isActive("/about")} onClick={handleNavigation}>
                About
              </NavLink>
              <NavLink href="/blog" isActive={isActive("/blog")} onClick={handleNavigation}>
                Blog
              </NavLink>
              <NavLink href="/gallery" isActive={isActive("/gallery")} onClick={handleNavigation}>
                Gallery
              </NavLink>
              <NavLink href="/apps" isActive={isActive("/apps")} onClick={handleNavigation}>
                Apps
              </NavLink>
            </nav>

            {/* Right side icons */}
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)} 
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                aria-label="Toggle theme" 
                className="mr-2"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)} 
                aria-label="Search" 
                className="mr-2"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMenu} 
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <nav className="flex flex-col space-y-2">
                <MobileNavLink href="/" isActive={isActive("/")} onClick={handleNavigation}>
                  Home
                </MobileNavLink>
                <MobileNavLink href="/about" isActive={isActive("/about")} onClick={handleNavigation}>
                  About
                </MobileNavLink>
                <MobileNavLink href="/blog" isActive={isActive("/blog")} onClick={handleNavigation}>
                  Blog
                </MobileNavLink>
                <MobileNavLink href="/gallery" isActive={isActive("/gallery")} onClick={handleNavigation}>
                  Gallery
                </MobileNavLink>
                <MobileNavLink href="/apps" isActive={isActive("/apps")} onClick={handleNavigation}>
                  Apps
                </MobileNavLink>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search for anything..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            {searchResults.length > 0 ? (
              <div className="space-y-1 mt-2 max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <Link href={result.url} key={index}>
                    <div 
                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={handleNavigation}
                    >
                      <div className="flex items-center gap-2">
                        {/* Icon based on content type */}
                        {result.type === 'blog' && (
                          <FileText className="h-4 w-4 text-red-500" />
                        )}
                        {result.type === 'music' && (
                          <Music className="h-4 w-4 text-amber-500" />
                        )}
                        {result.type === 'movie' && (
                          <Film className="h-4 w-4 text-blue-500" />
                        )}
                        {result.type === 'section' && (
                          <Smartphone className="h-4 w-4 text-green-500" />
                        )}
                        
                        <div className="flex flex-col">
                          <span className="text-sm">{result.title}</span>
                          <div className="flex gap-1 mt-1">
                            {/* Type badge with different colors */}
                            {result.type === 'blog' && (
                              <Badge variant="outline" className="text-xs px-1 py-0 h-4 bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
                                Article
                              </Badge>
                            )}
                            {result.type === 'music' && (
                              <Badge variant="outline" className="text-xs px-1 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                                Music
                              </Badge>
                            )}
                            {result.type === 'movie' && (
                              <Badge variant="outline" className="text-xs px-1 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                                Movie
                              </Badge>
                            )}
                            {result.type === 'page' && (
                              <Badge variant="outline" className="text-xs px-1 py-0 h-4 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                                Page
                              </Badge>
                            )}
                            {result.type === 'section' && (
                              <Badge variant="outline" className="text-xs px-1 py-0 h-4 bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                                App
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
                No results found for "{searchQuery}"
              </div>
            ) : null}
            
            <div className="pt-2 text-sm text-gray-500 dark:text-gray-400">
              <p>Try searching for pages, content, or specific topics.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}