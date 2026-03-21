import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { authAPI } from '../../utils/api';
import { tanzaniaLocations, getDistrictsByRegion, getWardsByDistrict } from '../../utils/tanzaniaLocations';
import type { 
  CasualLabourerProfile, 
  SkillCategory,
  WorkType 
} from '../../utils/types';

interface CasualLabourerWizardProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const steps = [
  { id: 'personal', title: 'Personal Information' },
  { id: 'skills', title: 'Skills & Experience' },
  { id: 'location', title: 'Location & Availability' },
  { id: 'verification', title: 'Verification' },
  { id: 'review', title: 'Review & Submit' },
];

export function CasualLabourerWizard({ onSuccess, onCancel }: CasualLabourerWizardProps) {
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
    
    // Skills & Experience
    skillCategory: '' as SkillCategory,
    workType: '' as WorkType,
    yearsOfExperience: '',
    specializations: [] as string[],
    educationLevel: '',
    certifications: [] as string[],
    
    // Location & Availability
    region: '',
    district: '',
    ward: '',
    village: '',
    houseNo: '',
    workRadius: '',
    dailyRate: '',
    availableDays: [] as string[],
    preferredWorkHours: '',
    
    // Verification
    agreeToTerms: false,
    idDocument: null as File | null,
    certificates: [] as File[],
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
      if (!formData.skillCategory) newErrors.skillCategory = 'Select skill category';
      if (!formData.workType) newErrors.workType = 'Select work type';
      if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience required';
      if (!formData.educationLevel) newErrors.educationLevel = 'Select education level';
    } else if (step === 2) {
      if (!formData.region) newErrors.region = 'Region required';
      if (!formData.district) newErrors.district = 'District required';
      if (!formData.ward) newErrors.ward = 'Ward required';
      if (!formData.workRadius) newErrors.workRadius = 'Work radius required';
      if (!formData.dailyRate) newErrors.dailyRate = 'Daily rate required';
      if (formData.availableDays.length === 0) newErrors.availableDays = 'Select available days';
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
        role: 'CASUAL_LABOURER',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        profile: {
          skillCategory: formData.skillCategory,
          workType: formData.workType,
          yearsOfExperience: parseInt(formData.yearsOfExperience),
          specializations: formData.specializations,
          educationLevel: formData.educationLevel,
          certifications: formData.certifications,
          location: {
            region: formData.region,
            district: formData.district,
            ward: formData.ward,
            village: formData.village,
            houseNo: formData.houseNo,
          },
          workRadius: parseInt(formData.workRadius),
          dailyRate: parseFloat(formData.dailyRate),
          availableDays: formData.availableDays,
          preferredWorkHours: formData.preferredWorkHours,
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
              <label className="block text-sm font-medium mb-2">Skill Category</label>
              <select
                value={formData.skillCategory}
                onChange={(e) => updateField('skillCategory', e.target.value as SkillCategory)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Skill Category</option>
                <option value="FARMING">Farming</option>
                <option value="HARVESTING">Harvesting</option>
                <option value="PLANTING">Planting</option>
                <option value="IRRIGATION">Irrigation</option>
                <option value="PEST_CONTROL">Pest Control</option>
                <option value="ANIMAL_CARE">Animal Care</option>
                <option value="MACHINERY">Machinery Operation</option>
                <option value="CONSTRUCTION">Construction</option>
                <option value="TRANSPORTATION">Transportation</option>
                <option value="GENERAL_LABOR">General Labor</option>
              </select>
              {errors.skillCategory && <p className="text-sm text-red-500">{errors.skillCategory}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Work Type</label>
              <select
                value={formData.workType}
                onChange={(e) => updateField('workType', e.target.value as WorkType)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Work Type</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="SEASONAL">Seasonal</option>
                <option value="CONTRACT">Contract</option>
                <option value="DAILY_WAGE">Daily Wage</option>
              </select>
              {errors.workType && <p className="text-sm text-red-500">{errors.workType}</p>}
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
              <label className="block text-sm font-medium mb-2">Specializations</label>
              <div className="grid grid-cols-2 gap-2">
                {['Crop Management', 'Livestock Care', 'Irrigation Systems', 'Pest Control', 'Harvesting', 'Planting', 'Fencing', 'Greenhouse', 'Poultry', 'Dairy'].map(skill => (
                  <label key={skill} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.specializations.includes(skill)}
                      onChange={(e) => {
                        const newSpecializations = e.target.checked
                          ? [...formData.specializations, skill]
                          : formData.specializations.filter(s => s !== skill);
                        updateField('specializations', newSpecializations);
                      }}
                    />
                    <span className="text-sm">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Education Level</label>
              <select
                value={formData.educationLevel}
                onChange={(e) => updateField('educationLevel', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Education Level</option>
                <option value="PRIMARY">Primary Education</option>
                <option value="SECONDARY">Secondary Education</option>
                <option value="DIPLOMA">Diploma</option>
                <option value="BACHELOR">Bachelor Degree</option>
                <option value="MASTERS">Master Degree</option>
                <option value="PHD">PhD</option>
                <option value="VOCATIONAL">Vocational Training</option>
                <option value="NONE">No Formal Education</option>
              </select>
              {errors.educationLevel && <p className="text-sm text-red-500">{errors.educationLevel}</p>}
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
                  {tanzaniaLocations.map(region => (
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
                  {formData.region && getDistrictsByRegion(formData.region).map(district => (
                    <option key={district.name} value={district.name}>{district.name}</option>
                  ))}
                </select>
                {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Ward</label>
                <select
                  value={formData.ward}
                  onChange={(e) => updateField('ward', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  disabled={!formData.district}
                >
                  <option value="">Select Ward</option>
                  {formData.district && getWardsByDistrict(formData.region, formData.district).map(ward => (
                    <option key={ward.name} value={ward.name}>{ward.name}</option>
                  ))}
                </select>
                {errors.ward && <p className="text-sm text-red-500">{errors.ward}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Village</label>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Work Radius (km)</label>
                <Input
                  type="number"
                  value={formData.workRadius}
                  onChange={(e) => updateField('workRadius', e.target.value)}
                />
                {errors.workRadius && <p className="text-sm text-red-500">{errors.workRadius}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Daily Rate (TZS)</label>
                <Input
                  type="number"
                  value={formData.dailyRate}
                  onChange={(e) => updateField('dailyRate', e.target.value)}
                />
                {errors.dailyRate && <p className="text-sm text-red-500">{errors.dailyRate}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Available Days</label>
              <div className="grid grid-cols-2 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <label key={day} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formData.availableDays.includes(day)}
                      onChange={(e) => {
                        const newDays = e.target.checked
                          ? [...formData.availableDays, day]
                          : formData.availableDays.filter(d => d !== day);
                        updateField('availableDays', newDays);
                      }}
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
              {errors.availableDays && <p className="text-sm text-red-500">{errors.availableDays}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preferred Work Hours</label>
              <select
                value={formData.preferredWorkHours}
                onChange={(e) => updateField('preferredWorkHours', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Preferred Hours</option>
                <option value="MORNING">Morning (6AM - 12PM)</option>
                <option value="AFTERNOON">Afternoon (12PM - 6PM)</option>
                <option value="EVENING">Evening (6PM - 10PM)</option>
                <option value="FULL_DAY">Full Day</option>
                <option value="FLEXIBLE">Flexible</option>
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Upload ID Document</label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => updateField('idDocument', e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload Certificates (optional)</label>
              <Input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => updateField('certificates', Array.from(e.target.files || []))}
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
              <p><strong>Gender:</strong> {formData.gender}</p>
              <p><strong>National ID:</strong> {formData.nationalId}</p>
              <p><strong>Skill Category:</strong> {formData.skillCategory}</p>
              <p><strong>Work Type:</strong> {formData.workType}</p>
              <p><strong>Experience:</strong> {formData.yearsOfExperience} years</p>
              <p><strong>Education:</strong> {formData.educationLevel}</p>
              <p><strong>Specializations:</strong> {formData.specializations.join(', ')}</p>
              <p><strong>Location:</strong> {formData.village}, {formData.ward}, {formData.district}, {formData.region}</p>
              <p><strong>Work Radius:</strong> {formData.workRadius} km</p>
              <p><strong>Daily Rate:</strong> TZS {formData.dailyRate}</p>
              <p><strong>Available Days:</strong> {formData.availableDays.join(', ')}</p>
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx <= currentStep ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {idx + 1}
            </div>
            {idx < steps.length - 1 && <div className={`w-12 h-1 mx-1 ${idx < currentStep ? 'bg-orange-600' : 'bg-gray-200'}`} />}
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
