import { SocialLink, SocialLinkWithMeta } from "@shared/schema";
import { 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin, 
  FaYoutube, 
  FaGithub, 
  FaPinterest,
  FaFacebookF
} from "react-icons/fa";
import { ChevronRight, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

interface SocialLinksProps {
  links: SocialLink[];
  onLinkClick: (url: string, platform: string) => void;
}

// The individual sortable link component
function SortableLink({ link, onLinkClick }: { link: SocialLinkWithMeta, onLinkClick: (url: string, platform: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: link.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as const
  };

  // Map of platform names to icons and colors
  const platformIcons: Record<string, { 
    icon: JSX.Element; 
    bgClass: string; 
  }> = {
    instagram: { 
      icon: <FaInstagram className="h-5 w-5 text-primary" />, 
      bgClass: "bg-indigo-100 dark:bg-indigo-900" 
    },
    twitter: { 
      icon: <FaTwitter className="h-5 w-5 text-blue-500" />, 
      bgClass: "bg-blue-100 dark:bg-blue-900" 
    },
    linkedin: { 
      icon: <FaLinkedin className="h-5 w-5 text-blue-700" />, 
      bgClass: "bg-blue-100 dark:bg-blue-900" 
    },
    youtube: { 
      icon: <FaYoutube className="h-5 w-5 text-red-500" />, 
      bgClass: "bg-red-100 dark:bg-red-900" 
    },
    github: { 
      icon: <FaGithub className="h-5 w-5 text-gray-700 dark:text-gray-300" />, 
      bgClass: "bg-gray-100 dark:bg-gray-700" 
    },
    pinterest: { 
      icon: <FaPinterest className="h-5 w-5 text-pink-500" />, 
      bgClass: "bg-pink-100 dark:bg-pink-900" 
    },
    facebook: { 
      icon: <FaFacebookF className="h-5 w-5 text-blue-600" />, 
      bgClass: "bg-blue-100 dark:bg-blue-900" 
    }
  };

  // Default icon if platform is not in the map
  const defaultIcon = { 
    icon: <FaInstagram className="h-5 w-5 text-primary" />, 
    bgClass: "bg-indigo-100 dark:bg-indigo-900" 
  };
  
  const platformConfig = platformIcons[link.platform.toLowerCase()] || defaultIcon;

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`social-link w-full bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 ${isDragging ? 'ring-2 ring-primary' : ''}`}
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing mr-2 opacity-50 hover:opacity-90 transition-opacity touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>
      
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${platformConfig.bgClass} mr-4`}>
        {platformConfig.icon}
      </div>
      
      <button
        className="flex-1 flex items-center text-left"
        onClick={() => onLinkClick(link.url, link.platform)}
      >
        <div className="flex-1">
          <h2 className="font-medium text-gray-900 dark:text-gray-100">
            {link.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {link.username}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </button>
    </div>
  );
}

export default function SocialLinks({ links, onLinkClick }: SocialLinksProps) {
  // Create state to keep track of the links with their order
  const [items, setItems] = useState<SocialLinkWithMeta[]>([]);
  
  // Set up the links in state, sorted by their order
  useEffect(() => {
    if (links.length > 0) {
      const sortedLinks = [...links].sort((a, b) => a.order - b.order);
      setItems(sortedLinks);
    }
  }, [links]);
  
  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems(items => {
        // Find the indexes of the active and over items
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        // Move the item in the array
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update the order values
        const reorderedLinks = newItems.map((item, index) => ({
          ...item,
          order: index
        }));
        
        // Send the new order to the server
        updateLinkOrder(reorderedLinks);
        
        return reorderedLinks;
      });
    }
  };
  
  // Update link order on the server
  const updateLinkOrder = async (links: SocialLinkWithMeta[]) => {
    try {
      // Create an array of objects with id and new order for the API
      const linkOrder = links.map(link => ({
        id: link.id,
        order: link.order
      }));
      
      // Call the API to update the link order
      await apiRequest('POST', '/api/social-links/reorder', { linkOrder });
      
      // Invalidate the user data query to refresh the links
      queryClient.invalidateQueries({ queryKey: ['/api/user-data'] });
      
      toast({
        title: "Links reordered",
        description: "Your links have been reordered successfully.",
        duration: 2000
      });
    } catch (error) {
      console.error('Failed to update link order:', error);
      toast({
        title: "Error",
        description: "Failed to update link order. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // If no items, show a message
  if (items.length === 0) {
    return <div className="text-center py-4">No social links available</div>;
  }
  
  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-3">
        <SortableContext 
          items={items.map(item => item.id)} 
          strategy={verticalListSortingStrategy}
        >
          {items.map(link => (
            <SortableLink 
              key={link.id} 
              link={link} 
              onLinkClick={onLinkClick} 
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}
