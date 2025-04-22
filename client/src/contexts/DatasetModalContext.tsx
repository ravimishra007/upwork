import { createContext, useContext, useState, ReactNode } from 'react';
import DatasetModal from '@/components/dataset-modal';

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

interface DatasetModalContextType {
  openDatasetModal: (type: DatasetType) => void;
  closeDatasetModal: () => void;
}

const DatasetModalContext = createContext<DatasetModalContextType | undefined>(undefined);

export function DatasetModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDataset, setCurrentDataset] = useState<DatasetType | null>(null);
  
  const openDatasetModal = (type: DatasetType) => {
    setCurrentDataset(type);
    setIsOpen(true);
  };
  
  const closeDatasetModal = () => {
    setIsOpen(false);
  };
  
  return (
    <DatasetModalContext.Provider value={{ openDatasetModal, closeDatasetModal }}>
      {children}
      {currentDataset && (
        <DatasetModal 
          isOpen={isOpen} 
          onClose={closeDatasetModal} 
          type={currentDataset} 
        />
      )}
    </DatasetModalContext.Provider>
  );
}

export function useDatasetModal() {
  const context = useContext(DatasetModalContext);
  
  if (context === undefined) {
    throw new Error('useDatasetModal must be used within a DatasetModalProvider');
  }
  
  return context;
}