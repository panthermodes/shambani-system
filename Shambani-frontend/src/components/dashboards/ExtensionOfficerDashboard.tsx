import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress, Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { servicesAPI, usersAPI, notificationsAPI } from "@/utils/api";
import { 
  Calendar, Users, MapPin, Star, TrendingUp, Award, Bell, Search, Filter,
  Menu, X, Home, Briefcase, Settings, LogOut, ChevronRight, AlertCircle, CheckCircle,
  Phone, Mail, Globe, Truck, Wrench, User, FileText, Download, Upload, Eye,
  BarChart3, PieChart, Activity, Target, Zap, Shield, MessageSquare, Heart, Coffee,
  Stethoscope, BookOpen, Clipboard, Clock, DollarSign, AlertTriangle, UserCheck
} from "lucide-react";
import type { User as UserType } from "@/utils/types";

interface ExtensionOfficerDashboardProps {
  user: UserType;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ExtensionOfficerDashboard({ user, activeTab, setActiveTab }: ExtensionOfficerDashboardProps) {
  const [stats, setStats] = useState({
    totalFarmers: 0,
    activeConsultations: 0,
    completedServices: 0,
    pendingRequests: 0,
    averageRating: 0,
    responseTime: 0,
    serviceArea: 0,
    certifications: 0
  });
  
  const [recentServices, setRecentServices] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [expertise, setExpertise] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  // Load dashboard data from APIs
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load assigned services
      const servicesResponse = await servicesAPI.getAssigned();
      if (servicesResponse.success) {
        setRecentServices(servicesResponse.data || []);
      }

      // Load notifications
      const notificationsResponse = await notificationsAPI.getNotifications({ limit: 10 });
      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data || []);
      }

      // Load user statistics
      const statsResponse = await servicesAPI.getStats();
      if (statsResponse.success) {
        setStats({
          totalFarmers: statsResponse.data.totalFarmers || 0,
          activeConsultations: statsResponse.data.activeConsultations || 0,
          completedServices: statsResponse.data.completedServices || 0,
          pendingRequests: statsResponse.data.pendingRequests || 0,
          averageRating: statsResponse.data.averageRating || 0,
          responseTime: statsResponse.data.responseTime || 0,
          serviceArea: statsResponse.data.serviceArea || 0,
          certifications: statsResponse.data.certifications || 0
        });
      }

      // Load expertise data (could be from user profile or separate API)
      setExpertise([
        { area: "Crop Management", services: statsResponse.data.cropManagementServices || 0, rating: statsResponse.data.cropManagementRating || 0, experience: "8 years" },
        { area: "Livestock Health", services: statsResponse.data.livestockHealthServices || 0, rating: statsResponse.data.livestockHealthRating || 0, experience: "6 years" },
        { area: "Soil Analysis", services: statsResponse.data.soilAnalysisServices || 0, rating: statsResponse.data.soilAnalysisRating || 0, experience: "5 years" },
        { area: "Pest Management", services: statsResponse.data.pestManagementServices || 0, rating: statsResponse.data.pestManagementRating || 0, experience: "7 years" }
      ]);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateServiceStatus = async (serviceId: string, status: string, notes?: string) => {
    try {
      await servicesAPI.updateStatus(serviceId, { status, notes });
      // Reload services after update
      loadDashboardData();
    } catch (error) {
      console.error('Failed to update service status:', error);
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, count: null },
    { id: "services", label: "My Services", icon: Briefcase, count: stats.pendingRequests },
    { id: "farmers", label: "Farmers Network", icon: Users, count: stats.totalFarmers },
    { id: "schedule", label: "Schedule", icon: Calendar, count: 5 },
    { id: "expertise", label: "Expertise", icon: Award, count: stats.certifications },
    { id: "reports", label: "Reports", icon: FileText, count: null },
    { id: "messages", label: "Messages", icon: MessageSquare, count: 3 },
    { id: "settings", label: "Settings", icon: Settings, count: null }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in-progress": return <Activity className="w-4 h-4" />;
      case "scheduled": return <Calendar className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "service": return <Briefcase className="w-4 h-4 text-blue-500" />;
      case "appointment": return <Calendar className="w-4 h-4 text-purple-500" />;
      case "review": return <Star className="w-4 h-4 text-yellow-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
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
      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-purple-600 to-purple-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-6 border-b border-purple-700">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.profile?.avatar} alt={user.firstName} />
                <AvatarFallback className="bg-purple-100 text-purple-800 font-bold">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{user.firstName} {user.lastName}</h3>
                <p className="text-purple-200 text-sm">Extension Officer</p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-purple-200 text-sm ml-1">{stats.averageRating}</span>
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
                    ? "bg-purple-700 text-white"
                    : "text-purple-100 hover:bg-purple-700 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count !== null && (
                  <Badge className="bg-white text-purple-800 text-xs">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-purple-700">
            <button className="w-full flex items-center space-x-3 p-3 text-purple-100 hover:bg-purple-700 rounded-lg transition-colors">
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
                <Badge className="bg-purple-100 text-purple-800">
                  {user.firstName} {user.lastName}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search farmers, services..."
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
                  <AvatarFallback className="bg-purple-100 text-purple-800 font-bold">
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
                    <CardTitle className="text-sm font-medium text-gray-600">Total Farmers</CardTitle>
                    <Users className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalFarmers}</div>
                    <p className="text-xs text-gray-500">In your network</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Services</CardTitle>
                    <Activity className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.activeConsultations}</div>
                    <p className="text-xs text-gray-500">Currently ongoing</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.completedServices}</div>
                    <p className="text-xs text-gray-500">Successfully delivered</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Avg Rating</CardTitle>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.averageRating}</div>
                    <p className="text-xs text-gray-500">From farmers</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Services */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Recent Services</span>
                      <Button variant="outline" size="sm">View All</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentServices.slice(0, 5).map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{service.service}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Users className="w-3 h-3 text-gray-500" />
                              <span className="text-sm text-gray-600">{service.farmer}</span>
                              <MapPin className="w-3 h-3 text-gray-500 ml-2" />
                              <span className="text-sm text-gray-600">{service.location}</span>
                              <Calendar className="w-3 h-3 text-gray-500 ml-2" />
                              <span className="text-sm text-gray-600">{service.date}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                              {getStatusIcon(service.status)}
                              <span className="ml-1">{service.status.replace('-', ' ')}</span>
                            </div>
                            {service.rating && (
                              <div className="flex items-center text-yellow-500 mt-1">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-xs ml-1">{service.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Expertise Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Expertise Areas</span>
                      <Button variant="outline" size="sm">Manage</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {expertise.slice(0, 4).map((area, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{area.area}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className="bg-blue-100 text-blue-800 text-xs">{area.experience}</Badge>
                              <span className="text-sm text-gray-600">{area.services} services</span>
                            </div>
                          </div>
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm ml-1">{area.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "services" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">My Services</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search Services
                  </Button>
                </div>
              </div>

              {/* Services List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentServices.map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                          {getStatusIcon(service.status)}
                          <span className="ml-1">{service.status.replace('-', ' ')}</span>
                        </div>
                        {service.rating && (
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm ml-1">{service.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{service.service}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="text-sm">{service.farmer}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">{service.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">{service.date}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <Button variant="outline" size="sm">View Details</Button>
                        {service.status === "scheduled" && (
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            Start Service
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
