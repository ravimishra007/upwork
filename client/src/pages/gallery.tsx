import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery } from "@tanstack/react-query";
import { 
  Camera, Layers, Lightbulb, Paintbrush, X, ChevronLeft, ChevronRight,
  Heart, Share2, Download, ZoomIn, Filter, Search, Menu, Loader2
} from "lucide-react";

// Define the gallery item type for better type safety
interface GalleryItem {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  tags?: string[];
  year?: string;
}

export default function Gallery() {
  // Set page title
  useEffect(() => {
    document.title = "Gallery | Stanislav Nikov";
  }, []);

  // State for gallery item modal
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [yearFilter, setYearFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch gallery items from API
  const { 
    data: galleryItems = [], 
    isLoading, 
    error 
  } = useQuery<GalleryItem[]>({
    queryKey: ['/api/datasets/gallery-items'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Filter gallery items based on active filters
  const filteredGalleryItems = galleryItems.filter((item) => {
    // Apply category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
      return false;
    }
    
    // Apply year filter
    if (yearFilter && item.year !== yearFilter) {
      return false;
    }
    
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const descriptionMatch = item.description.toLowerCase().includes(searchLower);
      const tagsMatch = item.tags?.some(tag => tag.toLowerCase().includes(searchLower)) || false;
      
      if (!(titleMatch || descriptionMatch || tagsMatch)) {
        return false;
      }
    }
    
    return true;
  });

  // Get unique years for filter
  const years = Array.from(new Set(galleryItems.map(item => item.year || "").filter(Boolean)));
  
  // Get unique categories
  const categories = Array.from(new Set(galleryItems.map(item => item.category)));

  // Toggle category in filter
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setYearFilter("");
    setSearchTerm("");
  };
  
  // Function to handle image navigation in modal
  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    const currentIndex = galleryItems.findIndex(item => item.id === selectedImage);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : galleryItems.length - 1;
    } else {
      newIndex = currentIndex < galleryItems.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedImage(galleryItems[newIndex].id);
  };

  // Get current tab from filters
  const getCurrentTab = () => {
    if (selectedCategories.length === 1) {
      return selectedCategories[0];
    }
    return "all";
  };

  // Display loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Loading gallery items...</span>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Gallery</h2>
          <p className="text-gray-600 mb-6">
            We encountered an issue while fetching gallery items. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 w-full max-w-6xl mx-auto px-0">
        <p className="text-gray-600 dark:text-gray-400 max-w-md text-left">
          Explore my design portfolio showcasing web design, UI/UX concepts, branding, and digital illustrations.
        </p>
        
        <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 text-center">
          Gallery
        </h1>
        
        <Dialog open={isFilterMenuOpen} onOpenChange={setIsFilterMenuOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter Options
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Filter Gallery</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Search</h3>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search by title, description or tags..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Categories</h3>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`} 
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label 
                        htmlFor={`category-${category}`}
                        className="capitalize"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Year</h3>
                <RadioGroup value={yearFilter} onValueChange={setYearFilter}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="" id="all-years" />
                      <Label htmlFor="all-years">All Years</Label>
                    </div>
                    {years.map((year) => (
                      <div key={year} className="flex items-center space-x-2">
                        <RadioGroupItem value={year} id={`year-${year}`} />
                        <Label htmlFor={`year-${year}`}>{year}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={clearFilters}>Clear All</Button>
                <Button onClick={() => setIsFilterMenuOpen(false)}>Apply Filters</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={getCurrentTab()} className="mb-8">
        <TabsList className="mb-8 w-full justify-start overflow-auto">
          <TabsTrigger 
            value="all" 
            className="flex items-center gap-1"
            onClick={() => setSelectedCategories([])}
          >
            <Layers className="h-4 w-4" />
            All Works ({filteredGalleryItems.length})
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger 
              key={category}
              value={category} 
              className="flex items-center gap-1"
              onClick={() => setSelectedCategories([category])}
            >
              {category === "web" && <Lightbulb className="h-4 w-4" />}
              {category === "ui" && <Paintbrush className="h-4 w-4" />}
              {category === "brand" && <Camera className="h-4 w-4" />}
              {category === "illustration" && <Paintbrush className="h-4 w-4" />}
              {category.charAt(0).toUpperCase() + category.slice(1)} ({galleryItems.filter(item => item.category === category).length})
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="m-0">
          {renderGalleryGrid(filteredGalleryItems)}
        </TabsContent>
        
        {/* Category tabs */}
        {categories.map(category => (
          <TabsContent key={category} value={category} className="m-0">
            {renderGalleryGrid(galleryItems.filter(item => item.category === category))}
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="flex justify-center mt-8">
        <Button>
          Load More Projects
        </Button>
      </div>
    </div>
  );
  
  // Helper function to render gallery grid
  function renderGalleryGrid(items: GalleryItem[]) {
    if (items.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No gallery items match your filters</p>
          <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden group cursor-pointer">
            <Dialog>
              <DialogTrigger asChild>
                <div 
                  className="relative h-64 bg-gray-100 dark:bg-gray-800"
                  onClick={() => setSelectedImage(item.id)}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <ZoomIn className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0">
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <Button size="icon" variant="ghost" className="rounded-full bg-black/20 hover:bg-black/40 text-white">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-3/4 relative bg-gray-100 dark:bg-gray-800">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="h-full w-full object-contain max-h-[70vh]"
                      />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/20 hover:bg-black/40 text-white"
                        onClick={() => navigateImage('prev')}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/20 hover:bg-black/40 text-white"
                        onClick={() => navigateImage('next')}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="lg:w-1/4 p-6 flex flex-col">
                      <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {item.description}
                      </p>
                      
                      {item.tags && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-sm mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-500 dark:text-gray-400">Category</span>
                          <span className="font-medium capitalize">{item.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Created</span>
                          <span className="font-medium">{item.year}</span>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex gap-2 mt-auto">
                        <Button size="sm" variant="outline" className="flex-1 flex items-center justify-center gap-1">
                          <Heart className="h-4 w-4" />
                          Like
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 flex items-center justify-center gap-1">
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center justify-center w-10 px-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <CardContent className="p-4">
              <h3 className="font-semibold">{item.title}</h3>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{item.category}</p>
                {item.year && <p className="text-xs text-gray-500">{item.year}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}