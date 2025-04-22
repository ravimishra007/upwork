import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, Monitor, Tag, Download, ExternalLink, 
  Search, List, Grid3X3
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

function generateAffiliateLinks(name: string, platform: "android" | "windows") {
  const sanitizedName = encodeURIComponent(name.replace(/\s+/g, '-').toLowerCase());
  
  // Create platform-specific affiliate links
  if (platform === "android") {
    return {
      googlePlay: `https://play.google.com/store/search?q=${sanitizedName}&c=apps&affiliate=true`,
      amazonAppStore: `https://www.amazon.com/s?k=${sanitizedName}&i=mobile-apps&affiliate=true`,
      huaweiAppGallery: `https://appgallery.huawei.com/search/${sanitizedName}?affiliate=true`
    };
  } else {
    return {
      microsoftStore: `https://apps.microsoft.com/search?q=${sanitizedName}&affiliate=true`,
      developer: `https://www.google.com/search?q=${sanitizedName}+official+website+download&affiliate=true`,
      softpedia: `https://www.softpedia.com/dyn-search.php?search_term=${sanitizedName}&affiliate=true`
    };
  }
}

interface App {
  id: number;
  name: string;
  developer: string;
  category: string;
  rating: number;
  description: string;
  platform: "android" | "windows";
  price: string;
  imageUrl?: string;
  tags: string[];
}

function renderRating(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-500">★</span>
      ))}
      {hasHalfStar && <span className="text-yellow-500">★</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300 dark:text-gray-600">★</span>
      ))}
    </div>
  );
}

export default function Apps() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Sample data for Android apps
  const androidApps: App[] = [
    {
      id: 1,
      name: "Weather Forecast Pro",
      developer: "WeatherTech Inc.",
      category: "Weather",
      rating: 4.7,
      description: "Accurate weather forecasts with radar, hourly and 10-day predictions, and severe weather alerts.",
      platform: "android",
      price: "Free",
      imageUrl: "https://placehold.co/200x200/4285F4/FFFFFF/?text=WF",
      tags: ["weather", "forecast", "radar"]
    },
    {
      id: 2,
      name: "Fitness Tracker Elite",
      developer: "HealthTech Solutions",
      category: "Health & Fitness",
      rating: 4.5,
      description: "Complete fitness tracking with heart rate monitoring, workout plans, and nutrition guidance.",
      platform: "android",
      price: "$3.99",
      imageUrl: "https://placehold.co/200x200/DB4437/FFFFFF/?text=FT",
      tags: ["fitness", "health", "workout"]
    },
    {
      id: 3,
      name: "Photo Editor Master",
      developer: "Creative Apps LLC",
      category: "Photography",
      rating: 4.3,
      description: "Advanced photo editing with filters, effects, and professional adjustment tools.",
      platform: "android",
      price: "Free (In-app purchases)",
      imageUrl: "https://placehold.co/200x200/F4B400/FFFFFF/?text=PE",
      tags: ["photo", "editing", "filters"]
    },
    {
      id: 4,
      name: "Secure Password Manager",
      developer: "Security Solutions",
      category: "Tools",
      rating: 4.8,
      description: "Store and generate secure passwords with end-to-end encryption.",
      platform: "android",
      price: "$4.99",
      imageUrl: "https://placehold.co/200x200/0F9D58/FFFFFF/?text=SP",
      tags: ["security", "password", "privacy"]
    },
    {
      id: 5,
      name: "Meditation & Sleep Sounds",
      developer: "Mindfulness Apps",
      category: "Lifestyle",
      rating: 4.6,
      description: "Guided meditations, sleep stories, and relaxing sounds to reduce stress and improve sleep.",
      platform: "android",
      price: "Free (Premium $9.99/year)",
      imageUrl: "https://placehold.co/200x200/7B1FA2/FFFFFF/?text=MS",
      tags: ["meditation", "sleep", "relaxation"]
    },
    {
      id: 6,
      name: "Language Learning Pro",
      developer: "Educational Technologies",
      category: "Education",
      rating: 4.4,
      description: "Learn 30+ languages with interactive lessons, speech recognition, and offline courses.",
      platform: "android",
      price: "Free (Premium $12.99/month)",
      imageUrl: "https://placehold.co/200x200/2196F3/FFFFFF/?text=LL",
      tags: ["languages", "education", "learning"]
    },
    {
      id: 7,
      name: "Smart Home Controller",
      developer: "Connected Home Inc.",
      category: "Tools",
      rating: 4.2,
      description: "Control all your smart home devices from one app with automation and voice commands.",
      platform: "android",
      price: "Free",
      imageUrl: "https://placehold.co/200x200/673AB7/FFFFFF/?text=SH",
      tags: ["smart home", "automation", "IoT"]
    },
    {
      id: 8,
      name: "Budget Tracker & Planner",
      developer: "Financial Apps Co.",
      category: "Finance",
      rating: 4.5,
      description: "Track expenses, set budgets, and plan your financial future with detailed reports.",
      platform: "android",
      price: "$2.99",
      imageUrl: "https://placehold.co/200x200/3F51B5/FFFFFF/?text=BT",
      tags: ["finance", "budget", "planning"]
    }
  ];
  
  // Sample data for Windows apps
  const windowsApps: App[] = [
    {
      id: 9,
      name: "Video Editor Studio",
      developer: "Creative Software Inc.",
      category: "Multimedia",
      rating: 4.6,
      description: "Professional video editing with timeline editing, effects, transitions, and 4K export.",
      platform: "windows",
      price: "$49.99",
      imageUrl: "https://placehold.co/200x200/E91E63/FFFFFF/?text=VE",
      tags: ["video", "editor", "multimedia"]
    },
    {
      id: 10,
      name: "Code IDE Pro",
      developer: "Dev Tools Ltd.",
      category: "Developer Tools",
      rating: 4.8,
      description: "Advanced integrated development environment with code completion, debugging, and git integration.",
      platform: "windows",
      price: "$79.99",
      imageUrl: "https://placehold.co/200x200/607D8B/FFFFFF/?text=CI",
      tags: ["development", "coding", "IDE"]
    },
    {
      id: 11,
      name: "Office Suite Plus",
      developer: "Productivity Software",
      category: "Productivity",
      rating: 4.5,
      description: "Complete office suite with word processor, spreadsheet, presentation, and PDF tools.",
      platform: "windows",
      price: "$39.99/year",
      imageUrl: "https://placehold.co/200x200/FF5722/FFFFFF/?text=OS",
      tags: ["office", "productivity", "documents"]
    },
    {
      id: 12,
      name: "System Optimizer Pro",
      developer: "PC Tools Inc.",
      category: "Utilities",
      rating: 4.3,
      description: "Clean, optimize and speed up your PC with advanced system tools and automatic maintenance.",
      platform: "windows",
      price: "$29.99",
      imageUrl: "https://placehold.co/200x200/009688/FFFFFF/?text=SO",
      tags: ["system", "cleaner", "optimization"]
    },
    {
      id: 13,
      name: "Digital Art Studio",
      developer: "Artist Tools Co.",
      category: "Graphics & Design",
      rating: 4.7,
      description: "Professional digital painting and illustration with custom brushes and vector tools.",
      platform: "windows",
      price: "$59.99",
      imageUrl: "https://placehold.co/200x200/795548/FFFFFF/?text=DA",
      tags: ["art", "illustration", "design"]
    },
    {
      id: 14,
      name: "Audio Production Suite",
      developer: "Sound Engineers Ltd.",
      category: "Multimedia",
      rating: 4.6,
      description: "Professional audio recording, editing, and mixing with virtual instruments and effects.",
      platform: "windows",
      price: "$89.99",
      imageUrl: "https://placehold.co/200x200/9C27B0/FFFFFF/?text=AP",
      tags: ["audio", "music", "production"]
    },
    {
      id: 15,
      name: "Network Monitor Tools",
      developer: "IT Security Solutions",
      category: "Network & Security",
      rating: 4.4,
      description: "Monitor and analyze network traffic, diagnose issues, and secure your network.",
      platform: "windows",
      price: "$39.99",
      imageUrl: "https://placehold.co/200x200/00BCD4/FFFFFF/?text=NM",
      tags: ["network", "monitoring", "security"]
    },
    {
      id: 16,
      name: "3D Modeling & Animation",
      developer: "3D Graphics Inc.",
      category: "Graphics & Design",
      rating: 4.5,
      description: "Create 3D models, animations, and renders with powerful modeling and rendering tools.",
      platform: "windows",
      price: "$99.99",
      imageUrl: "https://placehold.co/200x200/CDDC39/FFFFFF/?text=3D",
      tags: ["3D", "modeling", "animation"]
    }
  ];
  
  const getCategories = (platform: "android" | "windows") => {
    const apps = platform === "android" ? androidApps : windowsApps;
    return Array.from(new Set(apps.map(app => app.category))).sort();
  };
  
  const getFilteredApps = (platform: "android" | "windows") => {
    const apps = platform === "android" ? androidApps : windowsApps;
    
    return apps.filter(app => {
      const matchesCategory = !selectedCategory || app.category === selectedCategory;
      const matchesSearch = !searchTerm || 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.developer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  };
  
  const handleOpenAffiliateDialog = (app: App) => {
    // Additional analytics or tracking could be added here
    console.log(`Opening affiliate options for ${app.name}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="android" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="android">
            <Phone className="mr-2 h-4 w-4" />
            Android
          </TabsTrigger>
          <TabsTrigger value="windows">
            <Monitor className="mr-2 h-4 w-4" />
            Windows
          </TabsTrigger>
        </TabsList>
        
        {/* Android Apps Tab */}
        <TabsContent value="android" className="space-y-4">
          <Card>
            <CardHeader className="pb-3 pt-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-indigo-500" />
                  Android Applications
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost" 
                    size="icon"
                    className={`h-8 w-8 ${viewMode === "list" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                    onClick={() => setViewMode("list")}
                    title="List view"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost" 
                    size="icon"
                    className={`h-8 w-8 ${viewMode === "grid" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                    onClick={() => setViewMode("grid")}
                    title="Grid view"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      placeholder="Search Android apps..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <select 
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={selectedCategory || ""}
                      onChange={(e) => setSelectedCategory(e.target.value || null)}
                    >
                      <option value="">All Categories</option>
                      {getCategories("android").map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <ScrollArea className="h-[calc(100vh-22rem)] min-h-[240px]">
                  <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 px-1" : ""}>
                    {getFilteredApps("android").length > 0 ? (
                      getFilteredApps("android").map((app) => (
                        <Dialog key={app.id}>
                          <DialogTrigger asChild>
                            {viewMode === "grid" ? (
                              <div 
                                className="p-4 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex flex-col"
                                onClick={() => handleOpenAffiliateDialog(app)}
                              >
                                {/* Image section first for better layout */}
                                {app.imageUrl && (
                                  <div className="image-section w-full h-40 overflow-hidden rounded-md border mb-4 flex justify-center items-center">
                                    <img 
                                      src={app.imageUrl} 
                                      alt={`${app.name} icon`}
                                      className="h-full object-contain"
                                    />
                                  </div>
                                )}
                                
                                {/* Title section below image with smaller fonts */}
                                <div className="mb-3 px-1 w-full">
                                  <h4 className="font-medium text-sm mb-1 line-clamp-1">{app.name}</h4>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{app.developer}</div>
                                </div>
                                
                                {/* Details section with even smaller fonts */}
                                <div className="details-section mt-auto px-1 w-full">
                                  <div className="flex items-center justify-between text-xs mb-2">
                                    <span className="text-xs">{app.price}</span>
                                    <div className="flex items-center gap-1">
                                      {renderRating(app.rating)}
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    <Badge variant="outline" className="text-[10px] py-0 px-2 h-5">
                                      {app.category}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div 
                                className="grid grid-cols-6 gap-2 items-center py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b"
                                onClick={() => handleOpenAffiliateDialog(app)}
                              >
                                {app.imageUrl && (
                                  <div className="flex-shrink-0 h-12 w-12 overflow-hidden rounded-md border">
                                    <img 
                                      src={app.imageUrl} 
                                      alt={`${app.name} icon`}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="col-span-2 min-w-0">
                                  <h4 className="font-medium text-sm mb-1 line-clamp-1">{app.name}</h4>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{app.developer}</div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{app.category}</div>
                                <div className="text-xs">{app.price}</div>
                                <div className="text-xs flex justify-end">{renderRating(app.rating)}</div>
                              </div>
                            )}
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Get {app.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex flex-col sm:flex-row gap-4">
                                {app.imageUrl && (
                                  <div className="flex-shrink-0 sm:w-1/4 flex justify-center">
                                    <img 
                                      src={app.imageUrl} 
                                      alt={`${app.name} icon`}
                                      className="h-24 w-24 object-contain rounded-md border"
                                    />
                                  </div>
                                )}
                                <div className="flex-grow">
                                  <div className="text-sm">
                                    <p className="font-medium">{app.developer}</p>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1">{app.description}</p>
                                  </div>
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center">
                                      <Tag className="h-3 w-3 mr-1 text-gray-400" />
                                      <span className="text-xs text-gray-500">{app.category}</span>
                                    </div>
                                    <div>{renderRating(app.rating)}</div>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {app.tags.map((tag, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Download or purchase this app from:
                              </p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(generateAffiliateLinks(app.name, "android")).map(([platform, url]) => {
                                  // Format platform name for display
                                  const platformDisplay = platform
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^./, str => str.toUpperCase());
                                  
                                  return (
                                    <a 
                                      key={platform} 
                                      href={url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 p-3 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                      <Download className="h-4 w-4 text-indigo-500" />
                                      <span className="flex-grow">
                                        {platformDisplay}
                                      </span>
                                      <ExternalLink className="h-4 w-4 text-gray-400" />
                                    </a>
                                  );
                                })}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-4">
                                Links may contain affiliate codes. I earn from qualifying purchases.
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ))
                    ) : (
                      <div className={viewMode === "grid" ? "col-span-3 py-8 text-center text-gray-500 dark:text-gray-400" : "py-8 text-center text-gray-500 dark:text-gray-400"}>
                        No Android applications found matching your search.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Windows Apps Tab */}
        <TabsContent value="windows" className="space-y-4">
          <Card>
            <CardHeader className="pb-3 pt-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Monitor className="mr-2 h-5 w-5 text-indigo-500" />
                  Windows Applications
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost" 
                    size="icon"
                    className={`h-8 w-8 ${viewMode === "list" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                    onClick={() => setViewMode("list")}
                    title="List view"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost" 
                    size="icon"
                    className={`h-8 w-8 ${viewMode === "grid" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                    onClick={() => setViewMode("grid")}
                    title="Grid view"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      placeholder="Search Windows apps..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <select 
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={selectedCategory || ""}
                      onChange={(e) => setSelectedCategory(e.target.value || null)}
                    >
                      <option value="">All Categories</option>
                      {getCategories("windows").map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <ScrollArea className="h-[calc(100vh-22rem)] min-h-[240px]">
                  <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 px-1" : ""}>
                    {getFilteredApps("windows").length > 0 ? (
                      getFilteredApps("windows").map((app) => (
                        <Dialog key={app.id}>
                          <DialogTrigger asChild>
                            {viewMode === "grid" ? (
                              <div 
                                className="p-4 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex flex-col"
                                onClick={() => handleOpenAffiliateDialog(app)}
                              >
                                {/* Image section first for better layout */}
                                {app.imageUrl && (
                                  <div className="image-section w-full h-40 overflow-hidden rounded-md border mb-4 flex justify-center items-center">
                                    <img 
                                      src={app.imageUrl} 
                                      alt={`${app.name} icon`}
                                      className="h-full object-contain"
                                    />
                                  </div>
                                )}
                                
                                {/* Title section below image with smaller fonts */}
                                <div className="mb-3 px-1 w-full">
                                  <h4 className="font-medium text-sm mb-1 line-clamp-1">{app.name}</h4>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{app.developer}</div>
                                </div>
                                
                                {/* Details section with even smaller fonts */}
                                <div className="details-section mt-auto px-1 w-full">
                                  <div className="flex items-center justify-between text-xs mb-2">
                                    <span className="text-xs">{app.price}</span>
                                    <div className="flex items-center gap-1">
                                      {renderRating(app.rating)}
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    <Badge variant="outline" className="text-[10px] py-0 px-2 h-5">
                                      {app.category}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div 
                                className="grid grid-cols-6 gap-2 items-center py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b"
                                onClick={() => handleOpenAffiliateDialog(app)}
                              >
                                {app.imageUrl && (
                                  <div className="flex-shrink-0 h-12 w-12 overflow-hidden rounded-md border">
                                    <img 
                                      src={app.imageUrl} 
                                      alt={`${app.name} icon`}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="col-span-2 min-w-0">
                                  <h4 className="font-medium text-sm mb-1 line-clamp-1">{app.name}</h4>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{app.developer}</div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{app.category}</div>
                                <div className="text-xs">{app.price}</div>
                                <div className="text-xs flex justify-end">{renderRating(app.rating)}</div>
                              </div>
                            )}
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Get {app.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex flex-col sm:flex-row gap-4">
                                {app.imageUrl && (
                                  <div className="flex-shrink-0 sm:w-1/4 flex justify-center">
                                    <img 
                                      src={app.imageUrl} 
                                      alt={`${app.name} icon`}
                                      className="h-24 w-24 object-contain rounded-md border"
                                    />
                                  </div>
                                )}
                                <div className="flex-grow">
                                  <div className="text-sm">
                                    <p className="font-medium">{app.developer}</p>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1">{app.description}</p>
                                  </div>
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center">
                                      <Tag className="h-3 w-3 mr-1 text-gray-400" />
                                      <span className="text-xs text-gray-500">{app.category}</span>
                                    </div>
                                    <div>{renderRating(app.rating)}</div>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {app.tags.map((tag, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Download or purchase this app from:
                              </p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(generateAffiliateLinks(app.name, "windows")).map(([platform, url]) => {
                                  // Format platform name for display
                                  const platformDisplay = platform
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^./, str => str.toUpperCase());
                                  
                                  return (
                                    <a 
                                      key={platform} 
                                      href={url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 p-3 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                      <Download className="h-4 w-4 text-indigo-500" />
                                      <span className="flex-grow">
                                        {platformDisplay}
                                      </span>
                                      <ExternalLink className="h-4 w-4 text-gray-400" />
                                    </a>
                                  );
                                })}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-4">
                                Links may contain affiliate codes. I earn from qualifying purchases.
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ))
                    ) : (
                      <div className={viewMode === "grid" ? "col-span-3 py-8 text-center text-gray-500 dark:text-gray-400" : "py-8 text-center text-gray-500 dark:text-gray-400"}>
                        No Windows applications found matching your search.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}