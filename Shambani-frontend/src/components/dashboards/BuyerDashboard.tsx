import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress, Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { suppliersAPI, contractsAPI, notificationsAPI } from "@/utils/api";
import { 
  Calendar, Users, MapPin, Star, TrendingUp, Award, Bell, Search, Filter,
  Menu, X, Home, Briefcase, Settings, LogOut, ChevronRight, AlertCircle, CheckCircle,
  Phone, Mail, Globe, Truck, Wrench, User, FileText, Download, Upload, Eye,
  BarChart3, PieChart, Activity, Target, Zap, Shield, MessageSquare, Heart, Coffee,
  Package, ShoppingBag, Store, DollarSign, TrendingDown, ArrowUp, ArrowDown, MoreHorizontal,
  Plus, Minus, ShoppingCart, Scale, Award as AwardIcon, Globe2, Handshake,
  Factory, Warehouse, Truck as TruckIcon, Ship, Plane, Train, Clock, AlertTriangle,
  CheckCircle2, FileCheck, ClipboardList, Filter as FilterIcon
} from "lucide-react";
import type { User as UserType } from "@/utils/types";

interface BuyerAggregatorDashboardProps {
  user: UserType;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BuyerAggregatorDashboard({ user, activeTab, setActiveTab }: BuyerAggregatorDashboardProps) {
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    activeContracts: 0,
    totalPurchases: 0,
    pendingOrders: 0,
    totalSpent: 0,
    monthlyGrowth: 0,
    qualityScore: 0,
    sourcingRegions: 0
  });
  
  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load dashboard data from APIs
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load suppliers
      const suppliersResponse = await suppliersAPI.getSuppliers();
      if (suppliersResponse.success) {
        const suppliersData = suppliersResponse.data || [];
        setSuppliers(suppliersData);
        setStats(prev => ({ ...prev, totalSuppliers: suppliersData.length }));
      }

      // Load contracts
      const contractsResponse = await contractsAPI.getContracts();
      if (contractsResponse.success) {
        const contractsData = contractsResponse.data || [];
        setContracts(contractsData.slice(0, 5)); // Get recent 5 contracts
        
        const activeCount = contractsData.filter((c: any) => c.status === 'active').length;
        const pendingCount = contractsData.filter((c: any) => c.status === 'pending').length;
        const totalValue = contractsData.reduce((sum: number, c: any) => sum + (c.value || 0), 0);
        
        setStats(prev => ({
          ...prev,
          activeContracts: activeCount,
          totalPurchases: contractsData.length,
          pendingOrders: pendingCount,
          totalSpent: totalValue
        }));
      }

      // Load notifications
      const notificationsResponse = await notificationsAPI.getNotifications({ limit: 10 });
      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data || []);
      }

      // Load statistics
      const [suppliersStats, contractsStats] = await Promise.all([
        suppliersAPI.getStats(),
        contractsAPI.getStats()
      ]);

      if (suppliersStats.success) {
        const suppliersData = suppliersStats.data || {};
        setStats(prev => ({
          ...prev,
          qualityScore: suppliersData.averageQuality || 0,
          sourcingRegions: suppliersData.regions || 0
        }));
      }

      if (contractsStats.success) {
        const contractsData = contractsStats.data || {};
        setStats(prev => ({
          ...prev,
          monthlyGrowth: contractsData.monthlyGrowth || 0
        }));
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContractStatus = async (contractId: string, status: string, notes?: string) => {
    try {
      await contractsAPI.updateContractStatus(contractId, { status, notes });
      // Reload contracts after update
      loadDashboardData();
    } catch (error) {
      console.error('Failed to update contract status:', error);
    }
  };

  const rateSupplier = async (supplierId: string, rating: number, feedback?: string) => {
    try {
      await suppliersAPI.rateSupplier(supplierId, { rating, feedback });
      // Reload suppliers after rating
      loadDashboardData();
    } catch (error) {
      console.error('Failed to rate supplier:', error);
    }
  };

  const [contracts, setContracts] = useState([
    { id: 1, supplier: "Green Farms Ltd", product: "Maize", duration: "12 months", value: 2500000, status: "active", nextDelivery: "2024-03-25" },
    { id: 2, supplier: "AgroTech Solutions", product: "Rice", duration: "6 months", value: 1800000, status: "active", nextDelivery: "2024-03-28" },
    { id: 3, supplier: "Peter Masawe Farm", product: "Beans", duration: "3 months", value: 900000, status: "pending", nextDelivery: "2024-04-01" },
    { id: 4, supplier: "Sarah Mwanga Co", product: "Wheat", duration: "9 months", value: 2100000, status: "active", nextDelivery: "2024-03-30" }
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, count: null },
    { id: "purchases", label: "Purchases", icon: ShoppingCart, count: stats.pendingOrders },
    { id: "suppliers", label: "Suppliers", icon: Users, count: stats.totalSuppliers },
    { id: "contracts", label: "Contracts", icon: FileCheck, count: stats.activeContracts },
    { id: "quality", label: "Quality Control", icon: Quality, count: null },
    { id: "logistics", label: "Logistics", icon: TruckIcon, count: null },
    { id: "analytics", label: "Analytics", icon: BarChart3, count: null },
    { id: "messages", label: "Messages", icon: MessageSquare, count: 3 },
    { id: "settings", label: "Settings", icon: Settings, count: null }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "active": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "processing": return <Activity className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "active": return <CheckCircle2 className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order": return <ShoppingCart className="w-4 h-4 text-blue-500" />;
      case "quality": return <Quality className="w-4 h-4 text-green-500" />;
      case "contract": return <FileCheck className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "Grade A": return "bg-green-100 text-green-800";
      case "Grade B": return "bg-blue-100 text-blue-800";
      case "Grade C": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 95) return "bg-green-100 text-green-800";
    if (reliability >= 90) return "bg-blue-100 text-blue-800";
    if (reliability >= 85) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-pink-600 to-pink-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-6 border-b border-pink-700">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.profile?.avatar} alt={user.firstName} />
                <AvatarFallback className="bg-pink-100 text-pink-800 font-bold">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{user.firstName} {user.lastName}</h3>
                <p className="text-pink-200 text-sm">Buyer Aggregator</p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-pink-200 text-sm ml-1">4.9</span>
                  <Badge className="ml-2 bg-green-500 text-white text-xs">Premium</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-pink-700 text-white"
                    : "text-pink-100 hover:bg-pink-700 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count !== null && (
                  <Badge className="bg-white text-pink-800 text-xs">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-pink-700">
            <button className="w-full flex items-center space-x-3 p-3 text-pink-100 hover:bg-pink-700 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {sidebarItems.find(item => item.id === activeSection)?.label}
                </h1>
                <Badge className="bg-pink-100 text-pink-800">
                  {user.firstName} {user.lastName}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search suppliers, products..."
                    className="bg-transparent outline-none text-sm w-48"
                  />
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>
                </div>

                {/* User Avatar */}
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.profile?.avatar} alt={user.firstName} />
                  <AvatarFallback className="bg-pink-100 text-pink-800 font-bold">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {activeSection === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Suppliers</CardTitle>
                    <Users className="h-4 w-4 text-pink-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalSuppliers}</div>
                    <p className="text-xs text-gray-500">In network</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Contracts</CardTitle>
                    <FileCheck className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.activeContracts}</div>
                    <p className="text-xs text-gray-500">Currently active</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">TZS {stats.totalSpent.toLocaleString()}</div>
                    <p className="text-xs text-gray-500">Lifetime purchases</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Quality Score</CardTitle>
                    <Quality className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.qualityScore}</div>
                    <p className="text-xs text-gray-500">Average rating</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Purchases & Top Suppliers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Recent Purchases</span>
                      <Button variant="outline" size="sm">View All</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentPurchases.slice(0, 5).map((purchase) => (
                        <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{purchase.order}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Users className="w-3 h-3 text-gray-500" />
                              <span className="text-sm text-gray-600">{purchase.supplier}</span>
                              <Package className="w-3 h-3 text-gray-500 ml-2" />
                              <span className="text-sm text-gray-600">{purchase.product}</span>
                              <Scale className="w-3 h-3 text-gray-500 ml-2" />
                              <span className="text-sm text-gray-600">{purchase.quantity}</span>
                              <Calendar className="w-3 h-3 text-gray-500 ml-2" />
                              <span className="text-sm text-gray-600">{purchase.date}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                              {getStatusIcon(purchase.status)}
                              <span className="ml-1">{purchase.status}</span>
                            </div>
                            <div className="text-sm font-medium text-gray-900 mt-1">TZS {purchase.cost}</div>
                            {purchase.rating && (
                              <div className="flex items-center text-yellow-500 mt-1">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-xs ml-1">{purchase.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Suppliers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Top Suppliers</span>
                      <Button variant="outline" size="sm">Manage</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {suppliers.slice(0, 5).map((supplier, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{supplier.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="w-3 h-3 text-gray-500" />
                              <span className="text-sm text-gray-600">{supplier.region}</span>
                              <FileCheck className="w-3 h-3 text-gray-500 ml-2" />
                              <span className="text-sm text-gray-600">{supplier.contracts} contracts</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm ml-1">{supplier.rating}</span>
                            </div>
                            <Badge className={getQualityColor(supplier.quality)}>
                              {supplier.quality}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "purchases" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">All Purchases</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <FilterIcon className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Purchases Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPurchases.map((purchase) => (
                  <Card key={purchase.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                          {getStatusIcon(purchase.status)}
                          <span className="ml-1">{purchase.status}</span>
                        </div>
                        {purchase.rating && (
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm ml-1">{purchase.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{purchase.order}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="text-sm">{purchase.supplier}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Package className="w-4 h-4 mr-2" />
                          <span className="text-sm">{purchase.product}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Scale className="w-4 h-4 mr-2" />
                          <span className="text-sm">{purchase.quantity}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">{purchase.date}</span>
                        </div>
                        <div className="flex items-center text-green-600 font-medium">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>TZS {purchase.cost}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <Button variant="outline" size="sm">View Details</Button>
                        {purchase.status === "pending" && (
                          <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                            Approve
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === "suppliers" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Supplier Network</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <FilterIcon className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Supplier
                  </Button>
                </div>
              </div>

              {/* Suppliers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers.map((supplier, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm ml-1">{supplier.rating}</span>
                          </div>
                          <Badge className={getQualityColor(supplier.quality)}>
                            {supplier.quality}
                          </Badge>
                        </div>
                        <Users className="w-6 h-6 text-pink-600" />
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{supplier.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">{supplier.region}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FileCheck className="w-4 h-4 mr-2" />
                          <span className="text-sm">{supplier.contracts} active contracts</span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-600">Reliability</span>
                              <span className="text-sm font-medium">{supplier.reliability}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full ${getReliabilityColor(supplier.reliability)}`} style={{ width: `${supplier.reliability}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <Button variant="outline" size="sm">View Profile</Button>
                        <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                          New Contract
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Export as BuyerDashboard to match import in ShambaniDashboard
export const BuyerDashboard = BuyerAggregatorDashboard;
