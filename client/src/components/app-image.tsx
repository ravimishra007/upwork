import React from 'react';
import ResponsiveImage from './responsive-image';

interface AppImageProps {
  imageUrl?: string;
  appName: string;
  className?: string;
}

export default function AppImage({ imageUrl, appName, className = '' }: AppImageProps) {
  if (!imageUrl) return null;
  
  return (
    <ResponsiveImage 
      src={imageUrl} 
      alt={`${appName} icon`}
      title={appName}
      containerClassName={`mb-4 ${className}`}
      aspectRatio="square"
      showTitle={true}
    />
  );
}