import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp, Database, List, Grid, Table2, Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Album, Single, MovieOrTvSeries, Book, ReadingResource, Course, GalleryItem, AndroidApp, WindowsApp, BlogPost } from "@shared/schema";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

// Define types for different datasets
type DatasetType = 
  | 'singles' 
  | 'albums' 
  | 'moviesAndTvSeries' 
  | 'books'
  | 'readingResources'
  | 'courses'
  | 'galleryItems'
  | 'androidApps'
  | 'windowsApps'
  | 'blogPosts';

interface DatasetDisplayProps {
  name: string;
  type: DatasetType;
  apiEndpoint: string;
  description?: string;
}

export function DatasetDisplay({ name, type, apiEndpoint, description }: DatasetDisplayProps) {
  // Check if this dataset type is selected in session storage
  const initialExpanded = () => {
    const selectedType = sessionStorage.getItem('selectedDatasetType');
    return selectedType === type;
  };
  
  const [expanded, setExpanded] = useState(initialExpanded());
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  
  // Fetch dataset data
  const { data, isLoading, error } = useQuery<any[]>({
    queryKey: [apiEndpoint],
    enabled: expanded, // Only fetch when expanded
  });
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Get nice label for the dataset type
  const getTypeLabel = () => {
    switch(type) {
      case 'singles': return 'Singles';
      case 'albums': return 'Albums';
      case 'moviesAndTvSeries': return 'Movies & TV Series';
      case 'books': return 'Books';
      case 'readingResources': return 'Reading Resources';
      case 'courses': return 'Courses';
      case 'galleryItems': return 'Gallery Items';
      case 'androidApps': return 'Android Apps';
      case 'windowsApps': return 'Windows Apps';
      default: return 'Data';
    }
  };
  
  // Render dataset preview (collapsed state)
  const renderPreview = () => {
    return (
      <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div className="flex items-center">
            <Database className="mr-2 h-5 w-5 text-indigo-500" />
            <Link href={`/datasets/${type}`}>
              <CardTitle 
                className="text-lg cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {name}
              </CardTitle>
            </Link>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleExpanded} className="p-0 h-8 w-8">
                  <ChevronDown className={`h-5 w-5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{expanded ? 'Collapse' : 'Expand'} {name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        {description && (
          <CardContent className="pt-0 pb-4">
            <CardDescription>{description}</CardDescription>
          </CardContent>
        )}
      </Card>
    );
  };
  
  // Render loading state
  const renderLoading = () => {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  };
  
  // Render error state
  const renderError = () => {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md text-red-600 dark:text-red-400">
        <p>Error loading dataset: {error?.toString() || 'Unknown error'}</p>
      </div>
    );
  };
  
  // Render singles
  const renderSingles = (data: Single[]) => {
    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.map(single => (
            <Card key={single.id} className="overflow-hidden">
              {single.imageUrl && (
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={single.imageUrl} 
                    alt={`${single.title} by ${single.artist}`}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="p-3">
                <h3 className="font-semibold truncate">{single.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{single.artist}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{single.releaseDate}</span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3 w-3 ${i < single.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {single.genre.map((g, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5">
                      {g}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    } 
    else if (viewMode === 'list') {
      return (
        <div className="divide-y">
          {data.map(single => (
            <div key={single.id} className="py-3 flex items-center space-x-4">
              {single.imageUrl && (
                <div className="h-12 w-12 flex-shrink-0">
                  <img 
                    src={single.imageUrl} 
                    alt={`${single.title} by ${single.artist}`}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
              )}
              <div className="flex-grow min-w-0">
                <h3 className="font-medium truncate">{single.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{single.artist}</p>
              </div>
              <div className="text-xs text-gray-500">{single.releaseDate}</div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-3 w-3 ${i < single.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } 
    else {
      return (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Artist</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Release Date</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Genre</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Links</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {data.map(single => (
              <tr key={single.id}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{single.title}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{single.artist}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{single.releaseDate}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex flex-wrap gap-1">
                    {single.genre.slice(0, 2).map((g, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5">
                        {g}
                      </Badge>
                    ))}
                    {single.genre.length > 2 && <span className="text-xs">+{single.genre.length - 2}</span>}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3 w-3 ${i < single.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex space-x-2">
                    {single.spotifyUrl && (
                      <a href={single.spotifyUrl} target="_blank" rel="noopener noreferrer">
                        <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                      </a>
                    )}
                    {single.appleMusicUrl && (
                      <a href={single.appleMusicUrl} target="_blank" rel="noopener noreferrer">
                        <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15-.04-.003-.083-.01-.124-.013H5.988c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208c-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.802.42.127.856.187 1.293.228.405.038.813.05 1.22.05.016 0 .032.006.048.006h12.217c.35-.004.7-.036 1.048-.084.854-.126 1.655-.392 2.33-1.003.676-.61 1.127-1.367 1.33-2.263.09-.4.15-.813.15-1.227.017-.292.02-.583.02-.873V6.124zm-2.067 8.92c-.017.22-.043.44-.08.654-.095.56-.323 1.05-.713 1.46-.388.404-.875.65-1.434.766-.32.068-.642.11-.973.12-.2.01-.394.013-.587.013-.17 0-.34 0-.51-.003H7.366c-.386 0-.774-.037-1.155-.105-.552-.105-1.034-.324-1.43-.702-.396-.397-.635-.9-.732-1.47-.043-.255-.07-.515-.07-.78-.007-.776-.003-1.553-.003-2.33v-4.99c0-.02-.003-.04-.003-.06.003-.126.006-.25.012-.372.058-.764.29-1.43.822-1.976.342-.353.747-.598 1.207-.758.407-.14.842-.192 1.278-.208.118-.006.237-.01.355-.01H18.77c.118 0 .236.004.354.006.52.016 1.035.068 1.527.232.713.236 1.262.66 1.627 1.324.255.465.37.96.403 1.48.007.12.01.237.01.357v.09c0 3.203 0 6.4.002 9.6z"/>
                          <path d="M11.997 8.723c-1.667 0-3.024 1.356-3.024 3.022 0 1.667 1.357 3.024 3.024 3.024s3.025-1.357 3.025-3.023c0-1.667-1.358-3.024-3.025-3.024z"/>
                        </svg>
                      </a>
                    )}
                    {single.youtubeUrl && (
                      <a href={single.youtubeUrl} target="_blank" rel="noopener noreferrer">
                        <svg className="h-4 w-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };
  
  // Render albums (similar to singles with some differences)
  const renderAlbums = (data: Album[]) => {
    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.map(album => (
            <Card key={album.id} className="overflow-hidden">
              {album.imageUrl && (
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={album.imageUrl} 
                    alt={`${album.title} by ${album.artist}`}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="p-3">
                <h3 className="font-semibold truncate">{album.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{album.artist}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{album.releaseDate}</span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3 w-3 ${i < album.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {album.genre.map((g, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5">
                      {g}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    } else if (viewMode === 'list') {
      return (
        <div className="divide-y">
          {data.map(album => (
            <div key={album.id} className="py-3 flex items-center space-x-4">
              {album.imageUrl && (
                <div className="h-12 w-12 flex-shrink-0">
                  <img 
                    src={album.imageUrl} 
                    alt={`${album.title} by ${album.artist}`}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
              )}
              <div className="flex-grow min-w-0">
                <h3 className="font-medium truncate">{album.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{album.artist}</p>
              </div>
              <div className="text-xs text-gray-500">{album.releaseDate}</div>
              <div className="text-xs text-gray-500">{album.tracklist?.length || 0} tracks</div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-3 w-3 ${i < album.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Artist</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Release Date</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tracks</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Genre</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Links</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {data.map(album => (
              <tr key={album.id}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{album.title}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{album.artist}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{album.releaseDate}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{album.tracklist?.length || 0}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex flex-wrap gap-1">
                    {album.genre.slice(0, 2).map((g, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5">
                        {g}
                      </Badge>
                    ))}
                    {album.genre.length > 2 && <span className="text-xs">+{album.genre.length - 2}</span>}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3 w-3 ${i < album.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex space-x-2">
                    {album.spotifyUrl && (
                      <a href={album.spotifyUrl} target="_blank" rel="noopener noreferrer">
                        <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                      </a>
                    )}
                    {album.appleMusicUrl && (
                      <a href={album.appleMusicUrl} target="_blank" rel="noopener noreferrer">
                        <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15-.04-.003-.083-.01-.124-.013H5.988c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208c-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.802.42.127.856.187 1.293.228.405.038.813.05 1.22.05.016 0 .032.006.048.006h12.217c.35-.004.7-.036 1.048-.084.854-.126 1.655-.392 2.33-1.003.676-.61 1.127-1.367 1.33-2.263.09-.4.15-.813.15-1.227.017-.292.02-.583.02-.873V6.124zm-2.067 8.92c-.017.22-.043.44-.08.654-.095.56-.323 1.05-.713 1.46-.388.404-.875.65-1.434.766-.32.068-.642.11-.973.12-.2.01-.394.013-.587.013-.17 0-.34 0-.51-.003H7.366c-.386 0-.774-.037-1.155-.105-.552-.105-1.034-.324-1.43-.702-.396-.397-.635-.9-.732-1.47-.043-.255-.07-.515-.07-.78-.007-.776-.003-1.553-.003-2.33v-4.99c0-.02-.003-.04-.003-.06.003-.126.006-.25.012-.372.058-.764.29-1.43.822-1.976.342-.353.747-.598 1.207-.758.407-.14.842-.192 1.278-.208.118-.006.237-.01.355-.01H18.77c.118 0 .236.004.354.006.52.016 1.035.068 1.527.232.713.236 1.262.66 1.627 1.324.255.465.37.96.403 1.48.007.12.01.237.01.357v.09c0 3.203 0 6.4.002 9.6z"/>
                          <path d="M11.997 8.723c-1.667 0-3.024 1.356-3.024 3.022 0 1.667 1.357 3.024 3.024 3.024s3.025-1.357 3.025-3.023c0-1.667-1.358-3.024-3.025-3.024z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };
  
  // Render Android Apps
  const renderAndroidApps = (data: AndroidApp[]) => {
    if (viewMode === 'table') {
      return (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Developer</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {data.map(app => (
              <tr key={app.id}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{app.name}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{app.developer}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{app.category}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3 w-3 ${i < app.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{app.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    
    if (viewMode === 'list') {
      return (
        <div className="space-y-2">
          {data.map(app => (
            <div 
              key={app.id} 
              className="flex items-center p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {app.imageUrl && (
                <div className="flex-shrink-0 h-14 w-14 mr-4 rounded-md overflow-hidden border">
                  <img 
                    src={app.imageUrl} 
                    alt={app.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-grow">
                <h3 className="text-sm font-medium">{app.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{app.developer}</p>
                <div className="flex items-center mt-1">
                  <div className="flex items-center mr-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3 w-3 ${i < app.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                    {app.category}
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{app.price}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    // Grid view (default)
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {data.map(app => (
          <div 
            key={app.id} 
            className="border rounded-md overflow-hidden hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            <div className="h-40 bg-gray-100 dark:bg-gray-800 flex justify-center items-center p-4">
              {app.imageUrl ? (
                <img 
                  src={app.imageUrl} 
                  alt={app.name} 
                  className="h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                  <span className="text-xs">No image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium line-clamp-1">{app.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">{app.developer}</p>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-3 w-3 ${i < app.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs">{app.price}</span>
              </div>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                {app.category}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render Windows Apps
  const renderWindowsApps = (data: WindowsApp[]) => {
    if (viewMode === 'table') {
      return (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Developer</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {data.map(app => (
              <tr key={app.id}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{app.name}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{app.developer}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{app.category}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3 w-3 ${i < app.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{app.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    
    if (viewMode === 'list') {
      return (
        <div className="space-y-2">
          {data.map(app => (
            <div 
              key={app.id} 
              className="flex items-center p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {app.imageUrl && (
                <div className="flex-shrink-0 h-14 w-14 mr-4 rounded-md overflow-hidden border">
                  <img 
                    src={app.imageUrl} 
                    alt={app.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-grow">
                <h3 className="text-sm font-medium">{app.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{app.developer}</p>
                <div className="flex items-center mt-1">
                  <div className="flex items-center mr-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3 w-3 ${i < app.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                    {app.category}
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{app.price}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    // Grid view (default)
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {data.map(app => (
          <div 
            key={app.id} 
            className="border rounded-md overflow-hidden hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            <div className="h-40 bg-gray-100 dark:bg-gray-800 flex justify-center items-center p-4">
              {app.imageUrl ? (
                <img 
                  src={app.imageUrl} 
                  alt={app.name} 
                  className="h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                  <span className="text-xs">No image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium line-clamp-1">{app.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">{app.developer}</p>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-3 w-3 ${i < app.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs">{app.price}</span>
              </div>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                {app.category}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render movies and TV series
  const renderMoviesAndTvSeries = (data: MovieOrTvSeries[]) => {
    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.map(item => (
            <Card key={item.id} className="overflow-hidden">
              {item.imageUrl && (
                <div className="aspect-[2/3] overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="p-3">
                <h3 className="font-semibold truncate">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{item.director}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{item.releaseYear}</span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3 w-3 ${i < item.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.genre.slice(0, 2).map((g, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5">
                      {g}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    } 
    else if (viewMode === 'list') {
      return (
        <div className="divide-y">
          {data.map(item => (
            <div key={item.id} className="py-3 flex items-center space-x-4">
              {item.imageUrl && (
                <div className="h-12 w-12 flex-shrink-0">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
              )}
              <div className="flex-grow min-w-0">
                <h3 className="font-medium truncate">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{item.director} ({item.releaseYear})</p>
              </div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-3 w-3 ${i < item.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } 
    else {
      return (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Director</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Genre</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {data.map(item => (
              <tr key={item.id}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{item.title}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{item.director}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{item.releaseYear}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex flex-wrap gap-1">
                    {item.genre.slice(0, 2).map((g, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5">
                        {g}
                      </Badge>
                    ))}
                    {item.genre.length > 2 && <span className="text-xs">+{item.genre.length - 2}</span>}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3 w-3 ${i < item.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  <Badge variant={item.type === 'movie' ? 'default' : 'secondary'} className="text-[10px] py-0 px-1.5">
                    {item.type === 'movie' ? 'Movie' : 'TV Series'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };
  
  // Render books
  const renderBooks = (data: Book[]) => {
    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.map(book => (
            <Card key={book.id} className="overflow-hidden">
              {book.imageUrl && (
                <div className="aspect-[2/3] overflow-hidden">
                  <img 
                    src={book.imageUrl} 
                    alt={`${book.title} by ${book.author}`}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="p-3">
                <h3 className="font-semibold truncate">{book.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{book.author}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{book.publicationYear}</span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3 w-3 ${i < book.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {book.genre.slice(0, 2).map((g, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5">
                      {g}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    else if (viewMode === 'list') {
      return (
        <div className="divide-y">
          {data.map(book => (
            <div key={book.id} className="py-3 flex items-center space-x-4">
              {book.imageUrl && (
                <div className="h-12 w-12 flex-shrink-0">
                  <img 
                    src={book.imageUrl} 
                    alt={`${book.title} by ${book.author}`}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
              )}
              <div className="flex-grow min-w-0">
                <h3 className="font-medium truncate">{book.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{book.author} ({book.publicationYear})</p>
              </div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-3 w-3 ${i < book.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
    else {
      return (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Genre</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pages</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {data.map(book => (
              <tr key={book.id}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{book.title}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{book.author}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{book.publicationYear}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex flex-wrap gap-1">
                    {book.genre.slice(0, 2).map((g, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5">
                        {g}
                      </Badge>
                    ))}
                    {book.genre.length > 2 && <span className="text-xs">+{book.genre.length - 2}</span>}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3 w-3 ${i < book.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {book.pageCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  // Render reading resources
  const renderReadingResources = (data: ReadingResource[]) => {
    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.map(resource => (
            <Card key={resource.id} className="overflow-hidden">
              <CardContent className="p-3">
                <h3 className="font-semibold truncate">{resource.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{resource.author}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{resource.publicationDate}</span>
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                    {resource.type}
                  </Badge>
                </div>
                {resource.url && (
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 text-xs text-indigo-600 hover:underline flex items-center"
                  >
                    View Resource
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    else {
      return (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Link</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {data.map(resource => (
              <tr key={resource.id}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{resource.title}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{resource.author}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{resource.publicationDate}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                    {resource.type}
                  </Badge>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  {resource.url && (
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline flex items-center"
                    >
                      View
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };
  
  // Render courses
  const renderCourses = (data: Course[]) => {
    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.map(course => (
            <Card key={course.id} className="overflow-hidden">
              <CardContent className="p-3">
                <h3 className="font-semibold truncate">{course.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{course.provider}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                    {course.difficulty}
                  </Badge>
                  <span className="text-xs text-gray-500">{course.duration}</span>
                </div>
                {course.url && (
                  <a 
                    href={course.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 text-xs text-indigo-600 hover:underline flex items-center"
                  >
                    View Course
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    else {
      return (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Difficulty</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Link</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {data.map(course => (
              <tr key={course.id}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{course.title}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{course.provider}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                    {course.difficulty}
                  </Badge>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{course.duration}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  {course.url && (
                    <a 
                      href={course.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline flex items-center"
                    >
                      View
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };
  
  // Render gallery items
  const renderGalleryItems = (data: GalleryItem[]) => {
    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.map(item => (
            <Card key={item.id} className="overflow-hidden">
              {item.imageUrl && (
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="p-3">
                <h3 className="font-semibold truncate">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{item.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    else {
      return (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tags</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {data.map(item => (
              <tr key={item.id}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{item.title}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{item.description}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && <span className="text-xs">+{item.tags.length - 3}</span>}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{item.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };
  
  // Render blog posts
  const renderBlogPosts = (data: BlogPost[]) => {
    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.map(post => (
            <Card key={post.id} className="overflow-hidden">
              {post.imageUrl && (
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="p-3">
                <h3 className="font-semibold truncate">{post.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{post.summary}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{post.publishDate}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    else {
      return (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Summary</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tags</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {data.map(post => (
              <tr key={post.id}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{post.title}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{post.summary}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{post.publishDate}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 2 && <span className="text-xs">+{post.tags.length - 2}</span>}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{post.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };
  
  // Render dataset based on type
  const renderDataset = () => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          No data available.
        </div>
      );
    }
    
    switch(type) {
      case 'singles':
        return renderSingles(data as Single[]);
      case 'albums':
        return renderAlbums(data as Album[]);
      case 'moviesAndTvSeries':
        return renderMoviesAndTvSeries(data as MovieOrTvSeries[]);
      case 'books':
        return renderBooks(data as Book[]);
      case 'readingResources':
        return renderReadingResources(data as ReadingResource[]);
      case 'courses':
        return renderCourses(data as Course[]);
      case 'galleryItems':
        return renderGalleryItems(data as GalleryItem[]);
      case 'androidApps':
        return renderAndroidApps(data as AndroidApp[]);
      case 'windowsApps':
        return renderWindowsApps(data as WindowsApp[]);
      case 'blogPosts':
        return renderBlogPosts(data as BlogPost[]);
      default:
        return (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Renderer not implemented for type: {type}
          </div>
        );
    }
  };
  
  // Main component render
  return (
    <div className="mb-8">
      {!expanded ? (
        renderPreview()
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <div className="flex items-center">
              <Database className="mr-2 h-5 w-5 text-indigo-500" />
              <CardTitle className="text-lg">{name}</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={viewMode === 'grid' ? 'bg-gray-200 dark:bg-gray-700' : ''}
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Grid View</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={viewMode === 'list' ? 'bg-gray-200 dark:bg-gray-700' : ''}
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>List View</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={viewMode === 'table' ? 'bg-gray-200 dark:bg-gray-700' : ''}
                        onClick={() => setViewMode('table')}
                      >
                        <Table2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Table View</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={toggleExpanded}
                    >
                      <ChevronUp className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Collapse Dataset</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download Dataset</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          {description && (
            <CardContent className="pt-0 pb-2">
              <CardDescription>{description}</CardDescription>
            </CardContent>
          )}
          <CardContent className="pt-0">
            {isLoading ? (
              renderLoading()
            ) : error ? (
              renderError()
            ) : (
              <ScrollArea className="h-[calc(100vh-16rem)] rounded-md border">
                <div className="p-4">
                  {renderDataset()}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface DatasetCollectionProps {
  selectedType?: string;
}

export function DatasetCollection({ selectedType }: DatasetCollectionProps) {
  // Get the correct tab from session storage or default to "home"
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('selectedDatasetTab') || 'home';
    }
    return 'home';
  };

  // Clear the session storage values on unmount
  React.useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('selectedDatasetTab');
        sessionStorage.removeItem('selectedDatasetType');
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Database Collections</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Browse and explore all available datasets. Click on any dataset to expand and view its contents.
        </p>
        
        <Tabs defaultValue={getInitialTab()} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="home">Home Datasets</TabsTrigger>
            <TabsTrigger value="blog">Blog Datasets</TabsTrigger>
            <TabsTrigger value="other">Other Datasets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="home" className="space-y-4">
            <DatasetDisplay 
              name="Singles" 
              type="singles" 
              apiEndpoint="/api/datasets/singles" 
              description="Collection of music singles with artist information, genre, and ratings."
            />
            <DatasetDisplay 
              name="Albums" 
              type="albums" 
              apiEndpoint="/api/datasets/albums" 
              description="Music albums with track listings, artists, and streaming links."
            />
            <DatasetDisplay 
              name="Movies & TV Series" 
              type="moviesAndTvSeries" 
              apiEndpoint="/api/datasets/movies-tv-series" 
              description="Movies and TV series collection with genres, cast, and streaming options."
            />
            <DatasetDisplay 
              name="Books" 
              type="books" 
              apiEndpoint="/api/datasets/books" 
              description="Book collection with authors, genres, and purchase links."
            />
          </TabsContent>
          
          <TabsContent value="blog" className="space-y-4">
            <DatasetDisplay 
              name="Reading Resources" 
              type="readingResources" 
              apiEndpoint="/api/datasets/reading-resources" 
              description="Curated articles, videos, and other educational content."
            />
            <DatasetDisplay 
              name="Courses" 
              type="courses" 
              apiEndpoint="/api/datasets/courses" 
              description="Online courses and learning resources with providers and difficulty levels."
            />
            <DatasetDisplay 
              name="Blog Posts" 
              type="blogPosts" 
              apiEndpoint="/api/datasets/blog-posts" 
              description="Published blog articles with categories and tags."
            />
          </TabsContent>
          
          <TabsContent value="other" className="space-y-4">
            <DatasetDisplay 
              name="Gallery Items" 
              type="galleryItems" 
              apiEndpoint="/api/datasets/gallery-items" 
              description="Design portfolio items with categories and project details."
            />
            <DatasetDisplay 
              name="Android Apps" 
              type="androidApps" 
              apiEndpoint="/api/datasets/android-apps" 
              description="Recommended Android applications with ratings and download links."
            />
            <DatasetDisplay 
              name="Windows Apps" 
              type="windowsApps" 
              apiEndpoint="/api/datasets/windows-apps" 
              description="Windows desktop applications with ratings and download links."
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}