import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Button, Progress, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { Users, TrendingUp, TrendingDown, Settings, FileText, Eye, Edit, Trash2, Shield, Database, Activity, AlertTriangle, AlertCircle, CheckCircle, Clock, MapPin, Phone, Mail, Building, Calendar, DollarSign, ShoppingCart, Package, BarChart3, PieChart, LineChart, UserCheck, Lock, Unlock, RefreshCw, Download, Upload, Filter, Search, Plus, Minus, ChevronRight, ChevronDown, ChevronUp, Zap, Wind, Droplets, Sun, Cloud, Thermometer, Beaker, TestTube, Microscope, Award, Target, Globe, Bell, MessageSquare, LogOut } from "lucide-react";
import { usersAPI, notificationsAPI } from "@/utils/api";
import type { User } from "@/utils/types";

interface SuperAdminDashboardProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SuperAdminDashboard({ user, activeTab, setActiveTab }: SuperAdminDashboardProps) {
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuickStats, setShowQuickStats] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === "overview") {
      loadAdminStats();
      loadNotifications();
      loadAlerts();
    }
  }, [activeTab, selectedPeriod]);

  const loadAdminStats = async () => {
    try {
      setLoading(true);
      const [userStats, userList] = await Promise.all([
        usersAPI.getUserStats().catch(() => ({ data: { totalUsers: 0, activeUsers: 0, pendingTasks: 0 } })),
        usersAPI.getAllUsers({ page: 1, limit: 10 }).catch(() => ({ data: [] }))
      ]);

      setStats({
        ...userStats.data,
        lastUpdated: new Date().toISOString()
      });
      setUsers(userList.data || []);
    } catch (error) {
      console.error("Failed to load admin stats:", error);
      // Set default values when backend is unavailable
      setStats({ totalUsers: 0, activeUsers: 0, pendingTasks: 0, lastUpdated: new Date().toISOString() });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll({ limit: 10 });
      if (response.success) {
        setNotifications(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
    }
  };

  const loadAlerts = async () => {
    try {
      // Get high priority notifications as alerts
      const response = await notificationsAPI.getAll({ 
        limit: 5 
      });
      if (response.success) {
        const alertNotifications = response.data?.filter(n => 
          n.type === 'security' || n.type === 'system' || n.priority === 'high'
        ) || [];
        setAlerts(alertNotifications);
      }
    } catch (error) {
      console.error('Failed to load alerts:', error);
      setAlerts([]);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Shambani Admin Panel</h1>
            <div className="flex items-center space-x-4 text-purple-100">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Super Administrator</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Dar es Salaam, Tanzania</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Admin since {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" onClick={() => setShowQuickStats(!showQuickStats)}>
              {showQuickStats ? <Eye className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showQuickStats ? 'Hide Stats' : 'Show Stats'}
            </Button>
            <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {['today', 'week', 'month', 'year'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
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
            {/* Total Users */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Farmers:</span>
                    <span className="font-medium">{stats.farmers || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Extension Officers:</span>
                    <span className="font-medium">{stats.extensionOfficers || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Suppliers:</span>
                    <span className="font-medium">{stats.suppliers || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Activity className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.activeUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
                <div className="mt-2">
                  <Progress value={(stats.activeUserRate || 0) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {((stats.activeUserRate || 0) * 100).toFixed(1)}% activity rate
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Database className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.systemHealth || 98}%</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Server:</span>
                    <span className="font-medium text-green-600">Online</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Database:</span>
                    <span className="font-medium text-green-600">Connected</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>API:</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <FileText className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.pendingTasks || 0}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Approvals:</span>
                    <span className="font-medium">{stats.pendingApprovals || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Reports:</span>
                    <span className="font-medium">{stats.pendingReports || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Support:</span>
                    <span className="font-medium">{stats.pendingSupport || 0}</span>
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
                <div className="text-2xl font-bold text-green-600">${stats.revenue || 0}</div>
                <p className="text-xs text-muted-foreground">This period</p>
                <div className="mt-2 flex items-center text-xs">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+{stats.revenueGrowth || 0}%</span>
                  <span className="text-muted-foreground ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.totalOrders || 0}</div>
                <p className="text-xs text-muted-foreground">This period</p>
                <div className="mt-2 flex items-center text-xs">
                  <TrendingUp className="h-3 w-3 mr-1 text-blue-500" />
                  <span className="text-blue-500">+{stats.ordersGrowth || 0}%</span>
                  <span className="text-muted-foreground ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                <Package className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.activeServices || 0}</div>
                <p className="text-xs text-muted-foreground">Currently running</p>
                <div className="mt-2 flex items-center text-xs">
                  <Activity className="h-3 w-3 mr-1 text-purple-500" />
                  <span className="text-purple-500">{stats.serviceStatus || 'Normal'}</span>
                  <span className="text-muted-foreground ml-1">operations</span>
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
              <Zap className="h-5 w-5 mr-2 text-purple-500" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={() => setActiveTab("users")}>
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("settings")}>
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              View Reports
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Security Center
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
            <CardDescription>Latest system operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registration</p>
                  <p className="text-xs text-muted-foreground">John Doe - Farmer account</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System backup completed</p>
                  <p className="text-xs text-muted-foreground">All data backed up successfully</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Service request assigned</p>
                  <p className="text-xs text-muted-foreground">Veterinary service - Case #1234</p>
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
              System Alerts
            </CardTitle>
            <CardDescription>Important system notifications</CardDescription>
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
              User Growth Trends
            </CardTitle>
            <CardDescription>User registration over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">User growth chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-green-500" />
              User Distribution
            </CardTitle>
            <CardDescription>Users by role and region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">User distribution chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent User Registrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-gray-500" />
            Recent User Registrations
          </CardTitle>
          <CardDescription>Latest user signups and registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.slice(0, 5).map((userItem: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{userItem.firstName} {userItem.lastName}</p>
                  <p className="text-sm text-gray-600">{userItem.email} • {userItem.role}</p>
                  <p className="text-xs text-gray-500">Joined: {new Date(userItem.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={userItem.isActive ? "default" : "secondary"}>
                    {userItem.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent registrations</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <Button onClick={() => {/* TODO: Open add user modal */}}>
          <Plus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-gray-500" />
            Search & Filter Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or role..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.totalUsers || 0}</div>
            <p className="text-sm text-gray-600">All registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Active Users</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.activeUsers || 0}</div>
            <p className="text-sm text-gray-600">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Inactive Users</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-gray-600">{stats.inactiveUsers || 0}</div>
            <p className="text-sm text-gray-600">Not active recently</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-orange-600">{stats.pendingUsers || 0}</div>
            <p className="text-sm text-gray-600">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-gray-500" />
              All Users
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">User</th>
                  <th className="text-left p-3 font-medium">Contact</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Joined</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserCheck className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{userItem.firstName} {userItem.lastName}</p>
                          <p className="text-sm text-gray-600">@{userItem.username || userItem.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <p className="text-sm flex items-center">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {userItem.email}
                        </p>
                        {userItem.phone && (
                          <p className="text-sm flex items-center">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            {userItem.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={userItem.role === 'SUPER_ADMIN' ? 'destructive' : 'secondary'}>
                        {userItem.role?.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={userItem.isActive ? 'default' : 'secondary'} className="flex items-center space-x-1">
                        {userItem.isActive ? (
                          <><CheckCircle className="h-3 w-3" /> Active</>
                        ) : (
                          <><Clock className="h-3 w-3" /> Inactive</>
                        )}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <p className="text-sm text-gray-600">
                        {new Date(userItem.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant={userItem.isActive ? 'outline' : 'destructive'}>
                          {userItem.isActive ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users found</p>
                <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <Button>
          <RefreshCw className="h-4 w-4 mr-2" />
          Restart System
        </Button>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-green-500" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Server</span>
                <Badge variant="default" className="bg-green-100 text-green-800">Running</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cache</span>
                <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Background Jobs</span>
                <Badge variant="default" className="bg-blue-100 text-blue-800">Processing</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-500" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Firewall</span>
                <Badge variant="default" className="bg-green-100 text-green-800">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SSL Certificate</span>
                <Badge variant="default" className="bg-green-100 text-green-800">Valid</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">2FA Required</span>
                <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Login Attempts</span>
                <Badge variant="default" className="bg-yellow-100 text-yellow-800">Monitored</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-500" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">CPU Usage</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Memory</span>
                <span className="text-sm font-medium">2.1GB / 4GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <span className="text-sm font-medium">156GB / 500GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Uptime</span>
                <span className="text-sm font-medium">99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-gray-500" />
              Platform Configuration
            </CardTitle>
            <CardDescription>Core system settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-gray-600">Temporarily disable user access</p>
              </div>
              <Button variant="outline">
                {false ? 'Disable' : 'Enable'}
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">User Registration</p>
                <p className="text-sm text-gray-600">Control new user signups</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">System email settings</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">API Rate Limiting</p>
                <p className="text-sm text-gray-600">Control API request limits</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-gray-500" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure system alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">System Alerts</p>
                <p className="text-sm text-gray-600">Critical system notifications</p>
              </div>
              <Button variant="outline">
                {true ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Email Alerts</p>
                <p className="text-sm text-gray-600">Email notification settings</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">SMS Alerts</p>
                <p className="text-sm text-gray-600">SMS notification settings</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-600">Real-time push alerts</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup & Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-gray-500" />
            Backup & Maintenance
          </CardTitle>
          <CardDescription>System backup and maintenance operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Download className="h-6 w-6 mb-2" />
              <span className="text-sm">Download Backup</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Upload className="h-6 w-6 mb-2" />
              <span className="text-sm">Restore Backup</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <RefreshCw className="h-6 w-6 mb-2" />
              <span className="text-sm">Clear Cache</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Settings className="h-6 w-6 mb-2" />
              <span className="text-sm">System Maintenance</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2 text-blue-500" />
            Shambani Investment Ltd - System Information
          </CardTitle>
          <CardDescription>Company and system details</CardDescription>
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
    case "users":
      return renderUsers();
    case "settings":
      return renderSettings();
    default:
      return renderOverview();
  }
}
