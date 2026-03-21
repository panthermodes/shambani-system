import { useState } from "react";
import { Button, Input, Card, CardContent } from "@/components/ui";
import { Eye, EyeOff, Mail, Phone, Lock, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "./LanguageContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { login, loginWithOTP, requestOTP } = useAuth();
  const { language, t } = useLanguage();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone" | "username" | "otp">("email");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    username: "",
    password: "",
    otpCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      let result;

      if (loginMethod === "email") {
        if (!formData.email.trim() || !formData.password) {
          setErrors([language === "en" ? "Email and password are required" : "Barua pepe na nenosiri vinahitajika"]);
          setLoading(false);
          return;
        }
        result = await login(formData.email.trim(), formData.password);
      } else if (loginMethod === "username") {
        if (!formData.username.trim() || !formData.password) {
          setErrors([language === "en" ? "Username and password are required" : "Jina la mtumiaji na nenosiri vinahitajika"]);
          setLoading(false);
          return;
        }
        result = await login(formData.username.trim(), formData.password);
      } else if (loginMethod === "phone") {
        if (!formData.phone.trim() || !formData.password) {
          setErrors([language === "en" ? "Phone number and password are required" : "Namba ya simu na nenosiri vinahitajika"]);
          setLoading(false);
          return;
        }
        result = await login(formData.phone.trim(), formData.password);
      } else if (loginMethod === "otp") {
        if (!otpRequested) {
          // Request OTP
          if (!formData.phone.trim()) {
            setErrors([language === "en" ? "Phone number is required" : "Namba ya simu inahitajika"]);
            setLoading(false);
            return;
          }
          const otpResult = await requestOTP(formData.phone.trim());
          if (otpResult.success) {
            setOtpRequested(true);
            setLoading(false);
            return;
          } else {
            setErrors([otpResult.error || (language === "en" ? "Failed to send OTP" : "Imeshindwa kutuma OTP")]);
            return;
          }
        } else {
          // Verify OTP
          if (!formData.otpCode.trim()) {
            setErrors([language === "en" ? "OTP code is required" : "Msimbo wa OTP unahitajika"]);
            setLoading(false);
            return;
          }
          result = await loginWithOTP({
            phone: formData.phone.trim(),
            code: formData.otpCode.trim(),
          });
        }
      }

      if (result && result.success) {
        onSuccess?.();
        onClose();
      } else {
        setErrors([result?.error || (language === "en" ? "Login failed" : "Umeingia kwa msiba")]);
      }
    } catch (error: any) {
      setErrors([error.message || (language === "en" ? "Login failed" : "Umeingia kwa msiba")]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {language === "en" ? "Login to Shambani" : "Ingia kwenye Shambani"}
        </h2>

        {/* Login Method Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setLoginMethod("email");
              setOtpRequested(false);
              setErrors([]);
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              loginMethod === "email"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {language === "en" ? "Email" : "Barua pepe"}
          </button>
          <button
            onClick={() => {
              setLoginMethod("username");
              setOtpRequested(false);
              setErrors([]);
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              loginMethod === "username"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {language === "en" ? "Username" : "Jina la mtumiaji"}
          </button>
          <button
            onClick={() => {
              setLoginMethod("phone");
              setOtpRequested(false);
              setErrors([]);
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              loginMethod === "phone"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {language === "en" ? "Phone" : "Simu"}
          </button>
          <button
            onClick={() => {
              setLoginMethod("otp");
              setOtpRequested(false);
              setErrors([]);
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              loginMethod === "otp"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            OTP
          </button>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            {errors.map((error, index) => (
              <p key={`login-error-${index}`} className="text-red-600 text-sm">{error}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {loginMethod === "email" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Email" : "Barua pepe"} *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    placeholder={language === "en" ? "Enter your email" : "Weka barua pepe yako"}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Password" : "Nenosiri"} *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10"
                    placeholder={language === "en" ? "Enter your password" : "Weka nenosiri lako"}
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
            </>
          )}

          {loginMethod === "username" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Username" : "Jina la mtumiaji"} *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="pl-10"
                    placeholder={language === "en" ? "Enter your username" : "Weka jina lako la mtumiaji"}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "en" ? "Password" : "Nenosiri"} *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10"
                    placeholder={language === "en" ? "Enter your password" : "Weka nenosiri lako"}
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
            </>
          )}

          {(loginMethod === "phone" || loginMethod === "otp") && (
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === "en" ? "Phone Number" : "Namba ya Simu"} *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10"
                  placeholder={language === "en" ? "Enter your phone number" : "Weka namba yako ya simu"}
                  required
                />
              </div>
            </div>
          )}

          {loginMethod === "phone" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === "en" ? "Password" : "Nenosiri"} *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                  placeholder={language === "en" ? "Enter your password" : "Weka nenosiri lako"}
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
          )}

          {loginMethod === "otp" && otpRequested && (
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === "en" ? "OTP Code" : "Msimbo wa OTP"} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  value={formData.otpCode}
                  onChange={(e) => setFormData({ ...formData, otpCode: e.target.value })}
                  className="pl-10"
                  placeholder={language === "en" ? "Enter OTP code" : "Weka msimbo wa OTP"}
                  maxLength={6}
                  required
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                language === "en" ? "Logging in..." : "Kuingia..."
              ) : loginMethod === "otp" && !otpRequested ? (
                language === "en" ? "Send OTP" : "Tuma OTP"
              ) : (
                language === "en" ? "Login" : "Ingia"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {language === "en" ? "Cancel" : "Ghairi"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
