import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from './card';

// Base skeleton animation
const shimmer = {
  hidden: { backgroundPosition: '-200% 0' },
  visible: {
    backgroundPosition: '200% 0',
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// Generic Skeleton Pulse
export function SkeletonPulse({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
      initial="hidden"
      animate="visible"
      variants={shimmer}
    />
  );
}

// Dashboard Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <SkeletonPulse className="h-3 w-20 mb-3" />
              <SkeletonPulse className="h-7 w-16 mb-2" />
              <SkeletonPulse className="h-2 w-24" />
            </div>
            <SkeletonPulse className="size-10 sm:size-12 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Assignment Card Skeleton
export function AssignmentCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <SkeletonPulse className="h-5 w-2/3" />
            <SkeletonPulse className="h-6 w-16 rounded-full" />
          </div>
          <SkeletonPulse className="h-3 w-full mb-2" />
          <SkeletonPulse className="h-3 w-4/5" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <SkeletonPulse className="h-3 w-24" />
            <SkeletonPulse className="h-3 w-20" />
          </div>
          <SkeletonPulse className="h-9 w-full rounded-lg" />
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton() {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="border-b"
    >
      <td className="p-3">
        <SkeletonPulse className="h-4 w-32" />
      </td>
      <td className="p-3">
        <SkeletonPulse className="h-4 w-24" />
      </td>
      <td className="p-3">
        <SkeletonPulse className="h-4 w-16" />
      </td>
      <td className="p-3">
        <SkeletonPulse className="h-6 w-20 rounded-full" />
      </td>
    </motion.tr>
  );
}

// List Item Skeleton
export function ListItemSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 p-4 rounded-xl bg-gray-50"
    >
      <SkeletonPulse className="size-10 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonPulse className="h-4 w-3/4" />
        <SkeletonPulse className="h-3 w-full" />
        <SkeletonPulse className="h-3 w-2/3" />
      </div>
    </motion.div>
  );
}

// Profile Section Skeleton
export function ProfileSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader className="relative overflow-hidden">
          <SkeletonPulse className="absolute inset-0 h-32" />
          <div className="relative pt-16">
            <SkeletonPulse className="size-20 rounded-full mx-auto mb-4" />
            <SkeletonPulse className="h-5 w-32 mx-auto mb-2" />
            <SkeletonPulse className="h-3 w-24 mx-auto" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonPulse className="size-8 rounded-lg" />
              <div className="flex-1 space-y-2">
                <SkeletonPulse className="h-3 w-20" />
                <SkeletonPulse className="h-4 w-32" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Chart Skeleton
export function ChartSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader>
          <SkeletonPulse className="h-5 w-40 mb-2" />
          <SkeletonPulse className="h-3 w-56" />
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-around gap-2">
            {[...Array(6)].map((_, i) => (
              <SkeletonPulse
                key={i}
                className="flex-1 rounded-t-lg"
                style={{ height: `${40 + Math.random() * 60}%` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Event Card Skeleton
export function EventCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <SkeletonPulse className="size-16 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonPulse className="h-4 w-3/4" />
              <SkeletonPulse className="h-3 w-full" />
              <div className="flex items-center gap-2 mt-3">
                <SkeletonPulse className="h-6 w-20 rounded-full" />
                <SkeletonPulse className="h-3 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Message/Notification Skeleton
export function MessageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
    >
      <SkeletonPulse className="size-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <SkeletonPulse className="h-4 w-32" />
          <SkeletonPulse className="h-3 w-16" />
        </div>
        <SkeletonPulse className="h-3 w-full" />
        <SkeletonPulse className="h-3 w-4/5" />
      </div>
    </motion.div>
  );
}

// Grid Skeleton - Generic grid of cards
export function GridSkeleton({ 
  count = 6, 
  columns = 'md:grid-cols-2 lg:grid-cols-3' 
}: { 
  count?: number; 
  columns?: string; 
}) {
  return (
    <div className={`grid gap-4 sm:gap-6 ${columns}`}>
      {[...Array(count)].map((_, i) => (
        <AssignmentCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Full Page Loading Skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartSkeleton />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <GridSkeleton count={6} />
    </div>
  );
}
