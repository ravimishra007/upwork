import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Heart, Share2, Download, ZoomIn, X, ExternalLink, ImageIcon } from "lucide-react";
import { Link } from "wouter";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  tags?: string[];
  year?: string;
  client?: string;
  projectUrl?: string;
  featured?: boolean;
}

interface GalleryPreviewProps {
  title?: string;
  limit?: number;
  category?: string;
  featured?: boolean;
  className?: string;
  showMoreLink?: boolean;
}

export default function GalleryPreview({
  title = "Featured Work",
  limit = 3,
  category,
  featured = false,
  className = "",
  showMoreLink = true
}: GalleryPreviewProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Fetch gallery items from API
  const { 
    data: galleryItems = [], 
    isLoading, 
    error 
  } = useQuery<GalleryItem[]>({
    queryKey: ['/api/datasets/gallery-items'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Filter gallery items based on props
  const filteredItems = galleryItems
    .filter(item => {
      if (category && item.category !== category) return false;
      if (featured && !item.featured) return false;
      return true;
    })
    .slice(0, limit);

  // Function to handle image navigation in modal
  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    } else {
      newIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedImage(filteredItems[newIndex].id);
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array(limit).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || filteredItems.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        <Card className="p-6 text-center">
          <p className="text-gray-500">
            {error ? "Error loading gallery items" : "No gallery items found"}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        {showMoreLink && (
          <Link href="/gallery">
            <Button variant="ghost" size="sm" className="flex items-center">
              <span>View All</span>
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden group cursor-pointer">
            <Dialog>
              <DialogTrigger asChild>
                <div 
                  className="relative h-48 bg-gray-100 dark:bg-gray-800"
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
                        {item.year && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Created</span>
                            <span className="font-medium">{item.year}</span>
                          </div>
                        )}
                        {item.client && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Client</span>
                            <span className="font-medium">{item.client}</span>
                          </div>
                        )}
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
    </div>
  );
} 