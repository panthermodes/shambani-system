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
  FarmerProfile, 
  FarmerCategory, 
  FarmerType, 
  CropType, 
  LivestockType 
} from '../../utils/types';

interface FarmerWizardProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const steps = [
  { 
    id: 'personal', 
    title: 'Personal Information',
    description: 'Tell us about yourself',
    icon: User
  },
  { 
    id: 'business', 
    title: 'Farm Business Details',
    description: 'Your farming operation',
    icon: Building
  },
  { 
    id: 'operations', 
    title: 'Operations & Production',
    description: 'What you grow and raise',
    icon: Sprout
  },
  { 
    id: 'location', 
    title: 'Farm Location',
    description: 'Where your farm is located',
    icon: MapPin
  },
  { 
    id: 'verification', 
    title: 'Verification & Review',
    description: 'Final verification steps',
    icon: CheckCircle
  },
];

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

export function FarmerRegistrationWizard({ onSuccess, onCancel }: FarmerWizardProps) {
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
    
    // Business & Farm Details
    farmerCategory: '' as FarmerCategory,
    farmerType: '' as FarmerType,
    businessName: '',
    registrationNumber: '',
    taxId: '',
    yearsOfExperience: '',
    farmName: '',
    farmSize: '',
    farmSizeUnit: 'acres',
    
    // Operations & Production
    crops: [] as CropType[],
    livestock: [] as LivestockType[],
    farmingMethods: [] as string[],
    certifications: [] as string[],
    
    // Location & Verification
    region: '',
    district: '',
    ward: '',
    village: '',
    street: '',
    houseNumber: '',
    gpsCoordinates: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    idDocument: null as File | null,
    businessDocument: null as File | null,
    preferredLanguage: '',
    marketingConsent: false,
  });

  const updateField = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for that field if any
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
    
    if (step === 0) {
      // Personal Information
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^\+255\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
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
    } else if (step === 1) {
      // Business & Farm Details
      if (!formData.farmerCategory) newErrors.farmerCategory = 'Farmer category is required';
      if (!formData.farmerType) newErrors.farmerType = 'Farmer type is required';
      if ((formData.farmerCategory === 'COMPANY' || formData.farmerCategory === 'ORGANIZATION') && !formData.businessName.trim()) {
        newErrors.businessName = 'Business name is required';
      }
      if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';
      if (!formData.farmName.trim()) newErrors.farmName = 'Farm name is required';
      if (!formData.farmSize) newErrors.farmSize = 'Farm size is required';
    } else if (step === 2) {
      // Operations & Production
      if (formData.farmerType === 'CROP' && formData.crops.length === 0) newErrors.crops = 'Select at least one crop';
      if (formData.farmerType === 'LIVESTOCK' && formData.livestock.length === 0) newErrors.livestock = 'Select at least one livestock';
      if (formData.farmerType === 'MIXED' && (formData.crops.length === 0 || formData.livestock.length === 0)) {
        newErrors.mixed = 'Select both crops and livestock for mixed farming';
      }
    } else if (step === 3) {
      // Location
      if (!formData.region) newErrors.region = 'Region is required';
      if (!formData.district) newErrors.district = 'District is required';
      if (!formData.ward) newErrors.ward = 'Ward is required';
      if (!formData.village.trim()) newErrors.village = 'Village is required';
    } else if (step === 4) {
      // Verification
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms and conditions';
      if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = 'You must agree to privacy policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

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
      const payload = {
        role: 'FARMER',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
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
        gpsCoordinates: formData.gpsCoordinates,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        nationalId: formData.nationalId,
        alternativePhone: formData.alternativePhone,
        preferredLanguage: formData.preferredLanguage,
        marketingConsent: formData.marketingConsent,
      };
      
      await authAPI.register(payload);
      onSuccess();
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [formData, currentStep, validateStep, onSuccess]);

  // Get districts and wards based on selection
  const availableDistricts = formData.region ? getDistrictsByRegion(formData.region) : [];
  const availableWards = formData.region && formData.district ? getWardsByDistrict(formData.region, formData.district) : [];

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const renderStep = () => {
    const StepIcon = steps[currentStep].icon;
    
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <StepIcon className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
              <p className="text-gray-600">Let's get to know you better</p>
            </div>
            
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
                <label className="text-sm font-medium">Gender</label>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
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
                <label className="text-sm font-medium">Confirm Password</label>
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
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Building className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">Farm Business Details</h3>
              <p className="text-gray-600">Tell us about your farming operation</p>
            </div>
            
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
                onChange={(e) => {
                  updateField('farmerType', e.target.value as FarmerType);
                  updateField('crops', []);
                  updateField('livestock', []);
                }}
                className={`w-full p-2 border rounded-md ${errors.farmerType ? 'border-red-500' : ''}`}
              >
                <option value="">Select Farmer Type</option>
                <option value="CROP">Crop Farming</option>
                <option value="LIVESTOCK">Livestock Farming</option>
                <option value="MIXED">Mixed Farming (Crops & Livestock)</option>
                <option value="FISH">Fish Farming</option>
                <option value="MUSHROOM">Mushroom Farming</option>
              </select>
              {errors.farmerType && <p className="text-sm text-red-500">{errors.farmerType}</p>}
            </div>
            
            {(formData.farmerCategory === 'COMPANY' || formData.farmerCategory === 'ORGANIZATION') && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Business Information</h4>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Name</label>
                  <Input
                    value={formData.businessName}
                    onChange={(e) => updateField('businessName', e.target.value)}
                    placeholder="Enter business name"
                    className={errors.businessName ? 'border-red-500' : ''}
                  />
                  {errors.businessName && <p className="text-sm text-red-500">{errors.businessName}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Registration Number</label>
                    <Input
                      value={formData.registrationNumber}
                      onChange={(e) => updateField('registrationNumber', e.target.value)}
                      placeholder="Enter registration number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tax ID (TIN)</label>
                    <Input
                      value={formData.taxId}
                      onChange={(e) => updateField('taxId', e.target.value)}
                      placeholder="Enter tax ID"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Farming Experience</label>
                <Input
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) => updateField('yearsOfExperience', e.target.value)}
                  placeholder="Enter years of experience"
                  className={errors.yearsOfExperience ? 'border-red-500' : ''}
                />
                {errors.yearsOfExperience && <p className="text-sm text-red-500">{errors.yearsOfExperience}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Farm Name</label>
                <Input
                  value={formData.farmName}
                  onChange={(e) => updateField('farmName', e.target.value)}
                  placeholder="Enter your farm name"
                  className={errors.farmName ? 'border-red-500' : ''}
                />
                {errors.farmName && <p className="text-sm text-red-500">{errors.farmName}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Farm Size</label>
                <Input
                  type="number"
                  value={formData.farmSize}
                  onChange={(e) => updateField('farmSize', e.target.value)}
                  placeholder="Enter farm size"
                  className={errors.farmSize ? 'border-red-500' : ''}
                />
                {errors.farmSize && <p className="text-sm text-red-500">{errors.farmSize}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Size Unit</label>
                <select
                  value={formData.farmSizeUnit}
                  onChange={(e) => updateField('farmSizeUnit', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="square_meters">Square Meters</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Sprout className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">Operations & Production</h3>
              <p className="text-gray-600">What do you grow and raise?</p>
            </div>
            
            {(formData.farmerType === 'CROP' || formData.farmerType === 'MIXED') && (
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  🌾 Crops Grown {formData.farmerType === 'MIXED' && '(Mixed Farming)'}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {cropOptions.map(crop => (
                    <label key={crop.value} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.crops.includes(crop.value as CropType)}
                        onChange={(e) => {
                          const newCrops = e.target.checked 
                            ? [...formData.crops, crop.value as CropType]
                            : formData.crops.filter(c => c !== crop.value);
                          updateField('crops', newCrops);
                        }}
                        className="rounded"
                      />
                      <span className="text-lg">{crop.icon}</span>
                      <span className="text-sm font-medium">{crop.label}</span>
                    </label>
                  ))}
                </div>
                {errors.crops && <p className="text-sm text-red-500">{errors.crops}</p>}
              </div>
            )}
            
            {(formData.farmerType === 'LIVESTOCK' || formData.farmerType === 'MIXED') && (
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  🐄 Livestock Types {formData.farmerType === 'MIXED' && '(Mixed Farming)'}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {livestockOptions.map(animal => (
                    <label key={animal.value} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.livestock.includes(animal.value as LivestockType)}
                        onChange={(e) => {
                          const newLivestock = e.target.checked 
                            ? [...formData.livestock, animal.value as LivestockType]
                            : formData.livestock.filter(a => a !== animal.value);
                          updateField('livestock', newLivestock);
                        }}
                        className="rounded"
                      />
                      <span className="text-lg">{animal.icon}</span>
                      <span className="text-sm font-medium">{animal.label}</span>
                    </label>
                  ))}
                </div>
                {errors.livestock && <p className="text-sm text-red-500">{errors.livestock}</p>}
              </div>
            )}
            
            {errors.mixed && <p className="text-sm text-red-500">{errors.mixed}</p>}
            
            <div className="space-y-4">
              <h4 className="font-medium">Farming Methods</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {farmingMethods.map(method => (
                  <label key={method.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.farmingMethods.includes(method.value)}
                      onChange={(e) => {
                        const newMethods = e.target.checked 
                          ? [...formData.farmingMethods, method.value]
                          : formData.farmingMethods.filter(m => m !== method.value);
                        updateField('farmingMethods', newMethods);
                      }}
                      className="rounded mt-1"
                    />
                    <div>
                      <span className="text-sm font-medium">{method.label}</span>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Certifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {certifications.map(cert => (
                  <label key={cert.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.certifications.includes(cert.value)}
                      onChange={(e) => {
                        const newCerts = e.target.checked 
                          ? [...formData.certifications, cert.value]
                          : formData.certifications.filter(c => c !== cert.value);
                        updateField('certifications', newCerts);
                      }}
                      className="rounded mt-1"
                    />
                    <div>
                      <span className="text-sm font-medium">{cert.label}</span>
                      <p className="text-xs text-gray-500">{cert.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">Farm Location</h3>
              <p className="text-gray-600">Where is your farm located?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="w-4 h-4" />
                  Region
                </label>
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
                  {tanzaniaLocations.map(region => (
                    <option key={region.name} value={region.name}>
                      {region.name}
                    </option>
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
                  className={`w-full p-2 border rounded-md ${errors.district ? 'border-red-500' : ''}`}
                >
                  <option value="">Select District</option>
                  {availableDistricts.map(district => (
                    <option key={district.name} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
                {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ward</label>
                <select
                  value={formData.ward}
                  onChange={(e) => updateField('ward', e.target.value)}
                  disabled={!formData.district}
                  className={`w-full p-2 border rounded-md ${errors.ward ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Ward</option>
                  {availableWards.map(ward => (
                    <option key={ward.name} value={ward.name}>
                      {ward.name}
                    </option>
                  ))}
                </select>
                {errors.ward && <p className="text-sm text-red-500">{errors.ward}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Village/Street</label>
                <Input
                  value={formData.village}
                  onChange={(e) => updateField('village', e.target.value)}
                  placeholder="Enter village or street name"
                  className={errors.village ? 'border-red-500' : ''}
                />
                {errors.village && <p className="text-sm text-red-500">{errors.village}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Street Address</label>
                <Input
                  value={formData.street}
                  onChange={(e) => updateField('street', e.target.value)}
                  placeholder="Enter street address"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">House Number</label>
                <Input
                  value={formData.houseNumber}
                  onChange={(e) => updateField('houseNumber', e.target.value)}
                  placeholder="Enter house number"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4" />
                GPS Coordinates (Optional)
              </label>
              <Input
                value={formData.gpsCoordinates}
                onChange={(e) => updateField('gpsCoordinates', e.target.value)}
                placeholder="e.g., -6.7924, 39.2083"
              />
              <p className="text-xs text-gray-500">Helps us locate your farm precisely</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">Verification & Review</h3>
              <p className="text-gray-600">Final steps to complete your registration</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  Upload National ID Document
                </label>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => updateField('idDocument', e.target.files?.[0] || null)}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                <p className="text-xs text-gray-500">Upload a clear copy of your national ID (JPG, PNG, or PDF)</p>
              </div>
              
              {(formData.farmerCategory === 'COMPANY' || formData.farmerCategory === 'ORGANIZATION') && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="w-4 h-4" />
                    Upload Business Registration Document
                  </label>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => updateField('businessDocument', e.target.files?.[0] || null)}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <p className="text-xs text-gray-500">Upload business registration certificate</p>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h4 className="font-medium">Review Your Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3 max-h-64 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-sm text-gray-600 mb-2">Personal Information</h5>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {formData.firstName} {formData.middleName} {formData.lastName}</p>
                      <p><span className="font-medium">Email:</span> {formData.email}</p>
                      <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                      <p><span className="font-medium">Date of Birth:</span> {formData.dateOfBirth}</p>
                      <p><span className="font-medium">Gender:</span> {formData.gender}</p>
                      <p><span className="font-medium">National ID:</span> {formData.nationalId}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm text-gray-600 mb-2">Farm Details</h5>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Category:</span> {formData.farmerCategory}</p>
                      <p><span className="font-medium">Type:</span> {formData.farmerType}</p>
                      <p><span className="font-medium">Farm Name:</span> {formData.farmName}</p>
                      <p><span className="font-medium">Experience:</span> {formData.yearsOfExperience} years</p>
                      <p><span className="font-medium">Farm Size:</span> {formData.farmSize} {formData.farmSizeUnit}</p>
                      {formData.businessName && <p><span className="font-medium">Business:</span> {formData.businessName}</p>}
                    </div>
                  </div>
                </div>
                
                {formData.crops.length > 0 && (
                  <div>
                    <h5 className="font-medium text-sm text-gray-600 mb-1">Crops</h5>
                    <div className="flex flex-wrap gap-1">
                      {formData.crops.map(crop => (
                        <Badge key={crop} variant="secondary" className="text-xs">
                          {cropOptions.find(c => c.value === crop)?.icon} {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {formData.livestock.length > 0 && (
                  <div>
                    <h5 className="font-medium text-sm text-gray-600 mb-1">Livestock</h5>
                    <div className="flex flex-wrap gap-1">
                      {formData.livestock.map(animal => (
                        <Badge key={animal} variant="secondary" className="text-xs">
                          {livestockOptions.find(l => l.value === animal)?.icon} {animal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h5 className="font-medium text-sm text-gray-600 mb-1">Location</h5>
                  <p className="text-sm">
                    {formData.village}, {formData.ward}, {formData.district}, {formData.region}
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h4 className="font-medium">Agreements</h4>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => updateField('agreeToTerms', checked)}
                  />
                  <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I agree to the <span className="text-blue-600 underline font-medium">Terms and Conditions</span> of Shambani Investment
                  </label>
                </div>
                {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}
                
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Checkbox
                    id="privacy"
                    checked={formData.agreeToPrivacy}
                    onCheckedChange={(checked) => updateField('agreeToPrivacy', checked)}
                  />
                  <label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                    I agree to the <span className="text-blue-600 underline font-medium">Privacy Policy</span> and consent to data processing
                  </label>
                </div>
                {errors.agreeToPrivacy && <p className="text-sm text-red-500">{errors.agreeToPrivacy}</p>}
                
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Checkbox
                    id="marketing"
                    checked={formData.marketingConsent}
                    onCheckedChange={(checked) => updateField('marketingConsent', checked)}
                  />
                  <label htmlFor="marketing" className="text-sm leading-relaxed cursor-pointer">
                    I consent to receive marketing communications and updates about Shambani services
                  </label>
                </div>
              </div>
            </div>
            
            {errors.submit && (
              <Alert variant="destructive">
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Farmer Registration</h2>
          <Badge variant="outline" className="text-sm">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
        
        <Progress value={progressPercentage} className="mb-4" />
        
        <div className="flex justify-between items-center">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    idx <= currentStep 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {idx < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-1 text-center ${
                    idx <= currentStep ? 'text-green-600 font-medium' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    idx < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(steps[currentStep].icon, { className: "w-6 h-6 text-green-600" })}
            {steps[currentStep].title}
          </CardTitle>
          <p className="text-gray-600">{steps[currentStep].description}</p>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onCancel : prevStep}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {currentStep === 0 ? 'Cancel Registration' : 'Previous Step'}
        </Button>
        
        {currentStep === steps.length - 1 ? (
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4" />
            {loading ? 'Submitting...' : 'Complete Registration'}
          </Button>
        ) : (
          <Button 
            onClick={nextStep} 
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            Next Step
            <Tractor className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}