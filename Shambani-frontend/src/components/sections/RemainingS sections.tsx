import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  MapPin,
  Star,
  Phone,
  Clock,
  Truck,
  Users,
  BookOpen,
  DollarSign,
  Award,
  CheckCircle,
  Download,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useLanguage } from "../LanguageContext";

// AGROVET SHOPS SECTION
export function AgrovetSection() {
  const { t, language } = useLanguage();

  const shops = [
    {
      id: 1,
      name: "Dar es Salaam Agro Supplies",
      nameSw: "Dar es Salaam Agro Supplies",
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
      nameSw: "Arusha Farm Inputs",
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
      nameSw: "Mwanza Agro Center",
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
          <h1 className="text-gray-900 mb-4">{t("agrovetTitle")}</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
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

// EXTENSION OFFICERS SECTION
export function ExtensionSection() {
  const { t, language } = useLanguage();

  const officers = [
    {
      id: 1,
      name: "Dr. Jane Kamau",
      nameSw: "Dkt. Jane Kamau",
      specialty: t("agronomist"),
      specialtySw: t("agronomist"),
      experience: "15",
      rating: 5.0,
      price: "TZS 75,000",
      location: "Arusha",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    },
    {
      id: 2,
      name: "Dr. Peter Omondi",
      nameSw: "Dkt. Peter Omondi",
      specialty: t("veterinarian"),
      specialtySw: t("veterinarian"),
      experience: "12",
      rating: 4.9,
      price: "TZS 90,000",
      location: "Mwanza",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
    },
    {
      id: 3,
      name: "Mary Wanjiku",
      nameSw: "Mary Wanjiku",
      specialty: t("soilSpecialist"),
      specialtySw: t("soilSpecialist"),
      experience: "10",
      rating: 4.8,
      price: "TZS 60,000",
      location: "Kilimanjaro",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
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
          <h1 className="text-gray-900 mb-4">{t("extensionTitle")}</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("extensionSubtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {officers.map((officer, index) => (
            <motion.div
              key={officer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={officer.image}
                    alt={officer.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">
                      {officer.rating}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-gray-900 font-semibold mb-1">
                    {officer.name}
                  </h3>
                  <p className="text-green-600 text-sm font-medium mb-2">
                    {officer.specialty}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {officer.experience} {t("yearsExperience")}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                    <MapPin className="w-4 h-4" />
                    {officer.location}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-900 font-semibold">
                      {officer.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      {t("consultation")}
                    </span>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    {t("bookNow")}
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

// LOGISTICS SECTION
export function LogisticsSection() {
  const { t, language } = useLanguage();

  const providers = [
    {
      id: 1,
      name: "Fresh Transport Ltd",
      nameSw: "Fresh Transport Ltd",
      type: "Transport",
      capacity: "5 tons",
      location: "Dar es Salaam",
      rating: 4.8,
      features: [t("storageAvailable"), "Cold Chain", "GPS Tracking"],
      image:
        "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400",
    },
    {
      id: 2,
      name: "Arusha Collection Center",
      nameSw: "Kituo cha Ukusanyaji Arusha",
      type: "Collection Center",
      capacity: "50 tons",
      location: "Arusha",
      rating: 4.9,
      features: [t("storageAvailable"), "Sorting Facility", "Packaging"],
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400",
    },
    {
      id: 3,
      name: "Swift Agro Logistics",
      nameSw: "Swift Agro Logistics",
      type: "Transport",
      capacity: "10 tons",
      location: "Mwanza",
      rating: 4.7,
      features: ["Refrigerated", "Same-Day Delivery", "Insurance"],
      image:
        "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400",
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
          <h1 className="text-gray-900 mb-4">{t("logisticsTitle")}</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("logisticsSubtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {provider.type}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gray-900 font-semibold">
                      {language === "en" ? provider.name : provider.nameSw}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{provider.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                    <MapPin className="w-4 h-4" />
                    {provider.location} • {provider.capacity}
                  </p>
                  <div className="mb-4">
                    {provider.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-600 mb-1"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    {t("requestPickup")}
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

// E-BOOKS SECTION
export function EbookSection() {
  const { t, language } = useLanguage();
  const [tab, setTab] = useState<"free" | "paid">("free");

  const freeBooks = [
    {
      id: 1,
      title: "Modern Maize Farming",
      titleSw: "Kilimo cha Mahindi cha Kisasa",
      author: "Dr. James Mwangi",
      pages: 120,
      downloads: 5420,
      image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400",
    },
    {
      id: 2,
      title: "Poultry Management Guide",
      titleSw: "Mwongozo wa Ufugaji wa Kuku",
      author: "Grace Akinyi",
      pages: 85,
      downloads: 3280,
      image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400",
    },
    {
      id: 3,
      title: "Organic Vegetable Farming",
      titleSw: "Kilimo cha Mboga wa Asili",
      author: "Peter Kamau",
      pages: 95,
      downloads: 4150,
      image:
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
    },
  ];

  const paidBooks = [
    {
      id: 4,
      title: "Advanced Dairy Farming",
      titleSw: "Ufugaji wa Maziwa wa Kina",
      author: "Dr. Mary Wanjiru",
      pages: 250,
      price: "TZS 45,000",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
    },
    {
      id: 5,
      title: "Commercial Horticulture",
      titleSw: "Uzalishaji wa Matunda na Mboga",
      author: "John Kiprop",
      pages: 180,
      price: "TZS 36,000",
      image:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400",
    },
    {
      id: 6,
      title: "Fish Farming Mastery",
      titleSw: "Ufugaji wa Samaki Kitaalamu",
      author: "Samuel Odhiambo",
      pages: 200,
      price: "TZS 54,000",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
    },
  ];

  const books = tab === "free" ? freeBooks : paidBooks;

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-gray-900 mb-4">{t("ebookTitle")}</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("ebookSubtitle")}
          </p>
        </motion.div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setTab("free")}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              tab === "free"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("freeBooks")}
          </button>
          <button
            onClick={() => setTab("paid")}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              tab === "paid"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("paidBooks")}
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-sm mb-1">{book.author}</p>
                    <h3 className="text-white font-semibold">
                      {language === "en" ? book.title : (book as any).titleSw}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      {book.pages} {t("pages")}
                    </span>
                    {tab === "free" && (
                      <span className="text-sm text-green-600">
                        {(book as any).downloads} downloads
                      </span>
                    )}
                    {tab === "paid" && (
                      <span className="text-green-600 font-semibold">
                        {(book as any).price}
                      </span>
                    )}
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    {tab === "free" ? (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        {t("downloadFree")}
                      </>
                    ) : (
                      t("buyBook")
                    )}
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

// FUNDERS SECTION
export function FundersSection() {
  const { t, language } = useLanguage();
  const [tab, setTab] = useState<"funders" | "loans">("funders");

  const funders = [
    {
      id: 1,
      name: "Tanzania Agricultural Fund",
      nameSw: "Mfuko wa Kilimo wa Tanzania",
      type: "Grant",
      maxAmount: "TZS 15,000,000",
      requirements: "Active farm registration",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
    },
    {
      id: 2,
      name: "East Africa Agri Foundation",
      nameSw: "Shirika la Kilimo Afrika Mashariki",
      type: "Grant",
      maxAmount: "TZS 30,000,000",
      requirements: "Women & Youth farmers",
      image:
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400",
    },
  ];

  const loans = [
    {
      id: 3,
      name: "CRDB Bank - Agri Loan",
      nameSw: "CRDB Bank - Mkopo wa Kilimo",
      interestRate: "12%",
      maxAmount: "TZS 150,000,000",
      term: "1-5 years",
      image:
        "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=400",
    },
    {
      id: 4,
      name: "NMB Farm Loan",
      nameSw: "NMB Mkopo wa Shamba",
      interestRate: "13%",
      maxAmount: "TZS 90,000,000",
      term: "1-3 years",
      image:
        "https://images.unsplash.com/photo-1633158829875-e5316a358c6f?w=400",
    },
  ];

  const items = tab === "funders" ? funders : loans;

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-gray-900 mb-4">{t("fundersTitle")}</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("fundersSubtitle")}
          </p>
        </motion.div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setTab("funders")}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              tab === "funders"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("funders")}
          </button>
          <button
            onClick={() => setTab("loans")}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              tab === "loans"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("agriculturalLoans")}
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {tab === "funders"
                      ? (item as any).type
                      : t("agriculturalLoans")}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-gray-900 font-semibold mb-3">
                    {language === "en" ? item.name : (item as any).nameSw}
                  </h3>
                  {tab === "funders" ? (
                    <>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>{t("maxAmount")}:</strong> {item.maxAmount}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        {(item as any).requirements}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>{t("interestRate")}:</strong>{" "}
                        {(item as any).interestRate}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>{t("maxAmount")}:</strong> {item.maxAmount}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>{language === "en" ? "Term" : "Muda"}:</strong>{" "}
                        {(item as any).term}
                      </p>
                    </>
                  )}
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    {t("applyNow")}
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

// FOUNDERS SECTION
export function FoundersSection() {
  const { t, language } = useLanguage();

  const founders = [
    {
      id: 1,
      name: "Dr. James Kariuki",
      role: "CEO & Co-Founder",
      roleSw: "Mkuu Mtendaji na Mwanzilishi Mwenza",
      bio: "Agricultural economist with 20 years experience transforming value chains across Africa.",
      bioSw:
        "Mhasibu wa uchumi wa kilimo na uzoefu wa miaka 20 katika kubadilisha minoror ya thamani barani Afrika.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    },
    {
      id: 2,
      name: "Grace Wanjiku",
      role: "CTO & Co-Founder",
      roleSw: "Mkurugenzi wa Teknolojia na Mwanzilishi Mwenza",
      bio: "Tech innovator passionate about using digital solutions to empower farmers.",
      bioSw:
        "Mbuni wa teknolojia mwenye shauku ya kutumia suluhisho za kidijitali kuwawezesha wakulima.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    },
    {
      id: 3,
      name: "Peter Omondi",
      role: "COO & Co-Founder",
      roleSw: "Mkurugenzi wa Shughuli na Mwanzilishi Mwenza",
      bio: "Operations expert with deep understanding of agricultural logistics and market access.",
      bioSw:
        "Mtaalamu wa shughuli mwenye uelewa wa kina wa usafirishaji wa kilimo na upatikanaji wa masoko.",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
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
          <h1 className="text-gray-900 mb-4">{t("foundersTitle")}</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("foundersSubtitle")}
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-8 h-full bg-gradient-to-br from-green-50 to-white">
              <h3 className="text-gray-900 mb-4">{t("ourMission")}</h3>
              <p className="text-gray-600">{t("missionText")}</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-8 h-full bg-gradient-to-br from-blue-50 to-white">
              <h3 className="text-gray-900 mb-4">{t("ourVision")}</h3>
              <p className="text-gray-600">{t("visionText")}</p>
            </Card>
          </motion.div>
        </div>

        {/* Founders */}
        <div className="grid md:grid-cols-3 gap-8">
          {founders.map((founder, index) => (
            <motion.div
              key={founder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-gray-900 font-semibold mb-1">
                    {founder.name}
                  </h3>
                  <p className="text-green-600 text-sm font-medium mb-3">
                    {language === "en" ? founder.role : founder.roleSw}
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === "en" ? founder.bio : founder.bioSw}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
