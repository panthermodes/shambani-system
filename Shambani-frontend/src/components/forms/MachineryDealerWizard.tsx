import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { authAPI } from '../../utils/api';
import { tanzaniaLocations } from '../../utils/tanzaniaLocations';
import type { 
  MachineryDealerProfile, 
  EquipmentType,
  ServiceType 
} from '../../utils/types';

interface MachineryDealerWizardProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const steps = [
  { id: 'personal', title: 'Personal Information' },
  { id: 'business', title: 'Business Details' },
  { id: 'equipment', title: 'Equipment & Services' },
  { id: 'verification', title: 'Verification' },
  { id: 'review', title: 'Review & Submit' },
];

export function MachineryDealerWizard({ onSuccess, onCancel }: MachineryDealerWizardProps) {
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
    businessType: '',
    yearsInOperation: '',
    businessAddress: '',
    contactPerson: '',
    alternativePhone: '',
    website: '',
    
    // Equipment & Services
    equipmentTypes: [] as EquipmentType[],
    brands: [] as string[],
    services: [] as ServiceType[],
    newEquipment: false,
    usedEquipment: false,
    rentalService: false,
    maintenanceService: false,
    trainingService: false,
    serviceRegions: [] as string[],
    paymentMethods: [] as string[],
    
    // Verification
    agreeToTerms: false,
    businessLicenseDoc: null as File | null,
    equipmentCatalogs: [] as File[],
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
      if (!formData.businessType) newErrors.businessType = 'Business type required';
      if (!formData.yearsInOperation) newErrors.yearsInOperation = 'Years in operation required';
      if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address required';
      if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person required';
    } else if (step === 2) {
      if (formData.equipmentTypes.length === 0) newErrors.equipmentTypes = 'Select at least one equipment type';
      if (formData.brands.length === 0) newErrors.brands = 'Select at least one brand';
      if (formData.services.length === 0) newErrors.services = 'Select at least one service';
      if (formData.serviceRegions.length === 0) newErrors.serviceRegions = 'Select at least one service region';
      if (formData.paymentMethods.length === 0) newErrors.paymentMethods = 'Select at least one payment method';
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
        role: 'MACHINERY_DEALER',
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
          equipmentTypes: formData.equipmentTypes,
          brands: formData.brands,
          services: formData.services,
          newEquipment: formData.newEquipment,
          usedEquipment: formData.usedEquipment,
          rentalService: formData.rentalService,
          maintenanceService: formData.maintenanceService,
          trainingService: formData.trainingService,
          serviceRegions: formData.serviceRegions,
          paymentMethods: formData.paymentMethods,
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
              <label className="block text-sm font-medium mb-1">Business Type</label>
              <select
                value={formData.businessType}
                onChange={(e) => updateField('businessType', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Business Type</option>
                <option value="SOLE_PROPRIETOR">Sole Proprietor</option>
                <option value="PARTNERSHIP">Partnership</option>
                <option value="LIMITED_COMPANY">Limited Company</option>
                <option value="COOPERATIVE">Cooperative</option>
                <option value="FRANCHISE">Franchise</option>
                <option value="DISTRIBUTOR">Distributor</option>
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
              <label className="block text-sm font-medium mb-2">Equipment Types</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'TRACTORS', label: 'Tractors' },
                  { value: 'HARVESTERS', label: 'Harvesters' },
                  { value: 'PLANTERS', label: 'Planters' },
                  { value: 'IRRIGATION', label: 'Irrigation Equipment' },
                  { value: 'PROCESSING', label: 'Processing Equipment' },
                  { value: 'STORAGE', label: 'Storage Equipment' },
                  { value: 'GREENHOUSE', label: 'Greenhouse Equipment' },
                  { value: 'LIVESTOCK', label: 'Livestock Equipment' },
                  { value: 'HAND_TOOLS', label: 'Hand Tools' },
                  { value: 'SPARE_PARTS', label: 'Spare Parts' }
                ].map(equipment => (
                  <label key={equipment.value} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.equipmentTypes.includes(equipment.value as EquipmentType)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...formData.equipmentTypes, equipment.value as EquipmentType]
                          : formData.equipmentTypes.filter(t => t !== equipment.value);
                        updateField('equipmentTypes', newTypes);
                      }}
                    />
                    <span className="text-sm">{equipment.label}</span>
                  </label>
                ))}
              </div>
              {errors.equipmentTypes && <p className="text-sm text-red-500">{errors.equipmentTypes}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Brands</label>
              <div className="grid grid-cols-2 gap-2">
                {['John Deere', 'Massey Ferguson', 'New Holland', 'Case IH', 'Kubota', 'Mahindra', 'TAFE', 'AGCO', 'Claas', 'JCB'].map(brand => (
                  <label key={brand} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.brands.includes(brand)}
                      onChange={(e) => {
                        const newBrands = e.target.checked
                          ? [...formData.brands, brand]
                          : formData.brands.filter(b => b !== brand);
                        updateField('brands', newBrands);
                      }}
                    />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
              {errors.brands && <p className="text-sm text-red-500">{errors.brands}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Services</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'SALES', label: 'Equipment Sales' },
                  { value: 'RENTAL', label: 'Equipment Rental' },
                  { value: 'MAINTENANCE', label: 'Maintenance & Repair' },
                  { value: 'TRAINING', label: 'Operator Training' },
                  { value: 'CONSULTATION', label: 'Technical Consultation' },
                  { value: 'INSTALLATION', label: 'Installation Services' },
                  { value: 'SPARE_PARTS', label: 'Spare Parts Supply' },
                  { value: 'FINANCING', label: 'Equipment Financing' },
                  { value: 'AFTER_SALES', label: 'After-Sales Support' }
                ].map(service => (
                  <label key={service.value} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service.value as ServiceType)}
                      onChange={(e) => {
                        const newServices = e.target.checked
                          ? [...formData.services, service.value as ServiceType]
                          : formData.services.filter(s => s !== service.value);
                        updateField('services', newServices);
                      }}
                    />
                    <span className="text-sm">{service.label}</span>
                  </label>
                ))}
              </div>
              {errors.services && <p className="text-sm text-red-500">{errors.services}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">Additional Services</label>
              {[
                { id: 'newEquipment', label: 'New Equipment Sales' },
                { id: 'usedEquipment', label: 'Used Equipment Sales' },
                { id: 'rentalService', label: 'Equipment Rental' },
                { id: 'maintenanceService', label: 'Maintenance Services' },
                { id: 'trainingService', label: 'Operator Training' }
              ].map(service => (
                <div key={service.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={service.id}
                    checked={formData[service.id as keyof typeof formData] as boolean}
                    onChange={(e) => updateField(service.id, e.target.checked)}
                  />
                  <label htmlFor={service.id} className="text-sm">{service.label}</label>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Methods</label>
              <div className="grid grid-cols-2 gap-2">
                {['Cash', 'Mobile Money', 'Bank Transfer', 'Credit Card', 'Cheque', 'Installments', 'Trade-in'].map(method => (
                  <label key={method} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.paymentMethods.includes(method)}
                      onChange={(e) => {
                        const newMethods = e.target.checked
                          ? [...formData.paymentMethods, method]
                          : formData.paymentMethods.filter(m => m !== method);
                        updateField('paymentMethods', newMethods);
                      }}
                    />
                    <span className="text-sm">{method}</span>
                  </label>
                ))}
              </div>
              {errors.paymentMethods && <p className="text-sm text-red-500">{errors.paymentMethods}</p>}
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
              <label className="block text-sm font-medium mb-1">Upload Equipment Catalogs</label>
              <Input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => updateField('equipmentCatalogs', Array.from(e.target.files || []))}
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
              <p><strong>Business Type:</strong> {formData.businessType}</p>
              <p><strong>Years in Operation:</strong> {formData.yearsInOperation}</p>
              <p><strong>Business Address:</strong> {formData.businessAddress}</p>
              <p><strong>Contact Person:</strong> {formData.contactPerson}</p>
              <p><strong>Website:</strong> {formData.website || 'Not provided'}</p>
              <p><strong>Equipment Types:</strong> {formData.equipmentTypes.join(', ')}</p>
              <p><strong>Brands:</strong> {formData.brands.join(', ')}</p>
              <p><strong>Services:</strong> {formData.services.join(', ')}</p>
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {idx + 1}
            </div>
            {idx < steps.length - 1 && <div className={`w-12 h-1 mx-1 ${idx < currentStep ? 'bg-indigo-600' : 'bg-gray-200'}`} />}
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
