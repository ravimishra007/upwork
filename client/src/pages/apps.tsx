import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Smartphone, 
  Monitor, 
  ExternalLink, 
  Star, 
  Download, 
  Tag,
  Grid3X3,
  List,
  Loader2,
  Phone
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppImage from "@/components/app-image";
import { useQuery } from "@tanstack/react-query";

// Affiliate link generation function
function generateAffiliateLinks(name: string, platform: "android" | "windows") {
  const encodedQuery = encodeURIComponent(name);
  
  if (platform === "android") {
    return {
      googlePlay: `https://play.google.com/store/search?q=${encodedQuery}&c=apps&authuser=0&tag=stanislavnikov-20`,
      amazonAppstore: `https://www.amazon.com/s?k=${encodedQuery}&i=mobile-apps&tag=stanislavnikov-20`,
      aptoide: `https://en.aptoide.com/search?query=${encodedQuery}`,
      huaweiAppGallery: `https://appgallery.huawei.com/#/search/${encodedQuery}`,
      fdroid: `https://search.f-droid.org/?q=${encodedQuery}`,
      apkPure: `https://apkpure.com/search?q=${encodedQuery}`
    };
  } else {
    return {
      microsoftStore: `https://apps.microsoft.com/search?query=${encodedQuery}&tag=stanislavnikov-20`,
      steam: `https://store.steampowered.com/search/?term=${encodedQuery}`,
      epicGames: `https://www.epicgames.com/store/browse?q=${encodedQuery}&tag=stanislavnikov-20`,
      sourceforge: `https://sourceforge.net/directory/?q=${encodedQuery}`,
      amazonSoftware: `https://www.amazon.com/s?k=${encodedQuery}&i=software&tag=stanislavnikov-20`,
      github: `https://github.com/search?q=${encodedQuery}`
    };
  }
}

// App interface
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
  tags?: string[];
}

// Render star rating
function renderRating(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex">
      {Array(fullStars).fill(0).map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-500">★</span>
      ))}
      {hasHalfStar && <span className="text-yellow-500">★</span>}
      {Array(emptyStars).fill(0).map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300 dark:text-gray-600">★</span>
      ))}
    </div>
  );
}

export default function Apps() {
  // Set page title
  useEffect(() => {
    document.title = "Apps | Stanislav Nikov";
  }, []);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Fetch Android Apps
  const { 
    data: androidApps = [], 
    isLoading: androidLoading, 
    error: androidError 
  } = useQuery<App[]>({
    queryKey: ['/api/datasets/android-apps'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch Windows Apps
  const { 
    data: windowsApps = [], 
    isLoading: windowsLoading, 
    error: windowsError 
  } = useQuery<App[]>({
    queryKey: ['/api/datasets/windows-apps'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Handle opening the affiliate dialog
  const handleOpenAffiliateDialog = (app: App) => {
    setSelectedApp(app);
  };
  
  // Get categories for platform
  const getCategories = (platform: "android" | "windows") => {
    const apps = platform === "android" ? androidApps : windowsApps;
    return Array.from(new Set(apps.map(app => app.category))).sort();
  };
  
  // Filter apps based on search term and category
  const getFilteredApps = (platform: "android" | "windows") => {
    const apps = platform === "android" ? androidApps : windowsApps;
    
    return apps.filter(app => {
      const matchesSearch = !searchTerm || 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.developer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || app.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text animate-gradient">
        Application Showcase
      </h1>
      
      <Tabs defaultValue="android" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="android" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>Android Apps</span>
          </TabsTrigger>
          <TabsTrigger value="windows" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>Windows Apps</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="android">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-indigo-500" />
                  <span>Android Applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="flex items-center relative w-full md:w-3/4">
                  <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for Android apps..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="w-full md:w-1/4">
                  <select
                    value={selectedCategory || ""}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">All Categories</option>
                    {getCategories("android").map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="relative min-h-[300px]">
                <ScrollArea className="h-[60vh]">
                  <div className={
                    viewMode === "grid" 
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4" 
                      : "flex flex-col gap-4"
                  }>
                    {androidLoading ? (
                      <div className={viewMode === "grid" ? "col-span-3 py-16 flex items-center justify-center" : "py-16 flex items-center justify-center"}>
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2">Loading apps...</span>
                      </div>
                    ) : androidError ? (
                      <div className={viewMode === "grid" ? "col-span-3 py-8 text-center text-gray-500 dark:text-gray-400" : "py-8 text-center text-gray-500 dark:text-gray-400"}>
                        Failed to load apps. Please try again later.
                      </div>
                    ) : getFilteredApps("android").length === 0 ? (
                      <div className={viewMode === "grid" ? "col-span-3 py-8 text-center text-gray-500 dark:text-gray-400" : "py-8 text-center text-gray-500 dark:text-gray-400"}>
                        No Android applications found matching your search.
                      </div>
                    ) : (
                      getFilteredApps("android").map((app) => (
                        <div 
                          key={app.id}
                          className={
                            viewMode === "grid"
                              ? "p-4 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex flex-col"
                              : "grid grid-cols-6 gap-2 items-center py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b"
                          }
                          onClick={() => handleOpenAffiliateDialog(app)}
                        >
                          {viewMode === "grid" ? (
                            <>
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
                                
                                <div className="mt-3 flex justify-between">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-xs py-1 h-7 w-full"
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
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
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="windows">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-blue-500" />
                  <span>Windows Applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="flex items-center relative w-full md:w-3/4">
                  <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for Windows apps..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="w-full md:w-1/4">
                  <select
                    value={selectedCategory || ""}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">All Categories</option>
                    {getCategories("windows").map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="relative min-h-[300px]">
                <ScrollArea className="h-[60vh]">
                  <div className={
                    viewMode === "grid" 
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4" 
                      : "flex flex-col gap-4"
                  }>
                    {windowsLoading ? (
                      <div className={viewMode === "grid" ? "col-span-3 py-16 flex items-center justify-center" : "py-16 flex items-center justify-center"}>
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2">Loading apps...</span>
                      </div>
                    ) : windowsError ? (
                      <div className={viewMode === "grid" ? "col-span-3 py-8 text-center text-gray-500 dark:text-gray-400" : "py-8 text-center text-gray-500 dark:text-gray-400"}>
                        Failed to load apps. Please try again later.
                      </div>
                    ) : getFilteredApps("windows").length === 0 ? (
                      <div className={viewMode === "grid" ? "col-span-3 py-8 text-center text-gray-500 dark:text-gray-400" : "py-8 text-center text-gray-500 dark:text-gray-400"}>
                        No Windows applications found matching your search.
                      </div>
                    ) : (
                      getFilteredApps("windows").map((app) => (
                        <div 
                          key={app.id}
                          className={
                            viewMode === "grid"
                              ? "p-4 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex flex-col"
                              : "grid grid-cols-6 gap-2 items-center py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b"
                          }
                          onClick={() => handleOpenAffiliateDialog(app)}
                        >
                          {viewMode === "grid" ? (
                            <>
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
                                
                                <div className="mt-3 flex justify-between">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-xs py-1 h-7 w-full"
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
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
                            </>
                          )}
                        </div>
                      ))
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