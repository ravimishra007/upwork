import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileSectionProps {
  name: string;
  bio: string;
  location: string;
  profileImage: string;
}

export default function ProfileSection({ 
  name, 
  bio, 
  location, 
  profileImage 
}: ProfileSectionProps) {
  const [imageError, setImageError] = useState(false);
  const [imagePath, setImagePath] = useState(profileImage);
  
  useEffect(() => {
    // Try different image path variations
    const tryImagePath = async () => {
      const paths = [
        profileImage,
        `/assets${profileImage}`,
        `/assets/${profileImage.replace(/^\//, '')}`,
        `/public${profileImage}`,
        `/public/assets${profileImage}`,
        `https://raw.githubusercontent.com/yourusername/yourrepo/main/public${profileImage}`
      ];
      
      for (const path of paths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            setImagePath(path);
            return;
          }
        } catch (error) {
          console.warn(`Failed to load image from ${path}:`, error);
        }
      }
      
      // If all paths fail, use a default avatar
      setImagePath('https://api.dicebear.com/7.x/avataaars/svg?seed=stanislav');
    };
    
    tryImagePath();
  }, [profileImage]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 text-center transition-colors duration-300">
      <div className="relative mx-auto w-24 h-24 mb-4">
        {imageError ? (
          // Fallback to direct img tag if Avatar fails
          <img 
            src={imagePath}
            alt={`${name}'s profile picture`}
            className="w-24 h-24 rounded-full border-4 border-indigo-100 dark:border-indigo-900 shadow-md object-cover"
            onError={(e) => {
              console.error('Failed to load profile image as direct img:', imagePath);
              e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=stanislav';
            }}
          />
        ) : (
          <Avatar className="w-24 h-24 border-4 border-indigo-100 dark:border-indigo-900 shadow-md">
            <AvatarImage 
              src={imagePath}
              alt={`${name}'s profile picture`} 
              className="object-cover"
              onError={(e) => {
                console.error('Failed to load profile image in Avatar:', imagePath);
                e.currentTarget.onerror = null; // Prevent infinite loop
                setImageError(true); // Switch to the direct img tag
              }}
            />
            <AvatarFallback className="text-2xl font-semibold">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    
      <h1 className="text-2xl font-semibold mb-1">{name}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{bio}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{location}</p>
    </div>
  );
}