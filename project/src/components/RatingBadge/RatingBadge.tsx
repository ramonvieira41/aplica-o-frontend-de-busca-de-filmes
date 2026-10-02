import { Star } from 'lucide-react';
import { formatRating } from '@/utils/format';

interface RatingBadgeProps {
  rating: number;
  size?: 'sm' | 'md';
}

export function RatingBadge({ rating, size = 'sm' }: RatingBadgeProps) {
  const dims = size === 'md' ? 'h-7 px-2.5 text-sm' : 'h-6 px-2 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-accent-500/15 font-semibold text-accent-600 dark:text-accent-400 ${dims}`}
    >
      <Star size={size === 'md' ? 16 : 14} className="fill-current" />
      {formatRating(rating)}
    </span>
  );
}
