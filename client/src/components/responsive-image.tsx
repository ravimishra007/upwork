import { useState, useEffect, useRef } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  title?: string;
  containerClassName?: string;
  imageClassName?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto';
  showTitle?: boolean;
}

export default function ResponsiveImage({
  src,
  alt,
  title,
  containerClassName = '',
  imageClassName = '',
  aspectRatio = 'auto',
  showTitle = false
}: ResponsiveImageProps) {
  const [isHovering, setIsHovering] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [titleOverlapping, setTitleOverlapping] = useState(false);
  
  // Generate the appropriate aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'portrait': return 'aspect-[2/3]';
      case 'landscape': return 'aspect-[3/2]';
      default: return '';
    }
  };
  
  // Check if the title is overlapping with the image
  useEffect(() => {
    if (!showTitle || !imageRef.current || !containerRef.current) return;
    
    const checkOverlap = () => {
      const imageRect = imageRef.current?.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (imageRect && containerRect) {
        // Check if the image is taking up too much space
        const overlapThreshold = containerRect.height * 0.75;
        setTitleOverlapping(imageRect.height > overlapThreshold);
      }
    };
    
    if (imageLoaded) {
      checkOverlap();
      window.addEventListener('resize', checkOverlap);
    }
    
    return () => {
      window.removeEventListener('resize', checkOverlap);
    };
  }, [imageLoaded, showTitle]);
  
  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden rounded-md border group ${containerClassName}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={`${getAspectRatioClass()} flex items-center justify-center bg-white dark:bg-gray-900/50`}>
        <img 
          ref={imageRef}
          src={src} 
          alt={alt}
          className={`${titleOverlapping ? 'max-h-[65%] scale-90' : 'max-h-full'} max-w-full object-contain transition-all duration-300 ${isHovering ? 'scale-110' : ''} ${imageClassName}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      
      {showTitle && title && (
        <div className="mt-1 text-center text-xs truncate text-gray-700 dark:text-gray-300 font-medium">
          {title}
        </div>
      )}
    </div>
  );
}