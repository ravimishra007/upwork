import { Switch } from "@/components/ui/switch";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: (checked: boolean) => void;
}

export default function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  return (
    <div className="flex justify-end mb-4 items-center">
      <span className="mr-2 text-sm">🌞</span>
      <div className="theme-toggle inline-flex items-center">
        <Switch 
          checked={isDarkMode}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-primary"
        />
      </div>
      <span className="ml-2 text-sm">🌙</span>
    </div>
  );
}
