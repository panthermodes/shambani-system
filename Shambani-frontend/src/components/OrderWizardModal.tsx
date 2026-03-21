import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Package,
  ShoppingCart,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  tanzaniaLocations,
  getDistrictsByRegion,
  getWardsByDistrict,
} from "../utils/tanzaniaLocations";
import {
  productCategories,
} from "../utils/productData.ts";
import type { ProductListing } from "../utils/productData.ts";
import { api } from "../utils/api";

interface OrderWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step =
  | "location"
  | "category"
  | "productType"
  | "availability"
  | "confirmation"
  | "registration"
  | "success";

interface OrderData {
  region: string;
  district: string;
  ward: string;
  category: string;
  productType: string;
  selectedListing?: ProductListing;
  quantity: number;
}

interface GuestRegistration {
  fullName: string;
  phoneNumber: string;
  email: string;
  deliveryAddress: string;
}

export function OrderWizardModal({ isOpen, onClose }: OrderWizardModalProps) {
  const { language, t } = useLanguage();
  const [step, setStep] = useState<Step>("location");
  const [orderData, setOrderData] = useState<OrderData>({
    region: "",
    district: "",
    ward: "",
    category: "",
    productType: "",
    quantity: 1,
  });

  const [guestData, setGuestData] = useState<GuestRegistration>({
    fullName: "",
    phoneNumber: "",
    email: "",
    deliveryAddress: "",
  });

  const [availableListings, setAvailableListings] = useState<ProductListing[]>(
    [],
  );
  const [listingQuantities, setListingQuantities] = useState<
    Record<string, number>
  >({});

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("location");
        setOrderData({
          region: "",
          district: "",
          ward: "",
          category: "",
          productType: "",
          quantity: 1,
        });
        setAvailableListings([]);
        setListingQuantities({});
      }, 300);
    }
  }, [isOpen]);

  // Load product listings when productType is selected
  useEffect(() => {
    const loadProductListings = async () => {
      if (
        orderData.region &&
        orderData.district &&
        orderData.ward &&
        orderData.productType
      ) {
        try {
          const response = await api.get('/api/products', {
            category: orderData.productType,
            region: orderData.region,
            district: orderData.district,
            inStock: true,
            limit: 20
          });
          
          if (response.success) {
            // Transform API response to match ProductListing interface
            const listings: ProductListing[] = response.data.map((product: any) => ({
              id: product.id,
              farmerId: product.sellerId,
              farmerName: product.sellerName || 'Unknown Farmer',
              productTypeId: orderData.productType,
              quantity: product.stock,
              unit: productCategories
                .flatMap(c => c.types)
                .find(t => t.id === orderData.productType)?.unit || "kg",
              pricePerUnit: Number(product.price),
              region: orderData.region,
              district: orderData.district,
              ward: orderData.ward,
              description: product.description,
              quality: product.isVerified ? "Premium" : "Standard",
              qualitySwahili: product.isVerified ? "Bora" : "Kawaida",
              availableDate: new Date().toISOString(),
              isVerified: product.isVerified
            }));
            setAvailableListings(listings);
          }
        } catch (error) {
          console.error('Failed to load product listings:', error);
          setAvailableListings([]);
        }
      }
    };

    loadProductListings();
  }, [
    orderData.region,
    orderData.district,
    orderData.ward,
    orderData.productType,
  ]);

  const handleLocationSelect = (
    field: "region" | "district" | "ward",
    value: string,
  ) => {
    if (field === "region") {
      setOrderData({ ...orderData, region: value, district: "", ward: "" });
    } else if (field === "district") {
      setOrderData({ ...orderData, district: value, ward: "" });
    } else {
      setOrderData({ ...orderData, ward: value });
    }
  };

  const canProceedFromLocation =
    orderData.region && orderData.district && orderData.ward;
  const canProceedFromCategory = orderData.category;
  const canProceedFromProductType = orderData.productType;

  const districts = orderData.region
    ? getDistrictsByRegion(orderData.region)
    : [];
  const wards =
    orderData.region && orderData.district
      ? getWardsByDistrict(orderData.region, orderData.district)
      : [];

  const selectedCategory = productCategories.find(
    (c) => c.id === orderData.category,
  );
  const selectedProductType = selectedCategory?.types.find(
    (t) => t.id === orderData.productType,
  );

  const handleNext = () => {
    if (step === "location" && canProceedFromLocation) {
      setStep("category");
    } else if (step === "category" && canProceedFromCategory) {
      setStep("productType");
    } else if (step === "productType" && canProceedFromProductType) {
      setStep("availability");
    }
  };

  const handleBack = () => {
    if (step === "category") setStep("location");
    else if (step === "productType") setStep("category");
    else if (step === "availability") setStep("productType");
    else if (step === "confirmation") setStep("availability");
  };

  const handlePlaceOrder = () => {
    // In production, this would send the order to the backend
    console.log("Order placed:", orderData);
    setStep("confirmation");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-white">
                  {language === "en"
                    ? "Order Fresh Products"
                    : "Agiza Bidhaa Safi"}
                </h2>
                <p className="text-xs text-green-100">
                  {step === "location" &&
                    (language === "en"
                      ? "Step 1: Select Location"
                      : "Hatua 1: Chagua Eneo")}
                  {step === "category" &&
                    (language === "en"
                      ? "Step 2: Choose Category"
                      : "Hatua 2: Chagua Aina")}
                  {step === "productType" &&
                    (language === "en"
                      ? "Step 3: Select Product"
                      : "Hatua 3: Chagua Bidhaa")}
                  {step === "availability" &&
                    (language === "en"
                      ? "Step 4: View Availability"
                      : "Hatua 4: Angalia Upatikanaji")}
                  {step === "confirmation" &&
                    (language === "en"
                      ? "Order Confirmed!"
                      : "Oda Imethibitishwa!")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-1 sm:p-1.5 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Progress Indicator */}
          {step !== "confirmation" &&
            step !== "registration" &&
            step !== "success" && (
              <div className="bg-gray-50 px-3 sm:px-6 py-3">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  {["location", "category", "productType", "availability"].map(
                    (s, index) => (
                      <div key={s} className="flex items-center">
                        <div
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors ${
                            step === s
                              ? "bg-green-600 text-white"
                              : [
                                    "location",
                                    "category",
                                    "productType",
                                    "availability",
                                  ].indexOf(step) > index
                                ? "bg-green-500 text-white"
                                : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                        {index < 3 && (
                          <div
                            className={`w-8 sm:w-12 md:w-20 h-1 mx-0.5 sm:mx-1 transition-colors ${
                              [
                                "location",
                                "category",
                                "productType",
                                "availability",
                              ].indexOf(step) > index
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Location Selection */}
              {step === "location" && (
                <motion.div
                  key="location"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {language === "en"
                          ? "Select Your Location"
                          : "Chagua Eneo Lako"}
                      </h3>
                      <p className="text-gray-600">
                        {language === "en"
                          ? "Choose your region, district, and ward to find products near you"
                          : "Chagua mkoa, wilaya, na kata yako kupata bidhaa karibu nawe"}
                      </p>
                    </div>
                  </div>

                  {/* Region Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === "en" ? "Region" : "Mkoa"}
                    </label>
                    <select
                      value={orderData.region}
                      onChange={(e) =>
                        handleLocationSelect("region", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-base"
                    >
                      <option value="">
                        {language === "en"
                          ? "-- Select Region --"
                          : "-- Chagua Mkoa --"}
                      </option>
                      {tanzaniaLocations.map((region) => (
                        <option key={region.name} value={region.name}>
                          {language === "en" ? region.name : region.nameSwahili}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District Selection */}
                  {orderData.region && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === "en" ? "District" : "Wilaya"}
                      </label>
                      <select
                        value={orderData.district}
                        onChange={(e) =>
                          handleLocationSelect("district", e.target.value)
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-base"
                      >
                        <option value="">
                          {language === "en"
                            ? "-- Select District --"
                            : "-- Chagua Wilaya --"}
                        </option>
                        {districts.map((district) => (
                          <option key={district.name} value={district.name}>
                            {language === "en"
                              ? district.name
                              : district.nameSwahili}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  )}

                  {/* Ward Selection */}
                  {orderData.district && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === "en" ? "Ward" : "Kata"}
                      </label>
                      <select
                        value={orderData.ward}
                        onChange={(e) =>
                          handleLocationSelect("ward", e.target.value)
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-base"
                      >
                        <option value="">
                          {language === "en"
                            ? "-- Select Ward --"
                            : "-- Chagua Kata --"}
                        </option>
                        {wards.map((ward) => (
                          <option key={ward.name} value={ward.name}>
                            {language === "en" ? ward.name : ward.nameSwahili}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  )}

                  {/* Selected Location Summary */}
                  {canProceedFromLocation && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-4"
                    >
                      <p className="text-sm text-green-800">
                        <strong>
                          {language === "en"
                            ? "Selected Location:"
                            : "Eneo Lililochaguliwa:"}
                        </strong>
                        <br />
                        {orderData.ward}, {orderData.district},{" "}
                        {orderData.region}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Category Selection */}
              {step === "category" && (
                <motion.div
                  key="category"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Package className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {language === "en"
                          ? "Choose Product Category"
                          : "Chagua Aina ya Bidhaa"}
                      </h3>
                      <p className="text-gray-600">
                        {language === "en"
                          ? "Select between fresh produce or livestock"
                          : "Chagua kati ya mazao safi au mifugo"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {productCategories.map((category) => (
                      <Card
                        key={category.id}
                        className={`p-6 cursor-pointer transition-all hover:shadow-lg border-2 ${
                          orderData.category === category.id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                        onClick={() =>
                          setOrderData({
                            ...orderData,
                            category: category.id,
                            productType: "",
                          })
                        }
                      >
                        <div className="text-center">
                          <div className="text-6xl mb-4">{category.icon}</div>
                          <h4 className="text-xl font-bold text-gray-800 mb-2">
                            {language === "en"
                              ? category.name
                              : category.nameSwahili}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {language === "en"
                              ? category.description
                              : category.descriptionSwahili}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Product Type Selection */}
              {step === "productType" && selectedCategory && (
                <motion.div
                  key="productType"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-4xl">{selectedCategory.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {language === "en"
                          ? `Select ${selectedCategory.name}`
                          : `Chagua ${selectedCategory.nameSwahili}`}
                      </h3>
                      <p className="text-gray-600">
                        {language === "en"
                          ? "Choose the specific product you want to purchase"
                          : "Chagua bidhaa mahsusi unayotaka kununua"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedCategory.types.map((type) => (
                      <Card
                        key={type.id}
                        className={`p-4 cursor-pointer transition-all hover:shadow-lg border-2 ${
                          orderData.productType === type.id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                        onClick={() =>
                          setOrderData({ ...orderData, productType: type.id })
                        }
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-2">{type.icon}</div>
                          <p className="font-semibold text-sm text-gray-800">
                            {language === "en" ? type.name : type.nameSwahili}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Availability View */}
              {step === "availability" && selectedProductType && (
                <motion.div
                  key="availability"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-4xl">{selectedProductType.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {language === "en"
                          ? `Available ${selectedProductType.name}`
                          : `${selectedProductType.nameSwahili} Zinazopatikana`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {orderData.ward}, {orderData.district},{" "}
                        {orderData.region}
                      </p>
                    </div>
                  </div>

                  {availableListings.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">
                        {language === "en"
                          ? "No products available in your area at the moment"
                          : "Hakuna bidhaa zinazopatikana katika eneo lako kwa sasa"}
                      </p>
                      <Button onClick={handleBack} variant="outline">
                        {language === "en"
                          ? "Try Another Product"
                          : "Jaribu Bidhaa Nyingine"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {availableListings.map((listing) => {
                        const qty = listingQuantities[listing.id] || 1;
                        const totalPrice = listing.pricePerUnit * qty;

                        return (
                          <Card
                            key={listing.id}
                            className={`p-3 sm:p-4 transition-all hover:shadow-lg border-2 ${
                              orderData.selectedListing?.id === listing.id
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-green-300"
                            }`}
                          >
                            <div className="space-y-3">
                              {/* Seller Info */}
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <h4 className="font-bold text-sm sm:text-base text-gray-800">
                                      {listing.farmerName}
                                    </h4>
                                    {listing.isVerified && (
                                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                                        {language === "en"
                                          ? "✓ Verified"
                                          : "✓ Imethibitishwa"}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 text-xs sm:text-sm">
                                    <div>
                                      <span className="text-gray-600">
                                        {language === "en"
                                          ? "Available: "
                                          : "Inapatikana: "}
                                      </span>
                                      <span className="font-semibold text-gray-800">
                                        {listing.quantity}{" "}
                                        {language === "en"
                                          ? listing.unit
                                          : selectedProductType.unitSwahili}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">
                                        {language === "en"
                                          ? "Quality: "
                                          : "Ubora: "}
                                      </span>
                                      <span className="font-semibold text-gray-800">
                                        {language === "en"
                                          ? listing.quality
                                          : listing.qualitySwahili}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-left sm:text-right">
                                  <div className="text-lg sm:text-xl font-bold text-green-600">
                                    {listing.pricePerUnit.toLocaleString()} TZS
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {language === "en" ? "per" : "kwa"}{" "}
                                    {language === "en"
                                      ? listing.unit
                                      : selectedProductType.unitSwahili}
                                  </div>
                                </div>
                              </div>

                              {/* Quantity Selector */}
                              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex-1">
                                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    {language === "en" ? "Quantity" : "Kiasi"}
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    max={listing.quantity}
                                    value={qty}
                                    onChange={(e) => {
                                      const newQty =
                                        parseInt(e.target.value) || 1;
                                      setListingQuantities({
                                        ...listingQuantities,
                                        [listing.id]: newQty,
                                      });
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-sm"
                                  />
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-gray-500 mb-1">
                                    {language === "en" ? "Total" : "Jumla"}
                                  </div>
                                  <div className="text-base sm:text-lg font-bold text-gray-800">
                                    {totalPrice.toLocaleString()} TZS
                                  </div>
                                </div>
                              </div>

                              {/* Select Button */}
                              <Button
                                onClick={() => {
                                  setOrderData({
                                    ...orderData,
                                    selectedListing: listing,
                                    quantity: qty,
                                  });
                                }}
                                className={`w-full text-sm ${
                                  orderData.selectedListing?.id === listing.id
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-gray-600 hover:bg-gray-700"
                                } text-white`}
                              >
                                {orderData.selectedListing?.id === listing.id
                                  ? language === "en"
                                    ? "✓ Selected"
                                    : "✓ Imechaguliwa"
                                  : language === "en"
                                    ? "Select this Seller"
                                    : "Chagua Muuzaji Huyu"}
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 5: Confirmation */}
              {step === "confirmation" && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    {language === "en"
                      ? "Order Placed Successfully!"
                      : "Oda Imepokelewa!"}
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto text-base">
                    {language === "en"
                      ? "Your order has been confirmed. Please complete your registration to finalize delivery details."
                      : "Oda yako imethibitishwa. Tafadhali kamilisha usajili wako kukamilisha maelezo ya usafirishaji."}
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto text-left mb-8">
                    <h4 className="font-bold text-gray-800 mb-3 text-base">
                      {language === "en" ? "Order Summary" : "Muhtasari wa Oda"}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === "en" ? "Product:" : "Bidhaa:"}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {language === "en"
                            ? selectedProductType?.name
                            : selectedProductType?.nameSwahili}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === "en" ? "Quantity:" : "Kiasi:"}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {orderData.quantity}{" "}
                          {language === "en"
                            ? selectedProductType?.unit
                            : selectedProductType?.unitSwahili}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === "en" ? "Farmer:" : "Mkulima:"}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {orderData.selectedListing?.farmerName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {language === "en" ? "Location:" : "Eneo:"}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {orderData.ward}
                        </span>
                      </div>
                      <div className="border-t border-green-300 mt-3 pt-3 flex justify-between">
                        <span className="text-gray-800 font-bold">
                          {language === "en" ? "Total:" : "Jumla:"}
                        </span>
                        <span className="font-bold text-green-600 text-lg">
                          {orderData.selectedListing &&
                            (
                              orderData.selectedListing.pricePerUnit *
                              orderData.quantity
                            ).toLocaleString()}{" "}
                          TZS
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => setStep("registration")}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white text-base"
                    >
                      {language === "en"
                        ? "Complete Registration"
                        : "Kamilisha Usajili"}
                    </Button>
                    <Button
                      onClick={onClose}
                      size="lg"
                      variant="outline"
                      className="text-base"
                    >
                      {language === "en" ? "Skip for Now" : "Ruka kwa Sasa"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Guest Registration */}
              {step === "registration" && (
                <motion.div
                  key="registration"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {language === "en"
                          ? "Complete Your Registration"
                          : "Kamilisha Usajili Wako"}
                      </h3>
                      <p className="text-gray-600 text-base">
                        {language === "en"
                          ? "Please provide your contact details to complete the order"
                          : "Tafadhali toa maelezo yako ya mawasiliano kukamilisha oda"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === "en" ? "Full Name" : "Jina Kamili"}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={guestData.fullName}
                        onChange={(e) =>
                          setGuestData({
                            ...guestData,
                            fullName: e.target.value,
                          })
                        }
                        placeholder={
                          language === "en"
                            ? "Enter your full name"
                            : "Weka jina lako kamili"
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-base"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === "en" ? "Phone Number" : "Namba ya Simu"}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={guestData.phoneNumber}
                        onChange={(e) =>
                          setGuestData({
                            ...guestData,
                            phoneNumber: e.target.value,
                          })
                        }
                        placeholder={
                          language === "en"
                            ? "+255 XXX XXX XXX"
                            : "+255 XXX XXX XXX"
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-base"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === "en"
                          ? "Email Address (Optional)"
                          : "Barua Pepe (Si Lazima)"}
                      </label>
                      <input
                        type="email"
                        value={guestData.email}
                        onChange={(e) =>
                          setGuestData({ ...guestData, email: e.target.value })
                        }
                        placeholder={
                          language === "en"
                            ? "your.email@example.com"
                            : "barua.pepe@mfano.com"
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-base"
                      />
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {language === "en"
                          ? "Delivery Address"
                          : "Anwani ya Usafirishaji"}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={guestData.deliveryAddress}
                        onChange={(e) =>
                          setGuestData({
                            ...guestData,
                            deliveryAddress: e.target.value,
                          })
                        }
                        placeholder={
                          language === "en"
                            ? "Enter your delivery address"
                            : "Weka anwani ya usafirishaji"
                        }
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-base resize-none"
                      />
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      {language === "en"
                        ? "🔒 Your information is secure and will only be used to process your order and arrange delivery."
                        : "🔒 Maelezo yako ni salama na yatatumika tu kusindika oda yako na kupanga usafirishaji."}
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => {
                        // In production, save guest data
                        console.log("Guest registration:", guestData);
                        setStep("success");
                      }}
                      disabled={
                        !guestData.fullName ||
                        !guestData.phoneNumber ||
                        !guestData.deliveryAddress
                      }
                      size="lg"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-base"
                    >
                      {language === "en" ? "Complete Order" : "Kamilisha Oda"}
                    </Button>
                    <Button
                      onClick={() => setStep("confirmation")}
                      size="lg"
                      variant="outline"
                      className="text-base"
                    >
                      {language === "en" ? "Back" : "Rudi"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 7: Success */}
              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-20 h-20 text-green-600" />
                    </div>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-bold text-gray-800 mb-4"
                  >
                    {language === "en" ? "🎉 Congratulations!" : "🎉 Hongera!"}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-700 mb-4 max-w-lg mx-auto"
                  >
                    {language === "en"
                      ? "Your order has been successfully placed!"
                      : "Oda yako imefanikiwa!"}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-base text-gray-600 mb-8 max-w-md mx-auto"
                  >
                    {language === "en"
                      ? "The seller will contact you soon to arrange delivery of your products. Thank you for choosing Shambani Investment!"
                      : "Muuzaji atawasiliana nawe hivi karibuni kupanga usafirishaji wa bidhaa zako. Asante kwa kuchagua Shambani Investment!"}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 max-w-lg mx-auto mb-8"
                  >
                    <h4 className="font-bold text-gray-800 mb-4 text-lg">
                      {language === "en"
                        ? "📦 Order Details"
                        : "📦 Maelezo ya Oda"}
                    </h4>
                    <div className="space-y-3 text-base text-left">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-gray-600">
                          {language === "en" ? "Customer:" : "Mteja:"}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {guestData.fullName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-gray-600">
                          {language === "en" ? "Product:" : "Bidhaa:"}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {language === "en"
                            ? selectedProductType?.name
                            : selectedProductType?.nameSwahili}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-gray-600">
                          {language === "en" ? "Quantity:" : "Kiasi:"}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {orderData.quantity}{" "}
                          {language === "en"
                            ? selectedProductType?.unit
                            : selectedProductType?.unitSwahili}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-gray-600">
                          {language === "en" ? "Seller:" : "Muuzaji:"}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {orderData.selectedListing?.farmerName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-gray-600">
                          {language === "en"
                            ? "Delivery To:"
                            : "Usafirishaji Kwenda:"}
                        </span>
                        <span className="font-semibold text-gray-800 text-right max-w-[60%]">
                          {guestData.deliveryAddress}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-800 font-bold text-lg">
                          {language === "en" ? "Total:" : "Jumla:"}
                        </span>
                        <span className="font-bold text-green-600 text-2xl">
                          {orderData.selectedListing &&
                            (
                              orderData.selectedListing.pricePerUnit *
                              orderData.quantity
                            ).toLocaleString()}{" "}
                          TZS
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto mb-8"
                  >
                    <p className="text-sm text-blue-800">
                      {language === "en"
                        ? "📞 The seller will call you at " +
                          guestData.phoneNumber +
                          " to confirm delivery details."
                        : "📞 Muuzaji atapigia simu " +
                          guestData.phoneNumber +
                          " kuthibitisha maelezo ya usafirishaji."}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button
                      onClick={onClose}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white text-base px-8"
                    >
                      {language === "en" ? "Done" : "Maliza"}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          {step !== "confirmation" &&
            step !== "registration" &&
            step !== "success" && (
              <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-t gap-2">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  disabled={step === "location"}
                  className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden xs:inline">
                    {language === "en" ? "Back" : "Rudi"}
                  </span>
                </Button>

                {step === "availability" && orderData.selectedListing ? (
                  <Button
                    onClick={handlePlaceOrder}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                  >
                    <span>
                      {language === "en" ? "Place Order" : "Weka Oda"}
                    </span>
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={
                      (step === "location" && !canProceedFromLocation) ||
                      (step === "category" && !canProceedFromCategory) ||
                      (step === "productType" && !canProceedFromProductType)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                  >
                    <span>{language === "en" ? "Next" : "Endelea"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
