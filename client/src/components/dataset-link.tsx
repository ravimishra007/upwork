import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { Link } from "wouter";

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

interface DatasetLinkProps {
  type?: DatasetType;
  label?: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  className?: string;
  isTitle?: boolean; // New prop to indicate if this is a title link
  to?: string; // Allow direct path specification
  children?: React.ReactNode; // Add support for children
}

export default function DatasetLink({ 
  type, 
  label, 
  description, 
  icon = <Database className="h-4 w-4 mr-2" />,
  variant = 'outline',
  className = '',
  isTitle = false,
  to,
  children
}: DatasetLinkProps) {
  
  // Determine the link destination
  const linkPath = to || (type ? `/datasets/${type}` : '/datasets');
  
  // If it's a title, render a link with a span
  if (isTitle) {
    return (
      <Link href={linkPath}>
        <a className={`text-xl font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors ${className}`}>
          {children || label}
        </a>
      </Link>
    );
  }
  
  // Otherwise, render a button that links to datasets page
  return (
    <Link href={linkPath}>
      <Button 
        variant={variant} 
        className={`flex items-center ${className}`}
      >
        {icon}
        <span>{children || label}</span>
      </Button>
    </Link>
  );
}