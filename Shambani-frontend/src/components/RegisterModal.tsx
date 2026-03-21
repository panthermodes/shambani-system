import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  X,
  User,
  Sprout,
  Users,
  Truck,
  ShoppingBag,
  Tractor,
  Package,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { authAPI } from "../services/api";
import type { UserRole } from "../utils/types";
import { RegistrationForm } from "./RegistrationForm";
import { FarmerRegistrationWizard } from "./forms/FarmerRegistrationWizard";
import { CasualLabourerWizard } from "./forms/CasualLabourerWizard"; // Import casual labourer wizard
import { ExtensionOfficerWizard } from "./forms/ExtensionOfficerWizard";
import { LogisticsProviderWizard } from "./forms/LogisticsProviderWizard";
import { AgrovetOwnerWizard } from "./forms/AgrovetOwnerWizard";
import { MachineryDealerWizard } from "./forms/MachineryDealerWizard";
import { BuyerAggregatorWizard } from "./forms/BuyerAggregatorWizard";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RegisterModal({ isOpen, onClose, onSuccess }: RegisterModalProps) {
  const { language, t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    farmName: "",
    businessName: "",
    location: "",
    region: "",
    district: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const userTypes = [
    {
      icon: Sprout,
      key: "FARMER",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      hoverBorder: "hover:border-green-300",
    },
    {
      icon: User,
      key: "CASUAL_LABOURER",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      hoverBorder: "hover:border-orange-300",
    },
    {
      icon: Users,
      key: "EXTENSION_OFFICER",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      hoverBorder: "hover:border-purple-300",
    },
    {
      icon: Truck,
      key: "LOGISTICS_PROVIDER",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      hoverBorder: "hover:border-blue-300",
    },
    {
      icon: ShoppingBag,
      key: "AGROVET_OWNER",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      hoverBorder: "hover:border-teal-300",
    },
    {
      icon: Tractor,
      key: "MACHINERY_DEALER",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      hoverBorder: "hover:border-indigo-300",
    },
    {
      icon: Package,
      key: "BUYER_AGGREGATOR",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      hoverBorder: "hover:border-pink-300",
    },
    {
      icon: User,
      key: "SUPER_ADMIN",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      hoverBorder: "hover:border-red-300",
    },
  ];

  // Registration Form Modal
  if (selectedRole) {
    return (
      <AnimatePresence>
        <motion.div
          key="registration-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {t("registerTitle")} - {t(selectedRole)}
                </h2>
                <button
                  onClick={() => {
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {selectedRole === 'FARMER' && (
                <FarmerRegistrationWizard 
                  onSuccess={() => {
                    onSuccess?.();
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                  onCancel={() => {
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                />
              )}
              {selectedRole === 'CASUAL_LABOURER' && (
                <CasualLabourerWizard 
                  onSuccess={() => {
                    onSuccess?.();
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                  onCancel={() => {
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                />
              )}
              {selectedRole === 'EXTENSION_OFFICER' && (
                <ExtensionOfficerWizard 
                  onSuccess={() => {
                    onSuccess?.();
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                  onCancel={() => {
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                />
              )}
              {selectedRole === 'LOGISTICS_PROVIDER' && (
                <LogisticsProviderWizard 
                  onSuccess={() => {
                    onSuccess?.();
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                  onCancel={() => {
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                />
              )}
              {selectedRole === 'AGROVET_OWNER' && (
                <AgrovetOwnerWizard 
                  onSuccess={() => {
                    onSuccess?.();
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                  onCancel={() => {
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                />
              )}
              {selectedRole === 'MACHINERY_DEALER' && (
                <MachineryDealerWizard 
                  onSuccess={() => {
                    onSuccess?.();
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                  onCancel={() => {
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                />
              )}
              {selectedRole === 'BUYER_AGGREGATOR' && (
                <BuyerAggregatorWizard 
                  onSuccess={() => {
                    onSuccess?.();
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                  onCancel={() => {
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                />
              )}
              {selectedRole === 'SUPER_ADMIN' && (
                <RegistrationForm 
                  role={selectedRole}
                  onSuccess={() => {
                    onSuccess?.();
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                  onCancel={() => {
                    setSelectedRole(null);
                    setShowRegistrationForm(false);
                  }}
                />
              )}
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Main Registration Modal
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="register-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-white p-4 sm:p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-gray-900 text-lg sm:text-xl md:text-2xl">
                  {t("registerTitle")}
                </h2>
                <button
                  onClick={() => {
                    onClose();
                    onSuccess?.();
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* User Type Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userTypes.map((type, index) => (
                  <motion.button
                    key={type.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -2, scale: 1.01 }}
                    onClick={() => setSelectedRole(type.key as UserRole)}
                    className={`p-3 sm:p-4 rounded-lg border border-gray-200 ${type.hoverBorder} ${type.bgColor} transition-all text-left group flex items-center gap-3`}
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow group-hover:shadow-md transition-shadow`}
                    >
                      <type.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-0.5">
                        {t(type.key)}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                        {t(`${type.key}Desc`)}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Note about buyers */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs sm:text-sm text-blue-800">
                  <strong>{t("buyerNote")}</strong> {t("buyerNoteText")}
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
