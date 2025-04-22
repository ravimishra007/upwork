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
  
  console.log('Profile image path:', profileImage);
  
  // Prepare a direct image path with fallbacks
  const finalImagePath = profileImage.startsWith('/assets/') 
    ? profileImage 
    : `/assets${profileImage.startsWith('/') ? '' : '/'}${profileImage}`;
  
  console.log('Final image path:', finalImagePath);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 text-center transition-colors duration-300">
      <div className="relative mx-auto w-24 h-24 mb-4">
        {imageError ? (
          // Fallback to direct img tag if Avatar fails
          <img 
            src={finalImagePath}
            alt={`${name}'s profile picture`}
            className="w-24 h-24 rounded-full border-4 border-indigo-100 dark:border-indigo-900 shadow-md object-cover"
            onError={(e) => {
              console.error('Failed to load profile image as direct img:', finalImagePath);
              e.currentTarget.src = 'https://picsum.photos/200'; // Use a random image as final fallback
            }}
          />
        ) : (
          <Avatar className="w-24 h-24 border-4 border-indigo-100 dark:border-indigo-900 shadow-md">
            <AvatarImage 
              src={finalImagePath}
              alt={`${name}'s profile picture`} 
              className="object-cover"
              onError={(e) => {
                console.error('Failed to load profile image in Avatar:', finalImagePath);
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
