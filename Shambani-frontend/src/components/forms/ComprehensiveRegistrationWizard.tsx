// Comprehensive Registration Wizard for ALL User Roles
// Supports: Farmer, Extension Officer, Casual Labourer, Logistics Provider, Agrovet Owner, Machinery Dealer, Buyer Aggregator, Super Admin
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { 
  User, 
  Building, 
  Sprout, 
  MapPin, 
  CheckCircle, 
  Upload,
  Phone,
  Mail,
  Calendar,
  FileText,
  Globe,
  Shield,
  Tractor
} from 'lucide-react';
import { comprehensiveAuthAPI } from '../../services/api/comprehensive-auth';
import { tanzaniaLocations, getDistrictsByRegion, getWardsByDistrict } from '../../utils/tanzaniaLocations';
import type { 
  FarmerCategory, 
  FarmerType, 
  CropType, 
  LivestockType 
} from '../../utils/types';

interface ComprehensiveWizardProps {
  onSuccess: () => void;
  onCancel: () => void;
  userRole?: string;
}

// ============================================
// 🎯 ROLE-SPECIFIC CONFIGURATIONS
// ============================================

const roleConfigurations = {
  FARMER: {
    title: 'Farmer Registration',
    description: 'Register as a farmer and manage your agricultural operations',
    icon: Sprout,
    color: 'green',
    fields: ['personal', 'business', 'operations', 'location', 'verification']
  },
  EXTENSION_OFFICER: {
    title: 'Extension Officer Registration',
    description: 'Register as an agricultural extension officer to help farmers',
    icon: User,
    color: 'blue',
    fields: ['personal', 'business', 'operations', 'verification']
  },
  CASUAL_LABOURER: {
    title: 'Casual Labourer Registration',
    description: 'Register for casual agricultural work opportunities',
    icon: User,
    color: 'orange',
    fields: ['personal', 'skills', 'availability']
  },
  LOGISTICS_PROVIDER: {
    title: 'Logistics Provider Registration',
    description: 'Register as a logistics service provider for agricultural supply chain',
    icon: Truck,
    color: 'purple',
    fields: ['personal', 'business', 'operations']
  },
  AGROVET_OWNER: {
    title: 'Agrovet Owner Registration',
    description: 'Register as an agrovet shop owner to provide veterinary services',
    icon: Shield,
    color: 'red',
    fields: ['personal', 'business', 'operations']
  },
  MACHINERY_DEALER: {
    title: 'Machinery Dealer Registration',
    description: 'Register as a machinery dealer for agricultural equipment',
    icon: Tractor,
    color: 'indigo',
    fields: ['personal', 'business', 'operations']
  },
  BUYER_AGGREGATOR: {
    title: 'Buyer Aggregator Registration',
    description: 'Register as a buyer aggregator for agricultural products',
    icon: Building,
    color: 'teal',
    fields: ['personal', 'business', 'operations']
  },
  SUPER_ADMIN: {
    title: 'Super Admin Registration',
    description: 'Register as a system administrator',
    icon: Shield,
    color: 'gray',
    fields: ['personal', 'admin']
  }
};

const cropOptions = [
  { value: 'MAIZE', label: 'Maize', icon: '🌽' },
  { value: 'BEANS', label: 'Beans', icon: '🫘' },
  { value: 'VEGETABLES', label: 'Vegetables', icon: '🥬' },
  { value: 'FRUITS', label: 'Fruits', icon: '🍎' },
  { value: 'RICE', label: 'Rice', icon: '🌾' },
  { value: 'WHEAT', label: 'Wheat', icon: '🌾' },
  { value: 'SORGHUM', label: 'Sorghum', icon: '🌾' },
  { value: 'MILLET', label: 'Millet', icon: '🌾' },
  { value: 'CASSAVA', label: 'Cassava', icon: '🥔' },
  { value: 'POTATOES', label: 'Potatoes', icon: '🥔' },
  { value: 'TOMATOES', label: 'Tomatoes', icon: '🍅' },
  { value: 'ONIONS', label: 'Onions', icon: '🧅' },
  { value: 'SUGARCANE', label: 'Sugarcane', icon: '🎋' },
  { value: 'COFFEE', label: 'Coffee', icon: '☕' },
  { value: 'TEA', label: 'Tea', icon: '🍵' },
  { value: 'COTTON', label: 'Cotton', icon: '🌿' },
  { value: 'TOBACCO', label: 'Tobacco', icon: '🌿' },
  { value: 'OTHER', label: 'Other', icon: '🌱' },
];

const livestockOptions = [
  { value: 'CATTLE', label: 'Cattle', icon: '🐄' },
  { value: 'POULTRY', label: 'Poultry', icon: '🐔' },
  { value: 'GOAT', label: 'Goats', icon: '🐐' },
  { value: 'SHEEP', label: 'Sheep', icon: '🐑' },
  { value: 'PIGS', label: 'Pigs', icon: '🐷' },
  { value: 'RABBITS', label: 'Rabbits', icon: '🐰' },
  { value: 'FISH', label: 'Fish', icon: '🐟' },
  { value: 'BEE', label: 'Bees', icon: '🐝' },
  { value: 'OTHER', label: 'Other', icon: '🐾' },
];

const farmingMethods = [
  { value: 'ORGANIC', label: 'Organic', description: 'No synthetic chemicals' },
  { value: 'CONVENTIONAL', label: 'Conventional', description: 'Modern farming practices' },
  { value: 'HYDROPONIC', label: 'Hydroponic', description: 'Soil-less farming' },
  { value: 'GREENHOUSE', label: 'Greenhouse', description: 'Controlled environment' },
  { value: 'DRYLAND', label: 'Dryland', description: 'Water-efficient farming' },
  { value: 'IRRIGATED', label: 'Irrigated', description: 'Artificial watering' },
];

const certifications = [
  { value: 'ORGANIC_CERTIFIED', label: 'Organic Certified', description: 'Certified organic farming' },
  { value: 'GLOBALGAP', label: 'GlobalG.A.P', description: 'Global good agricultural practices' },
  { value: 'FAIR_TRADE', label: 'Fair Trade', description: 'Ethical trading certification' },
  { value: 'ISO_CERTIFIED', label: 'ISO Certified', description: 'International standards' },
  { value: 'LOCAL_CERTIFIED', label: 'Local Certified', description: 'Tanzania agricultural standards' },
];

export function ComprehensiveRegistrationWizard({ onSuccess, onCancel, userRole = 'FARMER' }: ComprehensiveWizardProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    alternativePhone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    nationalId: '',
    
    // Role-specific fields will be added dynamically
  });

  const config = roleConfigurations[userRole as keyof typeof roleConfigurations] || roleConfigurations.FARMER;
  const steps = config.fields.map((field, index) => ({
    id: field,
    title: getFieldTitle(field, userRole),
    description: getFieldDescription(field, userRole),
    icon: getFieldIcon(field, userRole)
  }));

  const getFieldTitle = (field: string, role: string): string => {
    const titles: Record<string, Record<string, string>> = {
      personal: { FARMER: 'Personal Information', EXTENSION_OFFICER: 'Personal Information', CASUAL_LABOURER: 'Personal Information' },
      business: { FARMER: 'Farm Business Details', EXTENSION_OFFICER: 'Work Details', CASUAL_LABOURER: 'Work Details' },
      operations: { FARMER: 'Operations & Production', EXTENSION_OFFICER: 'Service Area', CASUAL_LABOURER: 'Skills & Availability' },
      location: { FARMER: 'Farm Location', EXTENSION_OFFICER: 'Office Location', CASUAL_LABOURER: 'Work Area' },
      verification: { FARMER: 'Verification & Review', EXTENSION_OFFICER: 'Verification & Review', CASUAL_LABOURER: 'Verification & Review' },
      skills: { CASUAL_LABOURER: 'Skills & Experience' },
      availability: { CASUAL_LABOURER: 'Availability & Preferences' },
      admin: { SUPER_ADMIN: 'Admin Settings' }
    };
    return titles[field]?.[role] || field;
  };

  const getFieldDescription = (field: string, role: string): string => {
    const descriptions: Record<string, Record<string, string>> = {
      personal: { FARMER: 'Tell us about yourself', EXTENSION_OFFICER: 'Tell us about yourself', CASUAL_LABOURER: 'Tell us about yourself' },
      business: { FARMER: 'Your farming operation', EXTENSION_OFFICER: 'Your work details', CASUAL_LABOURER: 'Your work experience' },
      operations: { FARMER: 'What you grow and raise', EXTENSION_OFFICER: 'Your service area', CASUAL_LABOURER: 'Your skills and experience' },
      location: { FARMER: 'Where your farm is located', EXTENSION_OFFICER: 'Your office location', CASUAL_LABOURER: 'Your preferred work area' },
      verification: { FARMER: 'Final verification steps', EXTENSION_OFFICER: 'Final verification steps', CASUAL_LABOURER: 'Final verification steps' },
      skills: { CASUAL_LABOURER: 'Your agricultural skills and experience' },
      availability: { CASUAL_LABOURER: 'Your availability and work preferences' },
      admin: { SUPER_ADMIN: 'System administration settings' }
    };
    return descriptions[field]?.[role] || field;
  };

  const getFieldIcon = (field: string, role: string) => {
    const icons: Record<string, Record<string, any>> = {
      personal: User,
      business: Building,
      operations: Sprout,
      location: MapPin,
      verification: CheckCircle,
      skills: User,
      availability: Calendar,
      admin: Shield
    };
    return icons[field]?.[role] || User;
  };

  const updateField = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    const stepConfig = steps[step];
    if (!stepConfig) return true;

    // Personal information validation
    if (stepConfig.id === 'personal') {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (userRole === 'FARMER' && !/^\+255\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Invalid Tanzanian phone number format';
      }
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, number and special character';
      }
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.nationalId.trim()) newErrors.nationalId = 'National ID is required';
    }

    // Business validation
    if (stepConfig.id === 'business') {
      if (!formData.farmerCategory) newErrors.farmerCategory = 'Category is required';
      if (!formData.farmName && userRole === 'FARMER') newErrors.farmName = 'Farm name is required';
      if (!formData.businessName && userRole !== 'FARMER') newErrors.businessName = 'Business name is required';
      if (!formData.yearsOfExperience && userRole === 'FARMER') newErrors.yearsOfExperience = 'Years of experience is required';
      if (!formData.farmSize && userRole === 'FARMER') newErrors.farmSize = 'Farm size is required';
    }

    // Operations validation
    if (stepConfig.id === 'operations') {
      if (userRole === 'FARMER') {
        if (formData.farmerType === 'CROP' && (!formData.crops || formData.crops.length === 0)) {
          newErrors.crops = 'Select at least one crop';
        }
        if (formData.farmerType === 'LIVESTOCK' && (!formData.livestock || formData.livestock.length === 0)) {
          newErrors.livestock = 'Select at least one livestock';
        }
        if (formData.farmerType === 'MIXED' && (!formData.crops || formData.crops.length === 0 || !formData.livestock || formData.livestock.length === 0)) {
          newErrors.mixed = 'Select both crops and livestock for mixed farming';
        }
      }
    }

    // Location validation
    if (stepConfig.id === 'location') {
      if (!formData.region) newErrors.region = 'Region is required';
      if (!formData.district) newErrors.district = 'District is required';
      if (!formData.ward) newErrors.ward = 'Ward is required';
      if (!formData.village.trim()) newErrors.village = 'Village is required';
    }

    // Verification validation
    if (stepConfig.id === 'verification') {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms and conditions';
      if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = 'You must agree to privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, currentStep]);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    try {
      const response = await comprehensiveAuthAPI.register({
        role: userRole.toUpperCase(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        // Role-specific fields
        ...(userRole === 'FARMER' && {
          farmerType: formData.farmerType,
          farmName: formData.farmName,
          businessName: formData.businessName,
          farmerCategory: formData.farmerCategory,
          registrationNumber: formData.registrationNumber,
          taxId: formData.taxId,
          yearsOfExperience: parseInt(formData.yearsOfExperience),
          farmSize: parseFloat(formData.farmSize),
          farmSizeUnit: formData.farmSizeUnit,
          crops: formData.crops,
          livestock: formData.livestock,
          farmingMethods: formData.farmingMethods,
          certifications: formData.certifications,
          region: formData.region,
          district: formData.district,
          ward: formData.ward,
          village: formData.village,
          street: formData.street,
          houseNumber: formData.houseNumber,
          gpsCoordinates: formData.gpsCoordinates
        }),
        ...(userRole === 'EXTENSION_OFFICER' && {
          employeeId: formData.employeeId,
          officeLocation: formData.officeLocation,
          serviceArea: formData.serviceArea
        }),
        ...(userRole === 'CASUAL_LABOURER' && {
          skills: formData.skills,
          availability: formData.availability,
          expectedWage: formData.expectedWage,
          workArea: formData.workArea
        }),
        ...(userRole === 'LOGISTICS_PROVIDER' && {
          serviceArea: formData.serviceArea,
          vehicleType: formData.vehicleType,
          coverageArea: formData.coverageArea
        }),
        ...(userRole === 'AGROVET_OWNER' && {
          shopName: formData.shopName,
          shopLocation: formData.shopLocation,
          specializations: formData.specializations,
          licenseNumber: formData.licenseNumber
        }),
        ...(userRole === 'MACHINERY_DEALER' && {
          businessName: formData.businessName,
          dealerLicense: formData.dealerLicense,
          specializations: formData.specializations
        }),
        ...(userRole === 'BUYER_AGGREGATOR' && {
          companyName: formData.companyName,
          aggregationType: formData.aggregationType,
          licenseNumber: formData.licenseNumber
        }),
        ...(userRole === 'SUPER_ADMIN' && {
          adminLevel: formData.adminLevel,
          permissions: formData.permissions
        })
      });

      if (response.success) {
        onSuccess();
      } else {
        alert(`Registration failed: ${response.message}`);
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      alert(`Registration failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [formData, currentStep, onSuccess, userRole]);

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const renderStep = () => {
    const StepIcon = steps[currentStep].icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <StepIcon className={`w-16 h-16 mx-auto mb-4 text-${config.color}-600`} />
          <h3 className="text-xl font-semibold mb-2">{config.title}</h3>
          <p className="text-gray-600">{config.description}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Step {currentStep + 1} of {steps.length}</h4>
            <span className="text-sm text-gray-500">
              {progressPercentage.toFixed(0)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="w-64" />
        </div>

        {/* Role-specific step content */}
        {currentStep === 0 && stepConfig.id === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4" />
                First Name
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder="Enter your first name"
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4" />
                Last Name
              </label>
              <Input
                value={formData.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                placeholder="Enter your last name"
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Middle Name (Optional)</label>
              <Input
                value={formData.middleName}
                onChange={(e) => updateField('middleName', e.target.value)}
                placeholder="Enter your middle name"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+255 712 345 678"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                <p className="text-xs text-gray-500">Format: +255 XXX XXX XXX</p>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="w-4 h-4" />
                  Alternative Phone (Optional)
                </label>
                <Input
                  value={formData.alternativePhone}
                  onChange={(e) => updateField('alternativePhone', e.target.value)}
                  placeholder="+255 712 345 678"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  Date of Birth
                </label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  className={errors.dateOfBirth ? 'border-red-500' : ''}
                />
                {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className={`w-full p-2 border rounded-md ${errors.gender ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="w-4 h-4" />
                  National ID Number
                </label>
                <Input
                  value={formData.nationalId}
                  onChange={(e) => updateField('nationalId', e.target.value)}
                  placeholder="Enter your national ID number"
                  className={errors.nationalId ? 'border-red-500' : ''}
                />
                {errors.nationalId && <p className="text-sm text-red-500">{errors.nationalId}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">Password</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="Enter password"
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              <p className="text-xs text-gray-500">Must contain uppercase, lowercase, number and special character</p>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                placeholder="Confirm password"
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>
        )}

        {currentStep === 1 && stepConfig.id === 'business' && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium mb-4">{stepConfig.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userRole === 'FARMER' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Farmer Category</label>
                    <select
                      value={formData.farmerCategory}
                      onChange={(e) => updateField('farmerCategory', e.target.value as FarmerCategory)}
                      className={`w-full p-2 border rounded-md ${errors.farmerCategory ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select Farmer Category</option>
                      <option value="INDIVIDUAL">Individual Farmer</option>
                      <option value="GROUP">Farmer Group/Cooperative</option>
                      <option value="COMPANY">Farm Company</option>
                      <option value="ORGANIZATION">Farm Organization</option>
                    </select>
                    {errors.farmerCategory && <p className="text-sm text-red-500">{errors.farmerCategory}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Farmer Type</label>
                    <select
                      value={formData.farmerType}
                      onChange={(e) => updateField('farmerType', e.target.value as FarmerType)}
                      className={`w-full p-2 border rounded-md ${errors.farmerType ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select Farmer Type</option>
                      <option value="CROP">Crop Production</option>
                      <option value="LIVESTOCK">Livestock</option>
                      <option value="MIXED">Mixed Farming</option>
                      <option value="MUSHROOM">Mushroom</option>
                    </select>
                    {errors.farmerType && <p className="text-sm text-red-500">{errors.farmerType}</p>}
                  </div>
                </>
              )}
              
              {(userRole === 'EXTENSION_OFFICER' || userRole === 'CASUAL_LABOURER') && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {userRole === 'EXTENSION_OFFICER' ? 'Employee ID' : 'Expected Wage'}
                    </label>
                    <Input
                      value={userRole === 'EXTENSION_OFFICER' ? formData.employeeId : formData.expectedWage}
                      onChange={(e) => updateField(userRole === 'EXTENSION_OFFICER' ? 'employeeId' : 'expectedWage', e.target.value)}
                      placeholder={userRole === 'EXTENSION_OFFICER' ? 'Enter employee ID' : 'Enter expected wage'}
                      className={errors.employeeId || errors.expectedWage ? 'border-red-500' : ''}
                    />
                    {(errors.employeeId || errors.expectedWage) && <p className="text-sm text-red-500">{errors.employeeId || errors.expectedWage}</p>}
                  </div>
                </>
              )}
              
              {(userRole === 'LOGISTICS_PROVIDER' || userRole === 'AGROVET_OWNER' || userRole === 'MACHINERY_DEALER' || userRole === 'BUYER_AGGREGATOR') && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {userRole === 'LOGISTICS_PROVIDER' ? 'Service Area' : 
                       userRole === 'AGROVET_OWNER' ? 'Shop Name' :
                       userRole === 'MACHINERY_DEALER' ? 'Business Name' :
                       'Company Name'}
                    </label>
                    <Input
                      value={
                        userRole === 'LOGISTICS_PROVIDER' ? formData.serviceArea :
                        userRole === 'AGROVET_OWNER' ? formData.shopName :
                        userRole === 'MACHINERY_DEALER' ? formData.businessName :
                        formData.companyName
                      }
                      onChange={(e) => updateField(
                        userRole === 'LOGISTICS_PROVIDER' ? 'serviceArea' :
                        userRole === 'AGROVET_OWNER' ? 'shopName' :
                        userRole === 'MACHINERY_DEALER' ? 'businessName' :
                        'companyName', 
                        e.target.value
                      )}
                      placeholder={
                        userRole === 'LOGISTICS_PROVIDER' ? 'Enter service area' :
                        userRole === 'AGROVET_OWNER' ? 'Enter shop name' :
                        userRole === 'MACHINERY_DEALER' ? 'Enter business name' :
                        'Enter company name'
                      }
                      className={errors.serviceArea || errors.shopName || errors.businessName || errors.companyName ? 'border-red-500' : ''}
                    />
                    {(errors.serviceArea || errors.shopName || errors.businessName || errors.companyName) && <p className="text-sm text-red-500">{errors.serviceArea || errors.shopName || errors.businessName || errors.companyName}</p>}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && stepConfig.id === 'operations' && (
          <div className="space-y-6">
            <h4 className="text-lg font-medium mb-4">{stepConfig.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userRole === 'FARMER' && (
                <>
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Crops Grown</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {cropOptions.map((crop) => (
                        <div key={crop.value} className="flex items-center space-x-2">
                          <Checkbox
                            checked={formData.crops?.includes(crop.value)}
                            onCheckedChange={(checked) => {
                              const currentCrops = formData.crops || [];
                              if (checked) {
                                updateField('crops', [...currentCrops, crop.value]);
                              } else {
                                updateField('crops', currentCrops.filter(c => c !== crop.value));
                              }
                            }}
                          />
                          <label className="text-sm">{crop.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Livestock Types</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {livestockOptions.map((animal) => (
                        <div key={animal.value} className="flex items-center space-x-2">
                          <Checkbox
                            checked={formData.livestock?.includes(animal.value)}
                            onCheckedChange={(checked) => {
                              const currentLivestock = formData.livestock || [];
                              if (checked) {
                                updateField('livestock', [...currentLivestock, animal.value]);
                              } else {
                                updateField('livestock', currentLivestock.filter(a => a !== animal.value));
                              }
                            }}
                          />
                          <label className="text-sm">{animal.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Farming Methods</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {farmingMethods.map((method) => (
                        <div key={method.value} className="flex items-center space-x-2">
                          <Checkbox
                            checked={formData.farmingMethods?.includes(method.value)}
                            onCheckedChange={(checked) => {
                              const currentMethods = formData.farmingMethods || [];
                              if (checked) {
                                updateField('farmingMethods', [...currentMethods, method.value]);
                              } else {
                                updateField('farmingMethods', currentMethods.filter(m => m !== method.value));
                              }
                            }}
                          />
                          <div>
                            <label className="text-sm">{method.label}</label>
                            <p className="text-xs text-gray-500">{method.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Certifications</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {certifications.map((cert) => (
                        <div key={cert.value} className="flex items-center space-x-2">
                          <Checkbox
                            checked={formData.certifications?.includes(cert.value)}
                            onCheckedChange={(checked) => {
                              const currentCerts = formData.certifications || [];
                              if (checked) {
                                updateField('certifications', [...currentCerts, cert.value]);
                              } else {
                                updateField('certifications', currentCerts.filter(c => c !== cert.value));
                              }
                            }}
                          />
                          <div>
                            <label className="text-sm">{cert.label}</label>
                            <p className="text-xs text-gray-500">{cert.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {(userRole === 'EXTENSION_OFFICER' || userRole === 'CASUAL_LABOURER') && (
                <>
                  <div className="space-y-4">
                    <label className="text-sm font-medium">
                      {userRole === 'EXTENSION_OFFICER' ? 'Service Area' : 'Skills & Experience'}
                    </label>
                    <Input
                      value={userRole === 'EXTENSION_OFFICER' ? formData.serviceArea : formData.skills}
                      onChange={(e) => updateField(userRole === 'EXTENSION_OFFICER' ? 'serviceArea' : 'skills', e.target.value)}
                      placeholder={userRole === 'EXTENSION_OFFICER' ? 'Enter your service area' : 'Describe your agricultural skills'}
                      className={errors.serviceArea || errors.skills ? 'border-red-500' : ''}
                    />
                    {(errors.serviceArea || errors.skills) && <p className="text-sm text-red-500">{errors.serviceArea || errors.skills}</p>}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && stepConfig.id === 'location' && (
          <div className="space-y-6">
            <h4 className="text-lg font-medium mb-4">{stepConfig.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Region</label>
                <select
                  value={formData.region}
                  onChange={(e) => {
                    updateField('region', e.target.value);
                    updateField('district', '');
                    updateField('ward', '');
                  }}
                  className={`w-full p-2 border rounded-md ${errors.region ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Region</option>
                  {tanzaniaLocations.regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                {errors.region && <p className="text-sm text-red-500">{errors.region}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">District</label>
                <select
                  value={formData.district}
                  onChange={(e) => {
                    updateField('district', e.target.value);
                    updateField('ward', '');
                  }}
                  disabled={!formData.region}
                  className={`w-full p-2 border rounded-md ${errors.district ? 'border-red-500' : ''} ${!formData.region ? 'bg-gray-100' : ''}`}
                >
                  <option value="">Select District</option>
                  {formData.region && tanzaniaLocations.getDistrictsByRegion(formData.region).map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Ward</label>
                <select
                  value={formData.ward}
                  onChange={(e) => updateField('ward', e.target.value)}
                  disabled={!formData.district}
                  className={`w-full p-2 border rounded-md ${errors.ward ? 'border-red-500' : ''} ${!formData.district ? 'bg-gray-100' : ''}`}
                >
                  <option value="">Select Ward</option>
                  {formData.region && formData.district && tanzaniaLocations.getWardsByDistrict(formData.region, formData.district).map((ward) => (
                    <option key={ward} value={ward}>{ward}</option>
                  ))}
                </select>
                {errors.ward && <p className="text-sm text-red-500">{errors.ward}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Village/Street</label>
                <Input
                  value={formData.village}
                  onChange={(e) => updateField('village', e.target.value)}
                  placeholder="Enter village name"
                  className={errors.village ? 'border-red-500' : ''}
                />
                {errors.village && <p className="text-sm text-red-500">{errors.village}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Street Address</label>
                  <Input
                    value={formData.street}
                    onChange={(e) => updateField('street', e.target.value)}
                    placeholder="Enter street address"
                    className={errors.street ? 'border-red-500' : ''}
                  />
                  {errors.street && <p className="text-sm text-red-500">{errors.street}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">House Number</label>
                  <Input
                    value={formData.houseNumber}
                    onChange={(e) => updateField('houseNumber', e.target.value)}
                    placeholder="Enter house number"
                    className={errors.houseNumber ? 'border-red-500' : ''}
                  />
                  {errors.houseNumber && <p className="text-sm text-red-500">{errors.houseNumber}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">GPS Coordinates (Optional)</label>
                <Input
                  value={formData.gpsCoordinates}
                  onChange={(e) => updateField('gpsCoordinates', e.target.value)}
                  placeholder="e.g., -6.8205, 37.2785"
                  className={errors.gpsCoordinates ? 'border-red-500' : ''}
                />
                {errors.gpsCoordinates && <p className="text-sm text-red-500">{errors.gpsCoordinates}</p>}
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && stepConfig.id === 'verification' && (
          <div className="space-y-6">
            <h4 className="text-lg font-medium mb-4">{stepConfig.title}</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  ID Document (Optional)
                </label>
                <Input
                  type="file"
                  onChange={(e) => updateField('idDocument', e.target.files?.[0])}
                  accept="image/*,.pdf"
                  className={errors.idDocument ? 'border-red-500' : ''}
                />
                {errors.idDocument && <p className="text-sm text-red-500">{errors.idDocument}</p>}
              </div>
              
              {(userRole === 'EXTENSION_OFFICER' || userRole === 'CASUAL_LABOURER') && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Upload className="w-4 h-4" />
                    Business Document (Optional)
                  </label>
                  <Input
                    type="file"
                    onChange={(e) => updateField('businessDocument', e.target.files?.[0])}
                    accept="image/*,.pdf"
                    className={errors.businessDocument ? 'border-red-500' : ''}
                  />
                  {errors.businessDocument && <p className="text-sm text-red-500">{errors.businessDocument}</p>}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => updateField('agreeToTerms', checked)}
                  />
                  <label className="text-sm font-medium">I agree to the Terms and Conditions</label>
                </div>
                {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.agreeToPrivacy}
                    onCheckedChange={(checked) => updateField('agreeToPrivacy', checked)}
                  />
                  <label className="text-sm font-medium">I agree to the Privacy Policy</label>
                </div>
                {errors.agreeToPrivacy && <p className="text-sm text-red-500">{errors.agreeToPrivacy}</p>}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.marketingConsent}
                    onCheckedChange={(checked) => updateField('marketingConsent', checked)}
                  />
                  <label className="text-sm font-medium">I consent to receive marketing communications</label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ChevronRight className="w-4 h-4" />
            Previous
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="flex items-center space-x-2"
            style={{ backgroundColor: config.color }}
          >
            {currentStep === steps.length - 1 ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Complete Registration
              </>
            ) : (
              <>
                Next Step
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className={`text-2xl font-bold text-${config.color}-600`}>
              {config.title}
            </CardTitle>
            <CardDescription>
              {config.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            {renderStep()}
            
            <div className="flex justify-center space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={onCancel}
                className="px-8"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
