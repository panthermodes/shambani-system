import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  MapPin,
  Star,
  ShoppingCart,
  Phone,
  Clock,
  Truck,
  BookOpen,
  Award,
  CheckCircle,
  Download,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useLanguage } from "../LanguageContext";
import type { fr } from "date-fns/locale";

// Export all service sections

// MARKETPLACE SECTION
export function MarketplaceSection({ onBack }: { onBack?: () => void }) {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const products = [
    {
      id: 1,
      name: "Fresh Tomatoes",
      nameSw: "Nyanya Mbichi",
      farmer: "John Kamau",
      location: "Arusha",
      price: "TZS 2,000/kg",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
      category: "vegetables",
    },
    {
      id: 2,
      name: "Organic Spinach",
      nameSw: "Mchicha wa Asili",
      farmer: "Grace Wanjiru",
      location: "Mwanza",
      price: "TZS 1,500/bunch",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
      category: "vegetables",
    },
    {
      id: 3,
      name: "Free-Range Eggs",
      nameSw: "Mayai ya Kuku wa Nje",
      farmer: "Peter Mwangi",
      location: "Dar es Salaam",
      price: "TZS 10,000/tray",
      rating: 5.0,
      image:
        "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400",
      category: "poultry",
    },
    {
      id: 4,
      name: "Fresh Maize",
      nameSw: "Mahindi Mapya",
      farmer: "Jane Akinyi",
      location: "Morogoro",
      price: "TZS 1,800/kg",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400",
      category: "grains",
    },
    {
      id: 5,
      name: "Passion Fruits",
      nameSw: "Maparachichi",
      farmer: "Moses Kiprop",
      location: "Mbeya",
      price: "TZS 3,500/kg",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1589528735406-3fc935b84b48?w=400",
      category: "fruits",
    },
    {
      id: 6,
      name: "Fresh Milk",
      nameSw: "Maziwa Safi",
      farmer: "Ruth Chebet",
      location: "Kilimanjaro",
      price: "TZS 1,800/liter",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
      category: "dairy",
    },
  ];

  const categories = [
    { key: "all", label: "All Products", labelSw: "Bidhaa Zote" },
    { key: "vegetables", label: "Vegetables", labelSw: "Mboga" },
    { key: "fruits", label: "Fruits", labelSw: "Matunda" },
    { key: "grains", label: "Grains", labelSw: "Nafaka" },
    { key: "poultry", label: "Poultry & Eggs", labelSw: "Kuku na Mayai" },
    { key: "dairy", label: "Dairy", labelSw: "Bidhaa za Maziwa" },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameSw.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-16 sm:py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {onBack && (
          <Button variant="outline" onClick={onBack} className="mb-6">
            ← {t("home")}
          </Button>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h1 className="text-gray-900 mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl px-2 sm:px-4">
            {t("marketplaceTitle")}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2 sm:px-4">
            {t("marketplaceSubtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all text-xs sm:text-sm md:text-base ${
                  selectedCategory === category.key
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {language === "en" ? category.label : category.labelSw}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">
                      {product.rating}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-gray-900 font-semibold mb-1">
                    {language === "en" ? product.name : product.nameSw}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {product.location} • {product.farmer}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-green-600 font-semibold text-lg">
                      {product.price}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {t("buyNow")}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">{t("noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// MACHINERY SUPPLIERS
export function MachinerySuppliers({ onBack }: { onBack?: () => void }) {
  const { t } = useLanguage();

  const suppliers = [
    {
      id: 1,
      name: "Tractor World Tanzania",
      equipment: "John Deere Tractors, Ploughs, Harvesters",
      location: "Dar es Salaam",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
    },
    {
      id: 2,
      name: "AgroMech Solutions",
      equipment: "Water Pumps, Irrigation Systems",
      location: "Arusha",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1581578017426-3a52d31caf32?w=400",
    },
    {
      id: 3,
      name: "FarmTech Equipment",
      equipment: "Seeders, Sprayers, Harrows",
      location: "Mwanza",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1574086968598-4bbcbe1d0f4a?w=400",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {onBack && (
          <Button variant="outline" onClick={onBack} className="mb-6">
            ← {t("home")}
          </Button>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-gray-900 mb-4 text-2xl sm:text-3xl md:text-4xl px-4">
            {t("suppliersTitle")}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {t("suppliersSubtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier, index) => (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={supplier.image}
                    alt={supplier.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gray-900 font-semibold">
                      {supplier.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">
                        {supplier.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {supplier.equipment}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                    <MapPin className="w-4 h-4" />
                    {supplier.location}
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    {t("contactSupplier")}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// MACHINERY RENTALS
export function MachineryRentals({ onBack }: { onBack?: () => void }) {
  const { t, language } = useLanguage();

  const rentals = [
    {
      id: 1,
      name: "Massey Ferguson 375",
      nameSw: "Massey Ferguson 375",
      type: "Tractor",
      price: "TZS 150,000",
      location: "Arusha",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
    },
    {
      id: 2,
      name: "Water Pump - 3HP",
      nameSw: "Pampu ya Maji - 3HP",
      type: "Irrigation",
      price: "TZS 25,000",
      location: "Mwanza",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1581578017426-3a52d31caf32?w=400",
    },
    {
      id: 3,
      name: "Combine Harvester",
      nameSw: "Mashine ya Kuvuna",
      type: "Harvester",
      price: "TZS 450,000",
      location: "Morogoro",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1574086968598-4bbcbe1d0f4a?w=400",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-gray-900 mb-4 text-2xl sm:text-3xl md:text-4xl px-4">
            {t("rentalsTitle")}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {t("rentalsSubtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentals.map((rental, index) => (
            <motion.div
              key={rental.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={rental.image}
                    alt={rental.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {language === "en" ? "Available" : "Inapatikana"}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-gray-900 font-semibold mb-1">
                    {language === "en" ? rental.name : rental.nameSw}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{rental.type}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-green-600 font-semibold text-xl">
                        {rental.price}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        {t("perDay")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{rental.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                    <MapPin className="w-4 h-4" />
                    {rental.location}
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    {t("rentNow")}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// AGROVET SECTION
export function AgrovetSection({ onBack }: { onBack?: () => void }) {
  const { t, language } = useLanguage();

  const shops = [
    {
      id: 1,
      name: "Dar es Salaam Agro Supplies",
      products: "Seeds, Fertilizers, Pesticides",
      location: "Dar es Salaam",
      distance: "2.3",
      rating: 4.8,
      phone: "+255 712 345 678",
      status: "open",
      image:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400",
    },
    {
      id: 2,
      name: "Arusha Farm Inputs",
      products: "Animal Feed, Veterinary Supplies",
      location: "Arusha",
      distance: "5.1",
      rating: 4.9,
      phone: "+255 723 456 789",
      status: "open",
      image:
        "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=400",
    },
    {
      id: 3,
      name: "Mwanza Agro Center",
      products: "Seeds, Tools, Fertilizers",
      location: "Mwanza",
      distance: "8.7",
      rating: 4.7,
      phone: "+255 734 567 890",
      status: "open",
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-gray-900 mb-4 text-2xl sm:text-3xl md:text-4xl px-4">
            {t("agrovetTitle")}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {t("agrovetSubtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop, index) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                  {shop.status === "open" && (
                    <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {t("openNow")}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gray-900 font-semibold">{shop.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{shop.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{shop.products}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">
                    <MapPin className="w-4 h-4" />
                    {shop.location} • {shop.distance} {t("kmAway")}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                    <Phone className="w-4 h-4" />
                    {shop.phone}
                  </p>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      {t("viewShop")}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-green-600 text-green-600"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Extension Officers - simplified due to length
export function ExtensionSection({ onBack }: { onBack?: () => void }) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-gray-900 mb-4 text-2xl sm:text-3xl md:text-4xl px-4">
            {t("extensionTitle")}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {t("extensionSubtitle")}
          </p>
        </motion.div>
        <div className="text-center py-16">
          <p className="text-gray-600">
            {language === "en"
              ? "Extension officers coming soon"
              : "Washauri wa kilimo wanakuja hivi karibuni"}
          </p>
        </div>
      </div>
    </div>
  );
}

// Logistics - simplified
export function LogisticsSection({ onBack }: { onBack?: () => void }) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-gray-900 mb-4 text-2xl sm:text-3xl md:text-4xl px-4">
            {t("logisticsTitle")}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {t("logisticsSubtitle")}
          </p>
        </motion.div>
        <div className="text-center py-16">
          <p className="text-gray-600">
            {language === "en"
              ? "Logistics services coming soon"
              : "Huduma za usafirishaji zinakuja hivi karibuni"}
          </p>
        </div>
      </div>
    </div>
  );
}

// E-books - simplified
export function EbookSection({ onBack }: { onBack?: () => void }) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-gray-900 mb-4 text-2xl sm:text-3xl md:text-4xl px-4">
            {t("ebookTitle")}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {t("ebookSubtitle")}
          </p>
        </motion.div>
        <div className="text-center py-16">
          <p className="text-gray-600">
            {language === "en"
              ? "E-books library coming soon"
              : "Maktaba ya vitabu inakuja hivi karibuni"}
          </p>
        </div>
      </div>
    </div>
  );
}

// Funders - simplified
export function FundersSection({ onBack }: { onBack?: () => void }) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-gray-900 mb-4 text-2xl sm:text-3xl md:text-4xl px-4">
            {t("fundersTitle")}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {t("fundersSubtitle")}
          </p>
        </motion.div>
        <div className="text-center py-16">
          <p className="text-gray-600">
            {language === "en"
              ? "Funding opportunities coming soon"
              : "Fursa za ufadhili zinakuja hivi karibuni"}
          </p>
        </div>
      </div>
    </div>
  );
}

// Lease Services
export function LeaseServicesSection({ onBack }: { onBack?: () => void }) {
  const { t, language } = useLanguage();

  const leaseOptions = [
    {
      title: t("agriculturalFarmLease"),
      icon: "🌾",
      description:
        language === "en"
          ? "Lease ready-to-use agricultural land for crop production"
          : "Kodisha ardhi ya kilimo tayari kwa uzalishaji wa mazao",
    },
    {
      title: t("chickenHouseLease"),
      icon: "🐔",
      description:
        language === "en"
          ? "Lease fully equipped chicken houses for poultry farming"
          : "Kodisha banda la kuku lenye vifaa kwa ufugaji wa kuku",
    },
    {
      title: t("tractorLease"),
      icon: "🚜",
      description:
        language === "en"
          ? "Lease tractors for land preparation and farming operations"
          : "Kodisha trekta kwa uandaaji wa ardhi na shughuli za kilimo",
    },
    {
      title: t("storageHouseLease"),
      icon: "🏠",
      description:
        language === "en"
          ? "Lease storage facilities for your harvested produce"
          : "Kodisha ghala kwa mazao yako yaliyovunwa",
    },
    {
      title: t("refrigeratedVehicleLease"),
      icon: "🚛",
      description:
        language === "en"
          ? "Lease refrigerated transport vehicles for fresh produce"
          : "Kodisha magari ya kusafirisha yenye friji kwa mazao safi",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {onBack && (
          <Button variant="outline" onClick={onBack} className="mb-6">
            ← {t("home")}
          </Button>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-gray-900 mb-4 text-2xl sm:text-3xl md:text-4xl px-4">
            {t("leaseServicesTitle")}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {t("leaseServicesSubtitle")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaseOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-xl transition-shadow h-full">
                <div className="text-5xl mb-4">{option.icon}</div>
                <h3 className="text-gray-900 mb-3 text-lg sm:text-xl">
                  {option.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  {option.description}
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  {t("viewDetails")}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Agricultural Farm Lease Section
export function AgriculturalFarmLeaseSection({
  onBack,
}: {
  onBack?: () => void;
}) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {onBack && (
          <Button variant="outline" onClick={onBack} className="mb-6">
            ← {t("home")}
          </Button>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🌾</div>
          <h1 className="text-gray-900 mb-4 text-2xl sm:text-3xl md:text-4xl px-4">
            {t("agriculturalFarmLease")}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {language === "en"
              ? "Lease ready-to-use agricultural land for crop production"
              : "Kodisha ardhi ya kilimo tayari kwa uzalishaji wa mazao"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4 text-xl">
              {t("availableFarms")}
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>✓ {t("farmLease5to50Acres")}</li>
              <li>✓ {t("farmLeaseFertileSoil")}</li>
              <li>✓ {t("farmLeaseWaterAccess")}</li>
              <li>✓ {t("farmLeaseFlexibleTerms")}</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4 text-xl">{t("pricing")}</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">
              TZS 500,000 - 2,000,000
            </p>
            <p className="text-gray-600 mb-4">{t("perAcreYear")}</p>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              {t("contactForDetails")}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Chicken House Lease Section
export function ChickenHouseLeaseSection({ onBack }: { onBack?: () => void }) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {onBack && (
          <Button variant="outline" onClick={onBack} className="mb-6">
            ← {t("home")}
          </Button>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🐔</div>
          <h1 className="text-gray-900 mb-4 text-2xl sm:text-3xl md:text-4xl px-4">
            {t("chickenHouseLease")}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {language === "en"
              ? "Lease fully equipped chicken houses for poultry farming"
              : "Kodisha banda la kuku lenye vifaa kwa ufugaji wa kuku"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4 text-xl">{t("features")}</h3>
            <ul className="space-y-3 text-gray-600">
              <li>✓ {t("chickenCapacity")}</li>
              <li>✓ {t("chickenClimateControlled")}</li>
              <li>✓ {t("chickenAutomaticFeeders")}</li>
              <li>✓ {t("chickenBackupPower")}</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4 text-xl">{t("pricing")}</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">
              TZS 300,000 - 1,500,000
            </p>
            <p className="text-gray-600 mb-4">{t("perMonth")}</p>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              {t("contactForDetails")}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Tractor Lease Section
export function TractorLeaseSection({ onBack }: { onBack?: () => void }) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {onBack && (
          <Button variant="outline" onClick={onBack} className="mb-6">
            ← {t("home")}
          </Button>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🚜</div>
          <h1 className="text-gray-900 mb-4 text-2xl sm:text-3xl md:text-4xl px-4">
            {t("tractorLease")}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {language === "en"
              ? "Lease tractors for land preparation and farming operations"
              : "Kodisha trekta kwa uandaaji wa ardhi na shughuli za kilimo"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4 text-xl">
              {t("availableTractors")}
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>✓ {t("tractor40to120HP")}</li>
              <li>✓ {t("tractorWellMaintained")}</li>
              <li>✓ {t("tractorIncludesAttachments")}</li>
              <li>✓ {t("tractorOperatorAvailable")}</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4 text-xl">{t("pricing")}</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">
              TZS 150,000 - 500,000
            </p>
            <p className="text-gray-600 mb-4">{t("perDay")}</p>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              {t("contactForDetails")}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Storage House Lease Section
export function StorageHouseLeaseSection({ onBack }: { onBack?: () => void }) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {onBack && (
          <Button variant="outline" onClick={onBack} className="mb-6">
            ← {t("home")}
          </Button>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🏠</div>
          <h1 className="text-gray-900 mb-4 text-2xl sm:text-3xl md:text-4xl px-4">
            {t("storageHouseLease")}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {language === "en"
              ? "Lease storage facilities for your harvested produce"
              : "Kodisha ghala kwa mazao yako yaliyovunwa"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4 text-xl">{t("features")}</h3>
            <ul className="space-y-3 text-gray-600">
              <li>✓ {t("storage100to1000Tons")}</li>
              <li>✓ {t("storagePestControlled")}</li>
              <li>✓ {t("storage24x7Security")}</li>
              <li>✓ {t("storageEasyAccess")}</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4 text-xl">{t("pricing")}</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">
              TZS 200,000 - 800,000
            </p>
            <p className="text-gray-600 mb-4">{t("perMonth")}</p>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              {t("contactForDetails")}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Refrigerated Vehicle Lease Section
export function RefrigeratedVehicleLeaseSection({
  onBack,
}: {
  onBack?: () => void;
}) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {onBack && (
          <Button variant="outline" onClick={onBack} className="mb-6">
            ← {t("home")}
          </Button>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🚛</div>
          <h1 className="text-gray-900 mb-4 text-2xl sm:text-3xl md:text-4xl px-4">
            {t("refrigeratedVehicleLease")}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {language === "en"
              ? "Lease refrigerated transport vehicles for fresh produce"
              : "Kodisha magari ya kusafirisha yenye friji kwa mazao safi"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4 text-xl">{t("features")}</h3>
            <ul className="space-y-3 text-gray-600">
              <li>✓ {t("refrigerated1to10Tons")}</li>
              <li>✓ {t("refrigeratedTempRange")}</li>
              <li>✓ {t("refrigeratedGPSTracking")}</li>
              <li>✓ {t("refrigeratedDriversAvailable")}</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4 text-xl">{t("pricing")}</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">
              TZS 250,000 - 1,000,000
            </p>
            <p className="text-gray-600 mb-4">{t("perDay")}</p>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              {t("contactForDetails")}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Founders - simplified
export function FoundersSection({ onBack }: { onBack?: () => void }) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-gray-900 mb-4 text-2xl sm:text-3xl md:text-4xl px-4">
            {t("foundersTitle")}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {t("foundersSubtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Card className="p-8 bg-gradient-to-br from-green-50 to-white">
            <h3 className="text-gray-900 mb-4">{t("ourMission")}</h3>
            <p className="text-gray-600">{t("missionText")}</p>
          </Card>
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-white">
            <h3 className="text-gray-900 mb-4">{t("ourVision")}</h3>
            <p className="text-gray-600">{t("visionText")}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
