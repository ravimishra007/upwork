import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResponsiveImage from "@/components/responsive-image";
import { 
  BookOpen, 
  BookText,
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Film, 
  Grid, 
  Info, 
  List, 
  Search, 
  Star 
} from "lucide-react";
import { apiClient } from "../services/apiClient";

// Interface for media items (movies, TV shows, books)
interface FavoriteMedia {
  id: number;
  title: string;
  director: string; // or author for books
  year: string;
  genre: string[];
  rating: number;
  imageUrl: string | null;
  type: string;
}

// Generate affiliate links for books and movies
function generateAffiliateLinks(title: string, year: string, isBook: boolean = false) {
  const encodedTitle = encodeURIComponent(title);
  const encodedSearch = encodeURIComponent(`${title} ${year}`);
  
  if (isBook) {
    return {
      amazonKindle: `https://www.amazon.com/s?k=${encodedSearch}+kindle+edition&tag=myaffiliate-20`,
      amazonPaperback: `https://www.amazon.com/s?k=${encodedSearch}+paperback&tag=myaffiliate-20`,
      amazonHardcover: `https://www.amazon.com/s?k=${encodedSearch}+hardcover&tag=myaffiliate-20`,
      amazonAudiobook: `https://www.amazon.com/s?k=${encodedSearch}+audiobook&tag=myaffiliate-20`,
      barnesNoble: `https://www.barnesandnoble.com/s/${encodedSearch}`,
      googlePlay: `https://play.google.com/store/search?q=${encodedSearch}&c=books`,
      appleBooksStore: `https://books.apple.com/us/book/${encodedTitle}`
    };
  } else {
    return {
      amazonPrimeVideo: `https://www.amazon.com/s?k=${encodedSearch}&i=instant-video&tag=myaffiliate-20`,
      amazonBluRay: `https://www.amazon.com/s?k=${encodedSearch}+blu+ray&tag=myaffiliate-20`,
      amazonDVD: `https://www.amazon.com/s?k=${encodedSearch}+dvd&tag=myaffiliate-20`,
      googlePlayMovies: `https://play.google.com/store/search?q=${encodedSearch}&c=movies`,
      appleTV: `https://tv.apple.com/search?term=${encodedSearch}`,
      youTube: `https://www.youtube.com/results?search_query=${encodedSearch}+trailer`,
      disneyPlus: `https://www.disneyplus.com/search?q=${encodedSearch}`,
      huluPlus: `https://www.hulu.com/search?q=${encodedSearch}`
    };
  }
}

// Media List component
export default function MovieList() {
  const [activeTab, setActiveTab] = useState<"movies" | "books">("movies");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<FavoriteMedia | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortField, setSortField] = useState<"title" | "director" | "year" | "rating">("rating");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  // Fetch media data from the API
  const { data: mediaData, isLoading, error } = useQuery({
    queryKey: ['/api/movies', activeTab],
    queryFn: async () => {
      const type = activeTab === "books" ? "book" : "movie";
      console.log(`Fetching ${type} data`);
      try {
        const data = await apiClient.get(`/api/movies?type=${type}`);
        console.log(`Received ${type} data:`, data);
        return data || [];
      } catch (err) {
        console.error(`Error fetching ${type} data:`, err);
        throw err;
      }
    }
  });
  
  // Variable for current media type name and icon
  const mediaLabel = activeTab === "books" ? "Books" : "Movies";
  const directorLabel = activeTab === "books" ? "Author" : "Director";
  const mediaIcon = activeTab === "books" ? BookOpen : Film;
  
  // Get the appropriate media list based on active tab
  const mediaList = mediaData || [];
  
  // Get all unique genres from the current media list
  // Error display section
  if (error) {
    return (
      <Card className="h-full flex flex-col overflow-hidden border-0 sm:border">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to load {mediaLabel.toLowerCase()} data. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Get all unique genres from the current media list
  const allGenres = Array.from(
    new Set(mediaList.flatMap((item: FavoriteMedia) => 
      Array.isArray(item.genre) ? item.genre : []
    ))
  ).sort() as string[];

  // Filter media based on search term and genre filter
  const filteredMedia = mediaList.filter((item: FavoriteMedia) => {
    // Apply search filter
    const search = searchTerm.toLowerCase();
    const matchesSearch = (
      item.title.toLowerCase().includes(search) ||
      item.director.toLowerCase().includes(search) ||
      (Array.isArray(item.genre) && item.genre.some((g: string) => g.toLowerCase().includes(search))) ||
      (item.year && item.year.includes(search))
    );
    
    // Apply genre filter
    const matchesGenre = !selectedGenre || 
      (Array.isArray(item.genre) && item.genre.includes(selectedGenre));
    
    return matchesSearch && matchesGenre;
  });

  // Sort media list
  const sortedMedia = [...filteredMedia].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === "title") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortField === "director") {
      comparison = a.director.localeCompare(b.director);
    } else if (sortField === "year") {
      comparison = a.year.localeCompare(b.year);
    } else if (sortField === "rating") {
      comparison = a.rating - b.rating;
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Toggle sort direction
  const toggleSort = (field: "title" | "director" | "year" | "rating") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "rating" ? "desc" : "asc");
    }
  };

  // Handle opening the affiliate links dialog
  const handleOpenAffiliateDialog = (media: FavoriteMedia) => {
    setSelectedMedia(media);
  };

  // Render sort indicator
  const renderSortIndicator = (field: "title" | "director" | "year" | "rating") => {
    if (sortField !== field) return null;
    
    return sortDirection === "asc" 
      ? <ChevronUp className="inline h-4 w-4" /> 
      : <ChevronDown className="inline h-4 w-4" />;
  };

  // Render star rating
  const renderRating = (rating: number) => {
    // Ensure rating is between 0 and 10
    const normalizedRating = Math.min(Math.max(rating, 0), 10);
    
    // Calculate stars for a 5-star rating system (movie ratings are out of 10)
    const fullStars = Math.min(Math.floor(normalizedRating / 2), 5);
    const hasHalfStar = (normalizedRating / 2) % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));
    
    return (
      <div className="flex items-center">
        <span className="mr-1 text-xs">{normalizedRating.toFixed(1)}</span>
        <div className="flex text-yellow-400">
          {Array.from({ length: fullStars }).map((_, i) => (
            <Star key={`full-${i}`} className="h-3 w-3 fill-yellow-400" />
          ))}
          {hasHalfStar && (
            <Star className="h-3 w-3" />
          )}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden border-0 sm:border">
      <CardHeader className="pb-1 pt-2 px-2 sm:px-3 flex-shrink-0">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href={`/datasets/${activeTab === "books" ? 'books' : 'moviesAndTvSeries'}`}>
                <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                  {activeTab === "books" ? (
                    <BookOpen className="mr-2 h-5 w-5 text-indigo-500" />
                  ) : (
                    <Film className="mr-2 h-5 w-5 text-indigo-500" />
                  )}
                </Button>
              </Link>
              <Link href={`/datasets/${activeTab === "books" ? 'books' : 'moviesAndTvSeries'}`}>
                <CardTitle className="text-lg flex items-center cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {mediaLabel}
                </CardTitle>
              </Link>
              {isLoading && <span className="ml-2 text-xs text-gray-500">(Loading...)</span>}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost" 
                size="icon"
                className={`h-7 w-7 ${viewMode === "list" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                onClick={() => setViewMode("list")}
                title="List view"
              >
                <List className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost" 
                size="icon"
                className={`h-7 w-7 ${viewMode === "grid" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <Grid className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <Tabs 
            defaultValue="movies" 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "movies" | "books")}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-[300px] grid-cols-2 h-8">
              <TabsTrigger value="movies" className="flex items-center gap-1 text-xs sm:text-sm py-0.5">
                <Film className="h-3.5 w-3.5" />
                <span>Movies & TV</span>
              </TabsTrigger>
              <TabsTrigger value="books" className="flex items-center gap-1 text-xs sm:text-sm py-0.5">
                <BookText className="h-3.5 w-3.5" />
                <span>Books</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0 px-1 sm:px-2 pt-0 sm:pt-1 flex-grow overflow-auto">
        <div className="h-full flex flex-col">
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sticky top-0 bg-white dark:bg-gray-900 z-10 p-1 sm:px-1 py-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder={`Search ${mediaLabel.toLowerCase()}...`}
                className="pl-7 h-8 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select 
                className="h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={selectedGenre || ""}
                onChange={(e) => setSelectedGenre(e.target.value || null)}
              >
                <option value="">All Genres</option>
                {allGenres.map((genre: string) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>
          
          {viewMode === "list" ? (
            <div className="flex-grow flex flex-col overflow-hidden">
              <div className="grid grid-cols-12 gap-2 px-2 py-1.5 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 border-b">
                <div className="col-span-1"></div>
                <div 
                  className="col-span-5 flex items-center cursor-pointer"
                  onClick={() => toggleSort("title")}
                >
                  Title {renderSortIndicator("title")}
                </div>
                <div 
                  className="col-span-2 hidden sm:flex items-center cursor-pointer"
                  onClick={() => toggleSort("director")}
                >
                  {directorLabel} {renderSortIndicator("director")}
                </div>
                <div 
                  className="col-span-2 sm:col-span-1 flex items-center cursor-pointer"
                  onClick={() => toggleSort("year")}
                >
                  Year {renderSortIndicator("year")}
                </div>
                <div 
                  className="col-span-3 sm:col-span-2 flex items-center cursor-pointer"
                  onClick={() => toggleSort("rating")}
                >
                  Rating {renderSortIndicator("rating")}
                </div>
                <div className="col-span-1"></div>
              </div>
              
              <ScrollArea className="h-full flex-1 overflow-auto">
                <div className="space-y-2 pt-1">
                  {sortedMedia.map((media) => (
                    <Dialog key={media.id}>
                      <DialogTrigger asChild>
                        <div 
                          className="grid grid-cols-12 gap-3 px-3 py-2.5 text-xs sm:text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => handleOpenAffiliateDialog(media)}
                        >
                          {media.imageUrl && (
                            <div className="col-span-1 mr-2">
                              <div className="h-14 w-10 rounded overflow-hidden border">
                                <img 
                                  src={media.imageUrl} 
                                  alt={`${media.title} poster`}
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                            </div>
                          )}
                          <div className={`${media.imageUrl ? 'col-span-5' : 'col-span-6'} font-medium line-clamp-1 flex items-center`}>
                            {media.title}
                          </div>
                          <div className="col-span-2 hidden sm:flex items-center line-clamp-1">{media.director}</div>
                          <div className="col-span-2 sm:col-span-1 flex items-center">{media.year}</div>
                          <div className="col-span-3 sm:col-span-2 flex items-center">
                            {renderRating(media.rating)}
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {activeTab === "books" ? "Read" : "Watch"} "{media.title}" ({media.year})
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex flex-col sm:flex-row gap-2 text-sm">
                            <div><span className="font-medium">{directorLabel}:</span> {media.director}</div>
                            <div className="sm:ml-4"><span className="font-medium">Rating:</span> {media.rating}/10</div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {media.genre.map((g: string, idx: number) => (
                              <Badge key={idx} variant="secondary">{g}</Badge>
                            ))}
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Choose where you want to {activeTab === "books" ? "purchase" : "watch"} this {activeTab === "books" ? "book" : "movie"}:
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(generateAffiliateLinks(media.title, media.year, activeTab === "books")).map(([platform, url]) => {
                              // Format platform name for display
                              const platformDisplay = platform
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase())
                                .replace('Amazon Prime', 'Amazon Prime Video')
                                .replace('Hulu Plus', 'Hulu')
                                .replace('Amazon Blu Ray', 'Amazon Blu-ray')
                                .replace('Amazon DVD', 'Amazon DVD');
                              
                              // Get domain for favicon
                              let domain = platform.toLowerCase();
                              if (domain.includes('amazon')) domain = 'amazon';
                              else if (domain.includes('google')) domain = 'google';
                              else if (domain.includes('apple')) domain = 'apple';
                              else if (domain.includes('disney')) domain = 'disney';
                              else if (domain.includes('barnes')) domain = 'barnesandnoble';
                              
                              return (
                                <a 
                                  key={platform} 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-3 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                  <img 
                                    src={`https://www.google.com/s2/favicons?domain=${domain}.com&sz=32`} 
                                    alt={platform} 
                                    className="h-5 w-5"
                                  />
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
                  ))}
                  
                  {isLoading ? (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                      Loading {mediaLabel.toLowerCase()}...
                    </div>
                  ) : sortedMedia.length === 0 && (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                      No {mediaLabel.toLowerCase()} found matching your search.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <ScrollArea className="h-full flex-1 overflow-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 px-1 py-2">
                {sortedMedia.map((media) => (
                  <Dialog key={media.id}>
                    <DialogTrigger asChild>
                      <div 
                        className="p-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex flex-col h-full"
                        onClick={() => handleOpenAffiliateDialog(media)}
                      >
                        {/* Image section using the responsive component */}
                        {media.imageUrl && (
                          <ResponsiveImage
                            src={media.imageUrl}
                            alt={`${media.title} poster`}
                            title={`${media.title} (${media.year})`}
                            containerClassName="mb-2"
                            aspectRatio="portrait"
                            showTitle={true}
                          />
                        )}
                        
                        {/* Title section below image with smaller fonts */}
                        <div className="mb-2 px-1 w-full">
                          <h4 className="font-medium text-xs mb-1 line-clamp-1">{media.title}</h4>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">{media.director}</div>
                        </div>
                        
                        {/* Details section with even smaller fonts */}
                        <div className="details-section mt-auto px-1 w-full">
                          <div className="flex items-center justify-between text-[10px] mb-1.5">
                            <span>{media.year}</span>
                            <div className="flex items-center gap-1">
                              {renderRating(media.rating)}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {media.genre.slice(0, 2).map((genre: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-[9px] py-0 px-1.5 h-4">{genre}</Badge>
                            ))}
                            {media.genre.length > 2 && (
                              <Badge variant="outline" className="text-[9px] py-0 px-1.5 h-4">+{media.genre.length - 2}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {activeTab === "books" ? "Read" : "Watch"} "{media.title}" ({media.year})
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex flex-col sm:flex-row gap-2 text-sm">
                          <div><span className="font-medium">{directorLabel}:</span> {media.director}</div>
                          <div className="sm:ml-4"><span className="font-medium">Rating:</span> {media.rating}/10</div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {media.genre.map((g: string, idx: number) => (
                            <Badge key={idx} variant="secondary">{g}</Badge>
                          ))}
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Choose where you want to {activeTab === "books" ? "purchase" : "watch"} this {activeTab === "books" ? "book" : "movie"}:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(generateAffiliateLinks(media.title, media.year, activeTab === "books")).map(([platform, url]) => {
                            // Format platform name for display
                            const platformDisplay = platform
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, str => str.toUpperCase())
                              .replace('Amazon Prime', 'Amazon Prime Video')
                              .replace('Hulu Plus', 'Hulu')
                              .replace('Amazon Blu Ray', 'Amazon Blu-ray')
                              .replace('Amazon DVD', 'Amazon DVD');
                            
                            // Get domain for favicon
                            let domain = platform.toLowerCase();
                            if (domain.includes('amazon')) domain = 'amazon';
                            else if (domain.includes('google')) domain = 'google';
                            else if (domain.includes('apple')) domain = 'apple';
                            else if (domain.includes('disney')) domain = 'disney';
                            else if (domain.includes('barnes')) domain = 'barnesandnoble';
                            
                            return (
                              <a 
                                key={platform} 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-3 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              >
                                <img 
                                  src={`https://www.google.com/s2/favicons?domain=${domain}.com&sz=32`} 
                                  alt={platform} 
                                  className="h-5 w-5"
                                />
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
                ))}
                
                {isLoading ? (
                  <div className="col-span-2 md:col-span-3 py-8 text-center text-gray-500 dark:text-gray-400">
                    Loading {mediaLabel.toLowerCase()}...
                  </div>
                ) : sortedMedia.length === 0 && (
                  <div className="col-span-2 md:col-span-3 py-8 text-center text-gray-500 dark:text-gray-400">
                    No {mediaLabel.toLowerCase()} found matching your search.
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}