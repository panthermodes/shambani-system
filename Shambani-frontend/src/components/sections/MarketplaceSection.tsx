import { motion } from "framer-motion";
import { useState } from "react";
import { Search, MapPin, Star, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useLanguage } from "../LanguageContext";

const products = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    nameSw: "Nyanya Mbichi",
    farmer: "John Kamau",
    location: "Arusha",
    price: "TZS 2,000/kg",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
  },
  {
    id: 2,
    name: "Organic Spinach",
    nameSw: "Mchicha wa Asili",
    farmer: "Grace Wanjiru",
    location: "Mwanza",
    price: "TZS 1,500/bunch",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
  },
  {
    id: 3,
    name: "Free-Range Eggs",
    nameSw: "Mayai ya Kuku wa Nje",
    farmer: "Peter Mwangi",
    location: "Dar es Salaam",
    price: "TZS 10,000/tray",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400",
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
  },
  {
    id: 5,
    name: "Passion Fruits",
    nameSw: "Maparachichi",
    farmer: "Moses Kiprop",
    location: "Mbeya",
    price: "TZS 3,500/kg",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1589528735406-3fc935b84b48?w=400",
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

export function MarketplaceSection() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-gray-900 mb-4 text-3xl md:text-4xl font-semibold">
            {t("marketplaceTitle")}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("marketplaceSubtitle")}
          </p>
        </motion.div>

        {/* Search Bar */}
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

        {/* Categories */}
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

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                {/* Image */}
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

                {/* Content */}
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

                  {/* Actions */}
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

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              {language === "en"
                ? "No products found"
                : "Hakuna bidhaa zilizopatikana"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
