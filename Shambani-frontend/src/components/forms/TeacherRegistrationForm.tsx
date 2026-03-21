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
import { Textarea } from "../ui/textarea";
import { useAuth } from "../../contexts/AuthContext";
import { locationAPI, schoolAPI } from "../../utils/api";
import { toast } from "sonner";

interface TeacherRegistrationFormProps {
  onNavigate: (page: string) => void;
}

export function TeacherRegistrationForm({
  onNavigate,
}: TeacherRegistrationFormProps) {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true); // ✅ Added loading state
  const [regions, setRegions] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);

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
    subjects: "",
    regionId: "",
    districtId: "",
    wardId: "",
    schoolId: "",
    acceptedTerms: false,
    acceptedPrivacy: false,
  });

  useEffect(() => {
    loadInitialData(); // ✅ Load all data on mount
  }, []);

  // ✅ Load all initial data in PARALLEL for maximum speed
  const loadInitialData = async () => {
    setLoadingData(true);
    try {
      // ⚡ Load everything in parallel for maximum speed
      const [regionsRes, districtsRes, wardsRes, schoolsRes] =
        await Promise.all([
          locationAPI.getRegions(),
          locationAPI.getDistricts(), // Get ALL districts
          locationAPI.getWards(), // Get ALL wards
          schoolAPI.getAllSchools(),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.acceptedTerms || !formData.acceptedPrivacy) {
      toast.error("Please accept the Terms and Privacy Policy");
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        ...formData,
        userType: "teacher",
        fullName: `${formData.firstName} ${formData.middleName} ${formData.lastName}`,
      });

      if (result.success) {
        toast.success(
          "Registration submitted successfully! Your school admin will review your application. You will receive an SMS with your credentials once approved."
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

      {/* Professional Information */}
      <div className="space-y-4">
        <h4 className="text-gray-800">Professional Information</h4>

        <div className="space-y-2">
          <Label htmlFor="subjects">Subjects Taught *</Label>
          <Textarea
            id="subjects"
            placeholder="e.g., Mathematics, Physics, Chemistry"
            value={formData.subjects}
            onChange={(e) =>
              setFormData({ ...formData, subjects: e.target.value })
            }
            required
          />
          <p className="text-sm text-gray-500">
            List all subjects you teach, separated by commas
          </p>
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
              onValueChange={handleRegionChange}
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
              onValueChange={handleDistrictChange}
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
              ✓ {schools.length} schools loaded
            </p>
          )}
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
            I accept the Terms and Conditions
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
            I accept the Privacy Policy
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
