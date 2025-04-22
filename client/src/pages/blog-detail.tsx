import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Tag, ArrowLeft, BookOpen, User, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/services/apiClient";
import profilePhoto from "./profile-photo.jpg";

// Blog post interface
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  lastUpdated?: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl: string;
  readTime: string;
  featured: boolean;
  status: string;
}

export default function BlogDetail() {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute("/blog/:id");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogPost() {
      // First check if we have state data passed from blog page
      const state = history.state;
      if (state && state.blogPost) {
        console.log("Using post data from navigation state");
        setPost(state.blogPost);
        setLoading(false);
        document.title = `${state.blogPost.title} | Stanislav Nikov`;
        return;
      }

      // Fallback to API fetch if no state data
      if (!params?.id) {
        setError("Invalid blog post ID");
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching blog post with ID: ${params.id}`);
        const allPosts = await apiClient.get('/api/datasets/blog-posts');
        const data = allPosts.find((post: BlogPost) => post.id === Number(params.id));
        
        if (!data) {
          throw new Error("Blog post not found");
        }
        
        setPost(data);
        setLoading(false);
        document.title = `${data.title} | Stanislav Nikov`;
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(`Failed to load blog post. ${err instanceof Error ? err.message : 'Please try again later.'}`);
        setLoading(false);
      }
    }

    fetchBlogPost();
  }, [params?.id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    
    // If it's already a formatted date string like "April 10, 2023"
    if (typeof dateString === 'string' && !dateString.includes('T')) {
      return dateString;
    }
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <Card>
          <CardContent className="pt-6 pb-6">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p className="mb-6">{error || "Blog post not found"}</p>
            <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setLocation("/blog")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          onClick={() => setLocation("/blog")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to all articles
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              {/* Article header */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-indigo-500" />
                  <span className="text-sm">{formatDate(post.publishDate)}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-indigo-500" />
                  <span className="text-sm">{post.readTime}</span>
                </div>
                
                {post.category && (
                  <Badge variant="outline" className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/50">
                    {post.category}
                  </Badge>
                )}
              </div>
              
              {/* Featured image */}
              {post.imageUrl && (
                <div className="mb-8 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-[250px] md:h-[350px] object-cover"
                  />
                </div>
              )}
              
              {/* Excerpt */}
              <div className="mb-8">
                <p className="text-lg font-medium mb-6 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-100 dark:border-gray-700">
                  {post.excerpt}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Content */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <BookOpen className="mr-2 h-5 w-5 text-indigo-500" />
                <h2 className="text-xl font-semibold">Article Content</h2>
              </div>
              
              <div 
                className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Tag className="mr-2 h-5 w-5 text-indigo-500" />
                  <h2 className="text-xl font-semibold">Related Topics</h2>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-indigo-50 hover:to-indigo-100 dark:hover:from-indigo-900/20 dark:hover:to-indigo-800/30 cursor-pointer"
                      onClick={() => setLocation(`/blog?tag=${tag}`)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author info */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <User className="mr-2 h-5 w-5 text-indigo-500" />
                <h2 className="text-lg font-semibold">About the Author</h2>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 ring-2 ring-indigo-200 dark:ring-indigo-900">
                  <img 
                    src={profilePhoto} 
                    alt="Stanislav Nikov" 
                    className="h-full w-full object-cover"
                    onError={(e) => e.currentTarget.style.display = 'none'}
                  />
                </div>
                <div>
                  <h4 className="font-medium">{post.author}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Web developer, designer, and open source enthusiast. Sharing knowledge and experiences in web development.
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="p-0 h-auto text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    onClick={() => setLocation("/about")}
                  >
                    <span className="text-sm font-medium mr-1">View profile</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Related Posts Placeholder - You could implement this using actual data */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-0 shadow-sm">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Related Articles</h2>
              <div className="space-y-3">
                <div className="border-l-4 border-indigo-400 pl-3 py-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-r transition-colors">
                  <h3 className="font-medium text-sm">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      onClick={() => setLocation("/blog")}
                    >
                      Advanced State Management in React
                    </Button>
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Learn about context and advanced hooks</p>
                </div>
                
                <div className="border-l-4 border-blue-400 pl-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-r transition-colors">
                  <h3 className="font-medium text-sm">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      onClick={() => setLocation("/blog")}
                    >
                      Building Responsive Layouts with CSS Grid
                    </Button>
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Create complex layouts with ease</p>
                </div>
                
                <div className="border-l-4 border-green-400 pl-3 py-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-r transition-colors">
                  <h3 className="font-medium text-sm">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      onClick={() => setLocation("/blog")}
                    >
                      Getting Started with TypeScript in 2023
                    </Button>
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Modern TypeScript development</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Newsletter Signup */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-0 shadow-sm">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-3 text-indigo-700 dark:text-indigo-300">Subscribe to Newsletter</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Get notified about new articles and updates.
              </p>
              <div className="space-y-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
                />
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 