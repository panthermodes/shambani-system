import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { comprehensiveAuthAPI } from '../../services/api/comprehensive-auth';
import { tanzaniaLocations, getDistrictsByRegion, getWardsByDistrict } from '../../utils/tanzaniaLocations';
import type { 
  ExtensionOfficerProfile, 
  ExpertiseArea,
  ServiceType 
} from '../../utils/types';

interface ExtensionOfficerWizardProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const steps = [
  { id: 'personal', title: 'Personal Information' },
  { id: 'professional', title: 'Professional Details' },
  { id: 'location', title: 'Location & Service Area' },
  { id: 'verification', title: 'Verification' },
  { id: 'review', title: 'Review & Submit' },
];

export function ExtensionOfficerWizard({ onSuccess, onCancel }: ExtensionOfficerWizardProps) {
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
    
    // Professional Details
    employeeId: '',
    expertiseArea: '' as ExpertiseArea,
    serviceType: '' as ServiceType,
    yearsOfExperience: '',
    qualifications: [] as string[],
    certifications: [] as string[],
    institution: '',
    licenseNumber: '',
    specialization: '',
    
    // Location & Service Area
    region: '',
    district: '',
    ward: '',
    village: '',
    houseNo: '',
    serviceRegions: [] as string[],
    serviceDistricts: [] as string[],
    officeLocation: '',
    travelRadius: '',
    
    // Verification
    agreeToTerms: false,
    professionalLicense: null as File | null,
    certificates: [] as File[],
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
      if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID required';
      if (!formData.expertiseArea) newErrors.expertiseArea = 'Select expertise area';
      if (!formData.serviceType) newErrors.serviceType = 'Select service type';
      if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience required';
      if (!formData.institution.trim()) newErrors.institution = 'Institution required';
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number required';
    } else if (step === 2) {
      if (!formData.region) newErrors.region = 'Region required';
      if (!formData.district) newErrors.district = 'District required';
      if (!formData.ward) newErrors.ward = 'Ward required';
      if (!formData.officeLocation.trim()) newErrors.officeLocation = 'Office location required';
      if (!formData.travelRadius) newErrors.travelRadius = 'Travel radius required';
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
        role: 'EXTENSION_OFFICER',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        profile: {
          employeeId: formData.employeeId,
          expertiseArea: formData.expertiseArea,
          serviceType: formData.serviceType,
          yearsOfExperience: parseInt(formData.yearsOfExperience),
          qualifications: formData.qualifications,
          certifications: formData.certifications,
          institution: formData.institution,
          licenseNumber: formData.licenseNumber,
          specialization: formData.specialization,
          location: {
            region: formData.region,
            district: formData.district,
            ward: formData.ward,
            village: formData.village,
            houseNo: formData.houseNo,
          },
          serviceRegions: formData.serviceRegions,
          serviceDistricts: formData.serviceDistricts,
          officeLocation: formData.officeLocation,
          travelRadius: parseInt(formData.travelRadius),
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          nationalId: formData.nationalId,
        },
      };
      const response = await comprehensiveAuthAPI.register({
        role: 'EXTENSION_OFFICER',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        employeeId: formData.employeeId,
        officeLocation: formData.officeLocation,
        expertiseArea: formData.expertise,
        travelRadius: parseInt(formData.travelRadius),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        nationalId: formData.nationalId,
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
              <label className="block text-sm font-medium mb-1">Employee ID</label>
              <Input
                value={formData.employeeId}
                onChange={(e) => updateField('employeeId', e.target.value)}
              />
              {errors.employeeId && <p className="text-sm text-red-500">{errors.employeeId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Expertise Area</label>
              <select
                value={formData.expertiseArea}
                onChange={(e) => updateField('expertiseArea', e.target.value as ExpertiseArea)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Expertise Area</option>
                <option value="CROP_MANAGEMENT">Crop Management</option>
                <option value="LIVESTOCK_MANAGEMENT">Livestock Management</option>
                <option value="SOIL_ANALYSIS">Soil Analysis</option>
                <option value="PEST_MANAGEMENT">Pest Management</option>
                <option value="IRRIGATION">Irrigation Systems</option>
                <option value="POST_HARVEST">Post-Harvest Technology</option>
                <option value="AGRICULTURAL_ECONOMICS">Agricultural Economics</option>
                <option value="AGRI_BUSINESS">Agribusiness</option>
                <option value="RESEARCH">Agricultural Research</option>
              </select>
              {errors.expertiseArea && <p className="text-sm text-red-500">{errors.expertiseArea}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Service Type</label>
              <select
                value={formData.serviceType}
                onChange={(e) => updateField('serviceType', e.target.value as ServiceType)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Service Type</option>
                <option value="FIELD_VISITS">Field Visits</option>
                <option value="TRAINING">Training & Workshops</option>
                <option value="CONSULTATION">Consultation</option>
                <option value="RESEARCH">Research Services</option>
                <option value="EXTENSION_SERVICES">Extension Services</option>
                <option value="ADVISORY">Advisory Services</option>
              </select>
              {errors.serviceType && <p className="text-sm text-red-500">{errors.serviceType}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Years of Experience</label>
              <Input
                type="number"
                value={formData.yearsOfExperience}
                onChange={(e) => updateField('yearsOfExperience', e.target.value)}
              />
              {errors.yearsOfExperience && <p className="text-sm text-red-500">{errors.yearsOfExperience}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Institution</label>
              <Input
                value={formData.institution}
                onChange={(e) => updateField('institution', e.target.value)}
              />
              {errors.institution && <p className="text-sm text-red-500">{errors.institution}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">License Number</label>
              <Input
                value={formData.licenseNumber}
                onChange={(e) => updateField('licenseNumber', e.target.value)}
              />
              {errors.licenseNumber && <p className="text-sm text-red-500">{errors.licenseNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Specialization</label>
              <Input
                placeholder="e.g., Poultry Health, Crop Diseases, Soil Fertility"
                value={formData.specialization}
                onChange={(e) => updateField('specialization', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Qualifications</label>
              <div className="grid grid-cols-2 gap-2">
                {['BSc Agriculture', 'MSc Agriculture', 'PhD Agriculture', 'Diploma Agriculture', 'Veterinary Medicine', 'Agronomy', 'Horticulture', 'Animal Science', 'Soil Science', 'Plant Pathology'].map(qual => (
                  <label key={qual} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.qualifications.includes(qual)}
                      onChange={(e) => {
                        const newQualifications = e.target.checked
                          ? [...formData.qualifications, qual]
                          : formData.qualifications.filter(q => q !== qual);
                        updateField('qualifications', newQualifications);
                      }}
                    />
                    <span className="text-sm">{qual}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Certifications</label>
              <Input
                placeholder="Enter certifications separated by commas"
                value={formData.certifications.join(', ')}
                onChange={(e) => updateField('certifications', e.target.value.split(',').map(c => c.trim()).filter(c => c))}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Region</label>
                <select
                  value={formData.region}
                  onChange={(e) => {
                    updateField('region', e.target.value);
                    updateField('district', '');
                    updateField('ward', '');
                  }}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Region</option>
                  {tanzaniaLocations.map((region: any) => (
                    <option key={region.name} value={region.name}>{region.name}</option>
                  ))}
                </select>
                {errors.region && <p className="text-sm text-red-500">{errors.region}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">District</label>
                <select
                  value={formData.district}
                  onChange={(e) => {
                    updateField('district', e.target.value);
                    updateField('ward', '');
                  }}
                  className="w-full p-2 border rounded-md"
                  disabled={!formData.region}
                >
                  <option value="">Select District</option>
                  {getDistrictsByRegion(formData.region).map((district: any) => (
                    <option key={district.name} value={district.name}>{district.name}</option>
                  ))}
                </select>
                {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ward</label>
                <select
                  value={formData.ward}
                  onChange={(e) => updateField('ward', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  disabled={!formData.district}
                >
                  <option value="">Select Ward</option>
                  {getWardsByDistrict(formData.region, formData.district).map((ward: any) => (
                    <option key={ward.name} value={ward.name}>{ward.name}</option>
                  ))}
                </select>
                {errors.ward && <p className="text-sm text-red-500">{errors.ward}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Village/Street</label>
                <Input
                  value={formData.village}
                  onChange={(e) => updateField('village', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">House Number</label>
              <Input
                value={formData.houseNo}
                onChange={(e) => updateField('houseNo', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Office Location</label>
              <Input
                placeholder="Main office address"
                value={formData.officeLocation}
                onChange={(e) => updateField('officeLocation', e.target.value)}
              />
              {errors.officeLocation && <p className="text-sm text-red-500">{errors.officeLocation}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Travel Radius (km)</label>
              <Input
                type="number"
                value={formData.travelRadius}
                onChange={(e) => updateField('travelRadius', e.target.value)}
              />
              {errors.travelRadius && <p className="text-sm text-red-500">{errors.travelRadius}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Service Regions</label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {tanzaniaLocations.map((region: any) => (
                  <label key={region.name} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.serviceRegions.includes(region.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateField('serviceRegions', [...formData.serviceRegions, region.name]);
                        } else {
                          updateField('serviceRegions', formData.serviceRegions.filter((r: string) => r !== region.name));
                        }
                      }}
                    />
                    <span className="text-sm">{region.name}</span>
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
              <label className="block text-sm font-medium mb-1">Upload Professional License</label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => updateField('professionalLicense', e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload Certificates</label>
              <Input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => updateField('certificates', Array.from(e.target.files || []))}
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
              <p><strong>Employee ID:</strong> {formData.employeeId}</p>
              <p><strong>Expertise Area:</strong> {formData.expertiseArea}</p>
              <p><strong>Service Type:</strong> {formData.serviceType}</p>
              <p><strong>Experience:</strong> {formData.yearsOfExperience} years</p>
              <p><strong>Institution:</strong> {formData.institution}</p>
              <p><strong>License Number:</strong> {formData.licenseNumber}</p>
              <p><strong>Specialization:</strong> {formData.specialization}</p>
              <p><strong>Office Location:</strong> {formData.officeLocation}</p>
              <p><strong>Location:</strong> {formData.village}, {formData.ward}, {formData.district}, {formData.region}</p>
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx <= currentStep ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {idx + 1}
            </div>
            {idx < steps.length - 1 && <div className={`w-12 h-1 mx-1 ${idx < currentStep ? 'bg-purple-600' : 'bg-gray-200'}`} />}
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
