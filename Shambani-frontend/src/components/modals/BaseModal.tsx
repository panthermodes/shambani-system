import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { motion } from "framer-motion";
import { LucideIcon } from "../ui/icons";
import { Button } from "../ui/button";

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgGradient?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  preventClose?: boolean;
  footer?: ReactNode;
  className?: string;
  variant?: "glass" | "solid"; // New: glass morphism or solid white
}

const sizeClasses = {
  sm: "w-[calc(100%-2rem)] max-w-md",
  md: "w-[calc(100%-2rem)] max-w-2xl",
  lg: "w-[calc(100%-2rem)] max-w-4xl",
  xl: "w-[calc(100%-2rem)] max-w-6xl",
  full: "w-[calc(100%-2rem)] max-w-[95vw]",
};

export function BaseModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  icon: Icon,
  iconColor = "text-white",
  iconBgGradient = "from-blue-500 to-blue-600",
  size = "md",
  preventClose = false,
  footer,
  className = "",
  variant = "glass",
}: BaseModalProps) {
  const handleClose = () => {
    if (!preventClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={true}>
      <DialogContent
        className={`${sizeClasses[size]} max-h-[90vh] overflow-hidden p-0 border-2 border-gray-300 shadow-2xl ${className}`}
        onPointerDownOutside={(e) => {
          if (preventClose) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (preventClose) {
            e.preventDefault();
          }
        }}
      >
        {/* Background - Glass or Solid */}
        {variant === "glass" ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5OTk5OTkiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEzIDAgNi0yLjY4NyA2LTZzLTIuNjg3LTYtNi02LTYgMi42ODctNiA2IDIuNjg3IDYgNiA2ek0yNCA0NGMzLjMxMyAwIDYtMi42ODcgNi02cy0yLjY4Ny02LTYtNi02IDIuNjg3LTYgNiAyLjY4NyA2IDYgNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-white" />
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-200/50">
            <DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {Icon && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      }}
                      className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${iconBgGradient} shadow-lg flex-shrink-0`}
                    >
                      <Icon className={`size-5 sm:size-6 ${iconColor}`} />
                    </motion.div>
                  )}
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-lg sm:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                      {title}
                    </DialogTitle>
                    <DialogDescription
                      className={
                        description ? "text-sm sm:text-base mt-1" : "sr-only"
                      }
                    >
                      {description || title}
                    </DialogDescription>
                  </div>
                </div>
              </motion.div>
            </DialogHeader>
          </div>

          {/* Body - Scrollable */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 overflow-y-auto p-4 sm:p-6"
          >
            {children}
          </motion.div>

          {/* Footer */}
          {footer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 sm:p-6 pt-3 sm:pt-4 border-t-2 border-gray-200/50"
            >
              {footer}
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Pre-styled Modal Footer Component
export function ModalFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex gap-3 justify-end ${className}`}>{children}</div>
  );
}

// Pre-styled Cancel Button
export function ModalCancelButton({
  onClick,
  disabled = false,
  children = "Cancel",
}: {
  onClick: () => void;
  disabled?: boolean;
  children?: ReactNode;
}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        onClick={onClick}
        disabled={disabled}
        className="px-6"
      >
        {children}
      </Button>
    </motion.div>
  );
}

// Pre-styled Submit Button with ECONNECT gradient
export function ModalSubmitButton({
  onClick,
  disabled = false,
  loading = false,
  children = "Submit",
  icon: Icon,
  gradient = "from-blue-600 to-purple-600",
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children?: ReactNode;
  icon?: LucideIcon;
  gradient?: string;
}) {
  return (
    <motion.div
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
    >
      <Button
        onClick={onClick}
        disabled={disabled || loading}
        className={`bg-gradient-to-r ${gradient} hover:from-blue-700 hover:to-purple-700 text-white px-6 shadow-lg`}
      >
        {loading ? (
          <>
            <span className="inline-block size-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            {Icon && <Icon className="size-4 mr-2" />}
            {children}
          </>
        )}
      </Button>
    </motion.div>
  );
}

// Glass Card for content sections within modals
export function ModalGlassCard({
  children,
  className = "",
  gradient = false,
  borderColor = "border-gray-200",
  solid = false,
}: {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  borderColor?: string;
  solid?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-2xl border ${borderColor} ${
        solid
          ? "bg-white"
          : gradient
          ? "glass-card bg-gradient-to-br from-white/80 to-blue-50/50"
          : "glass-card"
      } ${className}`}
    >
      {children}
    </div>
  );
}
