import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { authAPI } from '../../utils/api';
import { tanzaniaLocations } from '../../utils/tanzaniaLocations';
import type { 
  LogisticsProviderProfile, 
  TransportType,
  ServiceArea 
} from '../../utils/types';

interface LogisticsProviderWizardProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const steps = [
  { id: 'personal', title: 'Personal Information' },
  { id: 'business', title: 'Business Details' },
  { id: 'services', title: 'Services & Coverage' },
  { id: 'verification', title: 'Verification' },
  { id: 'review', title: 'Review & Submit' },
];

export function LogisticsProviderWizard({ onSuccess, onCancel }: LogisticsProviderWizardProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    nationalId: '',
    
    // Business Details
    companyName: '',
    businessLicense: '',
    registrationNumber: '',
    yearsInBusiness: '',
    companyType: '',
    businessAddress: '',
    contactPerson: '',
    alternativePhone: '',
    
    // Services & Coverage
    transportType: '' as TransportType,
    serviceArea: '' as ServiceArea,
    vehicleTypes: [] as string[],
    serviceRegions: [] as string[],
    serviceDistricts: [] as string[],
    transportCapacity: '',
    specialServices: [] as string[],
    operatingHours: '',
    emergencyService: false,
    
    // Verification
    agreeToTerms: false,
    businessLicenseDoc: null as File | null,
    vehicleDocuments: [] as File[],
    insuranceDocuments: [] as File[],
    idDocument: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
      if (!formData.email.trim()) newErrors.email = 'Email required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
      if (!formData.phone.trim()) newErrors.phone = 'Phone required';
      if (!formData.password) newErrors.password = 'Password required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth required';
      if (!formData.gender) newErrors.gender = 'Gender required';
      if (!formData.nationalId.trim()) newErrors.nationalId = 'National ID required';
    } else if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name required';
      if (!formData.businessLicense.trim()) newErrors.businessLicense = 'Business license required';
      if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number required';
      if (!formData.yearsInBusiness) newErrors.yearsInBusiness = 'Years in business required';
      if (!formData.companyType) newErrors.companyType = 'Company type required';
      if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address required';
      if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person required';
    } else if (step === 2) {
      if (!formData.transportType) newErrors.transportType = 'Select transport type';
      if (!formData.serviceArea) newErrors.serviceArea = 'Select service area';
      if (formData.vehicleTypes.length === 0) newErrors.vehicleTypes = 'Select at least one vehicle type';
      if (!formData.transportCapacity) newErrors.transportCapacity = 'Transport capacity required';
      if (formData.serviceRegions.length === 0) newErrors.serviceRegions = 'Select at least one service region';
    } else if (step === 3) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    setLoading(true);
    try {
      const payload = {
        role: 'LOGISTICS_PROVIDER',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        profile: {
          companyName: formData.companyName,
          businessLicense: formData.businessLicense,
          registrationNumber: formData.registrationNumber,
          yearsInBusiness: parseInt(formData.yearsInBusiness),
          companyType: formData.companyType,
          businessAddress: formData.businessAddress,
          contactPerson: formData.contactPerson,
          alternativePhone: formData.alternativePhone,
          transportType: formData.transportType,
          serviceArea: formData.serviceArea,
          vehicleTypes: formData.vehicleTypes,
          serviceRegions: formData.serviceRegions,
          serviceDistricts: formData.serviceDistricts,
          transportCapacity: formData.transportCapacity,
          specialServices: formData.specialServices,
          operatingHours: formData.operatingHours,
          emergencyService: formData.emergencyService,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          nationalId: formData.nationalId,
        },
      };
      await authAPI.register(payload);
      onSuccess();
    } catch (error) {
      console.error('Registration failed', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                />
                {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">National ID Number</label>
              <Input
                value={formData.nationalId}
                onChange={(e) => updateField('nationalId', e.target.value)}
              />
              {errors.nationalId && <p className="text-sm text-red-500">{errors.nationalId}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <Input
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
              />
              {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business License Number</label>
              <Input
                value={formData.businessLicense}
                onChange={(e) => updateField('businessLicense', e.target.value)}
              />
              {errors.businessLicense && <p className="text-sm text-red-500">{errors.businessLicense}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Registration Number</label>
              <Input
                value={formData.registrationNumber}
                onChange={(e) => updateField('registrationNumber', e.target.value)}
              />
              {errors.registrationNumber && <p className="text-sm text-red-500">{errors.registrationNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Type</label>
              <select
                value={formData.companyType}
                onChange={(e) => updateField('companyType', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Company Type</option>
                <option value="SOLE_PROPRIETOR">Sole Proprietor</option>
                <option value="PARTNERSHIP">Partnership</option>
                <option value="LIMITED_COMPANY">Limited Company</option>
                <option value="COOPERATIVE">Cooperative</option>
                <option value="CORPORATION">Corporation</option>
              </select>
              {errors.companyType && <p className="text-sm text-red-500">{errors.companyType}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Years in Business</label>
              <Input
                type="number"
                value={formData.yearsInBusiness}
                onChange={(e) => updateField('yearsInBusiness', e.target.value)}
              />
              {errors.yearsInBusiness && <p className="text-sm text-red-500">{errors.yearsInBusiness}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business Address</label>
              <Input
                value={formData.businessAddress}
                onChange={(e) => updateField('businessAddress', e.target.value)}
              />
              {errors.businessAddress && <p className="text-sm text-red-500">{errors.businessAddress}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Person</label>
              <Input
                value={formData.contactPerson}
                onChange={(e) => updateField('contactPerson', e.target.value)}
              />
              {errors.contactPerson && <p className="text-sm text-red-500">{errors.contactPerson}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Alternative Phone</label>
              <Input
                value={formData.alternativePhone}
                onChange={(e) => updateField('alternativePhone', e.target.value)}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Transport Type</label>
              <select
                value={formData.transportType}
                onChange={(e) => updateField('transportType', e.target.value as TransportType)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Transport Type</option>
                <option value="ROAD_TRANSPORT">Road Transport</option>
                <option value="AIR_TRANSPORT">Air Transport</option>
                <option value="RAIL_TRANSPORT">Rail Transport</option>
                <option value="WATER_TRANSPORT">Water Transport</option>
                <option value="MULTIMODAL">Multimodal Transport</option>
              </select>
              {errors.transportType && <p className="text-sm text-red-500">{errors.transportType}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Service Area</label>
              <select
                value={formData.serviceArea}
                onChange={(e) => updateField('serviceArea', e.target.value as ServiceArea)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Service Area</option>
                <option value="AGRICULTURAL_PRODUCTS">Agricultural Products</option>
                <option value="LIVESTOCK">Livestock</option>
                <option value="FARM_INPUTS">Farm Inputs</option>
                <option value="PROCESSED_GOODS">Processed Goods</option>
                <option value="GENERAL_CARGO">General Cargo</option>
                <option value="PERISHABLE_GOODS">Perishable Goods</option>
                <option value="HAZARDOUS_MATERIALS">Hazardous Materials</option>
              </select>
              {errors.serviceArea && <p className="text-sm text-red-500">{errors.serviceArea}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Vehicle Types</label>
              <div className="grid grid-cols-2 gap-2">
                {['Trucks', 'Vans', 'Pickups', 'Motorcycles', 'Bicycles', 'Trailers', 'Refrigerated Vehicles', 'Tankers', 'Flatbed Trucks', 'Container Trucks'].map(vehicle => (
                  <label key={vehicle} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.vehicleTypes.includes(vehicle)}
                      onChange={(e) => {
                        const newVehicles = e.target.checked
                          ? [...formData.vehicleTypes, vehicle]
                          : formData.vehicleTypes.filter(v => v !== vehicle);
                        updateField('vehicleTypes', newVehicles);
                      }}
                    />
                    <span className="text-sm">{vehicle}</span>
                  </label>
                ))}
              </div>
              {errors.vehicleTypes && <p className="text-sm text-red-500">{errors.vehicleTypes}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Transport Capacity</label>
              <Input
                placeholder="e.g., 10 tons, 5000 kg"
                value={formData.transportCapacity}
                onChange={(e) => updateField('transportCapacity', e.target.value)}
              />
              {errors.transportCapacity && <p className="text-sm text-red-500">{errors.transportCapacity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Operating Hours</label>
              <select
                value={formData.operatingHours}
                onChange={(e) => updateField('operatingHours', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Operating Hours</option>
                <option value="24_7">24/7</option>
                <option value="BUSINESS_HOURS">Business Hours (8AM-6PM)</option>
                <option value="FLEXIBLE">Flexible</option>
                <option value="WEEKDAYS_ONLY">Weekdays Only</option>
                <option value="WEEKENDS_ONLY">Weekends Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Special Services</label>
              <div className="grid grid-cols-2 gap-2">
                {['Refrigerated Transport', 'Hazardous Materials', 'Oversized Cargo', 'Livestock Transport', 'Express Delivery', 'Cross-Border Transport', 'Warehousing', 'Packaging Services', 'Insurance Services', 'GPS Tracking'].map(service => (
                  <label key={service} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.specialServices.includes(service)}
                      onChange={(e) => {
                        const newServices = e.target.checked
                          ? [...formData.specialServices, service]
                          : formData.specialServices.filter(s => s !== service);
                        updateField('specialServices', newServices);
                      }}
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="emergency"
                checked={formData.emergencyService}
                onChange={(e) => updateField('emergencyService', e.target.checked)}
              />
              <label htmlFor="emergency" className="text-sm">
                Available for Emergency Services
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Service Regions</label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {tanzaniaLocations.regions.map(region => (
                  <label key={region} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.serviceRegions.includes(region)}
                      onChange={(e) => {
                        const newRegions = e.target.checked
                          ? [...formData.serviceRegions, region]
                          : formData.serviceRegions.filter(r => r !== region);
                        updateField('serviceRegions', newRegions);
                      }}
                    />
                    <span className="text-sm">{region}</span>
                  </label>
                ))}
              </div>
              {errors.serviceRegions && <p className="text-sm text-red-500">{errors.serviceRegions}</p>}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Upload Business License</label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => updateField('businessLicenseDoc', e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload Vehicle Documents</label>
              <Input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => updateField('vehicleDocuments', Array.from(e.target.files || []))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload Insurance Documents</label>
              <Input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => updateField('insuranceDocuments', Array.from(e.target.files || []))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload ID Document</label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => updateField('idDocument', e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={(e) => updateField('agreeToTerms', e.target.checked)}
              />
              <label htmlFor="terms" className="text-sm">
                I agree to the <a href="#" className="text-blue-600 underline">Terms and Conditions</a>
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}
          </div>
        );
      case 4:
        return (
          <div className="space-y-3">
            <h3 className="font-semibold">Review your information</h3>
            <div className="bg-gray-50 p-4 rounded space-y-2">
              <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <p><strong>Company:</strong> {formData.companyName}</p>
              <p><strong>Business License:</strong> {formData.businessLicense}</p>
              <p><strong>Registration Number:</strong> {formData.registrationNumber}</p>
              <p><strong>Company Type:</strong> {formData.companyType}</p>
              <p><strong>Years in Business:</strong> {formData.yearsInBusiness}</p>
              <p><strong>Business Address:</strong> {formData.businessAddress}</p>
              <p><strong>Contact Person:</strong> {formData.contactPerson}</p>
              <p><strong>Transport Type:</strong> {formData.transportType}</p>
              <p><strong>Service Area:</strong> {formData.serviceArea}</p>
              <p><strong>Vehicle Types:</strong> {formData.vehicleTypes.join(', ')}</p>
              <p><strong>Transport Capacity:</strong> {formData.transportCapacity}</p>
              <p><strong>Service Regions:</strong> {formData.serviceRegions.join(', ')}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6 flex justify-between items-center">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {idx + 1}
            </div>
            {idx < steps.length - 1 && <div className={`w-12 h-1 mx-1 ${idx < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step title */}
      <h2 className="text-xl font-bold mb-4">{steps[currentStep].title}</h2>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onCancel : prevStep}
          disabled={loading}
        >
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        {currentStep === steps.length - 1 ? (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Register'}
          </Button>
        ) : (
          <Button onClick={nextStep} disabled={loading}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
