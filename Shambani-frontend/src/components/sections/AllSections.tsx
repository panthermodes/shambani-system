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
  Tractor,
  Users,
  BookOpen,
  DollarSign,
  Award,
  CheckCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useLanguage } from "../LanguageContext";

// MARKETPLACE SECTION
export function MarketplaceSection() {
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
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-gray-900 mb-4">{t("marketplaceTitle")}</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("marketplaceSubtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-6 py-2.5 rounded-full transition-all ${
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
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

// MACHINERY SUPPLIERS SECTION
export function MachinerySuppliers() {
  const { t, language } = useLanguage();

  const suppliers = [
    {
      id: 1,
      name: "Tractor World Tanzania",
      nameSw: "Tractor World Tanzania",
      equipment: "John Deere Tractors, Ploughs, Harvesters",
      location: "Dar es Salaam",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
    },
    {
      id: 2,
      name: "AgroMech Solutions",
      nameSw: "AgroMech Solutions",
      equipment: "Water Pumps, Irrigation Systems",
      location: "Arusha",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1581578017426-3a52d31caf32?w=400",
    },
    {
      id: 3,
      name: "FarmTech Equipment",
      nameSw: "FarmTech Equipment",
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-gray-900 mb-4">{t("suppliersTitle")}</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
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

// MACHINERY RENTALS SECTION
export function MachineryRentals() {
  const { t, language } = useLanguage();

  const rentals = [
    {
      id: 1,
      name: "Massey Ferguson 375",
      nameSw: "Massey Ferguson 375",
      type: "Tractor",
      price: "TZS 150,000",
      priceUnit: t("perDay"),
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
      priceUnit: t("perDay"),
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
      priceUnit: t("perDay"),
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
          <h1 className="text-gray-900 mb-4">{t("rentalsTitle")}</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
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
                        {rental.priceUnit}
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

// Continue with more sections in next file to avoid length...
