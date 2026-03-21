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
import { locationAPI, talentAPI } from "../../utils/api";
import { toast } from "sonner";
import { CheckCircle } from "../ui/icons";
import { motion } from "framer-motion";

interface NonStudentRegistrationFormProps {
  onNavigate: (page: string) => void;
}

export function NonStudentRegistrationForm({
  onNavigate,
}: NonStudentRegistrationFormProps) {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true); // ✅ Added loading state
  const [regions, setRegions] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [talents, setTalents] = useState<any[]>([]); // ✅ Fetch from database

  // Filtered location data based on selection
  const [filteredDistricts, setFilteredDistricts] = useState<any[]>([]);
  const [filteredWards, setFilteredWards] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    phone: "",
    email: "",
    regionId: "",
    districtId: "",
    wardId: "",
    talents: [] as string[],
    businessCategories: [] as string[],
    registrationType: "" as "silver" | "diamond" | "",
    includeTracksuit: false,
    acceptedTerms: false,
    acceptedPrivacy: false,
  });

  // ✅ Static business options (not in database)
  const businessOptions = [
    "Agriculture",
    "Technology",
    "Fashion",
    "Food & Beverage",
    "Arts & Crafts",
    "Services",
    "Retail",
    "Other",
  ];

  useEffect(() => {
    loadInitialData(); // ✅ Load all data on mount
  }, []);

  // ✅ Load all initial data in PARALLEL for maximum speed
  const loadInitialData = async () => {
    setLoadingData(true);
    try {
      // ⚡ Load everything in parallel for maximum speed
      const [regionsRes, districtsRes, wardsRes, talentsRes] =
        await Promise.all([
          locationAPI.getRegions(),
          locationAPI.getDistricts(), // Get ALL districts
          locationAPI.getWards(), // Get ALL wards
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

      // Process talents
      if (talentsRes.success && talentsRes.data) {
        const talentsData = talentsRes.data.data || talentsRes.data;
        setTalents(talentsData);
        console.log("✅ Loaded talents:", talentsData.length);
      } else {
        const fallbackTalents = [
          { _id: "art", name: "Art & Drawing", id: "art", icon: "🎨" },
          { _id: "music", name: "Music & Singing", id: "music", icon: "🎵" },
          {
            _id: "dance",
            name: "Dance & Performance",
            id: "dance",
            icon: "💃",
          },
          {
            _id: "sports",
            name: "Sports & Athletics",
            id: "sports",
            icon: "⚽",
          },
          { _id: "tech", name: "Technology & ICT", id: "tech", icon: "💻" },
          {
            _id: "writing",
            name: "Writing & Poetry",
            id: "writing",
            icon: "✍️",
          },
          { _id: "acting", name: "Acting & Drama", id: "acting", icon: "🎭" },
          {
            _id: "leadership",
            name: "Leadership & Public Speaking",
            id: "leadership",
            icon: "🎤",
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
      talents: prev.talents.includes(talent)
        ? prev.talents.filter((t) => t !== talent)
        : [...prev.talents, talent],
    }));
  };

  const handleBusinessToggle = (business: string) => {
    setFormData((prev) => ({
      ...prev,
      businessCategories: prev.businessCategories.includes(business)
        ? prev.businessCategories.filter((b) => b !== business)
        : [...prev.businessCategories, business],
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

    if (formData.talents.length === 0) {
      toast.error("Please select at least one talent");
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        ...formData,
        userType: "non-student",
        fullName: `${formData.firstName} ${formData.middleName} ${formData.lastName}`,
        registration_type: formData.registrationType,
        include_tracksuit: formData.includeTracksuit,
      });

      if (result.success) {
        toast.success(
          "Registration submitted successfully! The CEO will review your application. You will receive an SMS with your credentials once approved."
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
                setFormData({ ...formData, firstName: e.target.value })
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
                setFormData({ ...formData, middleName: e.target.value })
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
                setFormData({ ...formData, lastName: e.target.value })
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
                setFormData({ ...formData, phone: e.target.value })
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
              setFormData({ ...formData, email: e.target.value })
            }
          />
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
              onValueChange={(value) => handleRegionChange(value)}
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
                ✓ {regions.length} regions loaded
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">District *</Label>
            <Select
              value={formData.districtId}
              onValueChange={(value) => handleDistrictChange(value)}
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
              onValueChange={(value) =>
                setFormData({ ...formData, wardId: value })
              }
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
      </div>

      {/* Registration Type Selection */}
      <div className="space-y-4">
        <h4 className="text-gray-800">Registration Type *</h4>
        <p className="text-sm text-gray-600">
          Choose your tier - All registrations include access to Premier
          Training at EConnect Talent Hub
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Silver Registration Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              setFormData({ ...formData, registrationType: "silver" })
            }
            className={`cursor-pointer border-2 rounded-lg p-6 transition-all ${
              formData.registrationType === "silver"
                ? "border-gray-400 bg-gray-50 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h5 className="text-lg font-semibold text-gray-900">
                  Silver Registration
                </h5>
                <p className="text-sm text-gray-600 mt-1">
                  Premier - Talent Hub
                </p>
                <span className="inline-block mt-2 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                  Standard Tier
                </span>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  formData.registrationType === "silver"
                    ? "border-gray-500 bg-gray-500"
                    : "border-gray-300"
                }`}
              >
                {formData.registrationType === "silver" && (
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
                <span className="font-semibold text-gray-500">
                  TZS 20,000 (optional)
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">ID Card</span>
                <span className="font-semibold">TZS 10,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Monthly Training</span>
                <span className="font-semibold">TZS 4,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t-2 border-gray-300 mt-2">
                <span className="font-semibold text-gray-900">Base Total</span>
                <span className="font-bold text-gray-600">TZS 39,000</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
              <p className="font-medium mb-1">Silver Benefits:</p>
              <ul className="space-y-1">
                <li>• Training & mentoring access</li>
                <li>• Official ID & T-shirt</li>
                <li>• Monthly sessions (4,000/mo)</li>
                <li>• Talent Hub membership</li>
              </ul>
            </div>
          </motion.div>

          {/* Diamond Registration Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              setFormData({ ...formData, registrationType: "diamond" })
            }
            className={`cursor-pointer border-2 rounded-lg p-6 transition-all relative overflow-hidden ${
              formData.registrationType === "diamond"
                ? "border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-lg"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h5 className="text-lg font-semibold text-gray-900">
                  Diamond Registration
                </h5>
                <p className="text-sm text-gray-600 mt-1">
                  Premier - Talent Hub
                </p>
                <span className="inline-block mt-2 px-2 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 text-xs rounded-full">
                  Premium Tier 💎
                </span>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  formData.registrationType === "diamond"
                    ? "border-cyan-500 bg-cyan-500"
                    : "border-gray-300"
                }`}
              >
                {formData.registrationType === "diamond" && (
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
                <span className="font-semibold text-gray-500">
                  TZS 20,000 (optional)
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">ID Card</span>
                <span className="font-semibold">TZS 10,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Monthly Training</span>
                <span className="font-semibold text-cyan-700">TZS 10,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t-2 border-gray-300 mt-2">
                <span className="font-semibold text-gray-900">Base Total</span>
                <span className="font-bold text-cyan-600">TZS 45,000</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/80 rounded text-xs text-gray-600">
              <p className="font-medium mb-1 text-cyan-800">
                Diamond Benefits:
              </p>
              <ul className="space-y-1">
                <li>• Premium training & coaching</li>
                <li>• Priority mentorship</li>
                <li>• Enhanced monthly sessions</li>
                <li>• Full Talent Hub access</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {formData.registrationType && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Tracksuit Optional Checkbox */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="includeTracksuit"
                  checked={formData.includeTracksuit}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      includeTracksuit: checked as boolean,
                    })
                  }
                />
                <div className="flex-1">
                  <Label
                    htmlFor="includeTracksuit"
                    className="cursor-pointer text-sm font-medium text-purple-900"
                  >
                    Add Tracksuit (+TZS 20,000)
                  </Label>
                  <p className="text-xs text-purple-700 mt-1">
                    Include branded tracksuit with your registration
                  </p>
                </div>
                {formData.includeTracksuit && (
                  <span className="text-sm font-semibold text-purple-700">
                    +20,000
                  </span>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    {formData.registrationType === "silver"
                      ? "Silver Registration Selected"
                      : "Diamond Registration Selected 💎"}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Total: TZS{" "}
                    {formData.registrationType === "silver"
                      ? (
                          39000 + (formData.includeTracksuit ? 20000 : 0)
                        ).toLocaleString()
                      : (
                          45000 + (formData.includeTracksuit ? 20000 : 0)
                        ).toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Payment: CRDB 0150814579600 or Vodacom Lipa 5130676 (E
                    Connect Limited)
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
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
                  checked={formData.talents.includes(talent.name)}
                  onCheckedChange={() => handleTalentToggle(talent.name)}
                />
                <Label
                  htmlFor={talent._id || talent.id}
                  className="cursor-pointer"
                >
                  {talent.icon} {talent.name}
                </Label>
              </div>
            ))}
          </div>
        )}
        {formData.talents.length > 0 && (
          <p className="text-sm text-blue-600">
            ✓ Selected {formData.talents.length} talent
            {formData.talents.length !== 1 ? "s" : ""}:{" "}
            {formData.talents.join(", ")}
          </p>
        )}
      </div>

      {/* Business Categories */}
      <div className="space-y-4">
        <h4 className="text-gray-800">Business Categories (Optional)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {businessOptions.map((business) => (
            <div key={business} className="flex items-center space-x-2">
              <Checkbox
                id={business}
                checked={formData.businessCategories.includes(business)}
                onCheckedChange={() => handleBusinessToggle(business)}
              />
              <Label htmlFor={business} className="cursor-pointer">
                {business}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-3 border-t pt-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={formData.acceptedTerms}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, acceptedTerms: checked as boolean })
            }
          />
          <Label htmlFor="terms" className="cursor-pointer text-sm">
            I accept the CTM Program Terms and Conditions, including the{" "}
            {formData.registrationType === "diamond"
              ? `Diamond tier fees (${
                  45000 + (formData.includeTracksuit ? 20000 : 0)
                } TZS)`
              : formData.registrationType === "silver"
              ? `Silver tier fees (${
                  39000 + (formData.includeTracksuit ? 20000 : 0)
                } TZS)`
              : "applicable registration fees"}
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox
            id="privacy"
            checked={formData.acceptedPrivacy}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, acceptedPrivacy: checked as boolean })
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
        After submission, the CEO will review your registration. You will
        receive an SMS with your login credentials once approved.
      </p>
    </form>
  );
}
