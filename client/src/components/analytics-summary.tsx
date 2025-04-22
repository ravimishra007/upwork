import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

interface AnalyticsSummary {
  totalClicks: number;
  clicksToday: number;
  growthRate: number;
  avgClicksPerDay: number;
  topPlatform: {
    name: string;
    count: number;
  };
}

export default function AnalyticsSummary() {
  const { data, isLoading } = useQuery<AnalyticsSummary>({
    queryKey: ['/api/analytics/summary'],
  });
  
  if (isLoading || !data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm my-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm">Loading analytics...</span>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm my-4">
      <div className="text-lg font-medium mb-2 flex items-center">
        <BarChart2 className="h-5 w-5 mr-2 text-primary" />
        Quick Stats
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Clicks</div>
          <div className="text-xl font-bold">{data.totalClicks}</div>
        </div>
        
        <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Today</div>
          <div className="text-xl font-bold flex justify-center items-center">
            {data.clicksToday}
            {data.growthRate !== 0 && (
              <span 
                className={`text-xs ml-1 ${data.growthRate > 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                {data.growthRate > 0 ? '↑' : '↓'} {Math.abs(data.growthRate)}%
              </span>
            )}
          </div>
        </div>
        
        <div className="text-center p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Top Platform</div>
          <div className="text-lg font-bold capitalize">{data.topPlatform.name}</div>
        </div>
        
        <div className="text-center p-2 bg-pink-50 dark:bg-pink-900/30 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Daily Avg</div>
          <div className="text-xl font-bold">{data.avgClicksPerDay}</div>
        </div>
      </div>
    </div>
  );
}