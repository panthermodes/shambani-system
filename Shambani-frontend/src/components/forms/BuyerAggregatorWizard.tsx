import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { authAPI } from '../../utils/api';
import { tanzaniaLocations } from '../../utils/tanzaniaLocations';
import type { 
  BuyerAggregatorProfile, 
  BusinessType,
  ProductCategory,
  Scale 
} from '../../utils/types';

interface BuyerAggregatorWizardProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const steps = [
  { id: 'personal', title: 'Personal Information' },
  { id: 'business', title: 'Business Details' },
  { id: 'operations', title: 'Operations & Sourcing' },
  { id: 'verification', title: 'Verification' },
  { id: 'review', title: 'Review & Submit' },
];

export function BuyerAggregatorWizard({ onSuccess, onCancel }: BuyerAggregatorWizardProps) {
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
    businessType: '' as BusinessType,
    yearsInOperation: '',
    businessAddress: '',
    contactPerson: '',
    alternativePhone: '',
    website: '',
    
    // Operations & Sourcing
    productCategories: [] as ProductCategory[],
    scale: '' as Scale,
    sourcingRegions: [] as string[],
    supplierNetwork: [] as string[],
    qualityStandards: [] as string[],
    storageCapacity: '',
    processingCapacity: '',
    transportCapacity: '',
    paymentTerms: '',
    contractTypes: [] as string[],
    
    // Verification
    agreeToTerms: false,
    businessLicenseDoc: null as File | null,
    registrationDoc: null as File | null,
    qualityCertificates: [] as File[],
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
      if (!formData.businessType) newErrors.businessType = 'Select business type';
      if (!formData.yearsInOperation) newErrors.yearsInOperation = 'Years in operation required';
      if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address required';
      if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person required';
    } else if (step === 2) {
      if (formData.productCategories.length === 0) newErrors.productCategories = 'Select at least one product category';
      if (!formData.scale) newErrors.scale = 'Select business scale';
      if (formData.sourcingRegions.length === 0) newErrors.sourcingRegions = 'Select at least one sourcing region';
      if (!formData.paymentTerms) newErrors.paymentTerms = 'Payment terms required';
      if (formData.contractTypes.length === 0) newErrors.contractTypes = 'Select at least one contract type';
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
        role: 'BUYER_AGGREGATOR',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        profile: {
          companyName: formData.companyName,
          businessLicense: formData.businessLicense,
          registrationNumber: formData.registrationNumber,
          businessType: formData.businessType,
          yearsInOperation: parseInt(formData.yearsInOperation),
          businessAddress: formData.businessAddress,
          contactPerson: formData.contactPerson,
          alternativePhone: formData.alternativePhone,
          website: formData.website,
          productCategories: formData.productCategories,
          scale: formData.scale,
          sourcingRegions: formData.sourcingRegions,
          supplierNetwork: formData.supplierNetwork,
          qualityStandards: formData.qualityStandards,
          storageCapacity: formData.storageCapacity,
          processingCapacity: formData.processingCapacity,
          transportCapacity: formData.transportCapacity,
          paymentTerms: formData.paymentTerms,
          contractTypes: formData.contractTypes,
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
              <label className="block text-sm font-medium mb-2">Business Type</label>
              <select
                value={formData.businessType}
                onChange={(e) => updateField('businessType', e.target.value as BusinessType)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Business Type</option>
                <option value="SOLE_PROPRIETOR">Sole Proprietor</option>
                <option value="PARTNERSHIP">Partnership</option>
                <option value="LIMITED_COMPANY">Limited Company</option>
                <option value="COOPERATIVE">Cooperative</option>
                <option value="CORPORATION">Corporation</option>
                <option value="TRADING_COMPANY">Trading Company</option>
              </select>
              {errors.businessType && <p className="text-sm text-red-500">{errors.businessType}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Years in Operation</label>
              <Input
                type="number"
                value={formData.yearsInOperation}
                onChange={(e) => updateField('yearsInOperation', e.target.value)}
              />
              {errors.yearsInOperation && <p className="text-sm text-red-500">{errors.yearsInOperation}</p>}
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
            <div>
              <label className="block text-sm font-medium mb-1">Website (optional)</label>
              <Input
                type="url"
                placeholder="https://www.yourbusiness.com"
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Categories</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'CEREALS', label: 'Cereals & Grains' },
                  { value: 'LEGUMES', label: 'Legumes & Pulses' },
                  { value: 'VEGETABLES', label: 'Vegetables' },
                  { value: 'FRUITS', label: 'Fruits' },
                  { value: 'LIVESTOCK', label: 'Livestock' },
                  { value: 'POULTRY', label: 'Poultry' },
                  { value: 'DAIRY_PRODUCTS', label: 'Dairy Products' },
                  { value: 'PROCESSED_FOODS', label: 'Processed Foods' },
                  { value: 'CASH_CROPS', label: 'Cash Crops' },
                  { value: 'HORTICULTURE', label: 'Horticulture Products' }
                ].map(category => (
                  <label key={category.value} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.productCategories.includes(category.value as ProductCategory)}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...formData.productCategories, category.value as ProductCategory]
                          : formData.productCategories.filter(c => c !== category.value);
                        updateField('productCategories', newCategories);
                      }}
                    />
                    <span className="text-sm">{category.label}</span>
                  </label>
                ))}
              </div>
              {errors.productCategories && <p className="text-sm text-red-500">{errors.productCategories}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Business Scale</label>
              <select
                value={formData.scale}
                onChange={(e) => updateField('scale', e.target.value as Scale)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Scale</option>
                <option value="SMALL_SCALE">Small Scale</option>
                <option value="MEDIUM_SCALE">Medium Scale</option>
                <option value="LARGE_SCALE">Large Scale</option>
                <option value="INDUSTRIAL">Industrial Scale</option>
              </select>
              {errors.scale && <p className="text-sm text-red-500">{errors.scale}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sourcing Regions</label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {tanzaniaLocations.regions.map(region => (
                  <label key={region} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.sourcingRegions.includes(region)}
                      onChange={(e) => {
                        const newRegions = e.target.checked
                          ? [...formData.sourcingRegions, region]
                          : formData.sourcingRegions.filter(r => r !== region);
                        updateField('sourcingRegions', newRegions);
                      }}
                    />
                    <span className="text-sm">{region}</span>
                  </label>
                ))}
              </div>
              {errors.sourcingRegions && <p className="text-sm text-red-500">{errors.sourcingRegions}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quality Standards</label>
              <div className="grid grid-cols-2 gap-2">
                {['ISO 9001', 'HACCP', 'GlobalGAP', 'Organic Certification', 'Fair Trade', 'HACCP', 'BRC', 'FSSC 22000', 'Local Quality Standards'].map(standard => (
                  <label key={standard} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.qualityStandards.includes(standard)}
                      onChange={(e) => {
                        const newStandards = e.target.checked
                          ? [...formData.qualityStandards, standard]
                          : formData.qualityStandards.filter(s => s !== standard);
                        updateField('qualityStandards', newStandards);
                      }}
                    />
                    <span className="text-sm">{standard}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Storage Capacity</label>
                <Input
                  placeholder="e.g., 1000 tons"
                  value={formData.storageCapacity}
                  onChange={(e) => updateField('storageCapacity', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Processing Capacity</label>
                <Input
                  placeholder="e.g., 500 tons/day"
                  value={formData.processingCapacity}
                  onChange={(e) => updateField('processingCapacity', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Transport Capacity</label>
              <Input
                placeholder="e.g., 20 trucks"
                value={formData.transportCapacity}
                onChange={(e) => updateField('transportCapacity', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Terms</label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => updateField('paymentTerms', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Payment Terms</option>
                <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                <option value="NET_30">Net 30 Days</option>
                <option value="NET_60">Net 60 Days</option>
                <option value="ADVANCE_PAYMENT">Advance Payment</option>
                <option value="INSTALLMENTS">Installments</option>
                <option value="LETTER_OF_CREDIT">Letter of Credit</option>
              </select>
              {errors.paymentTerms && <p className="text-sm text-red-500">{errors.paymentTerms}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contract Types</label>
              <div className="grid grid-cols-2 gap-2">
                {['Forward Contracts', 'Spot Buying', 'Long-term Contracts', 'Seasonal Contracts', 'Quality-Based Contracts', 'Volume-Based Contracts', 'Direct Farm Contracts', 'Cooperative Contracts'].map(contract => (
                  <label key={contract} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.contractTypes.includes(contract)}
                      onChange={(e) => {
                        const newContracts = e.target.checked
                          ? [...formData.contractTypes, contract]
                          : formData.contractTypes.filter(c => c !== contract);
                        updateField('contractTypes', newContracts);
                      }}
                    />
                    <span className="text-sm">{contract}</span>
                  </label>
                ))}
              </div>
              {errors.contractTypes && <p className="text-sm text-red-500">{errors.contractTypes}</p>}
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
              <label className="block text-sm font-medium mb-1">Upload Registration Document</label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => updateField('registrationDoc', e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload Quality Certificates</label>
              <Input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => updateField('qualityCertificates', Array.from(e.target.files || []))}
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
              <p><strong>Business Type:</strong> {formData.businessType}</p>
              <p><strong>Years in Operation:</strong> {formData.yearsInOperation}</p>
              <p><strong>Business Address:</strong> {formData.businessAddress}</p>
              <p><strong>Contact Person:</strong> {formData.contactPerson}</p>
              <p><strong>Website:</strong> {formData.website || 'Not provided'}</p>
              <p><strong>Product Categories:</strong> {formData.productCategories.join(', ')}</p>
              <p><strong>Business Scale:</strong> {formData.scale}</p>
              <p><strong>Sourcing Regions:</strong> {formData.sourcingRegions.join(', ')}</p>
              <p><strong>Quality Standards:</strong> {formData.qualityStandards.join(', ')}</p>
              <p><strong>Payment Terms:</strong> {formData.paymentTerms}</p>
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx <= currentStep ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {idx + 1}
            </div>
            {idx < steps.length - 1 && <div className={`w-12 h-1 mx-1 ${idx < currentStep ? 'bg-pink-600' : 'bg-gray-200'}`} />}
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
