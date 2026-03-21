import { useState, useEffect } from 'react';
import { productionAPI, feedingAPI, healthAPI, financialAPI, notificationsAPI } from '@/utils/api';
import type { User as UserType } from '@/utils/types';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';

// Import UI components
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Import real managers
import { FeedingManager } from '@/components/feeding/FeedingManager';
import { HealthManager } from '@/components/health/HealthManager';
import { ProductionManager } from '@/components/production/ProductionManager';
import { FinancialManager } from '@/components/financial/FinancialManager';

// Import icons
import { 
  Home,
  Bird,
  Leaf,
  Heart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  RefreshCw,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Search,
  Sun,
  Moon,
  Bell,
  Plus,
  ChevronDown,
  Activity,
  Target,
  Calculator,
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  Wind,
  Droplet,
  AlertTriangle,
  CheckCircle,
  Download,
  Clock,
  Info,
  ArrowUp,
  ArrowDown,
  Minus,
  Upload,
  Camera,
  Edit,
  Brain,
  Zap,
  Sprout,
  UserIcon
} from 'lucide-react';

interface UnifiedFarmerDashboardProps {
  user: UserType;
}

export function UnifiedFarmerDashboardFinal({ user }: UnifiedFarmerDashboardProps) {
  const { logout } = useAuth();
  const [currentView, setCurrentView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showQuickStats, setShowQuickStats] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [darkMode, setDarkMode] = useState(false);
  
  // Real data states
  const [stats, setStats] = useState<any>({});
  const [notifications, setNotifications] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Load real data from database
  useEffect(() => {
    if (currentView === "overview") {
      loadDashboardData();
    }
  }, [currentView, selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load real production stats
      const productionResponse = await productionAPI.getDashboard({ farmId: user.id });
      
      // Load real feeding stats
      const feedingResponse = await feedingAPI.getStats({ farmId: user.id });
      
      // Load real health stats
      const healthResponse = await healthAPI.getStats({ farmId: user.id });
      
      // Load real financial stats
      const financialResponse = await financialAPI.getSummary({ });
      
      // Load recent activity/notifications
      const notificationsResponse = await notificationsAPI.getNotifications({ limit: 10 });

      setStats({
        production: productionResponse.data || {},
        feeding: feedingResponse.data || {},
        health: healthResponse.data || {},
        financial: financialResponse.data || {},
        lastUpdated: new Date().toISOString()
      });

      setNotifications(notificationsResponse.data || []);
      
      // Process recent activity from notifications
      const activity = notificationsResponse.data?.slice(0, 5).map((notif: any) => ({
        id: notif.id,
        title: notif.title,
        description: notif.message,
        time: formatTimeAgo(notif.createdAt),
        type: notif.type.toLowerCase(),
        icon: getActivityIcon(notif.type)
      })) || [];

      setRecentActivity(activity);
      
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getActivityIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'SUCCESS': return CheckCircle;
      case 'WARNING': return AlertTriangle;
      case 'INFO': return Package;
      case 'ERROR': return AlertCircle;
      default: return Activity;
    }
  };

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProfileClick = () => {
    setCurrentView('profile');
  };

  const handleLogout = () => {
    logout();
  };

  // Remove duplicate header and sidebar - using unified layout from ShambaniDashboard.tsx

  const getWelcomeMessage = () => {
    const hour = currentTime.getHours();
    const firstName = user.firstName || 'Farmer';
    
    if (hour < 12) return `Good morning, ${firstName}!`;
    if (hour < 17) return `Good afternoon, ${firstName}!`;
    return `Good evening, ${firstName}!`;
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'production', label: 'Production', icon: Sprout },
    { id: 'feeding', label: 'Feeding', icon: Leaf },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  // Enhanced Header with Search, Theme, and User Menu
  const renderHeader = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchInputRef = useState(null);

    // Handle theme toggle
    const handleThemeToggle = () => {
      const newDarkMode = !darkMode;
      setDarkMode(newDarkMode);
      // Apply theme to document
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Save preference
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    };

    // Handle search
    const handleSearch = (query) => {
      setSearchQuery(query);
      if (query.trim().length > 0) {
        // Mock search results - replace with real search logic
        const results = [
          { type: 'production', title: 'Egg Production Report', description: 'Daily egg production statistics' },
          { type: 'feeding', title: 'Feeding Schedule', description: 'Chicken feeding schedule' },
          { type: 'health', title: 'Health Records', description: 'Poultry health monitoring' },
          { type: 'financial', title: 'Revenue Report', description: 'Monthly financial summary' },
        ].filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (showUserMenu && !event.target.closest('.user-menu')) {
          setShowUserMenu(false);
        }
        if (showSearchResults && !event.target.closest('.search-container')) {
          setShowSearchResults(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserMenu, showSearchResults]);

    // Close on Escape key
    useEffect(() => {
      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          setShowUserMenu(false);
          setShowProfileModal(false);
          setShowSearchResults(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    return (
    <header className={`bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 ${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : ''}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('overview')}>
            <Logo className="h-8 w-8" />
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Shambani Investment</h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Agritech Ecosystem</p>
            </div>
          </div>

          {/* Responsive Search Bar */}
          <div className="flex-1 flex items-center justify-center mx-4 sm:mx-8">
            <div className="search-container relative w-full max-w-xs sm:max-w-sm md:max-w-md">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm transition-all ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className={`absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border z-50 max-h-64 overflow-y-auto ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'border-gray-200'
                }`}>
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentView(result.type);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start space-x-3 ${
                        darkMode ? 'hover:bg-gray-700 text-white' : 'text-gray-900'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        result.type === 'production' ? 'bg-blue-100 text-blue-600' :
                        result.type === 'feeding' ? 'bg-green-100 text-green-600' :
                        result.type === 'health' ? 'bg-red-100 text-red-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {result.type === 'production' && <TrendingUp className="h-4 w-4" />}
                        {result.type === 'feeding' && <Leaf className="h-4 w-4" />}
                        {result.type === 'health' && <Heart className="h-4 w-4" />}
                        {result.type === 'financial' && <DollarSign className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{result.title}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{result.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-600" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className={`p-2 rounded-lg transition-colors relative ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <Bell className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            </div>

            {/* User Menu Dropdown */}
            <div className="user-menu relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title="User Menu"
              >
                <User className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>

              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-2 z-50 ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  {/* User Info */}
                  <div className={`px-4 py-3 border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user.firstName} {user.lastName}
                    </p>
                    <p className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user.role.replace('_', ' ')}
                    </p>
                  </div>
                  
                  {/* Menu Items */}
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowUserMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 transition-colors ${
                      darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>View Profile</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setCurrentView('settings');
                      setShowUserMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 transition-colors ${
                      darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  
                  <div className={`my-2 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={handleMenuToggle}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Menu className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-lg shadow-xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  User Profile
                </h3>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={(user as any).avatar || ''} alt={user.firstName} />
                  <AvatarFallback className="bg-green-100 text-green-800 text-2xl font-semibold">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <h4 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.firstName} {user.lastName}
                </h4>
                <p className={`text-sm capitalize mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user.role.replace('_', ' ')}
                </p>
                
                <div className={`w-full space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">{(user as any).email || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="text-sm">{(user as any).phone || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Location:</span>
                    <span className="text-sm">{(user as any).location || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <span className="text-sm flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                      Active
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6 w-full">
                  <button
                    onClick={() => {
                      setCurrentView('profile');
                      setShowProfileModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
  };

  // Enhanced Professional Sidebar
  const renderSidebar = () => (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-16 bottom-0 w-64 bg-white shadow-2xl z-50 lg:relative lg:translate-x-0 lg:shadow-lg lg:border-r lg:border-gray-200 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                className={`w-full justify-start gap-3 h-11 rounded-lg transition-all flex items-center group ${
                  isActive
                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                    : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                }`}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false);
                }}
              >
                <div className={`p-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white/20'
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <Icon className={`h-4 w-4 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-600 group-hover:text-gray-700'
                  }`} />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {isActive && (
                  <div className="h-2 w-2 bg-white rounded-full opacity-60"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <button
              onClick={() => setShowQuickStats(!showQuickStats)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Quick Stats</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showQuickStats ? 'rotate-180' : ''}`} />
            </button>
            
            {showQuickStats && (
              <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Today's Activity</span>
                  <span className="font-medium text-green-600">+12%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Tasks Completed</span>
                  <span className="font-medium">8/10</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header with AI Insights */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold mb-2">
              {getWelcomeMessage()} 🌱
            </h1>
            <p className="text-lg text-green-100 mb-3">
              Here's what's happening on your farm today
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{user?.region || 'Loading...'}, {user?.district || 'Loading...'}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{currentTime.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 bg-yellow-400/30 backdrop-blur-sm rounded-lg px-3 py-2">
                <Zap className="h-4 w-4 text-yellow-200" />
                <span className="text-sm font-medium">AI Insights Active</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button 
              onClick={() => setShowQuickStats(!showQuickStats)} 
              className="bg-white/20 border-white/30 hover:bg-white/30 px-4 py-2 rounded-lg text-white font-medium transition-all"
            >
              {showQuickStats ? 'Hide Details' : 'Show Details'}
            </button>
            <button 
              onClick={loadDashboardData}
              className="bg-white/20 border-white/30 hover:bg-white/30 px-4 py-2 rounded-lg text-white font-medium transition-all flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* AI Farm Assistant */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Farm Assistant</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <p className="text-sm text-gray-700">Your egg production is <span className="font-semibold text-green-600">12% above average</span> for this season. Consider increasing market supply.</p>
              </div>
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <p className="text-sm text-gray-700">Feed efficiency dropped by <span className="font-semibold text-yellow-600">8%</span>. Review feeding schedule and check for waste.</p>
              </div>
              <div className="flex items-start space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-sm text-gray-700">Market prices for eggs are <span className="font-semibold text-blue-600">rising 5%</span> this week. Good time to increase sales.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Period Selector with Advanced Options */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-700">Analysis Period:</span>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Info className="h-3 w-3" />
              <span>Compare with previous period</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex space-x-2">
              {['today', 'week', 'month', 'year'].map((period) => (
                <button
                  key={period}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    selectedPeriod === period 
                      ? 'bg-green-600 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
            <button className="px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all">
              <Download className="h-3 w-3 inline mr-1" />
              Export
            </button>
          </div>
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{loading ? 'Loading...' : `Last updated: ${stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString() : 'Never'}`}</span>
          </div>
        </div>
      </div>

      {showQuickStats && !loading && (
        <>
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Total Poultry with Growth Indicator */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Total Poultry</h3>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Bird className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold text-gray-900">{stats.production?.totalBirds || 0}</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>+5.2%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Active birds</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Layers: 85%</span>
                  <span className="text-gray-500">Broilers: 15%</span>
                </div>
              </div>
            </div>

            {/* Egg Production with Trend */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Egg Production</h3>
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold text-gray-900">{stats.production?.todayEggs || 0}</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>+12%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Eggs today</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Avg/bird: 0.92</span>
                  <span className="text-gray-500">Quality: A+</span>
                </div>
              </div>
            </div>

            {/* Feed Management with Efficiency */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Feed Management</h3>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Leaf className="h-4 w-4 text-orange-500" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold text-gray-900">{stats.feeding?.todayFeed || 0}kg</div>
                <div className="flex items-center text-xs text-red-600">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  <span>-3%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Today's consumption</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Efficiency: 2.1kg</span>
                  <span className="text-gray-500">Cost: $0.45/kg</span>
                </div>
              </div>
            </div>

            {/* Health Status with Alert */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Health Status</h3>
                <div className="p-2 bg-red-50 rounded-lg relative">
                  <Heart className="h-4 w-4 text-red-500" />
                  {stats.health?.sickBirds > 0 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold text-green-600">{stats.health?.healthyPercentage || 0}%</div>
                <div className="flex items-center text-xs text-gray-500">
                  <Minus className="h-3 w-3 mr-1" />
                  <span>0%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Healthy birds</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Sick: {stats.health?.sickBirds || 0}</span>
                  <span className="text-gray-500">Treated: 12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Revenue</h3>
                <div className="p-2 bg-green-50 rounded-lg">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold text-green-600">${stats.financial?.revenue || 0}</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>+18%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">This period</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">Eggs: 75% | Meat: 25%</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Expenses</h3>
                <div className="p-2 bg-red-50 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold text-red-600">${stats.financial?.expenses || 0}</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  <span>-5%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">This period</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">Feed: 60% | Labor: 25% | Other: 15%</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Net Profit</h3>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold text-purple-600">${stats.financial?.profit || 0}</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>+32%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">This period</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">Margin: 28% | ROI: 156%</div>
              </div>
            </div>
          </div>

          {/* Advanced Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Production Trends */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Production Trends</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View Details</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Egg Production</p>
                      <p className="text-xs text-gray-500">Daily average</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">1,245</p>
                    <p className="text-xs text-green-600">+12% vs last week</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Feed Conversion</p>
                      <p className="text-xs text-gray-500">Efficiency ratio</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">2.1:1</p>
                    <p className="text-xs text-green-600">Excellent</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Growth Rate</p>
                      <p className="text-xs text-gray-500">Weekly average</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">+8.5%</p>
                    <p className="text-xs text-green-600">Above target</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Intelligence */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Market Intelligence</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Update Prices</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Egg Prices</p>
                      <p className="text-xs text-gray-500">Local market</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">$0.85/doz</p>
                    <p className="text-xs text-green-600">+5% this week</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Feed Costs</p>
                      <p className="text-xs text-gray-500">Current supplier</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-orange-600">$0.45/kg</p>
                    <p className="text-xs text-red-600">+2% this week</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Demand</p>
                      <p className="text-xs text-gray-500">Local orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-blue-600">High</p>
                    <p className="text-xs text-blue-600">+15 orders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentView('production')}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Record Production</p>
                    <p className="text-xs text-gray-500">Log today's egg collection</p>
                  </div>
                </button>
                <button
                  onClick={() => setCurrentView('feeding')}
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <Leaf className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Update Feeding</p>
                    <p className="text-xs text-gray-500">Record feed consumption</p>
                  </div>
                </button>
                <button
                  onClick={() => setCurrentView('health')}
                  className="w-full flex items-center space-x-3 p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Heart className="h-5 w-5 text-red-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Health Check</p>
                    <p className="text-xs text-gray-500">Schedule veterinary visit</p>
                  </div>
                </button>
                <button
                  onClick={() => setCurrentView('financial')}
                  className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <Calculator className="h-5 w-5 text-purple-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Financial Records</p>
                    <p className="text-xs text-gray-500">Update expense tracking</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Today's Tasks */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">5 pending</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input type="checkbox" className="mt-1 rounded border-gray-300" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Morning feeding check</p>
                    <p className="text-xs text-gray-500">Due by 8:00 AM</p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">High</span>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input type="checkbox" className="mt-1 rounded border-gray-300" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Egg collection</p>
                    <p className="text-xs text-gray-500">Due by 10:00 AM</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Done</span>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input type="checkbox" className="mt-1 rounded border-gray-300" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Water system inspection</p>
                    <p className="text-xs text-gray-500">Due by 12:00 PM</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Medium</span>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input type="checkbox" className="mt-1 rounded border-gray-300" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Clean feeding equipment</p>
                    <p className="text-xs text-gray-500">Due by 2:00 PM</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Low</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Production recorded</p>
                    <p className="text-xs text-gray-500">1,245 eggs collected</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Sale completed</p>
                    <p className="text-xs text-gray-500">$450 revenue from eggs</p>
                    <p className="text-xs text-gray-400">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Leaf className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Feed inventory updated</p>
                    <p className="text-xs text-gray-500">250kg remaining</p>
                    <p className="text-xs text-gray-400">6 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Heart className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Health check completed</p>
                    <p className="text-xs text-gray-500">All birds healthy</p>
                    <p className="text-xs text-gray-400">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental & Weather Insights */}
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Environmental Insights</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Weather Forecast</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg">
                  <Sun className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Temperature</p>
                  <p className="text-xs text-gray-500">24°C optimal</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg">
                  <Droplet className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Humidity</p>
                  <p className="text-xs text-gray-500">65% good</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg">
                  <Wind className="h-5 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Ventilation</p>
                  <p className="text-xs text-gray-500">Air quality good</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Heat Stress</p>
                  <p className="text-xs text-green-600">Low risk</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
        <button className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-all flex items-center">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center mb-4">
            <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
            <h2 className="text-lg font-semibold">Personal Information</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Your personal and contact details</p>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-gray-900">{user?.firstName} {user?.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email Address</label>
                <p className="text-gray-900">{(user as any).email || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                <p className="text-gray-900">{(user as any).phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Farm Name</label>
                <p className="text-gray-900">{(user as any).farmName || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Region</label>
                <p className="text-gray-900">{user?.region || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">District</label>
                <p className="text-gray-900">{user?.district || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center mb-4">
            <Camera className="h-5 w-5 mr-2 text-green-500" />
            <h2 className="text-lg font-semibold">Profile Photo</h2>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="h-16 w-16 text-white" />
            </div>
            <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProduction = () => (
    <ProductionManager user={user} />
  );

  const renderFeeding = () => (
    <FeedingManager user={user} />
  );

  const renderHealth = () => (
    <HealthManager user={user} />
  );

  const renderFinancial = () => (
    <FinancialManager user={user} />
  );

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return renderOverview();
      case 'production':
        return renderProduction();
      case 'feeding':
        return renderFeeding();
      case 'health':
        return renderHealth();
      case 'financial':
        return renderFinancial();
      case 'profile':
        return renderProfile();
      default:
        return renderOverview();
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        {renderHeader()}

        {/* Main Content */}
        <div className="flex">
          {/* Sidebar */}
          {renderSidebar()}

          {/* Main Content Area */}
          <main className="flex-1 p-4 lg:p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
