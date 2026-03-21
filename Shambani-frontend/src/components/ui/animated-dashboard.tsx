import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedDashboardProps {
  children: ReactNode;
}

// Reusable animation wrapper for dashboard components
export function AnimatedDashboard({ children }: AnimatedDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

// Animated stat card for dashboards
interface AnimatedStatCardProps {
  children: ReactNode;
  delay?: number;
}

export function AnimatedStatCard({
  children,
  delay = 0,
}: AnimatedStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

// Animated list item
interface AnimatedListItemProps {
  children: ReactNode;
  index?: number;
}

export function AnimatedListItem({
  children,
  index = 0,
}: AnimatedListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ x: 5, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
}

// Page transition wrapper
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

// Fade in section
export function FadeInSection({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

// Stagger children container
export function StaggerContainer({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Scale in animation for icons
export function ScaleInIcon({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      whileHover={{ rotate: 360, scale: 1.2 }}
    >
      {children}
    </motion.div>
  );
}
