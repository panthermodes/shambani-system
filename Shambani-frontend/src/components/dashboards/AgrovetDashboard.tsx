import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress, Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { productsAPI, ordersAPI, notificationsAPI } from "@/utils/api";
import { 
  Calendar, Users, MapPin, Star, TrendingUp, Award, Bell, Search, Filter,
  Menu, X, Home, Briefcase, Settings, LogOut, ChevronRight, AlertCircle, CheckCircle,
  Phone, Mail, Globe, Truck, Wrench, User, FileText, Download, Upload, Eye,
  BarChart3, PieChart, Activity, Target, Zap, Shield, MessageSquare, Heart, Coffee,
  Package, ShoppingBag, Store, DollarSign, Pill, Beaker, Stethoscope, Clock, AlertTriangle,
  TrendingDown, ArrowUp, ArrowDown, MoreHorizontal, Plus, Minus, ShoppingCart
} from "lucide-react";
import type { User as UserType } from "@/utils/types";

interface AgrovetDashboardProps {
  user: UserType;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AgrovetDashboard({ user, activeTab, setActiveTab }: AgrovetDashboardProps) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    activeCustomers: 0,
    categories: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load products
      const productsResponse = await productsAPI.getProducts();
      if (productsResponse.success) {
        const products = productsResponse.data || [];
        setInventory(products);
        const lowStockCount = products.filter((p: any) => p.stock <= p.lowStockThreshold).length;
        
        setStats(prev => ({
          ...prev,
          totalProducts: products.length,
          lowStock: lowStockCount
        }));
      }

      // Load orders
      const ordersResponse = await ordersAPI.getOrders();
      if (ordersResponse.success) {
        const orders = ordersResponse.data || [];
        setRecentOrders(orders.slice(0, 5)); // Get recent 5 orders
        
        const pendingCount = orders.filter((o: any) => o.status === 'pending').length;
        const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
        
        setStats(prev => ({
          ...prev,
          totalOrders: orders.length,
          pendingOrders: pendingCount,
          totalRevenue
        }));
      }

      // Load notifications
      const notificationsResponse = await notificationsAPI.getNotifications({ limit: 10 });
      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data || []);
      }

      // Load product statistics
      const statsResponse = await productsAPI.getStats();
      if (statsResponse.success) {
        const statsData = statsResponse.data || {};
        setStats(prev => ({
          ...prev,
          averageRating: statsData.averageRating || 0,
          activeCustomers: statsData.activeCustomers || 0,
          categories: statsData.categories || 0
        }));
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, notes?: string) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, { status, notes });
      // Reload orders after update
      loadDashboardData();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const updateProductStock = async (productId: string, quantity: number, operation: 'add' | 'subtract') => {
    try {
      await productsAPI.updateStock(productId, { quantity, operation });
      // Reload products after update
      loadDashboardData();
    } catch (error) {
      console.error('Failed to update product stock:', error);
    }
  };

  const [services, setServices] = useState([
    { name: "Veterinary Consultation", price: 15000, bookings: 23, rating: 4.8 },
    { name: "Crop Disease Diagnosis", price: 12000, bookings: 18, rating: 4.9 },
    { name: "Soil Testing", price: 8000, bookings: 15, rating: 4.7 },
    { name: "Pest Control Service", price: 20000, bookings: 12, rating: 5.0 }
  ]);

  // Remove duplicate sidebar state - handled by ShambaniDashboard.tsx
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, count: null },
    { id: "orders", label: "Orders", icon: ShoppingCart, count: stats.pendingOrders },
    { id: "products", label: "Products", icon: Package, count: stats.lowStock },
    { id: "services", label: "Services", icon: Stethoscope, count: 4 },
    { id: "customers", label: "Customers", icon: Users, count: stats.activeCustomers },
    { id: "inventory", label: "Inventory", icon: Store, count: null },
    { id: "revenue", label: "Revenue", icon: DollarSign, count: null },
    { id: "messages", label: "Messages", icon: MessageSquare, count: 3 },
    { id: "settings", label: "Settings", icon: Settings, count: null }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-red-100 text-red-800";
      case "normal": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "processing": return <Activity className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "low": return <AlertTriangle className="w-4 h-4" />;
      case "normal": return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "stock": return <Package className="w-4 h-4 text-red-500" />;
      case "order": return <ShoppingCart className="w-4 h-4 text-blue-500" />;
      case "consultation": return <Stethoscope className="w-4 h-4 text-green-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Fertilizers": return <Flask className="w-4 h-4 text-purple-500" />;
      case "Pesticides": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "Supplements": return <Pill className="w-4 h-4 text-blue-500" />;
      case "Feed": return <ShoppingBag className="w-4 h-4 text-green-500" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
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
      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-teal-600 to-teal-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-6 border-b border-teal-700">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.profile?.avatar} alt={user.firstName} />
                <AvatarFallback className="bg-teal-100 text-teal-800 font-bold">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{user.firstName} {user.lastName}</h3>
                <p className="text-teal-200 text-sm">Agrovet Owner</p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-teal-200 text-sm ml-1">4.8</span>
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
                    ? "bg-teal-700 text-white"
                    : "text-teal-100 hover:bg-teal-700 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count !== null && (
                  <Badge className="bg-white text-teal-800 text-xs">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-teal-700">
            <button className="w-full flex items-center space-x-3 p-3 text-teal-100 hover:bg-teal-700 rounded-lg transition-colors">
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
                <Badge className="bg-teal-100 text-teal-800">
                  {user.firstName} {user.lastName}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search products, orders..."
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
                  <AvatarImage src={user.avatar || ''} alt={user.firstName} />
                  <AvatarFallback className="bg-teal-100 text-teal-800 font-bold">
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
                    <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-teal-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalProducts}</div>
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

              {/* Recent Orders & Products */}
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
                              <Package className="w-3 h-3 text-gray-500 ml-2" />
                              <span className="text-sm text-gray-600">{order.items} items</span>
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

                {/* Products Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Products Status</span>
                      <Button variant="outline" size="sm">Manage</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {products.slice(0, 5).map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              {getCategoryIcon(product.category)}
                              <span className="text-sm text-gray-600">{product.category}</span>
                              <span className="text-sm text-gray-600 ml-2">TZS {product.price}/{product.unit}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                              {getStatusIcon(product.status)}
                              <span className="ml-1">{product.stock} {product.unit}</span>
                            </div>
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
                          <Package className="w-4 h-4 mr-2" />
                          <span className="text-sm">{order.items} items</span>
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
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
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

          {activeSection === "products" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Product Inventory</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventory.map((product: any, index: number) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(product.category)}
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                            {getStatusIcon(product.status)}
                            <span className="ml-1">{product.status}</span>
                          </div>
                        </div>
                        <Package className="w-6 h-6 text-teal-600" />
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Badge className="bg-blue-100 text-blue-800 text-xs mr-2">{product.category}</Badge>
                          <span className="text-sm">{product.stock} {product.unit}</span>
                        </div>
                        <div className="flex items-center text-green-600 font-medium">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>TZS {product.price}/{product.unit}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <Button variant="outline" size="sm">View Details</Button>
                        {product.status === "low" && (
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Restock
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
