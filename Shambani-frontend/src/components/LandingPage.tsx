import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Sprout,
  Users,
  ShoppingCart,
  Truck,
  Leaf,
  ChevronRight,
  CheckCircle,
  TrendingUp,
  Globe,
  Shield,
  Zap,
  Award,
  ChevronDown,
  BookOpen,
  DollarSign,
  Link2,
  MapPin,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Logo } from "./Logo";
import { useLanguage } from "./LanguageContext";
import { RegisterModal } from "./RegisterModal";
import {
  MarketplaceSection,
  MachinerySuppliers,
  MachineryRentals,
  AgrovetSection,
  ExtensionSection,
  LogisticsSection,
  EbookSection,
  FundersSection,
  FoundersSection,
} from "./sections/ServiceSections";

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [machineryOpen, setMachineryOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("home");
  const { language, setLanguage, t } = useLanguage();

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentSection]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const navItems = [
    { key: "home", label: t("home"), onClick: () => setCurrentSection("home") },
    {
      key: "services",
      label: t("services"),
      hasDropdown: true,
      items: [
        { key: "agrovet", label: t("agrovetShops"), icon: ShoppingCart },
        { key: "marketplace", label: t("marketplace"), icon: Globe },
        { key: "extension", label: t("extensionOfficers"), icon: Users },
        { key: "logistics", label: t("logistics"), icon: Truck },
        {
          key: "machinery",
          label: t("agroMachinery"),
          icon: Truck,
          hasSubmenu: true,
          submenu: [
            { key: "suppliers", label: t("suppliers") },
            { key: "rentals", label: t("rentals") },
          ],
        },
      ],
    },
    {
      key: "ebook",
      label: t("ebook"),
      icon: BookOpen,
      onClick: () => setCurrentSection("ebook"),
    },
    {
      key: "funders",
      label: t("funders"),
      icon: DollarSign,
      onClick: () => setCurrentSection("funders"),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-lg"
            : "bg-white/95 backdrop-blur-sm border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setCurrentSection("home")}
            >
              <Logo className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10" />
              <span className="text-base sm:text-lg lg:text-xl text-green-800">
                Shambani Investment
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:flex items-center gap-6"
            >
              {/* Home */}
              <button
                onClick={() => setCurrentSection("home")}
                className="text-gray-700 hover:text-green-600 transition-colors relative group"
              >
                {t("home")}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
              </button>

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button className="text-gray-700 hover:text-green-600 transition-colors flex items-center gap-1 relative group">
                  {t("services")}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      servicesOpen ? "rotate-180" : ""
                    }`}
                  />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
                    >
                      {[
                        {
                          key: "agrovet",
                          label: t("agrovetShops"),
                          icon: ShoppingCart,
                          color: "text-orange-600",
                        },
                        {
                          key: "marketplace",
                          label: t("marketplace"),
                          icon: Globe,
                          color: "text-green-600",
                        },
                        {
                          key: "extension",
                          label: t("extensionOfficers"),
                          icon: Users,
                          color: "text-purple-600",
                        },
                        {
                          key: "logistics",
                          label: t("logistics"),
                          icon: Truck,
                          color: "text-blue-600",
                        },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => {
                            setCurrentSection(item.key);
                            setServicesOpen(false);
                          }}
                          className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
                        >
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          <span className="text-gray-700">{item.label}</span>
                        </button>
                      ))}

                      {/* Agro-Machinery with submenu */}
                      <div
                        className="relative"
                        onMouseEnter={() => setMachineryOpen(true)}
                        onMouseLeave={() => setMachineryOpen(false)}
                      >
                        <button className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between text-left">
                          <div className="flex items-center gap-3">
                            <Truck className="w-5 h-5 text-indigo-600" />
                            <span className="text-gray-700">
                              {t("agroMachinery")}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>

                        <AnimatePresence>
                          {machineryOpen && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="absolute left-full top-0 ml-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2"
                            >
                              <button
                                onClick={() => {
                                  setCurrentSection("machinery-suppliers");
                                  setServicesOpen(false);
                                  setMachineryOpen(false);
                                }}
                                className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left text-gray-700"
                              >
                                {t("suppliers")}
                              </button>
                              <button
                                onClick={() => {
                                  setCurrentSection("machinery-rentals");
                                  setServicesOpen(false);
                                  setMachineryOpen(false);
                                }}
                                className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left text-gray-700"
                              >
                                {t("rentals")}
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* E-Book */}
              <button
                onClick={() => setCurrentSection("ebook")}
                className="text-gray-700 hover:text-green-600 transition-colors relative group"
              >
                {t("ebook")}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
              </button>

              {/* Funders */}
              <button
                onClick={() => setCurrentSection("funders")}
                className="text-gray-700 hover:text-green-600 transition-colors relative group"
              >
                {t("funders")}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
              </button>

              {/* Language Toggle */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-2 py-1 rounded ${
                    language === "en"
                      ? "bg-green-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  } transition-colors text-sm font-medium`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("sw")}
                  className={`px-2 py-1 rounded ${
                    language === "sw"
                      ? "bg-green-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  } transition-colors text-sm font-medium`}
                >
                  SW
                </button>
              </div>

              {/* Login */}
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                {t("login")}
              </Button>
            </motion.div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
                className="lg:hidden overflow-hidden"
              >
                <div className="py-4 space-y-3">
                  <button
                    onClick={() => {
                      setCurrentSection("home");
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-3 rounded-lg transition-colors"
                  >
                    {t("home")}
                  </button>

                  {/* Services in mobile */}
                  <div>
                    <button
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className="block w-full text-left py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-3 rounded-lg transition-colors flex items-center justify-between"
                    >
                      {t("services")}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          servicesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {servicesOpen && (
                      <div className="pl-6 space-y-2 mt-2">
                        {[
                          { key: "agrovet", label: t("agrovetShops") },
                          { key: "marketplace", label: t("marketplace") },
                          { key: "extension", label: t("extensionOfficers") },
                          { key: "logistics", label: t("logistics") },
                          {
                            key: "machinery-suppliers",
                            label: `${t("agroMachinery")} - ${t("suppliers")}`,
                          },
                          {
                            key: "machinery-rentals",
                            label: `${t("agroMachinery")} - ${t("rentals")}`,
                          },
                        ].map((item) => (
                          <button
                            key={item.key}
                            onClick={() => {
                              setCurrentSection(item.key);
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 px-3 rounded-lg transition-colors"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentSection("ebook");
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-3 rounded-lg transition-colors"
                  >
                    {t("ebook")}
                  </button>

                  <button
                    onClick={() => {
                      setCurrentSection("funders");
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-3 rounded-lg transition-colors"
                  >
                    {t("funders")}
                  </button>

                  {/* Language Toggle Mobile */}
                  <div className="flex items-center gap-2 px-3 py-2">
                    <span className="text-sm text-gray-600 mr-2">
                      {language === "en" ? "Language:" : "Lugha:"}
                    </span>
                    <button
                      onClick={() => setLanguage("en")}
                      className={`px-3 py-1.5 rounded ${
                        language === "en"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      } transition-colors text-sm font-medium`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLanguage("sw")}
                      className={`px-3 py-1.5 rounded ${
                        language === "sw"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      } transition-colors text-sm font-medium`}
                    >
                      Kiswahili
                    </button>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                  >
                    {t("login")}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Register Modal */}
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
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
      {currentSection === "founders" && (
        <FoundersSection onBack={() => setCurrentSection("home")} />
      )}

      {/* Home Page Content - Only show when currentSection is 'home' */}
      {currentSection === "home" && (
        <>
          {/* Hero Section */}
          <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute top-40 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 right-20 w-72 h-72 bg-lime-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-4 py-2 bg-green-100 rounded-full border border-green-200"
                  >
                    <span className="text-green-800 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      {t("heroBadge")}
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-900"
                  >
                    {t("heroTitle")}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 text-lg"
                  >
                    {t("heroSubtitle")}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Button
                      size="lg"
                      onClick={() => setRegisterModalOpen(true)}
                      className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
                    >
                      {t("joinFarmer")}
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setCurrentSection("marketplace")}
                      className="border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700 shadow-md hover:shadow-lg transition-all"
                    >
                      {t("browseMarketplace")}
                    </Button>
                  </motion.div>

                  {/* Quick Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-3 gap-4 pt-6"
                  >
                    {[
                      { value: "5000+", label: t("farmers") },
                      { value: "200+", label: t("extensionOfficersCount") },
                      { value: "1000+", label: t("verifiedProducts") },
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/60 backdrop-blur-sm rounded-lg p-3 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="text-green-600">{stat.value}</div>
                        <div className="text-sm text-gray-600">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Right Image */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative"
                >
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1585094659595-04a44bcba305?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZmFybWVyJTIwZmFybWluZyUyMGNyb3BzfGVufDF8fHx8MTc2NTM3ODUwMHww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="African farmer"
                      className="rounded-2xl shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent rounded-2xl"></div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-2xl border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">
                          {t("cropYieldIncrease")}
                        </div>
                        <div className="text-green-600">+45%</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Vision Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-600 to-emerald-700 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6"
                >
                  <span className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    {t("visionTitle")}
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-white mb-6 text-3xl md:text-4xl lg:text-5xl max-w-5xl mx-auto leading-tight"
                >
                  {t("visionText")}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap justify-center gap-8 mt-12"
                >
                  {[
                    {
                      icon: Shield,
                      label: language === "en" ? "Trusted" : "Tunaaminika",
                      color: "from-blue-400 to-blue-500",
                    },
                    {
                      icon: Users,
                      label: language === "en" ? "Inclusive" : "Jumuishi",
                      color: "from-purple-400 to-purple-500",
                    },
                    {
                      icon: BarChart3,
                      label:
                        language === "en" ? "Data-Driven" : "Data ya Kisasa",
                      color: "from-emerald-400 to-emerald-500",
                    },
                    {
                      icon: TrendingUp,
                      label: language === "en" ? "Prosperity" : "Ustawi",
                      color: "from-yellow-400 to-yellow-500",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-xl`}
                      >
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-white font-medium">
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* User Roles Section */}
          <section
            id="for-users"
            className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-gray-900 mb-4 text-3xl md:text-4xl font-semibold">
                  {t("userRolesTitle")}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  {t("userRolesSubtitle")}
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Farmers */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="p-6 bg-white hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-green-200 h-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <Sprout className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                      {t("forFarmers")}
                    </h3>
                    <ul className="space-y-3 mb-6">
                      {[
                        t("farmerFeature1"),
                        t("farmerFeature2"),
                        t("farmerFeature3"),
                        t("farmerFeature4"),
                        t("farmerFeature5"),
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => setRegisterModalOpen(true)}
                      className="w-full bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
                    >
                      {t("registerAsFarmer")}
                    </Button>
                  </Card>
                </motion.div>

                {/* Buyers */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="p-6 bg-white hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 h-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <ShoppingCart className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                      {t("forBuyers")}
                    </h3>
                    <ul className="space-y-3 mb-6">
                      {[
                        t("buyerFeature1"),
                        t("buyerFeature2"),
                        t("buyerFeature3"),
                        t("buyerFeature4"),
                        t("buyerFeature5"),
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => setCurrentSection("marketplace")}
                      className="w-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                    >
                      {t("startBuying")}
                    </Button>
                  </Card>
                </motion.div>

                {/* Extension Officers */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="p-6 bg-white hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-purple-200 h-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                      {t("forExtensionOfficers")}
                    </h3>
                    <ul className="space-y-3 mb-6">
                      {[
                        t("extensionFeature1"),
                        t("extensionFeature2"),
                        t("extensionFeature3"),
                        t("extensionFeature4"),
                        t("extensionFeature5"),
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => setRegisterModalOpen(true)}
                      className="w-full bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all"
                    >
                      {t("joinAsOfficer")}
                    </Button>
                  </Card>
                </motion.div>

                {/* Suppliers */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="p-6 bg-white hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-orange-200 h-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                      {t("forSuppliers")}
                    </h3>
                    <ul className="space-y-3 mb-6">
                      {[
                        t("supplierFeature1"),
                        t("supplierFeature2"),
                        t("supplierFeature3"),
                        t("supplierFeature4"),
                        t("supplierFeature5"),
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => setRegisterModalOpen(true)}
                      className="w-full bg-orange-600 hover:bg-orange-700 shadow-md hover:shadow-lg transition-all"
                    >
                      {t("registerAsSupplier")}
                    </Button>
                  </Card>
                </motion.div>

                {/* Transporters */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="p-6 bg-white hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-teal-200 h-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <Truck className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                      {t("forTransporters")}
                    </h3>
                    <ul className="space-y-3 mb-6">
                      {[
                        t("transporterFeature1"),
                        t("transporterFeature2"),
                        t("transporterFeature3"),
                        t("transporterFeature4"),
                        t("transporterFeature5"),
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => setRegisterModalOpen(true)}
                      className="w-full bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg transition-all"
                    >
                      {t("joinAsTransporter")}
                    </Button>
                  </Card>
                </motion.div>

                {/* Collection Centers */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="p-6 bg-white hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-indigo-200 h-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-gray-900 mb-3 text-xl font-semibold">
                      {t("forCollectionCenters")}
                    </h3>
                    <ul className="space-y-3 mb-6">
                      {[
                        t("collectionFeature1"),
                        t("collectionFeature2"),
                        t("collectionFeature3"),
                        t("collectionFeature4"),
                        t("collectionFeature5"),
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => setRegisterModalOpen(true)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
                    >
                      {t("registerCenter")}
                    </Button>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>

          {/* What Makes Us Different */}
          <section
            id="about"
            className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-600 to-emerald-700 text-white"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-white mb-4">
                  {t("whatMakesUsDifferentTitle")}
                </h2>
                <p className="text-green-100 max-w-2xl mx-auto">
                  {t("whatMakesUsDifferentSubtitle")}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Shield,
                    title: t("diff1Title"),
                    description: t("diff1Desc"),
                  },
                  {
                    icon: Users,
                    title: t("diff3Title"),
                    description: t("diff3Desc"),
                  },
                  {
                    icon: MapPin,
                    title: t("diff5Title"),
                    description: t("diff5Desc"),
                  },
                  {
                    icon: BarChart3,
                    title: t("diff7Title"),
                    description: t("diff7Desc"),
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 transition-all hover:bg-white/20">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white mb-2 text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-green-100 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-gray-900 mb-4">{t("ctaTitle")}</h2>
              <p className="text-gray-600 mb-8 text-lg">{t("ctaSubtitle")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => setRegisterModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {t("getStartedToday")}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  {t("contactSales")}
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer - Always visible */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            {/* Brand & Description */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Sprout className="w-7 h-7 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Shambani Investment
                </span>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                {t("footerDescription")}
              </p>
              <p className="text-gray-500 text-xs mb-4 italic">
                {language === "en"
                  ? "Transforming African agriculture through digital innovation."
                  : "Kubadilisha kilimo cha Afrika kwa ubunifu wa kidijitali."}
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800/50 hover:bg-green-600 rounded-lg flex items-center justify-center transition-all hover:scale-110 border border-gray-700 hover:border-green-500"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800/50 hover:bg-green-600 rounded-lg flex items-center justify-center transition-all hover:scale-110 border border-gray-700 hover:border-green-500"
                >
                  <Users className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800/50 hover:bg-green-600 rounded-lg flex items-center justify-center transition-all hover:scale-110 border border-gray-700 hover:border-green-500"
                >
                  <MapPin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold mb-4 text-base text-white flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-green-500" />
                {t("quickLinks")}
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => setCurrentSection("home")}
                    className="text-gray-400 hover:text-green-400 transition-all flex items-center gap-2 text-sm hover:translate-x-1 duration-200"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {t("home")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentSection("home");
                      setTimeout(() => {
                        document
                          .getElementById("for-users")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className="text-gray-400 hover:text-green-400 transition-all flex items-center gap-2 text-sm hover:translate-x-1 duration-200"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {t("forUsers")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentSection("home");
                      setTimeout(() => {
                        document
                          .getElementById("about")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className="text-gray-400 hover:text-green-400 transition-all flex items-center gap-2 text-sm hover:translate-x-1 duration-200"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {t("aboutUs")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentSection("founders")}
                    className="text-gray-400 hover:text-green-400 transition-all flex items-center gap-2 text-sm hover:translate-x-1 duration-200"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {language === "en" ? "Our Team" : "Timu Yetu"}
                  </button>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-bold mb-4 text-base text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                {t("services")}
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => setCurrentSection("marketplace")}
                    className="text-gray-400 hover:text-green-400 transition-all flex items-start gap-2 text-sm text-left hover:translate-x-1 duration-200 w-full"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span className="break-words">{t("marketplace")}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentSection("agrovet")}
                    className="text-gray-400 hover:text-green-400 transition-all flex items-start gap-2 text-sm text-left hover:translate-x-1 duration-200 w-full"
                  >
                    <Leaf className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span className="break-words">{t("agrovetShops")}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentSection("extension")}
                    className="text-gray-400 hover:text-green-400 transition-all flex items-start gap-2 text-sm text-left hover:translate-x-1 duration-200 w-full"
                  >
                    <Users className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span className="break-words">
                      {t("extensionOfficers")}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentSection("logistics")}
                    className="text-gray-400 hover:text-green-400 transition-all flex items-start gap-2 text-sm text-left hover:translate-x-1 duration-200 w-full"
                  >
                    <Truck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span className="break-words">{t("logistics")}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentSection("ebook")}
                    className="text-gray-400 hover:text-green-400 transition-all flex items-start gap-2 text-sm text-left hover:translate-x-1 duration-200 w-full"
                  >
                    <BookOpen className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span className="break-words">{t("ebook")}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold mb-4 text-base text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-500" />
                {t("contactUs")}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-gray-400">
                  <div className="w-9 h-9 bg-gray-800/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-700">
                    <MapPin className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm mb-1">
                      Shambani Investment Ltd
                    </p>
                    <p className="text-xs leading-relaxed text-gray-400">
                      Kinyerezi Mbuyuni, House No.5, Msikiti Street, Ilala, Dar
                      es Salaam, Tanzania
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 text-gray-400 group">
                  <div className="w-9 h-9 bg-gray-800/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-700 group-hover:border-green-500 transition-colors">
                    <Globe className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <a
                      href="mailto:ceoshambaniinvestment@gmail.com"
                      className="block break-all hover:text-green-400 transition-colors"
                    >
                      ceoshambaniinvestment@gmail.com
                    </a>
                    <a
                      href="https://www.shambaniinvestment.co.tz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:text-green-400 transition-colors"
                    >
                      www.shambaniinvestment.co.tz
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 text-gray-400 group">
                  <div className="w-9 h-9 bg-gray-800/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-700 group-hover:border-green-500 transition-colors">
                    <Users className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <a
                      href="tel:+255769409240"
                      className="block hover:text-green-400 transition-colors"
                    >
                      +255 769 409 240
                    </a>
                    <a
                      href="tel:+255788741194"
                      className="block hover:text-green-400 transition-colors"
                    >
                      +255 788 741 194
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                &copy; 2024 Shambani Investment Ltd. {t("rightsReserved")}
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                <a
                  href="#"
                  className="hover:text-green-400 transition-colors hover:underline"
                >
                  {language === "en" ? "Privacy Policy" : "Sera ya Faragha"}
                </a>
                <a
                  href="#"
                  className="hover:text-green-400 transition-colors hover:underline"
                >
                  {language === "en"
                    ? "Terms of Service"
                    : "Masharti ya Huduma"}
                </a>
                <a
                  href="#"
                  className="hover:text-green-400 transition-colors hover:underline"
                >
                  {language === "en" ? "Cookie Policy" : "Sera ya Vidakuzi"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
