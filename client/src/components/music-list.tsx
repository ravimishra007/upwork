import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Switch } from "@/components/ui/switch";
import { 
  Music, 
  Search, 
  List, 
  Grid, 
  ChevronUp, 
  ChevronDown, 
  ExternalLink,
  Disc,
  Music2,
  Info
} from "lucide-react";
import ResponsiveImage from "@/components/responsive-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Favorite music interface
interface FavoriteMusic {
  id: number;
  title: string;
  artist: string;
  year: string;
  genre: string;
  imageUrl?: string | null;
  type: string;
}

// Affiliate link generation function
function generateAffiliateLinks(title: string, artist: string, isAlbum: boolean) {
  const encodedQuery = encodeURIComponent(`${title} ${artist}`);
  
  if (isAlbum) {
    return {
      amazon: `https://www.amazon.com/s?k=${encodedQuery} album&tag=stanislavnikov-20`,
      spotify: `https://open.spotify.com/search/${encodedQuery} album`,
      appleMusic: `https://music.apple.com/us/search?term=${encodedQuery} album`,
      youtube: `https://www.youtube.com/results?search_query=${encodedQuery} full album`,
      deezer: `https://www.deezer.com/search/${encodedQuery} album`,
      bandcamp: `https://bandcamp.com/search?q=${encodedQuery}`
    };
  } else {
    return {
      amazon: `https://www.amazon.com/s?k=${encodedQuery} song&tag=stanislavnikov-20`,
      spotify: `https://open.spotify.com/search/${encodedQuery}`,
      appleMusic: `https://music.apple.com/us/search?term=${encodedQuery}`,
      youtube: `https://www.youtube.com/results?search_query=${encodedQuery} song`,
      deezer: `https://www.deezer.com/search/${encodedQuery}`,
      soundcloud: `https://soundcloud.com/search?q=${encodedQuery}`
    };
  }
}

// Music List component
export default function MusicList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMusic, setSelectedMusic] = useState<FavoriteMusic | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortField, setSortField] = useState<"title" | "artist" | "year" | "genre">("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showAlbums, setShowAlbums] = useState(false);

  // Fetch music data from the API
  const { data: musicData, isLoading, error } = useQuery({
    queryKey: ['/api/music', showAlbums ? 'album' : 'song'],
    queryFn: async () => {
      const type = showAlbums ? "album" : "song";
      const response = await fetch(`/api/music?type=${type}`);
      if (!response.ok) {
        throw new Error("Failed to fetch music data");
      }
      return response.json() as Promise<FavoriteMusic[]>;
    }
  });
  
  // Get the music list from API data
  const musicList = musicData || [];
  
  // Media type label
  const mediaLabel = showAlbums ? 'Albums' : 'Songs';

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

  // Filter music based on search term
  const filteredMusic = musicList.filter(music => {
    const search = searchTerm.toLowerCase();
    return (
      music.title.toLowerCase().includes(search) ||
      music.artist.toLowerCase().includes(search) ||
      music.genre.toLowerCase().includes(search) ||
      music.year.includes(search)
    );
  });

  // Sort music list
  const sortedMusic = [...filteredMusic].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === "title") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortField === "artist") {
      comparison = a.artist.localeCompare(b.artist);
    } else if (sortField === "year") {
      comparison = a.year.localeCompare(b.year);
    } else if (sortField === "genre") {
      comparison = a.genre.localeCompare(b.genre);
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Toggle sort direction
  const toggleSort = (field: "title" | "artist" | "year" | "genre") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle opening the affiliate links dialog
  const handleOpenAffiliateDialog = (music: FavoriteMusic) => {
    setSelectedMusic(music);
  };

  // Render sort indicator
  const renderSortIndicator = (field: "title" | "artist" | "year" | "genre") => {
    if (sortField !== field) return null;
    
    return sortDirection === "asc" 
      ? <ChevronUp className="inline h-4 w-4" /> 
      : <ChevronDown className="inline h-4 w-4" />;
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden border-0 sm:border">
      <CardHeader className="pb-1 pt-2 px-2 sm:px-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href={`/datasets/${showAlbums ? 'albums' : 'singles'}`}>
              <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                {showAlbums ? (
                  <Disc className="mr-2 h-5 w-5 text-indigo-500" />
                ) : (
                  <Music2 className="mr-2 h-5 w-5 text-indigo-500" /> 
                )}
              </Button>
            </Link>
            <Link href={`/datasets/${showAlbums ? 'albums' : 'singles'}`}>
              <CardTitle className="text-lg flex items-center cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {mediaLabel}
              </CardTitle>
            </Link>
            {isLoading && <span className="ml-2 text-xs text-gray-500">(Loading...)</span>}
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
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
            <div className="flex items-center space-x-1 sm:space-x-2 px-0 min-w-[160px] justify-end">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm">Songs</span>
                <Switch 
                  checked={showAlbums} 
                  onCheckedChange={setShowAlbums} 
                  id="album-mode"
                  className="scale-90"
                />
                <span className="text-xs sm:text-sm">Albums</span>
              </div>
            </div>
          </div>
          
          {viewMode === "list" ? (
            <div className="flex-grow flex flex-col overflow-hidden">
              <div className="grid grid-cols-12 gap-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 border-b">
                <div className="col-span-1"></div>
                <div 
                  className="col-span-4 flex items-center cursor-pointer"
                  onClick={() => toggleSort("title")}
                >
                  {showAlbums ? "Album" : "Song"} {renderSortIndicator("title")}
                </div>
                <div 
                  className="col-span-3 flex items-center cursor-pointer"
                  onClick={() => toggleSort("artist")}
                >
                  Artist {renderSortIndicator("artist")}
                </div>
                <div 
                  className="col-span-2 flex items-center cursor-pointer"
                  onClick={() => toggleSort("year")}
                >
                  Year {renderSortIndicator("year")}
                </div>
                <div 
                  className="col-span-2 hidden sm:flex items-center cursor-pointer"
                  onClick={() => toggleSort("genre")}
                >
                  Genre {renderSortIndicator("genre")}
                </div>
              </div>
              
              <ScrollArea className="h-full flex-1 overflow-auto">
                <div className="space-y-2 pt-1">
                  {sortedMusic.map((music) => (
                    <Dialog key={music.id}>
                      <DialogTrigger asChild>
                        <div 
                          className="grid grid-cols-12 gap-2 px-3 py-3 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => handleOpenAffiliateDialog(music)}
                        >
                          {music.imageUrl && (
                            <div className="col-span-1">
                              <div className="h-12 w-12 rounded overflow-hidden border bg-white dark:bg-gray-900/50 flex items-center justify-center">
                                <img 
                                  src={music.imageUrl} 
                                  alt={`${music.title} by ${music.artist}`}
                                  className="max-h-10 max-w-10 object-contain"
                                />
                              </div>
                            </div>
                          )}
                          <div className={`${music.imageUrl ? 'col-span-4' : 'col-span-5'} font-medium flex items-center`}>
                            {music.title}
                          </div>
                          <div className="col-span-3 flex items-center">
                            {music.artist}
                          </div>
                          <div className="col-span-2 flex items-center">{music.year}</div>
                          <div className="col-span-2 hidden sm:flex items-center">{music.genre}</div>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {showAlbums ? 
                              `Get "${music.title}" by ${music.artist}` : 
                              `Listen to "${music.title}" by ${music.artist}`
                            }
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex items-center gap-4">
                            {music.imageUrl && (
                              <div className="h-20 w-20 rounded overflow-hidden border shrink-0">
                                <img 
                                  src={music.imageUrl} 
                                  alt={`${music.title} by ${music.artist}`}
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-lg">{music.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{music.artist}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <Badge variant="secondary">{music.year}</Badge>
                                <Badge variant="outline">{music.genre}</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Choose where you want to listen to or purchase this {showAlbums ? 'album' : 'song'}:
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(generateAffiliateLinks(music.title, music.artist, showAlbums)).map(([platform, url]) => (
                              <a 
                                key={platform} 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-3 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              >
                                <img 
                                  src={`https://www.google.com/s2/favicons?domain=${platform}.com&sz=32`} 
                                  alt={platform} 
                                  className="h-5 w-5"
                                />
                                <span className="flex-grow capitalize">
                                  {platform === "appleMusic" ? "Apple Music" : platform}
                                </span>
                                <ExternalLink className="h-4 w-4 text-gray-400" />
                              </a>
                            ))}
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
                  ) : sortedMusic.length === 0 && (
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
                {sortedMusic.map((music) => (
                  <Dialog key={music.id}>
                    <DialogTrigger asChild>
                      <div 
                        className="p-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex flex-col h-full"
                        onClick={() => handleOpenAffiliateDialog(music)}
                      >
                        {/* Image section with responsive component */}
                        {music.imageUrl && (
                          <ResponsiveImage
                            src={music.imageUrl}
                            alt={`${music.title} by ${music.artist}`}
                            title={`${music.title} - ${music.artist}`}
                            containerClassName="mb-2"
                            aspectRatio="square"
                            showTitle={true}
                          />
                        )}
                        
                        {/* Title section with clear hierarchy */}
                        <div className="mb-auto px-1 w-full">
                          <h4 className="font-medium text-xs mb-1 line-clamp-1">{music.title}</h4>
                          <div className="text-[11px] text-gray-600 dark:text-gray-400 line-clamp-1">{music.artist}</div>
                        </div>
                        
                        {/* Details section with smaller fonts */}
                        <div className="mt-2 px-1 w-full">
                          <div className="flex items-center justify-between text-[10px]">
                            <span>{music.year}</span>
                            <span className="text-gray-500">{music.genre}</span>
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {showAlbums ? 
                            `Get "${music.title}" by ${music.artist}` : 
                            `Listen to "${music.title}" by ${music.artist}`
                          }
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center gap-4">
                          {music.imageUrl && (
                            <div className="h-20 w-20 rounded overflow-hidden border shrink-0 bg-white dark:bg-gray-900/50 flex items-center justify-center">
                              <img 
                                src={music.imageUrl} 
                                alt={`${music.title} by ${music.artist}`}
                                className="max-h-16 max-w-16 object-contain"
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">{music.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{music.artist}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <Badge variant="secondary">{music.year}</Badge>
                              <Badge variant="outline">{music.genre}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Choose where you want to listen to or purchase this {showAlbums ? 'album' : 'song'}:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(generateAffiliateLinks(music.title, music.artist, showAlbums)).map(([platform, url]) => (
                            <a 
                              key={platform} 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <img 
                                src={`https://www.google.com/s2/favicons?domain=${platform}.com&sz=32`} 
                                alt={platform} 
                                className="h-5 w-5"
                              />
                              <span className="flex-grow capitalize">
                                {platform === "appleMusic" ? "Apple Music" : platform}
                              </span>
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            </a>
                          ))}
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
                ) : sortedMusic.length === 0 && (
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