import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress, Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { logisticsAPI, notificationsAPI } from "@/utils/api";
import { 
  Calendar, Users, MapPin, Star, TrendingUp, Award, Bell, Search, Filter,
  Menu, X, Home, Briefcase, Settings, LogOut, ChevronRight, AlertCircle, CheckCircle,
  Phone, Mail, Globe, Truck, Wrench, User, FileText, Download, Upload, Eye,
  BarChart3, PieChart, Activity, Target, Zap, Shield, MessageSquare, Heart, Coffee,
  Package, Navigation, Fuel, Gauge, Clock, DollarSign, Route, Warehouse, Cargo, Plus
} from "lucide-react";
import type { User as UserType } from "@/utils/types";

interface LogisticsDashboardProps {
  user: UserType;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function LogisticsDashboard({ user, activeTab, setActiveTab }: LogisticsDashboardProps) {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completedDeliveries: 0,
    pendingDeliveries: 0,
    activeRoutes: 0,
    totalRevenue: 0,
    averageDeliveryTime: 0,
    fleetSize: 0,
    serviceArea: 0
  });
  
  const [recentDeliveries, setRecentDeliveries] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [routes, setRoutes] = useState([
    { id: 1, name: "Northern Route", distance: "450 km", stops: 5, active: true, revenue: 12500 },
    { id: 2, name: "Southern Route", distance: "320 km", stops: 3, active: true, revenue: 8900 },
    { id: 3, name: "Western Route", distance: "280 km", stops: 4, active: false, revenue: 6700 },
    { id: 4, name: "Eastern Route", distance: "380 km", stops: 6, active: true, revenue: 11200 }
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  // Load dashboard data from APIs
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load deliveries
      const deliveriesResponse = await logisticsAPI.getDeliveries();
      if (deliveriesResponse.success) {
        const deliveries = deliveriesResponse.data || [];
        setRecentDeliveries(deliveries);
        
        // Calculate delivery stats
        const completed = deliveries.filter((d: any) => d.status === 'completed').length;
        const pending = deliveries.filter((d: any) => d.status === 'pending').length;
        const inTransit = deliveries.filter((d: any) => d.status === 'in-transit').length;
        const totalRevenue = deliveries.reduce((sum: number, d: any) => sum + (d.revenue || 0), 0);
        
        setStats(prev => ({
          ...prev,
          totalDeliveries: deliveries.length,
          completedDeliveries: completed,
          pendingDeliveries: pending,
          activeRoutes: inTransit,
          totalRevenue
        }));
      }

      // Load fleet vehicles
      const fleetResponse = await logisticsAPI.getFleet();
      if (fleetResponse.success) {
        const fleet = fleetResponse.data || [];
        setVehicles(fleet);
        setStats(prev => ({ ...prev, fleetSize: fleet.length }));
      }

      // Load notifications
      const notificationsResponse = await notificationsAPI.getNotifications({ limit: 10 });
      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data || []);
      }

      // Load logistics statistics
      const statsResponse = await logisticsAPI.getStats();
      if (statsResponse.success) {
        const statsData = statsResponse.data || {};
        setStats(prev => ({
          ...prev,
          averageDeliveryTime: statsData.averageDeliveryTime || 0,
          serviceArea: statsData.serviceArea || 0
        }));
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (deliveryId: string, status: string, notes?: string, location?: any) => {
    try {
      await logisticsAPI.updateDeliveryStatus(deliveryId, { status, notes, location });
      // Reload deliveries after update
      loadDashboardData();
    } catch (error) {
      console.error('Failed to update delivery status:', error);
    }
  };

  const updateVehicleStatus = async (vehicleId: string, status: string, location?: any, fuelLevel?: number) => {
    try {
      await logisticsAPI.updateVehicleStatus(vehicleId, { status, location, fuelLevel });
      // Reload fleet after update
      loadDashboardData();
    } catch (error) {
      console.error('Failed to update vehicle status:', error);
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, count: null },
    { id: "deliveries", label: "Deliveries", icon: Package, count: stats.pendingDeliveries },
    { id: "fleet", label: "Fleet Management", icon: Truck, count: stats.fleetSize },
    { id: "routes", label: "Routes", icon: Route, count: stats.activeRoutes },
    { id: "clients", label: "Clients", icon: Users, count: 45 },
    { id: "revenue", label: "Revenue", icon: DollarSign, count: null },
    { id: "messages", label: "Messages", icon: MessageSquare, count: 3 },
    { id: "settings", label: "Settings", icon: Settings, count: null }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-transit": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-purple-100 text-purple-800";
      case "active": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in-transit": return <Navigation className="w-4 h-4" />;
      case "scheduled": return <Calendar className="w-4 h-4" />;
      case "active": return <Activity className="w-4 h-4" />;
      case "maintenance": return <Wrench className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "delivery": return <Package className="w-4 h-4 text-blue-500" />;
      case "route": return <Route className="w-4 h-4 text-green-500" />;
      case "payment": return <DollarSign className="w-4 h-4 text-yellow-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getFuelColor = (fuel: number) => {
    if (fuel >= 70) return "bg-green-500";
    if (fuel >= 30) return "bg-yellow-500";
    return "bg-red-500";
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
      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-600 to-blue-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-6 border-b border-blue-700">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.profile?.avatar} alt={user.firstName} />
                <AvatarFallback className="bg-blue-100 text-blue-800 font-bold">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{user.firstName} {user.lastName}</h3>
                <p className="text-blue-200 text-sm">Logistics Provider</p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-blue-200 text-sm ml-1">4.7</span>
                  <Badge className="ml-2 bg-green-500 text-white text-xs">Active</Badge>
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
                    ? "bg-blue-700 text-white"
                    : "text-blue-100 hover:bg-blue-700 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count !== null && (
                  <Badge className="bg-white text-blue-800 text-xs">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-blue-700">
            <button className="w-full flex items-center space-x-3 p-3 text-blue-100 hover:bg-blue-700 rounded-lg transition-colors">
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
                <Badge className="bg-blue-100 text-blue-800">
                  {user.firstName} {user.lastName}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search deliveries, clients..."
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
                  <AvatarFallback className="bg-blue-100 text-blue-800 font-bold">
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
                    <CardTitle className="text-sm font-medium text-gray-600">Total Deliveries</CardTitle>
                    <Package className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</div>
                    <p className="text-xs text-gray-500">All time</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.completedDeliveries}</div>
                    <p className="text-xs text-gray-500">Successfully delivered</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">TZS {stats.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-gray-500">Lifetime earnings</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Fleet Size</CardTitle>
                    <Truck className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.fleetSize}</div>
                    <p className="text-xs text-gray-500">Total vehicles</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Deliveries & Fleet Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Recent Deliveries</span>
                      <Button variant="outline" size="sm">View All</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentDeliveries.slice(0, 5).map((delivery) => (
                        <div key={delivery.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{delivery.order}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Users className="w-3 h-3 text-gray-500" />
                              <span className="text-sm text-gray-600">{delivery.client}</span>
                              <MapPin className="w-3 h-3 text-gray-500 ml-2" />
                              <span className="text-sm text-gray-600">{delivery.destination}</span>
                              <Calendar className="w-3 h-3 text-gray-500 ml-2" />
                              <span className="text-sm text-gray-600">{delivery.date}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                              {getStatusIcon(delivery.status)}
                              <span className="ml-1">{delivery.status.replace('-', ' ')}</span>
                            </div>
                            <div className="text-sm font-medium text-gray-900 mt-1">TZS {delivery.revenue}</div>
                            {delivery.rating && (
                              <div className="flex items-center text-yellow-500 mt-1">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-xs ml-1">{delivery.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Fleet Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Fleet Status</span>
                      <Button variant="outline" size="sm">Manage Fleet</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {vehicles.slice(0, 4).map((vehicle) => (
                        <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{vehicle.type}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className="bg-blue-100 text-blue-800 text-xs">{vehicle.plate}</Badge>
                              <span className="text-sm text-gray-600">{vehicle.capacity}</span>
                              <MapPin className="w-3 h-3 text-gray-500 ml-2" />
                              <span className="text-sm text-gray-600">{vehicle.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                              {getStatusIcon(vehicle.status)}
                              <span className="ml-1">{vehicle.status}</span>
                            </div>
                            <div className="flex items-center">
                              <Fuel className="w-4 h-4 text-gray-500 mr-1" />
                              <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full ${getFuelColor(vehicle.fuel)}`} style={{ width: `${vehicle.fuel}%` }} />
                              </div>
                              <span className="text-xs text-gray-600 ml-1">{vehicle.fuel}%</span>
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

          {activeSection === "deliveries" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">All Deliveries</h2>
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

              {/* Deliveries Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentDeliveries.map((delivery) => (
                  <Card key={delivery.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                          {getStatusIcon(delivery.status)}
                          <span className="ml-1">{delivery.status.replace('-', ' ')}</span>
                        </div>
                        {delivery.rating && (
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm ml-1">{delivery.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{delivery.order}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="text-sm">{delivery.client}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">{delivery.destination}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">{delivery.date}</span>
                        </div>
                        <div className="flex items-center text-green-600 font-medium">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>TZS {delivery.revenue}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <Button variant="outline" size="sm">View Details</Button>
                        {delivery.status === "scheduled" && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Start Delivery
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === "fleet" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Fleet Management</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vehicle
                  </Button>
                </div>
              </div>

              {/* Fleet Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                          {getStatusIcon(vehicle.status)}
                          <span className="ml-1">{vehicle.status}</span>
                        </div>
                        <Truck className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{vehicle.type}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Badge className="bg-blue-100 text-blue-800 text-xs mr-2">{vehicle.plate}</Badge>
                          <span className="text-sm">{vehicle.capacity}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">{vehicle.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Fuel className="w-4 h-4 text-gray-500 mr-2" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-600">Fuel Level</span>
                              <span className="text-sm font-medium">{vehicle.fuel}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full ${getFuelColor(vehicle.fuel)}`} style={{ width: `${vehicle.fuel}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <Button variant="outline" size="sm">View Details</Button>
                        {vehicle.status === "maintenance" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Mark Active
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
