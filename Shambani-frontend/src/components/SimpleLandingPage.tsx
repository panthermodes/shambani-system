import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Leaf,
  Users,
  Truck,
  ShoppingCart,
  Home as HomeIcon,
  Warehouse,
  Bird,
} from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageContext";
import { RegisterModal } from "./RegisterModal";
import { LoginModal } from "./LoginModal";
import { OrderWizardModal } from "./OrderWizardModal";
import {
  MarketplaceSection,
  MachinerySuppliers,
  MachineryRentals,
  AgrovetSection,
  ExtensionSection,
  LogisticsSection,
  EbookSection,
  FundersSection,
  LeaseServicesSection,
  AgriculturalFarmLeaseSection,
  ChickenHouseLeaseSection,
  TractorLeaseSection,
  StorageHouseLeaseSection,
  RefrigeratedVehicleLeaseSection,
  FoundersSection,
} from "./sections/ServiceSections";
import { Logo } from "./Logo";

// Import partner logos
import tamisemiLogo from "../assets/logos/tamisemi.png";
import hyteHotelLogo from "../assets/logos/hyte-hotel.jpg";

export function SimpleLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [leaseServicesOpen, setLeaseServicesOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("home");
  const { language, setLanguage, t } = useLanguage();

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentSection]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simple Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setCurrentSection("home")}
            >
              <Logo className="h-10 w-10" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => setCurrentSection("home")}
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                {t("home")}
              </button>

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button className="text-gray-700 hover:text-green-600 transition-colors flex items-center gap-1 font-medium">
                  {t("services")}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      servicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                    >
                      {[
                        {
                          key: "marketplace",
                          label: t("marketplace"),
                          icon: ShoppingCart,
                        },
                        {
                          key: "agrovet",
                          label: t("agrovetShops"),
                          icon: Leaf,
                        },
                        {
                          key: "extension",
                          label: t("extensionOfficers"),
                          icon: Users,
                        },
                        {
                          key: "logistics",
                          label: t("logistics"),
                          icon: Truck,
                        },
                        {
                          key: "machinery-suppliers",
                          label: t("suppliers"),
                          icon: Truck,
                        },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => {
                            setCurrentSection(item.key);
                            setServicesOpen(false);
                          }}
                          className="w-full px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
                        >
                          <item.icon className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">{item.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setCurrentSection("ebook")}
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                {t("ebook")}
              </button>

              <div
                className="relative"
                onMouseEnter={() => setLeaseServicesOpen(true)}
                onMouseLeave={() => setLeaseServicesOpen(false)}
              >
                <button className="text-gray-700 hover:text-green-600 transition-colors flex items-center gap-1 font-medium">
                  {t("leaseServices")}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      leaseServicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {leaseServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                    >
                      {[
                        {
                          key: "agricultural-farm-lease",
                          label: t("agriculturalFarmLease"),
                          icon: Leaf,
                        },
                        {
                          key: "chicken-house-lease",
                          label: t("chickenHouseLease"),
                          icon: Bird,
                        },
                        {
                          key: "tractor-lease",
                          label: t("tractorLease"),
                          icon: Truck,
                        },
                        {
                          key: "storage-house-lease",
                          label: t("storageHouseLease"),
                          icon: Warehouse,
                        },
                        {
                          key: "refrigerated-vehicle-lease",
                          label: t("refrigeratedVehicleLease"),
                          icon: Truck,
                        },
                      ].map((item, index) => (
                        <button
                          key={`${item.key}-${index}`}
                          onClick={() => {
                            setCurrentSection(item.key);
                            setLeaseServicesOpen(false);
                          }}
                          className="w-full px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
                        >
                          <item.icon className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">{item.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setCurrentSection("funders")}
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                {t("funders")}
              </button>

              <Button
                onClick={() => setLoginModalOpen(true)}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                {t("login")}
              </Button>

              <Button
                onClick={() => setRegisterModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {t("register")}
              </Button>

              {/* Language Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    language === "en"
                      ? "bg-green-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("sw")}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    language === "sw"
                      ? "bg-green-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  SW
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden pb-4"
              >
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setCurrentSection("home");
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-green-600 px-3"
                  >
                    {t("home")}
                  </button>

                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="block w-full text-left py-2 text-gray-700 hover:text-green-600 px-3 flex items-center justify-between"
                  >
                    {t("services")}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        servicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {servicesOpen && (
                    <div className="pl-6 space-y-2">
                      {[
                        { key: "marketplace", label: t("marketplace") },
                        { key: "agrovet", label: t("agrovetShops") },
                        { key: "extension", label: t("extensionOfficers") },
                        { key: "logistics", label: t("logistics") },
                        { key: "machinery-suppliers", label: t("suppliers") },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => {
                            setCurrentSection(item.key);
                            setMobileMenuOpen(false);
                          }}
                          className="block w-full text-left py-2 text-sm text-gray-600 hover:text-green-600 px-3"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setCurrentSection("ebook");
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-green-600 px-3"
                  >
                    {t("ebook")}
                  </button>

                  <button
                    onClick={() => setLeaseServicesOpen(!leaseServicesOpen)}
                    className="block w-full text-left py-2 text-gray-700 hover:text-green-600 px-3 flex items-center justify-between"
                  >
                    {t("leaseServices")}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        leaseServicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {leaseServicesOpen && (
                    <div className="pl-6 space-y-2">
                      {[
                        {
                          key: "agricultural-farm-lease",
                          label: t("agriculturalFarmLease"),
                        },
                        {
                          key: "chicken-house-lease",
                          label: t("chickenHouseLease"),
                        },
                        { key: "tractor-lease", label: t("tractorLease") },
                        {
                          key: "storage-house-lease",
                          label: t("storageHouseLease"),
                        },
                        {
                          key: "refrigerated-vehicle-lease",
                          label: t("refrigeratedVehicleLease"),
                        },
                      ].map((item, index) => (
                        <button
                          key={`${item.key}-${index}`}
                          onClick={() => {
                            setCurrentSection(item.key);
                            setMobileMenuOpen(false);
                          }}
                          className="block w-full text-left py-2 text-sm text-gray-600 hover:text-green-600 px-3"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setCurrentSection("funders");
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-green-600 px-3"
                  >
                    {t("funders")}
                  </button>

                  <Button
                    onClick={() => setRegisterModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 w-full"
                  >
                    {t("login")}
                  </Button>

                  <div className="flex items-center gap-2 px-3 py-2">
                    <button
                      onClick={() => setLanguage("en")}
                      className={`flex-1 px-3 py-1.5 rounded text-sm font-medium ${
                        language === "en"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLanguage("sw")}
                      className={`flex-1 px-3 py-1.5 rounded text-sm font-medium ${
                        language === "sw"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      Kiswahili
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Register Modal */}
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      {/* Order Wizard Modal */}
      <OrderWizardModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />

      {/* Conditional Section Rendering */}
      {currentSection === "marketplace" && (
        <MarketplaceSection onBack={() => setCurrentSection("home")} />
      )}
      {currentSection === "machinery-suppliers" && (
        <MachinerySuppliers onBack={() => setCurrentSection("home")} />
      )}
      {currentSection === "machinery-rentals" && (
        <MachineryRentals onBack={() => setCurrentSection("home")} />
      )}
      {currentSection === "agrovet" && (
        <AgrovetSection onBack={() => setCurrentSection("home")} />
      )}
      {currentSection === "extension" && (
        <ExtensionSection onBack={() => setCurrentSection("home")} />
      )}
      {currentSection === "logistics" && (
        <LogisticsSection onBack={() => setCurrentSection("home")} />
      )}
      {currentSection === "ebook" && (
        <EbookSection onBack={() => setCurrentSection("home")} />
      )}
      {currentSection === "funders" && (
        <FundersSection onBack={() => setCurrentSection("home")} />
      )}
      {currentSection === "lease-services" && (
        <LeaseServicesSection onBack={() => setCurrentSection("home")} />
      )}
      {currentSection === "agricultural-farm-lease" && (
        <AgriculturalFarmLeaseSection
          onBack={() => setCurrentSection("home")}
        />
      )}
      {currentSection === "chicken-house-lease" && (
        <ChickenHouseLeaseSection onBack={() => setCurrentSection("home")} />
      )}
      {currentSection === "tractor-lease" && (
        <TractorLeaseSection onBack={() => setCurrentSection("home")} />
      )}
      {currentSection === "storage-house-lease" && (
        <StorageHouseLeaseSection onBack={() => setCurrentSection("home")} />
      )}
      {currentSection === "refrigerated-vehicle-lease" && (
        <RefrigeratedVehicleLeaseSection
          onBack={() => setCurrentSection("home")}
        />
      )}
      {currentSection === "founders" && (
        <FoundersSection onBack={() => setCurrentSection("home")} />
      )}

      {/* Home Page Content */}
      {currentSection === "home" && (
        <>
          {/* Hero Section - Dark Green with Yellow Text */}
          <section className="relative bg-gradient-to-br from-green-700 via-green-800 to-green-900 py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-400 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-6xl mx-auto text-center relative z-10">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-yellow-400 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-relaxed px-2 sm:px-4 md:px-6 font-normal max-w-5xl mx-auto"
              >
                {language === "en"
                  ? "An integrated digital ecosystem connecting farmers, extension officers, input suppliers, transporters, and consumers across Tanzania."
                  : "Mfumo wa dijitali unaowaunganisha wakulima, maafisa wa ugani, wasambazaji wa pembejeo, wabiashara na watumiaji kote Tanzania."}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="flex justify-center px-2 sm:px-4"
              >
                <Button
                  size="lg"
                  onClick={() => setOrderModalOpen(true)}
                  className="bg-cyan-400 hover:bg-cyan-500 text-gray-900 font-bold px-6 sm:px-8 md:px-10 lg:px-12 py-4 sm:py-4 md:py-5 lg:py-6 text-sm sm:text-base md:text-lg rounded-full shadow-2xl hover:shadow-cyan-400/50 transition-all duration-300 hover:scale-105 transform w-full sm:w-auto max-w-xl sm:max-w-none text-center leading-relaxed whitespace-normal min-h-[60px] sm:min-h-[64px] flex items-center justify-center"
                >
                  <span className="block px-2">
                    {language === "en"
                      ? "Click to Order and source fresh produce and livestock here!"
                      : "Bonyeza kuagiza na kupata mazao safi na mifugo hapa!"}
                  </span>
                </Button>
              </motion.div>
            </div>
          </section>

          {/* Second Section - Light Gray with Blue Text */}
          <section className="bg-gradient-to-b from-gray-100 to-gray-200 py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-blue-900 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-8 sm:mb-10 md:mb-12 lg:mb-14 px-2 sm:px-4 font-semibold leading-tight"
              >
                {language === "en"
                  ? "Africa AgriTech Ecosystem Solutions"
                  : "Suluhisho la Mfumo wa Teknolojia ya Kilimo Afrika"}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="flex justify-center px-2 sm:px-4"
              >
                <Button
                  size="lg"
                  onClick={() => setRegisterModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 sm:px-10 md:px-12 lg:px-16 py-4 sm:py-5 md:py-6 lg:py-7 text-sm sm:text-base md:text-lg lg:text-xl rounded-full shadow-2xl hover:shadow-blue-600/50 transition-all duration-300 hover:scale-105 transform w-full sm:w-auto max-w-sm sm:max-w-none text-center leading-tight sm:leading-snug"
                >
                  {language === "en" ? "Register here!" : "Jisajili hapa!"}
                </Button>
              </motion.div>
            </div>
          </section>

          {/* Partners Section */}
          <section className="bg-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10 sm:mb-12"
              >
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                  {language === "en" ? "Our Partners" : "Washirika Wetu"}
                </h3>
              </motion.div>

              <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-12 md:gap-16 lg:gap-20">
                {/* TAMISEMI */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center hover:scale-110 transition-transform duration-300"
                >
                  <img
                    src={tamisemiLogo}
                    alt="TAMISEMI"
                    className="h-14 sm:h-16 md:h-20 w-auto object-contain"
                  />
                </motion.div>

                {/* Hyte Hotel */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-center justify-center hover:scale-110 transition-transform duration-300"
                >
                  <img
                    src={hyteHotelLogo}
                    alt="Hyte Hotel"
                    className="h-14 sm:h-16 md:h-20 w-auto object-contain rounded"
                  />
                </motion.div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Simple Footer - Blue Background */}
      <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 border-t-4 border-cyan-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Logo and Copyright */}
            <div className="flex flex-col items-center gap-2">
              <Logo className="h-10 w-10 sm:h-12 sm:w-12" />
              <div>
                <p className="text-sm sm:text-base font-semibold">
                  ©2025 Shambani Investment Ltd.
                </p>
                <p className="text-xs sm:text-sm text-cyan-200">
                  {language === "en"
                    ? "All rights reserved."
                    : "Haki zote zimehifadhiwa."}
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 text-sm sm:text-base">
              <button
                onClick={() => setCurrentSection("founders")}
                className="hover:text-cyan-300 transition-colors font-medium"
              >
                {language === "en" ? "About Us" : "Kuhusu Sisi"}
              </button>
              <span className="text-cyan-400">•</span>
              <a
                href="#"
                className="hover:text-cyan-300 transition-colors font-medium"
              >
                {language === "en" ? "Privacy Policy" : "Sera ya Faragha"}
              </a>
              <span className="text-cyan-400">•</span>
              <a
                href="#"
                className="hover:text-cyan-300 transition-colors font-medium"
              >
                {language === "en" ? "Contact" : "Wasiliana"}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
