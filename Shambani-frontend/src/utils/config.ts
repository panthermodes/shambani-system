// Configuration file for Shambani Investment Platform
// Connected to NestJS backend

// Get API URL from environment or use default
const getApiUrl = (): string => {
  // Check if running in browser with Vite
  if (typeof import.meta !== "undefined" && import.meta.env) {
    // Priority: Environment variable > Local backend > Production backend
    const envUrl =
      import.meta.env.VITE_API_URL ||
      "http://localhost:3001" ||
      "https://shambani-backend.onrender.com";

    console.log("🔌 SHAMBANI API Configuration:");
    console.log("   Environment:", import.meta.env.MODE || "development");
    console.log("   API URL:", envUrl);
    console.log(
      "   Source:",
      import.meta.env.VITE_API_URL
        ? ".env file"
        : "default (local backend)"
    );
    return envUrl;
  }
  // Fallback for non-Vite environments - use local backend
  console.log(
    "🔌 Using fallback API URL: http://localhost:3001"
  );
  return "http://localhost:3001";
};

export const config = {
  // ============================================
  // 🔌 BACKEND CONNECTION
  // ============================================

  // Shambani backend server URL
  // Environment variable takes precedence, then falls back to default
  //
  // DOCKER USERS: Set VITE_API_URL in your .env file
  // Example: VITE_API_URL=http://localhost:8080
  //
  // DEPLOYMENT OPTIONS:
  // - Local Development: 'http://localhost:3001'
  // - Docker: 'http://host.docker.internal:3001'
  // - Production: Set VITE_API_URL environment variable
  apiBaseUrl: getApiUrl(),

  // ============================================
  // 📱 APP SETTINGS
  // ============================================

  appName: "Shambani Investment",
  appDescription: "Agricultural Value Chain Management System",
  
  // ============================================
  // 🌍 TANZANIA CONFIGURATION
  // ============================================

  // Default currency
  currency: "TZS",
  
  // Tanzania regions coverage
  coverageAreas: [
    "Dar es Salaam", "Dodoma", "Arusha", "Mwanza", "Mbeya",
    "Tanga", "Morogoro", "Kilimanjaro", "Tabora", "Iringa",
    "Kagera", "Ruvuma", "Mara", "Manyara", "Katavi",
    "Simiyu", "Geita", "Njombe", "Songwe", "Lindi",
    "Mtwara", "Rukwa", "Pwani", "Singida", "Mbeya Rural"
  ],

  // ============================================
  // 🤝 PARTNERS
  // ============================================

  partners: [
    "Ministry of Agriculture",
    "TAMISEMI",
    "CRDB Bank",
    "National Bank of Commerce",
    "Tanzania Agricultural Research Institute"
  ],

  // ============================================
  // � AGRICULTURAL CATEGORIES
  // ============================================

  // User roles matching backend
  userRoles: [
    "FARMER",
    "CASUAL_LABOURER", 
    "EXTENSION_OFFICER",
    "LOGISTICS_PROVIDER",
    "AGROVET_OWNER",
    "MACHINERY_DEALER",
    "BUYER_AGGREGATOR",
    "SUPER_ADMIN"
  ],

  // Agricultural categories
  agriculturalCategories: [
    "Poultry Farming",
    "Crop Production", 
    "Livestock",
    "Agro-processing",
    "Input Supply",
    "Mechanization",
    "Logistics",
    "Extension Services"
  ],

  // ============================================
  // 💰 FINANCIAL CONFIGURATION
  // ============================================

  // Transaction limits (in TZS)
  transactionLimits: {
    minTransaction: 1000,
    maxTransaction: 10000000,
    dailyLimit: 50000000
  },

  // Service fees
  serviceFees: {
    registration: 0,
    transaction: 0.02, // 2%
    premium: 5000 // Monthly premium
  },

  // ============================================
  // 📊 SYSTEM CONFIGURATION
  // ============================================

  // Pagination
  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  },

  // File upload
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    uploadUrl: '/api/upload'
  },

  // Cache settings
  cache: {
    defaultTTL: 300, // 5 minutes
    userCacheTTL: 600, // 10 minutes
  }
};

export default config;
