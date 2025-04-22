import { useEffect } from "react";
import ProfileSection from "@/components/profile-section";
import SocialLinks from "@/components/social-links";
import AnalyticsSummary from "@/components/analytics-summary";
import CvDownload from "@/components/cv-download";
import MusicList from "@/components/music-list";
import MovieList from "@/components/movie-list";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { UserData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { BarChart2 } from "lucide-react";
import { Link } from "wouter";




export default function Home() {
  // Set page title
  useEffect(() => {
    document.title = "Stanislav Nikov | Web Developer & Designer";
  }, []);


  const demoLinks= [
    {
      id: "1",
      userId: 1,
      platform: "facebook",
      name: "Facebook",
      username: "eyedealist",
      url: "https://www.facebook.com/eyedealist",
      active: true,
      order: 0
    },
    {
      id: "2",
      userId: 1,
      platform: "linkedin",
      name: "LinkedIn",
      username: "stanislav-nikov",
      url: "https://www.linkedin.com/in/stanislav-nikov/",
      active: true,
      order: 1
    },
    {
      id: "3",
      userId: 1,
      platform: "twitter",
      name: "Twitter/X",
      username: "@StanislavMNikov",
      url: "https://x.com/StanislavMNikov",
      active: true,
      order: 2
    },
    {
      id: "4",
      userId: 1,
      platform: "instagram",
      name: "Instagram",
      username: "@stansnikov",
      url: "https://www.instagram.com/stansnikov/",
      active: true,
      order: 3
    },
    {
      id: "5",
      userId: 1,
      platform: "youtube",
      name: "YouTube",
      username: "@StanislavNikov",
      url: "https://www.youtube.com/@StanislavNikov",
      active: true,
      order: 4
    },
    {
      id: "6",
      userId: 1,
      platform: "github",
      name: "GitHub",
      username: "StanislavNikov",
      url: "https://github.com/StanislavNikov",
      active: true,
      order: 5
    },
    {
      id: "7",
      userId: 1,
      platform: "pinterest",
      name: "Pinterest",
      username: "StanislavMNikov",
      url: "https://www.pinterest.com/StanislavMNikov/",
      active: true,
      order: 6
    }
  ];
  

  const userData = {
    name: "Stanislav Nikov",
    bio: "Web developer & graphic designer passionate about creative solutions",
    location: "📍 Germany",
    profileImage: "/profile-photo.jpg",
    socialLinks: demoLinks.map(link => ({
      ...link,
      id: parseInt(link.id),
      userId: 1
    }))
  }; 
  
  // Fetch user data
  const {  isLoading, error } = useQuery<UserData>({ 
    queryKey: ['/api/user-data'],
  });
  
  // Track analytics for link clicks
  const handleLinkClick = async (url: string, platform: string) => {
    try {
      await apiRequest('POST', '/api/click-tracking', { 
        platform, 
        url,
        timestamp: new Date().toISOString() 
      });
      
      // Invalidate analytics queries to ensure data refresh on analytics page
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/summary'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/by-platform'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/by-day'] });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
    
    // Open the link in a new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-0 py-4 overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-10">Loading profile data...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            Error loading profile data. Please try again.
          </div>
        ) : userData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 px-2 md:px-4">
            {/* Left Column - Music */}
            <div className="flex flex-col h-[800px] rounded-lg overflow-hidden shadow-md bg-gradient-to-b from-orange-400 to-amber-600">
              <div className="p-4 text-white flex-shrink-0">
                <h2 className="text-xl font-bold mb-1">Music Collection</h2>
                <p className="text-sm opacity-90">My favorite songs and albums</p>
              </div>
              <div className="flex-grow bg-white dark:bg-gray-900 rounded-t-2xl overflow-hidden flex flex-col">
                <div className="h-full overflow-hidden">
                  <MusicList />
                </div>
              </div>
            </div>
            
            {/* Middle Column - Profile */}
            <div className="flex flex-col h-[800px] rounded-lg overflow-hidden shadow-md bg-gradient-to-b from-teal-500 to-emerald-700">
              <div className="p-4 text-white flex-shrink-0">
                <h2 className="text-xl font-bold mb-1">About Me</h2>
                <p className="text-sm opacity-90">My profile and social links</p>
              </div>
              <div className="flex-grow bg-white dark:bg-gray-900 rounded-t-2xl overflow-auto">
                <div className="p-4">
                  <ProfileSection 
                    name={userData.name}
                    bio={userData.bio}
                    location={userData.location}
                    profileImage="/assets/profile-photo.jpg"
                  />
            
                  <SocialLinks 
                    links={userData.socialLinks} 
                    onLinkClick={handleLinkClick} 
                  />

                  {/* CV Download Section */}
                  <CvDownload />

                  {/* Analytics Summary */}
                  <div className="mt-4 mb-4">
                    <AnalyticsSummary />
                  </div>

                  <div className="mt-4 mb-6">
                    <Link href="/analytics">
                      <Button className="w-full flex items-center justify-center gap-2">
                        <BarChart2 className="h-5 w-5" />
                        View Full Analytics Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Movies */}
            <div className="flex flex-col h-[800px] rounded-lg overflow-hidden shadow-md bg-gradient-to-b from-indigo-600 to-violet-800">
              <div className="p-4 text-white flex-shrink-0">
                <h2 className="text-xl font-bold mb-1">Movie Collection</h2>
                <p className="text-sm opacity-90">Films and books I recommend</p>
              </div>
              <div className="flex-grow bg-white dark:bg-gray-900 rounded-t-2xl overflow-hidden flex flex-col">
                <div className="h-full overflow-hidden">
                  <MovieList />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">No profile data available</div>
        )}
      </div>
    </div>
  );
}
