import { useState } from "react";
import { Button, Input, Card, CardContent } from "@/components/ui";
import { Eye, EyeOff, User, Mail, Phone, Lock, MapPin, Building } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "./LanguageContext";
import type { UserRole } from "@/utils/types";

interface RegistrationFormProps {
  role: UserRole;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RegistrationForm({ role, onSuccess, onCancel }: RegistrationFormProps) {
  const { register } = useAuth();
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    farmName: "",
    businessName: "",
    location: "",
    region: "",
    district: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    
    // Validation
    const newErrors: string[] = [];
    
    if (!formData.firstName.trim()) newErrors.push(language === "en" ? "First name is required" : "Jina la kwanza linahitajika");
    if (!formData.lastName.trim()) newErrors.push(language === "en" ? "Last name is required" : "Jina la mwisho linahitajika");
    if (!formData.phone.trim()) newErrors.push(language === "en" ? "Phone number is required" : "Namba ya simu inahitajika");
    if (formData.phone.trim().length < 10) newErrors.push(language === "en" ? "Phone number must be at least 10 characters" : "Namba ya simu lazima iwe na angalau tarakimu 10");
    if (!formData.password) newErrors.push(language === "en" ? "Password is required" : "Nenosiri linahitajika");
    if (formData.password.length < 8) newErrors.push(language === "en" ? "Password must be at least 8 characters" : "Nenosiri lazima liwe na angalau herufi 8");
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.push(language === "en" ? "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character" : "Nenosiri lazima liwe na angalau herufi 1 kubwa, 1 ndogo, 1 namba, na 1 alama maalum");
    }
    if (formData.password !== formData.confirmPassword) newErrors.push(language === "en" ? "Passwords do not match" : "Nenosiri hazilingani");
    
    // Role-specific validations
    if (role === "FARMER" && !formData.farmName.trim()) {
      newErrors.push(language === "en" ? "Farm name is required" : "Jina la shamba linahitajika");
    }
    
    if (["AGROVET_OWNER", "MACHINERY_DEALER", "BUYER_AGGREGATOR", "LOGISTICS_PROVIDER"].includes(role) && !formData.businessName.trim()) {
      newErrors.push(language === "en" ? "Business name is required" : "Jina la biashara linahitajika");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        phone: formData.phone.trim(),
        password: formData.password,
        names: {
          first: formData.firstName.trim(),
          last: formData.lastName.trim()
        },
        role,
        ...(role === "FARMER" && { farmName: formData.farmName.trim() }),
        ...(["AGROVET_OWNER", "MACHINERY_DEALER", "BUYER_AGGREGATOR", "LOGISTICS_PROVIDER"].includes(role) && { 
          businessName: formData.businessName.trim() 
        }),
        location: formData.location.trim(),
        region: formData.region.trim(),
        district: formData.district.trim(),
      };

      const result = await register(registrationData);
      
      if (result.success) {
        onSuccess();
      } else {
        setErrors([result.error || "Registration failed"]);
      }
    } catch (error: any) {
      setErrors([error.message || (language === "en" ? "Registration failed" : "Usajili umeshindwa")]);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label: string, name: string, type: string = "text", icon?: React.ReactNode, required: boolean = true) => (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <Input
          type={type}
          name={name}
          value={formData[name as keyof typeof formData]}
          onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
          className={icon ? "pl-10" : ""}
          placeholder={label}
          required={required}
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          {errors.map((error, index) => (
            <p key={`error-${index}`} className="text-red-600 text-sm">{error}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField(language === "en" ? "First Name" : "Jina la Kwanza", "firstName", "text", <User className="w-4 h-4" />)}
        {renderField(language === "en" ? "Last Name" : "Jina la Mwisho", "lastName", "text", <User className="w-4 h-4" />)}
      </div>

      {renderField(language === "en" ? "Email" : "Barua pepe", "email", "email", <Mail className="w-4 h-4" />, false)}
      {renderField(language === "en" ? "Phone Number" : "Namba ya Simu", "phone", "tel", <Phone className="w-4 h-4" />)}

      {role === "FARMER" && renderField(language === "en" ? "Farm Name" : "Jina la Shamba", "farmName", "text", <Building className="w-4 h-4" />)}
      
      {["AGROVET_OWNER", "MACHINERY_DEALER", "BUYER_AGGREGATOR", "LOGISTICS_PROVIDER"].includes(role) && 
        renderField(language === "en" ? "Business Name" : "Jina la Biashara", "businessName", "text", <Building className="w-4 h-4" />)}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderField(language === "en" ? "Location" : "Mahali", "location", "text", <MapPin className="w-4 h-4" />, false)}
        {renderField(language === "en" ? "Region" : "Mkoa", "region", "text", <MapPin className="w-4 h-4" />, false)}
        {renderField(language === "en" ? "District" : "Wilaya", "district", "text", <MapPin className="w-4 h-4" />, false)}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          {language === "en" ? "Password" : "Nenosiri"} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="pl-10 pr-10"
            placeholder={language === "en" ? "Enter password" : "Weka nenosiri"}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          {language === "en" ? "Confirm Password" : "Thibitisha Nenosiri"} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="pl-10 pr-10"
            placeholder={language === "en" ? "Confirm password" : "Thibitisha nenosiri"}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {loading ? (language === "en" ? "Registering..." : "Kusajili...") : (language === "en" ? "Register" : "Jisajili")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          {language === "en" ? "Cancel" : "Ghairi"}
        </Button>
      </div>
    </form>
  );
}
