import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress, Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { equipmentAPI, notificationsAPI } from "@/utils/api";
import { 
  Calendar, Users, MapPin, Star, TrendingUp, Award, Bell, Search, Filter,
  Menu, X, Home, Briefcase, Settings, LogOut, ChevronRight, AlertCircle, CheckCircle,
  Phone, Mail, Globe, Truck, Wrench, User, FileText, Download, Upload, Eye,
  BarChart3, PieChart, Activity, Target, Zap, Shield, MessageSquare, Heart, Coffee,
  Package, ShoppingBag, Store, DollarSign, Wrench as WrenchIcon, Settings as SettingsIcon,
  TrendingDown, ArrowUp, ArrowDown, MoreHorizontal, Plus, Minus, ShoppingCart, Hammer,
  Cog, Gauge, Zap as ZapIcon, Battery, Clock, AlertTriangle, Wrench as ToolIcon, Construction as BuildIcon, Droplet
} from "lucide-react";
import type { User as UserType } from "@/utils/types";

interface MachineryDealerDashboardProps {
  user: UserType;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function MachineryDealerDashboard({ user, activeTab, setActiveTab }: MachineryDealerDashboardProps) {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    availableEquipment: 0,
    rentalEquipment: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeClients: 0,
    serviceRequests: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load dashboard data from APIs
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load equipment
      const equipmentResponse = await equipmentAPI.getEquipment();
      if (equipmentResponse.success) {
        const equipmentData = equipmentResponse.data || [];
        setEquipment(equipmentData);
        
        const available = equipmentData.filter((e: any) => e.status === 'available').length;
        const rented = equipmentData.filter((e: any) => e.status === 'rented').length;
        const maintenance = equipmentData.filter((e: any) => e.status === 'maintenance').length;
        
        setStats(prev => ({
          ...prev,
          totalEquipment: equipmentData.length,
          availableEquipment: available,
          rentalEquipment: rented
        }));
      }

      // Load rentals
      const rentalsResponse = await equipmentAPI.getRentals();
      if (rentalsResponse.success) {
        const rentals = rentalsResponse.data || [];
        setRecentOrders(rentals.slice(0, 5)); // Get recent 5 rentals
        
        const pendingCount = rentals.filter((r: any) => r.status === 'pending').length;
        const totalRevenue = rentals.reduce((sum: number, r: any) => sum + (r.revenue || 0), 0);
        
        setStats(prev => ({
          ...prev,
          totalOrders: rentals.length,
          pendingOrders: pendingCount,
          totalRevenue
        }));
      }

      // Load notifications
      const notificationsResponse = await notificationsAPI.getNotifications({ limit: 10 });
      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data || []);
      }

      // Load equipment statistics
      const statsResponse = await equipmentAPI.getStats();
      if (statsResponse.success) {
        const statsData = statsResponse.data || {};
        setStats(prev => ({
          ...prev,
          monthlyGrowth: statsData.monthlyGrowth || 0,
          activeClients: statsData.activeClients || 0,
          serviceRequests: statsData.serviceRequests || 0
        }));
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRentalStatus = async (rentalId: string, status: string, notes?: string) => {
    try {
      await equipmentAPI.updateRentalStatus(rentalId, { status, notes });
      // Reload rentals after update
      loadDashboardData();
    } catch (error) {
      console.error('Failed to update rental status:', error);
    }
  };

  const updateEquipmentStatus = async (equipmentId: string, status: string, notes?: string) => {
    try {
      await equipmentAPI.updateEquipmentStatus(equipmentId, { status, notes });
      // Reload equipment after update
      loadDashboardData();
    } catch (error) {
      console.error('Failed to update equipment status:', error);
    }
  };

  const [services, setServices] = useState([
    { name: "Equipment Maintenance", price: 15000, requests: 23, rating: 4.8 },
    { name: "Installation Service", price: 25000, requests: 18, rating: 4.9 },
    { name: "Operator Training", price: 20000, requests: 15, rating: 4.7 },
    { name: "Emergency Repair", price: 30000, requests: 12, rating: 5.0 }
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, count: null },
    { id: "orders", label: "Orders", icon: ShoppingCart, count: stats.pendingOrders },
    { id: "equipment", label: "Equipment", icon: WrenchIcon, count: stats.availableEquipment },
    { id: "rentals", label: "Rentals", icon: Clock, count: stats.rentalEquipment },
    { id: "services", label: "Services", icon: Tool, count: stats.serviceRequests },
    { id: "clients", label: "Clients", icon: Users, count: stats.activeClients },
    { id: "revenue", label: "Revenue", icon: DollarSign, count: null },
    { id: "messages", label: "Messages", icon: MessageSquare, count: 3 },
    { id: "settings", label: "Settings", icon: Settings, count: null }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "available": return "bg-green-100 text-green-800";
      case "rented": return "bg-blue-100 text-blue-800";
      case "maintenance": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "processing": return <Activity className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "available": return <CheckCircle className="w-4 h-4" />;
      case "rented": return <Clock className="w-4 h-4" />;
      case "maintenance": return <ToolIcon className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "equipment": return <WrenchIcon className="w-4 h-4 text-blue-500" />;
      case "maintenance": return <ToolIcon className="w-4 h-4 text-orange-500" />;
      case "order": return <ShoppingCart className="w-4 h-4 text-green-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Tractors": return <Truck className="w-4 h-4 text-purple-500" />;
      case "Harvesters": return <Package className="w-4 h-4 text-red-500" />;
      case "Irrigation": return <Droplet className="w-4 h-4 text-blue-500" />;
      case "Plows": return <Tool className="w-4 h-4 text-green-500" />;
      case "Seeders": return <Package className="w-4 h-4 text-yellow-500" />;
      default: return <WrenchIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Excellent": return "bg-green-100 text-green-800";
      case "Good": return "bg-blue-100 text-blue-800";
      case "Fair": return "bg-yellow-100 text-yellow-800";
      case "Poor": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-6 border-b border-indigo-700">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.profile?.avatar} alt={user.firstName} />
                <AvatarFallback className="bg-indigo-100 text-indigo-800 font-bold">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{user.firstName} {user.lastName}</h3>
                <p className="text-indigo-200 text-sm">Machinery Dealer</p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-indigo-200 text-sm ml-1">4.9</span>
                  <Badge className="ml-2 bg-green-500 text-white text-xs">Verified</Badge>
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
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-700 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count !== null && (
                  <Badge className="bg-white text-indigo-800 text-xs">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-indigo-700">
            <button className="w-full flex items-center space-x-3 p-3 text-indigo-100 hover:bg-indigo-700 rounded-lg transition-colors">
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
                <Badge className="bg-indigo-100 text-indigo-800">
                  {user.firstName} {user.lastName}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search equipment, orders..."
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
                  <AvatarFallback className="bg-indigo-100 text-indigo-800 font-bold">
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
                    <CardTitle className="text-sm font-medium text-gray-600">Total Equipment</CardTitle>
                    <WrenchIcon className="h-4 w-4 text-indigo-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalEquipment}</div>
                    <p className="text-xs text-gray-500">In inventory</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
                    <p className="text-xs text-gray-500">All time</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">TZS {stats.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-gray-500">Lifetime earnings</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Growth Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.monthlyGrowth}%</div>
                    <p className="text-xs text-gray-500">Monthly growth</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders & Equipment */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Recent Orders</span>
                      <Button variant="outline" size="sm">View All</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{order.order}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Users className="w-3 h-3 text-gray-500" />
                              <span className="text-sm text-gray-600">{order.customer}</span>
                              <WrenchIcon className="w-3 h-3 text-gray-500 ml-2" />
                              <span className="text-sm text-gray-600">{order.equipment}</span>
                              <Calendar className="w-3 h-3 text-gray-500 ml-2" />
                              <span className="text-sm text-gray-600">{order.date}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{order.status}</span>
                            </div>
                            <div className="text-sm font-medium text-gray-900 mt-1">TZS {order.revenue}</div>
                            {order.rating && (
                              <div className="flex items-center text-yellow-500 mt-1">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-xs ml-1">{order.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Equipment Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Equipment Status</span>
                      <Button variant="outline" size="sm">Manage</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {equipment.slice(0, 5).map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              {getCategoryIcon(item.category)}
                              <span className="text-sm text-gray-600">{item.category}</span>
                              <span className="text-sm text-gray-600 ml-2">TZS {item.price}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {getStatusIcon(item.status)}
                              <span className="ml-1">{item.status}</span>
                            </div>
                            <Badge className={getConditionColor(item.condition)}>
                              {item.condition}
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

          {activeSection === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">All Orders</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Orders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </div>
                        {order.rating && (
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm ml-1">{order.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{order.order}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="text-sm">{order.customer}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <WrenchIcon className="w-4 h-4 mr-2" />
                          <span className="text-sm">{order.equipment}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">{order.date}</span>
                        </div>
                        <div className="flex items-center text-green-600 font-medium">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>TZS {order.revenue}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <Button variant="outline" size="sm">View Details</Button>
                        {order.status === "pending" && (
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                            Process Order
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === "equipment" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Equipment Inventory</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Equipment
                  </Button>
                </div>
              </div>

              {/* Equipment Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipment.map((item, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(item.category)}
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            <span className="ml-1">{item.status}</span>
                          </div>
                        </div>
                        <WrenchIcon className="w-6 h-6 text-indigo-600" />
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Badge className="bg-blue-100 text-blue-800 text-xs mr-2">{item.category}</Badge>
                          <Badge className={getConditionColor(item.condition)}>
                            {item.condition}
                          </Badge>
                        </div>
                        <div className="flex items-center text-green-600 font-medium">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>TZS {item.price}</span>
                        </div>
                        <div className="flex items-center text-blue-600 text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Rental: TZS {item.rentalRate}/day</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <Button variant="outline" size="sm">View Details</Button>
                        {item.status === "available" && (
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                            Rent Now
                          </Button>
                        )}
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
