import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Progress } from "@/components/ui";
import { productionAPI, feedingAPI, healthAPI, financialAPI, servicesAPI, notificationsAPI } from "@/utils/api";
import { 
  Bird, Leaf, Heart, TrendingUp, Calendar, AlertCircle, DollarSign, Users, FileText, Settings, Bell, 
  ShoppingCart, Activity, Award, AlertTriangle, CheckCircle, Clock, MapPin, Phone, Mail, Building, 
  Package, Syringe, Stethoscope, Calculator, PiggyBank, Receipt, FileSpreadsheet, MessageSquare, 
  Shield, UserCheck, LogOut, Edit, Camera, Upload, Download, Printer, Share2, Filter, Search, 
  Plus, Minus, ChevronRight, ChevronDown, ChevronUp, Eye, EyeOff, Lock, Unlock, RefreshCw, 
  DownloadCloud, UploadCloud, Database, BarChart3, PieChart, LineChart, Target, Zap, Wind, 
  Droplets, Sun, Cloud, Thermometer, Beaker, TestTube, Microscope, Home, Truck, Wrench, 
  ShoppingBag, Store, UserIcon, Star, TrendingDown, ArrowUp, ArrowDown, MoreHorizontal, Menu, 
  X, Check, AlertTriangle as AlertTriangleIcon, Sun as SunIcon, Moon, CloudRain, Umbrella,
  Facebook, Twitter, Instagram, Linkedin, Youtube, Globe, Sprout, Award as AwardIcon,
  HelpCircle, Navigation, Compass, PhoneCall, MailIcon, ExternalLink, BookOpen, Handshake
} from "lucide-react";
import type { User as UserType } from "@/utils/types";
import { motion, AnimatePresence } from "framer-motion";

// Import real managers
import { FeedingManager } from "@/components/feeding/FeedingManager";
import { HealthManager } from "@/components/health/HealthManager";
import { ProductionManager } from "@/components/production/ProductionManager";
import { FinancialManager } from "@/components/financial/FinancialManager";

interface FarmerDashboardProps {
  user: UserType;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function FarmerDashboard({ user, activeTab, setActiveTab }: FarmerDashboardProps) {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showQuickStats, setShowQuickStats] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [motivationMessage, setMotivationMessage] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState(activeTab);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProfileClick = () => {
    setCurrentView('profile');
    setActiveTab('profile');
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
  };

  // Update currentView when activeTab changes
  useEffect(() => {
    setCurrentView(activeTab);
  }, [activeTab]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Set motivation message based on time
  useEffect(() => {
    const hour = currentTime.getHours();
    let message = '';
    if (hour < 6) message = "🌙 Early bird catches the worm! Time to check on your flock.";
    else if (hour < 12) message = "☀️ Good morning! Your poultry are waiting for your care.";
    else if (hour < 17) message = "🌤️ Afternoon! Perfect time for farm management tasks.";
    else if (hour < 20) message = "🌅 Evening! Review your day's progress and plan for tomorrow.";
    else message = "🌙 Night time! Rest well for a productive tomorrow.";
    
    setMotivationMessage(message);
  }, [currentTime]);

  useEffect(() => {
    if (activeTab === "overview") {
      loadDashboardStats();
      loadNotifications();
      loadAlerts();
    }
  }, [activeTab, selectedPeriod]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      // Load production stats
      const productionStats = await productionAPI.getDashboard({ farmId: user.id });
      // Load feeding stats
      const feedingStats = await feedingAPI.getStats({ farmId: user.id });
      // Load health stats
      const healthStats = await healthAPI.getStats({ farmId: user.id });
      // Load financial stats
      const financialStats = await financialAPI.getSummary({ });

      setStats({
        production: productionStats.data,
        feeding: feedingStats.data,
        health: healthStats.data,
        financial: financialStats.data,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await notificationsAPI.getNotifications({ limit: 10 });
      if (response.success) {
        setNotifications(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      // Set empty array on error
      setNotifications([]);
    }
  };

  const loadAlerts = async () => {
    try {
      // For now, use notifications with high priority as alerts
      const response = await notificationsAPI.getNotifications({ 
        isRead: false, 
        limit: 5 
      });
      if (response.success) {
        const alertNotifications = response.data?.filter(n => 
          n.type === 'INFO' || n.type === 'WARNING' || n.type === 'ERROR'
        ) || [];
        setAlerts(alertNotifications);
      }
    } catch (error) {
      console.error('Failed to load alerts:', error);
      setAlerts([]);
    }
  };

  const getWelcomeMessage = () => {
    const hour = currentTime.getHours();
    const firstName = user.firstName || 'Farmer';
    
    if (hour < 12) return `Good morning, ${firstName}! 🌅`;
    if (hour < 17) return `Good afternoon, ${firstName}! ☀️`;
    return `Good evening, ${firstName}! 🌅`;
  };

  const getGreetingIcon = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return <Moon className="h-5 w-5" />;
    if (hour < 12) return <SunIcon className="h-5 w-5" />;
    if (hour < 17) return <Sun className="h-5 w-5" />;
    return <Moon className="h-5 w-5" />;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Professional Header with Welcome Message */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 rounded-xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-3 mb-3">
              {currentTime.getHours() < 12 ? <SunIcon className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <h1 className="text-4xl font-bold">
                {currentTime.getHours() < 12 ? `Good morning, ${user.firstName || 'Farmer'}! 🌅` :
                 currentTime.getHours() < 17 ? `Good afternoon, ${user.firstName || 'Farmer'}! ☀️` :
                 `Good evening, ${user.firstName || 'Farmer'}! 🌅`}
              </h1>
            </div>
            <p className="text-xl text-green-100 mb-4">
              {currentTime.getHours() < 6 ? "🌙 Early bird catches the worm! Time to check on your flock." :
               currentTime.getHours() < 12 ? "☀️ Good morning! Your poultry are waiting for your care." :
               currentTime.getHours() < 17 ? "🌤️ Afternoon! Perfect time for farm management tasks." :
               currentTime.getHours() < 20 ? "🌅 Evening! Review your day's progress and plan for tomorrow." :
               "🌙 Night time! Rest well for a productive tomorrow."}
            </p>
            <div className="flex flex-wrap gap-4 text-green-100">
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                <MapPin className="h-4 w-4" />
                <span>{user.location || 'Location not set'}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                <Users className="h-4 w-4" />
                <span>{user.role || 'Individual Farmer'}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                <Calendar className="h-4 w-4" />
                <span>Member since {new Date().getFullYear()}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                <Clock className="h-4 w-4" />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" size="lg" onClick={() => setShowQuickStats(!showQuickStats)} className="bg-white/20 border-white/30 hover:bg-white/30">
              {showQuickStats ? <EyeOff className="h-5 w-5 mr-2" /> : <Eye className="h-5 w-5 mr-2" />}
              {showQuickStats ? 'Hide Stats' : 'Show Stats'}
            </Button>
            <Button variant="outline" size="lg" className="bg-white/20 border-white/30 hover:bg-white/30">
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-700">Period:</span>
        </div>
        <div className="flex space-x-2">
          {['today', 'week', 'month', 'year'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="min-w-[80px]"
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString() : 'Never'}
        </div>
      </div>

      {showQuickStats && (
        <>
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Poultry Stats */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Poultry</CardTitle>
                <Bird className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.production?.totalBirds || 0}</div>
                <p className="text-xs text-muted-foreground">Active birds</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Chicks:</span>
                    <span className="font-medium">{stats.production?.chicks || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Hens:</span>
                    <span className="font-medium">{stats.production?.hens || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Cocks:</span>
                    <span className="font-medium">{stats.production?.cocks || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Production Stats */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Egg Production</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.production?.todayEggs || 0}</div>
                <p className="text-xs text-muted-foreground">Eggs today</p>
                <div className="mt-2">
                  <Progress value={(stats.production?.productionRate || 0) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {((stats.production?.productionRate || 0) * 100).toFixed(1)}% production rate
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feeding Stats */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Feed Management</CardTitle>
                <Leaf className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.feeding?.todayFeed || 0}kg</div>
                <p className="text-xs text-muted-foreground">Today's consumption</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Stock:</span>
                    <span className="font-medium">{stats.feeding?.stock || 0}kg</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Cost:</span>
                    <span className="font-medium">${stats.feeding?.cost || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Stats */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Status</CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.health?.healthy || 0}%</div>
                <p className="text-xs text-muted-foreground">Healthy birds</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Sick:</span>
                    <span className="font-medium text-red-600">{stats.health?.sick || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Treated:</span>
                    <span className="font-medium text-blue-600">{stats.health?.treated || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-green-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${stats.financial?.revenue || 0}</div>
                <p className="text-xs text-muted-foreground">This period</p>
                <div className="mt-2 flex items-center text-xs">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+{stats.financial?.revenueGrowth || 0}%</span>
                  <span className="text-muted-foreground ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                <ShoppingCart className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">${stats.financial?.expenses || 0}</div>
                <p className="text-xs text-muted-foreground">This period</p>
                <div className="mt-2 flex items-center text-xs">
                  <TrendingUp className="h-3 w-3 mr-1 text-red-500" />
                  <span className="text-red-500">+{stats.financial?.expensesGrowth || 0}%</span>
                  <span className="text-muted-foreground ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <Calculator className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">${stats.financial?.profit || 0}</div>
                <p className="text-xs text-muted-foreground">This period</p>
                <div className="mt-2 flex items-center text-xs">
                  <TrendingUp className="h-3 w-3 mr-1 text-purple-500" />
                  <span className="text-purple-500">+{stats.financial?.profitGrowth || 0}%</span>
                  <span className="text-muted-foreground ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-blue-500" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={() => setActiveTab("production")}>
              <Bird className="h-4 w-4 mr-2" />
              Record Production
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("feeding")}>
              <Leaf className="h-4 w-4 mr-2" />
              Update Feeding
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("health")}>
              <Heart className="h-4 w-4 mr-2" />
              Health Check
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("financial")}>
              <DollarSign className="h-4 w-4 mr-2" />
              Financial Records
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("services")}>
              <Stethoscope className="h-4 w-4 mr-2" />
              Request Services
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-500" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest farm operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Egg collection completed</p>
                  <p className="text-xs text-muted-foreground">156 eggs collected</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Feeding schedule updated</p>
                  <p className="text-xs text-muted-foreground">25kg feed distributed</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Health check due tomorrow</p>
                  <p className="text-xs text-muted-foreground">Routine vaccination</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Alerts & Notifications
            </CardTitle>
            <CardDescription>Important updates and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3">
                  <AlertCircle className={`h-4 w-4 mt-0.5 ${
                    alert.severity === 'critical' ? 'text-red-500' :
                    alert.severity === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.type}</p>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <p className="text-sm text-muted-foreground">No active alerts</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Production Trends
            </CardTitle>
            <CardDescription>Egg production over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Production chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-green-500" />
              Financial Overview
            </CardTitle>
            <CardDescription>Revenue vs Expenses breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Financial chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderFeeding = () => (
    <FeedingManager user={user} />
  );

  const renderHealth = () => (
    <HealthManager user={user} />
  );

  const renderProduction = () => (
    <ProductionManager user={user} />
  );

  const renderFinancial = () => (
    <FinancialManager user={user} />
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Professional Services</h1>
        <Button onClick={() => {/* TODO: Open service modal */}}>
          <Plus className="h-4 w-4 mr-2" />
          Request Service
        </Button>
      </div>

      {/* Service Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Veterinary Services */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Stethoscope className="h-5 w-5 mr-2 text-red-500" />
              Veterinary Services
            </CardTitle>
            <CardDescription>Professional animal health services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Syringe className="h-4 w-4 mr-2" />
              Request Vaccination
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Heart className="h-4 w-4 mr-2" />
              Health Check-up
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Treatment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TestTube className="h-4 w-4 mr-2" />
              Laboratory Tests
            </Button>
          </CardContent>
        </Card>

        {/* Extension Services */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-500" />
              Extension Services
            </CardTitle>
            <CardDescription>Agricultural expertise and consultation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Award className="h-4 w-4 mr-2" />
              Farm Consultation
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Building className="h-4 w-4 mr-2" />
              Housing Guidance
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Biosecurity Training
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Target className="h-4 w-4 mr-2" />
              Production Planning
            </Button>
          </CardContent>
        </Card>

        {/* Financial Services */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PiggyBank className="h-5 w-5 mr-2 text-blue-500" />
              Financial Services
            </CardTitle>
            <CardDescription>Loans and financial assistance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              Feed Loans
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Package className="h-4 w-4 mr-2" />
              Equipment Financing
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Business Planning
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calculator className="h-4 w-4 mr-2" />
              Financial Analysis
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Service Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-500" />
            Recent Service Requests
          </CardTitle>
          <CardDescription>Track your service requests and appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Vaccination Program</p>
                  <p className="text-sm text-muted-foreground">Dr. John Kimaro - Scheduled for tomorrow</p>
                </div>
              </div>
              <Badge variant="secondary">Confirmed</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Farm Consultation</p>
                  <p className="text-sm text-muted-foreground">Extension Officer - Pending confirmation</p>
                </div>
              </div>
              <Badge variant="outline">Pending</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Updates and alerts for your farm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-medium">Feeding Reminder</p>
              <p className="text-sm text-gray-600">Time for afternoon feeding</p>
              <p className="text-xs text-gray-400">2 hours ago</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-medium">Egg Collection Complete</p>
              <p className="text-sm text-gray-600">Daily collection completed successfully</p>
              <p className="text-xs text-gray-400">5 hours ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="h-5 w-5 mr-2 text-blue-500" />
              Farm Information
            </CardTitle>
            <CardDescription>Manage your farm and personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <p className="text-gray-900">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-gray-600">{user.email || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-gray-600">{user.phone || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Farmer Type</label>
                  <p className="text-gray-600">{user.role || 'Individual'}</p>
                </div>
              </div>
            </div>

            {/* Farm Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Farm Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Farm Name</label>
                  <p className="text-gray-600">{user.farmName || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <p className="text-gray-600">{user.location || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Region</label>
                  <p className="text-gray-600">{user.region || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Farm Size</label>
                  <p className="text-gray-600">Not specified</p>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Business Registration</label>
                  <p className="text-gray-600">Not registered</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Tax ID</label>
                  <p className="text-gray-600">Not provided</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Bank Account</label>
                  <p className="text-gray-600">Not provided</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Member Since</label>
                  <p className="text-gray-600">{new Date(user.createdAt).getFullYear()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Settings */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2 text-gray-500" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserCheck className="h-12 w-12 text-gray-400" />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-gray-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Receipt className="h-4 w-4 mr-2" />
                View Invoices
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Privacy Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSpreadsheet className="h-5 w-5 mr-2 text-gray-500" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <UploadCloud className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DownloadCloud className="h-4 w-4 mr-2" />
                Download Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2 text-blue-500" />
            Shambani Investment Ltd - Contact Information
          </CardTitle>
          <CardDescription>Company details for your reference</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Address</h4>
              <p className="text-sm text-gray-600">
                Kinyerezi Mbuyuni, House No.5<br />
                Msikiti Street, P.O. BOX 895<br />
                Ilala, Dar es Salaam
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Contact</h4>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  shambaniinvestment@gmail.com
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  0758061582 / 0743177222
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                {user.firstName || 'Farmer'} {user.lastName || ''}
              </h3>
              <p className="text-sm text-gray-600 flex items-center justify-center gap-1 mt-1">
                <Building className="size-3" />
                {user.farmName || "Farm Not Set"}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Online</h4>
              <p className="text-sm text-gray-600 flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                www.shambaniinvestment.co.tz
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render content based on active tab
  switch (activeTab) {
    case "overview":
      return renderOverview();
    case "production":
      return renderProduction();
    case "feeding":
      return renderFeeding();
    case "health":
      return renderHealth();
    case "financial":
      return renderFinancial();
    case "services":
      return renderServices();
    case "notifications":
      return renderNotifications();
    case "profile":
      return renderProfile();
    default:
      return renderOverview();
  }
}
