import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { apiClient } from "../services/apiClient";

type DatasetType = 
  | 'singles' 
  | 'albums' 
  | 'moviesAndTvSeries' 
  | 'books'
  | 'readingResources'
  | 'courses'
  | 'blogPosts'
  | 'galleryItems'
  | 'androidApps'
  | 'windowsApps';

interface DatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: DatasetType;
}

export default function DatasetModal({ isOpen, onClose, type }: DatasetModalProps) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map dataset types to API endpoints and display names
  const datasetConfig = {
    singles: { endpoint: '/api/datasets/singles', name: 'Singles' },
    albums: { endpoint: '/api/datasets/albums', name: 'Albums' },
    moviesAndTvSeries: { endpoint: '/api/datasets/movies-tv-series', name: 'Movies & TV Series' },
    books: { endpoint: '/api/datasets/books', name: 'Books' },
    readingResources: { endpoint: '/api/datasets/reading-resources', name: 'Reading Resources' },
    courses: { endpoint: '/api/datasets/courses', name: 'Courses' },
    blogPosts: { endpoint: '/api/datasets/blog-posts', name: 'Blog Posts' },
    galleryItems: { endpoint: '/api/datasets/gallery-items', name: 'Gallery Items' },
    androidApps: { endpoint: '/api/datasets/android-apps', name: 'Android Apps' },
    windowsApps: { endpoint: '/api/datasets/windows-apps', name: 'Windows Apps' }
  };

  // Fetch data from the API
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          const result = await apiClient.get(datasetConfig[type].endpoint);
          setData(result);
        } catch (err) {
          console.error('Error fetching dataset:', err);
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  // Render card based on dataset type
  const renderCard = (item: any) => {
    switch(type) {
      case 'singles':
      case 'albums':
        return (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-square relative">
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg truncate">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.artist}</p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {item.genre && item.genre.map((g: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs">{g}</Badge>
                ))}
              </div>
              {item.spotifyUrl && (
                <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                  <a href={item.spotifyUrl} target="_blank" rel="noopener noreferrer">
                    Spotify
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        );
      
      case 'moviesAndTvSeries':
      case 'books':
        return (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-[2/3] relative">
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg truncate">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {type === 'moviesAndTvSeries' ? item.director : item.author} ({item.releaseDate?.substring(0, 4)})
              </p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {item.genre && item.genre.map((g: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs">{g}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        );
        
      case 'readingResources':
      case 'courses':
      case 'blogPosts':
        return (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.author || item.instructor}
              </p>
              {item.summary && <p className="mt-2 text-sm">{item.summary}</p>}
              {item.description && <p className="mt-2 text-sm">{item.description}</p>}
              {item.tags && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {item.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}
              {item.url && (
                <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    View Resource
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        );
        
      case 'galleryItems':
        return (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-video relative">
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
              <p className="mt-2 text-sm">{item.description}</p>
              {item.tags && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {item.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
        
      case 'androidApps':
      case 'windowsApps':
        return (
          <Card key={item.id} className="overflow-hidden">
            <div className="p-4 flex items-center gap-4">
              {item.iconUrl && (
                <img 
                  src={item.iconUrl} 
                  alt={item.name} 
                  className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.developer}</p>
              </div>
            </div>
            <Separator />
            <CardContent className="p-4">
              <p className="text-sm">{item.description}</p>
              <div className="flex justify-between mt-2 text-sm">
                <span>{item.category}</span>
                <span className="font-semibold">Rating: {item.rating}/5</span>
              </div>
              {item.features && (
                <div className="mt-3">
                  <p className="font-medium text-sm mb-1">Key Features:</p>
                  <ul className="text-sm list-disc pl-5">
                    {item.features.slice(0, 3).map((feature: string, i: number) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              {item.downloadUrl && (
                <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                  <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        );
        
      default:
        return (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{item.title || item.name}</h3>
              <p className="text-sm">{item.description}</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 pt-16 pb-16">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="text-xl font-bold">{datasetConfig[type].name} Dataset</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.map((item) => renderCard(item))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}