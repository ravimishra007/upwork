import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { 
  Download, 
  RefreshCcw,
  AlertCircle,
  EyeOff,
  Eye,
  FileSpreadsheet,
  Trash
} from "lucide-react";

interface AnalyticsSummary {
  totalClicks: number;
  clicksToday: number;
  growthRate: number;
  avgClicksPerDay: number;
  topPlatform: {
    name: string;
    count: number;
  };
  isPublic: boolean;
}

interface PlatformStat {
  platform: string;
  count: number;
}

interface DailyStat {
  date: string;
  count: number;
}

export default function AnalyticsDashboard() {
  const { data: summaryData, isLoading: summaryLoading } = useQuery<AnalyticsSummary>({
    queryKey: ['/api/analytics/summary'],
  });

  const { data: platformData, isLoading: platformLoading } = useQuery<PlatformStat[]>({
    queryKey: ['/api/analytics/by-platform'],
  });

  const { data: dailyData, isLoading: dailyLoading } = useQuery<DailyStat[]>({
    queryKey: ['/api/analytics/by-day'],
  });
  
  // Reset analytics mutation
  const resetMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest<{success: boolean; message: string}>('POST', '/api/analytics/reset', {});
    },
    onSuccess: () => {
      // Invalidate all analytics queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/summary'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/by-platform'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/by-day'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/clicks'] });
      
      toast({
        title: "Analytics Reset",
        description: "All analytics data has been reset successfully.",
      });
    },
    onError: (error) => {
      console.error('Failed to reset analytics:', error);
      toast({
        title: "Reset Failed",
        description: "Failed to reset analytics data. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const isLoading = summaryLoading || platformLoading || dailyLoading || resetMutation.isPending;
  
  // Handle reset analytics
  const handleResetAnalytics = () => {
    if (window.confirm("Are you sure you want to reset all analytics data? This action cannot be undone.")) {
      resetMutation.mutate();
    }
  };
  
  // Handle export to CSV
  const handleExportCSV = () => {
    window.open('/api/analytics/export', '_blank');
  };
  
  const COLORS = [
    "#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c", 
    "#d0ed57", "#ffc658", "#ff8042", "#ff6361", "#bc5090"
  ];

  if (isLoading || !summaryData || !platformData || !dailyData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span>Loading analytics data...</span>
        </div>
      </div>
    );
  }

  // Format daily data for chart
  const formattedDailyData = dailyData.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        
        <div className="flex flex-wrap gap-2">
          {/* Export Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={handleExportCSV}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export CSV
          </Button>
          
          {/* Reset Button */}
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={handleResetAnalytics}
          >
            <RefreshCcw className="h-4 w-4" />
            Reset Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">{summaryData.totalClicks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Clicks</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">{summaryData.clicksToday}</div>
              {summaryData.growthRate !== 0 && (
                <div className={`ml-2 text-sm ${summaryData.growthRate > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {summaryData.growthRate > 0 ? '↑' : '↓'} {Math.abs(summaryData.growthRate)}%
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Platform</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold capitalize">{summaryData.topPlatform.name}</div>
            <div className="text-sm text-muted-foreground">{summaryData.topPlatform.count} clicks</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Average</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-bold">{summaryData.avgClicksPerDay}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="daily">Daily Activity</TabsTrigger>
          <TabsTrigger value="platforms">Platform Breakdown</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="p-4 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Daily Click Activity</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedDailyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  name="Clicks"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="platforms" className="p-4 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Platform Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="platform"
                  label={({ platform }) => platform}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value, name, props) => [`${value} clicks`, `${props.payload.platform}`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="p-4 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-6">Analytics Settings</h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-4">Data Management</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Export Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    Download your analytics data as a CSV file for use in spreadsheet applications.
                  </p>
                  <Button 
                    className="mt-2 w-full sm:w-auto flex items-center gap-2"
                    onClick={handleExportCSV}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Export to CSV
                  </Button>
                </div>
                
                <div className="space-y-2 pt-2 border-t">
                  <h4 className="font-medium text-sm">Reset Analytics Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete all analytics data. This action cannot be undone.
                  </p>
                  <Button 
                    variant="destructive" 
                    className="mt-2 w-full sm:w-auto flex items-center gap-2"
                    onClick={handleResetAnalytics}
                  >
                    <Trash className="h-4 w-4" />
                    Reset All Data
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
              
              <div className="space-y-6">
                <div className="space-y-4">                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-500" />
                      <span>Public Analytics</span>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Your analytics are always public. Anyone with the link can view your statistics.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 pt-2 border-t">
                  <h4 className="font-medium text-sm">Third-Party Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Export your data to Google Sheets or Airtable for more advanced analysis.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button variant="outline" disabled className="flex items-center gap-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.8 0H2.2C1 0 0 1 0 2.2v19.6C0 23 1 24 2.2 24h19.6c1.2 0 2.2-1 2.2-2.2V2.2C24 1 23 0 21.8 0z" fill="#0F9D58"/>
                        <path d="M7 17h2v-8H7v8zm4 0h2V7h-2v10zm4 0h2v-6h-2v6z" fill="white"/>
                      </svg>
                      Google Sheets
                    </Button>
                    <Button variant="outline" disabled className="flex items-center gap-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5z" fill="#FFCB00"/>
                        <path d="M9 9h6v6H9V9z" fill="white"/>
                      </svg>
                      Airtable
                    </Button>
                    <Button variant="outline" disabled className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}