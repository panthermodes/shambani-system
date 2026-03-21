import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { useAuth } from "../../contexts/AuthContext";
import { locationAPI, schoolAPI, talentAPI } from "../../utils/api";
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle, XCircle } from "../ui/icons";
import { motion } from "framer-motion";

interface StudentRegistrationFormProps {
  onNavigate: (page: string) => void;
}

export function StudentRegistrationForm({
  onNavigate,
}: StudentRegistrationFormProps) {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [regions, setRegions] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [talents, setTalents] = useState<any[]>([]);

  // Filtered location data based on selection
  const [filteredDistricts, setFilteredDistricts] = useState<any[]>([]);
  const [filteredWards, setFilteredWards] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    phone: "",
    password: "",
    confirmPassword: "",
    email: "",
    studentId: "",
    classLevel: "",
    classYear: "",
    regionId: "",
    districtId: "",
    wardId: "",
    schoolId: "",
    selectedTalents: [] as string[],
    registrationType: "" as "normal" | "premier" | "",
    acceptedTerms: false,
    acceptedPrivacy: false,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoadingData(true);
    try {
      // ✅ Load everything in parallel for maximum speed
      const [regionsRes, districtsRes, wardsRes, schoolsRes, talentsRes] =
        await Promise.all([
          locationAPI.getRegions(),
          locationAPI.getDistricts(), // Get ALL districts
          locationAPI.getWards(), // Get ALL wards
          schoolAPI.getAllSchools(),
          talentAPI.getAll(),
        ]);

      // Process regions
      if (regionsRes.success && regionsRes.data) {
        setRegions(regionsRes.data);
        console.log("✅ Loaded regions:", regionsRes.data.length);
      }

      // Process districts
      if (districtsRes.success && districtsRes.data) {
        setDistricts(districtsRes.data);
        console.log("✅ Loaded districts:", districtsRes.data.length);
      }

      // Process wards
      if (wardsRes.success && wardsRes.data) {
        setWards(wardsRes.data);
        console.log("✅ Loaded wards:", wardsRes.data.length);
      }

      // Process schools
      if (schoolsRes.success && schoolsRes.data) {
        setSchools(schoolsRes.data.data || schoolsRes.data);
        console.log(
          "✅ Loaded schools:",
          (schoolsRes.data.data || schoolsRes.data).length
        );
      } else {
        const fallbackSchools = [
          { _id: "school1", name: "Enter School Name Manually", id: "school1" },
        ];
        setSchools(fallbackSchools);
      }

      // Process talents
      if (talentsRes.success && talentsRes.data) {
        const talentsData = talentsRes.data.data || talentsRes.data;
        setTalents(talentsData);
        console.log("✅ Loaded talents:", talentsData.length);
      } else {
        const fallbackTalents = [
          { _id: "art", name: "Art & Drawing", id: "art" },
          { _id: "music", name: "Music & Singing", id: "music" },
          { _id: "dance", name: "Dance & Performance", id: "dance" },
          { _id: "sports", name: "Sports & Athletics", id: "sports" },
          { _id: "tech", name: "Technology & ICT", id: "tech" },
          { _id: "writing", name: "Writing & Poetry", id: "writing" },
          { _id: "acting", name: "Acting & Drama", id: "acting" },
          {
            _id: "leadership",
            name: "Leadership & Public Speaking",
            id: "leadership",
          },
        ];
        setTalents(fallbackTalents);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast.error("Failed to load form data. Please refresh the page.");
    } finally {
      setLoadingData(false);
    }
  };

  // Filter districts based on selected region
  const handleRegionChange = (regionId: string) => {
    setFormData({
      ...formData,
      regionId,
      districtId: "",
      wardId: "",
    });

    if (regionId) {
      const filtered = districts.filter((d) => d.regionId === regionId);
      setFilteredDistricts(filtered);
      setFilteredWards([]);
      console.log(
        `🔽 Filtered ${filtered.length} districts for region ${regionId}`
      );
    } else {
      setFilteredDistricts([]);
      setFilteredWards([]);
    }
  };

  // Filter wards based on selected district
  const handleDistrictChange = (districtId: string) => {
    setFormData({
      ...formData,
      districtId,
      wardId: "",
    });

    if (districtId) {
      const filtered = wards.filter((w) => w.districtId === districtId);
      setFilteredWards(filtered);
      console.log(
        `🔽 Filtered ${filtered.length} wards for district ${districtId}`
      );
    } else {
      setFilteredWards([]);
    }
  };

  const handleTalentToggle = (talent: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTalents: prev.selectedTalents.includes(talent)
        ? prev.selectedTalents.filter((t) => t !== talent)
        : [...prev.selectedTalents, talent],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.registrationType) {
      toast.error("Please select a registration type");
      return;
    }

    if (!formData.acceptedTerms || !formData.acceptedPrivacy) {
      toast.error("Please accept the Terms and Privacy Policy");
      return;
    }

    if (formData.selectedTalents.length === 0) {
      toast.error("Please select at least one talent");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Format data to match backend schema
      const registrationData = {
        phone: formData.phone,
        password: formData.password,
        names: {
          first: formData.firstName,
          middle: formData.middleName,
          last: formData.lastName,
        },
        email: formData.email || undefined,
        role: "student",
        school_id: formData.schoolId,
        accepted_terms: true,
        student: {
          student_id: formData.studentId || undefined,
          class_level: formData.classLevel,
          year: parseInt(formData.classYear) || new Date().getFullYear(),
          talents: formData.selectedTalents,
          registration_type: formData.registrationType,
        },
        location: {
          region:
            regions.find((r) => (r._id || r.id) === formData.regionId)?.name ||
            "",
          district:
            districts.find((d) => (d._id || d.id) === formData.districtId)
              ?.name || "",
          ward:
            wards.find((w) => (w._id || w.id) === formData.wardId)?.name || "",
        },
        metadata: {
          gender: formData.gender,
        },
      };

      const result = await register(registrationData);

      if (result.success) {
        toast.success(
          "Registration submitted successfully! Your school admin will review and approve your registration. You will receive an SMS with your credentials."
        );
        onNavigate("login");
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h4 className="text-gray-800">Personal Information</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  firstName: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="middleName">Middle Name *</Label>
            <Input
              id="middleName"
              value={formData.middleName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  middleName: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lastName: e.target.value,
                })
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                setFormData({ ...formData, gender: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+255..."
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (Optional)</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {formData.password && (
              <p
                className={`text-xs ${
                  formData.password.length >= 6
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formData.password.length >= 6
                  ? "✓ Password meets minimum length"
                  : "✗ Password must be at least 6 characters"}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {formData.confirmPassword && (
              <p
                className={`text-xs ${
                  formData.password === formData.confirmPassword
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formData.password === formData.confirmPassword
                  ? "✓ Passwords match"
                  : "✗ Passwords do not match"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Registration Type Selection */}
      <div className="space-y-4">
        <h4 className="text-gray-800">Registration Type *</h4>
        <p className="text-sm text-gray-600">
          Choose the registration type that best fits your needs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Normal Registration Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              setFormData({ ...formData, registrationType: "normal" })
            }
            className={`cursor-pointer border-2 rounded-lg p-6 transition-all ${
              formData.registrationType === "normal"
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h5 className="text-lg font-semibold text-gray-900">
                  Normal Registration
                </h5>
                <p className="text-sm text-gray-600 mt-1">CTM Club at School</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  formData.registrationType === "normal"
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {formData.registrationType === "normal" && (
                  <CheckCircle className="size-4 text-white" />
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Annual Membership</span>
                <span className="font-semibold">TZS 10,000</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">CTM Certificate</span>
                <span className="font-semibold">TZS 5,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t-2 border-gray-300 mt-2">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-blue-600">TZS 15,000</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
              <p className="font-medium mb-1">Includes:</p>
              <ul className="space-y-1">
                <li>• Access to CTM Club activities</li>
                <li>• Certificate for graduates</li>
                <li>• School-based training</li>
              </ul>
            </div>
          </motion.div>

          {/* Premier Registration Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              setFormData({ ...formData, registrationType: "premier" })
            }
            className={`cursor-pointer border-2 rounded-lg p-6 transition-all ${
              formData.registrationType === "premier"
                ? "border-purple-500 bg-purple-50 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h5 className="text-lg font-semibold text-gray-900">
                  Premier Registration
                </h5>
                <p className="text-sm text-gray-600 mt-1">
                  EConnect Talent Hub
                </p>
                <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  Training & Mentoring
                </span>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  formData.registrationType === "premier"
                    ? "border-purple-500 bg-purple-500"
                    : "border-gray-300"
                }`}
              >
                {formData.registrationType === "premier" && (
                  <CheckCircle className="size-4 text-white" />
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Registration</span>
                <span className="font-semibold">TZS 10,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">T-Shirt</span>
                <span className="font-semibold">TZS 15,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Tracksuit</span>
                <span className="font-semibold">TZS 20,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">ID Card</span>
                <span className="font-semibold">TZS 10,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Monthly Training</span>
                <span className="font-semibold">TZS 15,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t-2 border-gray-300 mt-2">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-purple-600">TZS 70,000</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
              <p className="font-medium mb-1">Premium Benefits:</p>
              <ul className="space-y-1">
                <li>• Professional training & coaching</li>
                <li>• Personal mentorship</li>
                <li>• Official ID & branded gear</li>
                <li>• Talent Hub access</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {formData.registrationType && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-start space-x-3">
              <CheckCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {formData.registrationType === "normal"
                    ? "Normal Registration Selected"
                    : "Premier Registration Selected"}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Payment Methods: CRDB A/C 0150814579600 or Vodacom Lipa
                  5130676 (E Connect Limited)
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Academic Information */}
      <div className="space-y-4">
        <h4 className="text-gray-800">Academic Information</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="classLevel">Class Level *</Label>
            <Select
              value={formData.classLevel}
              onValueChange={(value) =>
                setFormData({ ...formData, classLevel: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="college">College/University</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="classYear">Class/Form/Year *</Label>
            <Input
              id="classYear"
              placeholder="e.g., Form 4, Year 2"
              value={formData.classYear}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  classYear: e.target.value,
                })
              }
              required
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h4 className="text-gray-800">Location</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="region">Region *</Label>
            <Select
              value={formData.regionId}
              onValueChange={(value) => {
                handleRegionChange(value);
              }}
              disabled={loadingData || regions.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingData
                      ? "Loading regions..."
                      : regions.length === 0
                      ? "No regions available"
                      : "Select region"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem
                    key={region._id || region.id}
                    value={region._id || region.id}
                  >
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {regions.length > 0 && (
              <p className="text-xs text-gray-500">
                ✓ {regions.length} regions loaded from backend
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">District *</Label>
            <Select
              value={formData.districtId}
              onValueChange={(value) => {
                handleDistrictChange(value);
              }}
              disabled={!formData.regionId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {filteredDistricts.map((district) => (
                  <SelectItem
                    key={district._id || district.id}
                    value={district._id || district.id}
                  >
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ward">Ward *</Label>
            <Select
              value={formData.wardId}
              onValueChange={(value) => {
                setFormData({ ...formData, wardId: value });
              }}
              disabled={!formData.districtId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ward" />
              </SelectTrigger>
              <SelectContent>
                {filteredWards.map((ward) => (
                  <SelectItem
                    key={ward._id || ward.id}
                    value={ward._id || ward.id}
                  >
                    {ward.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="school">School *</Label>
          <Select
            value={formData.schoolId}
            onValueChange={(value) =>
              setFormData({ ...formData, schoolId: value })
            }
            disabled={loadingData || schools.length === 0}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingData
                    ? "Loading schools..."
                    : schools.length === 0
                    ? "No schools available"
                    : "Select your school"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {schools.map((school) => (
                <SelectItem
                  key={school._id || school.id}
                  value={school._id || school.id}
                >
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {schools.length > 0 && (
            <p className="text-xs text-gray-500">
              ✓ {schools.length} schools loaded from backend
            </p>
          )}
        </div>
      </div>

      {/* Talents */}
      <div className="space-y-4">
        <h4 className="text-gray-800">Select Your Talents *</h4>
        {loadingData ? (
          <div className="py-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">
              Loading talents from backend...
            </p>
          </div>
        ) : talents.length === 0 ? (
          <div className="py-8 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-600 mb-2">No talents available</p>
            <p className="text-sm text-gray-500">
              Please contact support or try again later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {talents.map((talent) => (
              <div
                key={talent._id || talent.id}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={talent._id || talent.id}
                  checked={formData.selectedTalents.includes(talent.name)}
                  onCheckedChange={() => handleTalentToggle(talent.name)}
                />
                <Label
                  htmlFor={talent._id || talent.id}
                  className="cursor-pointer"
                >
                  {talent.name}
                </Label>
              </div>
            ))}
          </div>
        )}
        {formData.selectedTalents.length > 0 && (
          <p className="text-sm text-blue-600">
            ✓ Selected {formData.selectedTalents.length} talent
            {formData.selectedTalents.length !== 1 ? "s" : ""}:{" "}
            {formData.selectedTalents.join(", ")}
          </p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-3 border-t pt-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={formData.acceptedTerms}
            onCheckedChange={(checked) =>
              setFormData({
                ...formData,
                acceptedTerms: checked as boolean,
              })
            }
          />
          <Label htmlFor="terms" className="cursor-pointer text-sm">
            I accept the CTM Program Terms and Conditions, including the{" "}
            {formData.registrationType === "premier"
              ? "Premier Registration fees (70,000 TZS)"
              : formData.registrationType === "normal"
              ? "membership fees (15,000 TZS)"
              : "applicable registration fees"}
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox
            id="privacy"
            checked={formData.acceptedPrivacy}
            onCheckedChange={(checked) =>
              setFormData({
                ...formData,
                acceptedPrivacy: checked as boolean,
              })
            }
          />
          <Label htmlFor="privacy" className="cursor-pointer text-sm">
            I accept the Privacy Policy and consent to media usage. I understand
            that for monetized content, I will receive 30% revenue share.
          </Label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Submit Registration"}
      </Button>

      <p className="text-sm text-gray-600 text-center">
        After submission, your school admin will review your registration. You
        will receive an SMS with your login credentials once approved.
      </p>
    </form>
  );
}
