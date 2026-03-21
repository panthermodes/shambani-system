import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress, Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { jobsAPI, earningsAPI, notificationsAPI } from "@/utils/api";
import { 
  Calendar, DollarSign, Users, Clock, MapPin, Star, TrendingUp, Award, Bell, Search, Filter,
  Menu, X, Home, Briefcase, Settings, LogOut, ChevronRight, AlertCircle, CheckCircle,
  Phone, Mail, Globe, Truck, Wrench, User as UserIcon, FileText, Download, Upload, Eye,
  BarChart3, PieChart, Activity, Target, Zap, Shield, MessageSquare, Heart, Coffee
} from "lucide-react";
import type { User as UserType } from "@/utils/types";

interface CasualLabourerDashboardProps {
  user: UserType;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function CasualLabourerDashboard({ user, activeTab, setActiveTab }: CasualLabourerDashboardProps) {
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    pendingJobs: 0,
    totalEarnings: 0,
    averageRating: 0,
    activeJobs: 0,
    pendingPayments: 0,
    skillsCount: 0
  });
  
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
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
      
      // Load my jobs
      const jobsResponse = await jobsAPI.getMyJobs();
      if (jobsResponse.success) {
        const jobs = jobsResponse.data || [];
        setRecentJobs(jobs);
        
        // Calculate job stats
        const completed = jobs.filter((job: any) => job.status === 'completed').length;
        const pending = jobs.filter((job: any) => job.status === 'pending').length;
        const active = jobs.filter((job: any) => job.status === 'in-progress').length;
        
        setStats(prev => ({
          ...prev,
          totalJobs: jobs.length,
          completedJobs: completed,
          pendingJobs: pending,
          activeJobs: active
        }));
      }

      // Load earnings
      const earningsResponse = await earningsAPI.getSummary();
      if (earningsResponse.success) {
        const earningsData = earningsResponse.data || {};
        setStats(prev => ({
          ...prev,
          totalEarnings: earningsData.totalEarnings || 0,
          averageRating: earningsData.averageRating || 0,
          pendingPayments: earningsData.pendingPayments || 0
        }));
      }

      // Load notifications
      const notificationsResponse = await notificationsAPI.getNotifications({ limit: 10 });
      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data || []);
      }

      // Load skills (could be from user profile or separate API)
      const skillsData = [
        { name: "Crop Harvesting", level: "Expert", jobs: 45, rating: 4.9, earnings: 11250 },
        { name: "Land Preparation", level: "Advanced", jobs: 32, rating: 4.8, earnings: 6400 },
        { name: "Irrigation Setup", level: "Intermediate", jobs: 28, rating: 4.7, earnings: 5600 },
        { name: "Pest Control", level: "Expert", jobs: 38, rating: 4.9, earnings: 7600 }
      ];
      setSkills(skillsData);
      setStats(prev => ({ ...prev, skillsCount: skillsData.length }));

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyForJob = async (jobId: string) => {
    try {
      await jobsAPI.applyForJob(jobId, { userId: user.id });
      // Reload jobs after application
      loadDashboardData();
    } catch (error) {
      console.error('Failed to apply for job:', error);
    }
  };

  const updateJobStatus = async (jobId: string, status: string, notes?: string) => {
    try {
      await jobsAPI.updateJobStatus(jobId, { status, notes });
      // Reload jobs after update
      loadDashboardData();
    } catch (error) {
      console.error('Failed to update job status:', error);
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, count: null },
    { id: "jobs", label: "My Jobs", icon: Briefcase, count: stats.pendingJobs },
    { id: "earnings", label: "Earnings", icon: DollarSign, count: null },
    { id: "profile", label: "Profile", icon: UserIcon, count: null },
    { id: "skills", label: "Skills & Certifications", icon: Award, count: stats.skillsCount },
    { id: "schedule", label: "Schedule", icon: Calendar, count: 5 },
    { id: "messages", label: "Messages", icon: MessageSquare, count: 3 },
    { id: "settings", label: "Settings", icon: Settings, count: null }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in-progress": return <Activity className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "job": return <Briefcase className="w-4 h-4 text-blue-500" />;
      case "payment": return <DollarSign className="w-4 h-4 text-green-500" />;
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
      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-orange-600 to-orange-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-6 border-b border-orange-700">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar || ''} alt={user.firstName} />
                <AvatarFallback className="bg-orange-100 text-orange-800 font-bold">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{user.firstName} {user.lastName}</h3>
                <p className="text-orange-200 text-sm">Casual Labourer</p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-orange-200 text-sm ml-1">{stats.averageRating}</span>
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
                    ? "bg-orange-700 text-white"
                    : "text-orange-100 hover:bg-orange-700 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count !== null && (
                  <Badge className="bg-white text-orange-800 text-xs">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-orange-700">
            <button className="w-full flex items-center space-x-3 p-3 text-orange-100 hover:bg-orange-700 rounded-lg transition-colors">
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
                <Badge className="bg-orange-100 text-orange-800">
                  {user.firstName} {user.lastName}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search jobs, skills..."
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
                  <AvatarFallback className="bg-orange-100 text-orange-800 font-bold">
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
                    <CardTitle className="text-sm font-medium text-gray-600">Total Jobs</CardTitle>
                    <Briefcase className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalJobs}</div>
                    <p className="text-xs text-gray-500">All time</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.completedJobs}</div>
                    <p className="text-xs text-gray-500">Successfully finished</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">TZS {stats.totalEarnings.toLocaleString()}</div>
                    <p className="text-xs text-gray-500">Lifetime earnings</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Rating</CardTitle>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.averageRating}</div>
                    <p className="text-xs text-gray-500">Average rating</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Jobs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Recent Jobs</span>
                      <Button variant="outline" size="sm">View All</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentJobs.slice(0, 5).map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{job.title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="w-3 h-3 text-gray-500" />
                              <span className="text-sm text-gray-600">{job.location}</span>
                              <Calendar className="w-3 h-3 text-gray-500 ml-2" />
                              <span className="text-sm text-gray-600">{job.date}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                              {getStatusIcon(job.status)}
                              <span className="ml-1">{job.status.replace('-', ' ')}</span>
                            </div>
                            {job.earnings && (
                              <div className="text-sm font-medium text-gray-900 mt-1">TZS {job.earnings}</div>
                            )}
                            {job.rating && (
                              <div className="flex items-center text-yellow-500 mt-1">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-xs ml-1">{job.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Skills & Expertise</span>
                      <Button variant="outline" size="sm">Manage</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {skills.slice(0, 4).map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{skill.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className="bg-blue-100 text-blue-800 text-xs">{skill.level}</Badge>
                              <span className="text-sm text-gray-600">{skill.jobs} jobs</span>
                            </div>
                          </div>
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm ml-1">{skill.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "jobs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">My Jobs</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search Jobs
                  </Button>
                </div>
              </div>

              {/* Jobs List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {getStatusIcon(job.status)}
                          <span className="ml-1">{job.status.replace('-', ' ')}</span>
                        </div>
                        {job.rating && (
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm ml-1">{job.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{job.title}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">{job.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">{job.date}</span>
                        </div>
                        {job.earnings && (
                          <div className="flex items-center text-green-600 font-medium">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span>TZS {job.earnings}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <Button variant="outline" size="sm">View Details</Button>
                        {job.status === "pending" && (
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Accept Job
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
