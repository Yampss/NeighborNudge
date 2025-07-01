import { ExternalLink } from 'lucide-react';

interface RedditAuthButtonProps {
  onAuthChange?: (isAuthenticated: boolean) => void;
}

export default function RedditAuthButton({ onAuthChange }: RedditAuthButtonProps) {
  // Always show as not authenticated since we removed OAuth
  return (
    <a
      href="https://reddit.com/r/NeighborNudge"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
    >
      <ExternalLink className="h-4 w-4" />
      <span>Visit r/NeighborNudge</span>
    </a>
  );
}