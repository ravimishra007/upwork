import { useEffect, useRef } from "react";
import { DatasetCollection } from "@/components/dataset-display";
import { useParams } from "wouter";

export default function Datasets() {
  // Get the selected dataset type from URL params
  const params = useParams();
  const selectedType = params.type;
  const datasetRef = useRef<HTMLDivElement>(null);

  // Set page title
  useEffect(() => {
    document.title = "Datasets | Stanislav Nikov";
    
    // If a specific dataset type is selected, try to expand that dataset
    if (selectedType && datasetRef.current) {
      // This will be used to auto-select the correct tab and expand the dataset
      const tabMap: Record<string, string> = {
        'singles': 'home',
        'albums': 'home',
        'moviesAndTvSeries': 'home',
        'books': 'home',
        'readingResources': 'blog',
        'courses': 'blog',
        'galleryItems': 'other',
        'androidApps': 'other',
        'windowsApps': 'other',
        'blogPosts': 'blog'
      };
      
      // Set the correct tab in session storage for the DatasetCollection component to read
      if (tabMap[selectedType]) {
        sessionStorage.setItem('selectedDatasetTab', tabMap[selectedType]);
        sessionStorage.setItem('selectedDatasetType', selectedType);
      }
    }
  }, [selectedType]);

  // Function to get dataset name from type
  const getDatasetName = () => {
    if (!selectedType) return null;
    
    const nameMap: Record<string, string> = {
      'singles': 'Singles',
      'albums': 'Albums',
      'moviesAndTvSeries': 'Movies & TV Series',
      'books': 'Books',
      'readingResources': 'Reading Resources',
      'courses': 'Courses',
      'galleryItems': 'Gallery Items',
      'androidApps': 'Android Apps',
      'windowsApps': 'Windows Apps',
      'blogPosts': 'Blog Posts'
    };
    
    return nameMap[selectedType] || 'Dataset';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="gallery-header w-full max-w-6xl mx-auto">
        <div className="left">
          <h1 className="cyberpunk-heading" data-text="Datasets">
            Datasets
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md text-left relative overflow-hidden">
            <span className="relative z-10">
              {selectedType 
                ? `Browsing ${getDatasetName()} collection` 
                : "Explore and browse all available datasets from our personal collection"}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent animate-pulse"></span>
          </p>
        </div>
        
        <div className="center">
          {/* Center content moved to left side as requested */}
        </div>
        
        <div className="right">
          {/* Empty div to balance the layout */}
        </div>
      </div>
      
      <div ref={datasetRef}>
        <DatasetCollection selectedType={selectedType} />
      </div>
    </div>
  );
}