import { useEffect, useState } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, Tag, ChevronRight, ArrowLeft, Globe, Filter, Grid3X3, List, ChevronDown, BookOpen, Book, Newspaper, GraduationCap, Loader2 } from "lucide-react";
import DatasetLink from "@/components/dataset-link";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";

// Define blog post interface
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  publishDate: string;
  lastUpdated?: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl: string;
  readTime: string;
  featured: boolean;
  status: string;
  content?: string;
}

export default function Blog() {
  // Set page title
  useEffect(() => {
    document.title = "Blog | Stanislav Nikov";
  }, []);

  // For search functionality
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [, setLocation] = useLocation();
  
  // For loading more posts
  const [visiblePostCount, setVisiblePostCount] = useState<number>(6);
  
  // Check if we're on a category page
  const [, params] = useRoute("/blog/category/:category");
  const currentCategory = params?.category || "";
  
  // Fetch blog posts from API
  const { 
    data: allBlogPosts = [], 
    isLoading, 
    error 
  } = useQuery<BlogPost[]>({
    queryKey: ['/api/datasets/blog-posts'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Filter posts by category and search term
  const filteredPosts = allBlogPosts.filter(post => {
    // Filter by category if on a category page
    if (currentCategory && post.category?.toLowerCase() !== currentCategory.toLowerCase()) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        post.title.toLowerCase().includes(search) ||
        post.excerpt.toLowerCase().includes(search) ||
        post.tags.some(tag => tag.toLowerCase().includes(search)) ||
        (post.category && post.category.toLowerCase().includes(search))
      );
    }
    
    return true;
  });

  // Get featured post from API data
  const featuredPost = allBlogPosts.find(post => post.featured);

  // Get all unique categories and their counts
  const categoryData = allBlogPosts.reduce((acc, post) => {
    if (post.category) {
      if (!acc[post.category]) {
        acc[post.category] = 0;
      }
      acc[post.category]++;
    }
    return acc;
  }, {} as Record<string, number>);
  
  // Convert to array for display
  const categories = Object.entries(categoryData).map(([name, count]) => ({
    name,
    count
  }));

  // Handle search 
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // We could navigate to a search results page, but for now let's just filter in place
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Reset visible count when searching
    setVisiblePostCount(6);
  };
  
  // Reset visible count when changing categories
  useEffect(() => {
    setVisiblePostCount(6);
  }, [currentCategory]);

  const [selectedTag, setSelectedTag] = useState<string>("");

  // Display loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Loading blog posts...</span>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Blog Posts</h2>
          <p className="text-gray-600 mb-6">
            We encountered an issue while fetching blog posts. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    );
  }

  const renderPosts = () => {
    return filteredPosts.map(post => (
      <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
        <Link href={`/blog/${post.id}`} state={{ blogPost: post }}>
          <a className="block">
            {post.imageUrl && (
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <CardHeader className="pb-2">
              {post.category && (
                <Badge variant="outline" className="self-start mb-2">
                  {post.category}
                </Badge>
              )}
              <CardTitle className="text-xl hover:text-indigo-600 transition-colors">
                {post.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
              
              <div className="flex flex-wrap items-center text-xs text-gray-500 gap-4">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(post.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {post.readTime}
                </span>
              </div>
            </CardContent>
          </a>
        </Link>
        
        <CardFooter className="flex flex-wrap gap-1 pt-0">
          {post.tags && post.tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-[10px] py-0 px-1.5 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedTag(tag);
                setSearchTerm(tag);
              }}
            >
              {tag}
            </Badge>
          ))}
          {post.tags && post.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
          )}
        </CardFooter>
      </Card>
    ));
  };

  return (
    <div className="container mx-auto py-8">
      {currentCategory && (
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
          {`${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} Articles`}
        </h1>
      )}
      
      {currentCategory && (
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 dark:text-gray-400"
            onClick={() => setLocation("/blog")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to all articles
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        <div className="lg:col-span-2 space-y-8">
          {/* Search Bar for mobile */}
          <div className="lg:hidden">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </form>
          </div>
          
          {/* Featured Post - only show if not searching, not on category page, and we have a featured post */}
          {!searchTerm && !currentCategory && featuredPost && (
            <Card className="overflow-hidden border-0 shadow-lg mb-4">
              <div className="relative h-64 w-full bg-gradient-to-r from-indigo-600 to-violet-600">
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <Badge className="mb-2 w-fit" variant="outline">Featured</Badge>
                  <h2 className="text-2xl font-bold mb-2">{featuredPost.title}</h2>
                  <p className="text-gray-200 mb-4 line-clamp-2">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-4">{new Date(featuredPost.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          {/* Blog Posts */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              {searchTerm 
                ? `Search Results: ${filteredPosts.length} article${filteredPosts.length !== 1 ? 's' : ''} found` 
                : currentCategory 
                  ? `${filteredPosts.length} article${filteredPosts.length !== 1 ? 's' : ''} in this category` 
                  : "Recent Articles"}
            </h2>
            
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderPosts()}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg border-dashed">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No articles found matching your criteria</p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  if (currentCategory) {
                    setLocation("/blog");
                  }
                }}>
                  View All Articles
                </Button>
              </div>
            )}
            
            {filteredPosts.length > visiblePostCount && (
              <div className="flex justify-center mt-8">
                <Button 
                  variant="outline"
                  onClick={() => setVisiblePostCount(prev => prev + 6)}
                >
                  Load More Articles ({filteredPosts.length - visiblePostCount} remaining)
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Search Bar for desktop */}
          <Card className="hidden lg:block bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-500"><span className="font-bold uppercase">BLOG</span> Search</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search articles..."
                    className="pl-8 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-200"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Categories */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <Link href={`/blog/category/${category.name.toLowerCase()}`}>
                      <a className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">
                        {category.name}
                      </a>
                    </Link>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Reading Resources */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Reading Resources</CardTitle>
                <DatasetLink 
                  type="readingResources"
                  label="View All" 
                  icon={<BookOpen className="h-4 w-4 mr-2" />}
                  variant="ghost"
                  className="text-sm text-indigo-600 dark:text-indigo-400"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-64 overflow-y-auto pr-4 pl-3 pb-3 pt-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <div className="space-y-2">
                  <div className="border-l-4 border-indigo-400 pl-3 py-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">Frontend Weekly</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Latest news and updates in frontend development</p>
                  </div>
                  <div className="border-l-4 border-blue-400 pl-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">The Pragmatic Engineer</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Engineering leadership and systems design</p>
                  </div>
                  <div className="border-l-4 border-green-400 pl-3 py-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">Smashing Magazine</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Professional web design and development</p>
                  </div>
                  <div className="border-l-4 border-purple-400 pl-3 py-1 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">CSS-Tricks</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Tips, tricks, and techniques for CSS</p>
                  </div>
                  <div className="border-l-4 border-red-400 pl-3 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">A List Apart</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Web standards and best practices</p>
                  </div>
                  <div className="border-l-4 border-yellow-400 pl-3 py-1 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">Web.dev</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Google's guidance for modern web development</p>
                  </div>
                  <div className="border-l-4 border-orange-400 pl-3 py-1 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">JavaScript Weekly</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Weekly JavaScript news and articles</p>
                  </div>
                  <div className="border-l-4 border-teal-400 pl-3 py-1 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">React Status</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Weekly React and React Native updates</p>
                  </div>
                  <div className="border-l-4 border-pink-400 pl-3 py-1 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">UI Design Daily</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Daily UI design inspiration</p>
                  </div>
                  <div className="border-l-4 border-gray-400 pl-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">Hacker News</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Tech news and discussions</p>
                  </div>
                  <div className="border-l-4 border-indigo-400 pl-3 py-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">HeyDesigner</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Design news and inspiration for designers</p>
                  </div>
                  <div className="border-l-4 border-blue-400 pl-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">DEV Community</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Community of software developers</p>
                  </div>
                  <div className="border-l-4 border-green-400 pl-3 py-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">Node Weekly</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Node.js news and articles</p>
                  </div>
                  <div className="border-l-4 border-purple-400 pl-3 py-1 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">TypeScript Weekly</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Weekly TypeScript updates and tutorials</p>
                  </div>
                  <div className="border-l-4 border-red-400 pl-3 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">Frontend Focus</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Frontend news, articles, and tutorials</p>
                  </div>
                  <div className="border-l-4 border-yellow-400 pl-3 py-1 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">Increment</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">In-depth coverage of development topics</p>
                  </div>
                  <div className="border-l-4 border-orange-400 pl-3 py-1 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">Web Design Weekly</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Weekly web design news and articles</p>
                  </div>
                  <div className="border-l-4 border-teal-400 pl-3 py-1 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">CSS Weekly</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Weekly CSS news and articles</p>
                  </div>
                  <div className="border-l-4 border-pink-400 pl-3 py-1 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">UX Collective</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">User experience design stories</p>
                  </div>
                  <div className="border-l-4 border-gray-400 pl-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">Dense Discovery</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Weekly newsletter on design, tech, and culture</p>
                  </div>
                  <div className="border-l-4 border-indigo-400 pl-3 py-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">Sidebar</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Five design links daily</p>
                  </div>
                  <div className="border-l-4 border-blue-400 pl-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">Bytes</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">JavaScript newsletter with curated content</p>
                  </div>
                  <div className="border-l-4 border-green-400 pl-3 py-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">React Newsletter</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">React updates, articles, and tutorials</p>
                  </div>
                  <div className="border-l-4 border-purple-400 pl-3 py-1 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">Web Animation Weekly</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Weekly web animation news and inspiration</p>
                  </div>
                  <div className="border-l-4 border-red-400 pl-3 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">Responsive Design Weekly</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Responsive web design news</p>
                  </div>
                  <div className="border-l-4 border-yellow-400 pl-3 py-1 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">UI Movement</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">UI design inspiration daily</p>
                  </div>
                  <div className="border-l-4 border-orange-400 pl-3 py-1 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">Frontend Horse</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Frontend development tutorials and techniques</p>
                  </div>
                  <div className="border-l-4 border-teal-400 pl-3 py-1 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">Webdev Digest</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Weekly web development resources</p>
                  </div>
                  <div className="border-l-4 border-pink-400 pl-3 py-1 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">UX Booth</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">User experience design articles</p>
                  </div>
                  <div className="border-l-4 border-gray-400 pl-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-r transition-colors">
                    <h3 className="font-medium text-sm">CSS Layout News</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Weekly CSS layout techniques and tools</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Learning Paths */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">Learning Paths</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-indigo-400 to-indigo-600 text-white dark:from-indigo-800 dark:to-indigo-600 flex items-center justify-center rounded-full shadow-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Frontend Fundamentals</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">HTML, CSS, JavaScript basics</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-400 to-blue-600 text-white dark:from-blue-800 dark:to-blue-600 flex items-center justify-center rounded-full shadow-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">React Mastery</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Component patterns and state management</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white dark:from-emerald-800 dark:to-emerald-600 flex items-center justify-center rounded-full shadow-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Full-Stack Development</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Backend integration and API design</p>
                  </div>
                </div>
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium">Courses</h4>
                    <DatasetLink 
                      type="courses"
                      label="All Courses" 
                      icon={<GraduationCap className="h-4 w-4 mr-2" />}
                      variant="ghost"
                      className="text-xs text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div className="h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    <div className="space-y-3">
                      <div className="p-2 rounded-md bg-gradient-to-r from-indigo-50/80 to-indigo-100/80 dark:from-indigo-900/20 dark:to-indigo-800/30 border border-indigo-200/50 dark:border-indigo-700/30">
                        <h5 className="text-xs font-medium text-indigo-700 dark:text-indigo-300">HTML Basics</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Introduction to HTML structure and semantic elements</p>
                      </div>
                      <div className="p-2 rounded-md bg-gradient-to-r from-blue-50/80 to-blue-100/80 dark:from-blue-900/20 dark:to-blue-800/30 border border-blue-200/50 dark:border-blue-700/30">
                        <h5 className="text-xs font-medium text-blue-700 dark:text-blue-300">CSS Fundamentals</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Styling web pages with modern CSS techniques</p>
                      </div>
                      <div className="p-2 rounded-md bg-gradient-to-r from-amber-50/80 to-amber-100/80 dark:from-amber-900/20 dark:to-amber-800/30 border border-amber-200/50 dark:border-amber-700/30">
                        <h5 className="text-xs font-medium text-amber-700 dark:text-amber-300">JavaScript Essentials</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Core JavaScript concepts and DOM manipulation</p>
                      </div>
                      <div className="p-2 rounded-md bg-gradient-to-r from-red-50/80 to-red-100/80 dark:from-red-900/20 dark:to-red-800/30 border border-red-200/50 dark:border-red-700/30">
                        <h5 className="text-xs font-medium text-red-700 dark:text-red-300">React Foundations</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Building interactive UIs with React components</p>
                      </div>
                      <div className="p-2 rounded-md bg-gradient-to-r from-emerald-50/80 to-emerald-100/80 dark:from-emerald-900/20 dark:to-emerald-800/30 border border-emerald-200/50 dark:border-emerald-700/30">
                        <h5 className="text-xs font-medium text-emerald-700 dark:text-emerald-300">SQL Basics</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Database fundamentals and SQL query language</p>
                      </div>
                      <div className="p-2 rounded-md bg-gradient-to-r from-cyan-50/80 to-cyan-100/80 dark:from-cyan-900/20 dark:to-cyan-800/30 border border-cyan-200/50 dark:border-cyan-700/30">
                        <h5 className="text-xs font-medium text-cyan-700 dark:text-cyan-300">Python Programming</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Introduction to Python syntax and applications</p>
                      </div>
                      <div className="p-2 rounded-md bg-gradient-to-r from-violet-50/80 to-violet-100/80 dark:from-violet-900/20 dark:to-violet-800/30 border border-violet-200/50 dark:border-violet-700/30">
                        <h5 className="text-xs font-medium text-violet-700 dark:text-violet-300">AI Prompting Techniques</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Effective prompting strategies for AI models</p>
                      </div>
                      <div className="p-2 rounded-md bg-gradient-to-r from-pink-50/80 to-pink-100/80 dark:from-pink-900/20 dark:to-pink-800/30 border border-pink-200/50 dark:border-pink-700/30">
                        <h5 className="text-xs font-medium text-pink-700 dark:text-pink-300">WordPress Development</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Building sites and plugins with WordPress</p>
                      </div>
                      <div className="p-2 rounded-md bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-900/20 dark:to-gray-800/30 border border-gray-200/50 dark:border-gray-700/30">
                        <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">Automation Tools</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Workflow automation with Zapier, Make.com, and Airtable</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Technology Stack */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-500">Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50">React</Badge>
                <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50">TypeScript</Badge>
                <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700/50">Node.js</Badge>
                <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50">WordPress</Badge>
                <Badge variant="outline" className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/50">PostgreSQL</Badge>
                <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700/50">GraphQL</Badge>
                <Badge variant="outline" className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/50">JavaScript</Badge>
                <Badge variant="outline" className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-700/50">Sass</Badge>
                <Badge variant="outline" className="bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700/50">Tailwind</Badge>
                <Badge variant="outline" className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50">Redis</Badge>
              </div>

              <div className="mt-4">
                <h5 className="font-medium text-sm mb-3">Development Tools</h5>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">VS Code</Badge>
                  <Badge variant="outline" className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">Git</Badge>
                  <Badge variant="outline" className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">Docker</Badge>
                  <Badge variant="outline" className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">Figma</Badge>
                  <Badge variant="outline" className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">Webpack</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* About Author (moved to bottom) */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">About the Author</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 ring-2 ring-purple-200 dark:ring-purple-900">
                  <img 
                    src="/assets/stanislav.jpg" 
                    alt="Stanislav Nikov" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">Stanislav Nikov</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Web developer, designer, and open source enthusiast. Sharing knowledge and experiences in web development.
                  </p>
                  <Link href="/about">
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                      Read more
                    </span>
                  </Link>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h5 className="font-medium text-sm mb-2">Areas of Expertise</h5>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Web Development</Badge>
                  <Badge variant="outline">UX Design</Badge>
                  <Badge variant="outline">Digital Marketing</Badge>
                  <Badge variant="outline">AI Integration</Badge>
                  <Badge variant="outline">Data Visualization</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 mb-3">
                  Writing from Sofia and Berlin, my articles draw from my experiences in both eastern and western European tech scenes. I focus on practical, accessible approaches to modern web development.
                </p>
                
                <h5 className="font-medium text-sm mb-2 mt-4">Professional Focus</h5>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">System Architecture</Badge>
                  <Badge variant="outline">Content Creation</Badge>
                  <Badge variant="outline">Technical SEO</Badge>
                  <Badge variant="outline">Automation</Badge>
                  <Badge variant="outline">Analytics</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}