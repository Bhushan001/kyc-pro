import React, { useState } from 'react';
import { Users, Building, BarChart3, Settings, Shield, Bell, Search, Plus, Filter, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { User, Tenant, Application } from '../../App';
import TenantCreationStepper from '../TenantCreationStepper';
import TenantManagementModal from '../TenantManagementModal';
import DebugInfo from '../DebugInfo';
import { toast } from 'sonner@2.0.3';

interface HubProps {
  user: User;
  onLogout: () => void;
  tenants: Tenant[];
  users: User[];
  applications: Application[];
  onAddTenant: (tenantData: any) => void;
  onAssignTenantAdmin: (tenantId: string, userId: string) => void;
}

const Hub = ({ user, onLogout, tenants = [], users = [], applications = [], onAddTenant, onAssignTenantAdmin }: HubProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showTenantCreation, setShowTenantCreation] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showTenantManagement, setShowTenantManagement] = useState(false);

  const mockStats = {
    totalTenants: tenants?.length || 0,
    totalUsers: users?.length || 0,
    monthlyVerifications: 28934,
    systemHealth: 99.9
  };

  const mockAlerts = [
    { id: '1', type: 'warning', message: 'High verification volume detected for TechCorp Inc', time: '10 minutes ago' },
    { id: '2', type: 'info', message: 'New tenant signup: Digital Ventures', time: '2 hours ago' },
    { id: '3', type: 'error', message: 'API rate limit exceeded for Finance Solutions', time: '1 day ago' },
  ];

  const handleAddTenant = () => {
    setShowTenantCreation(true);
  };

  const handleTenantCreationComplete = (tenantData: any) => {
    console.log('New tenant created:', tenantData);
    onAddTenant(tenantData);
    toast.success(`Tenant "${tenantData.name}" has been created successfully!`);
    setShowTenantCreation(false);
  };

  const handleCloseTenantCreation = () => {
    setShowTenantCreation(false);
  };

  const handleManageTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowTenantManagement(true);
  };

  const handleCloseTenantManagement = () => {
    setShowTenantManagement(false);
    setSelectedTenant(null);
  };

  const getTotalRevenue = () => {
    return (tenants || []).reduce((total, tenant) => total + (tenant.monthlyRevenue || 0), 0);
  };

  // If showing tenant creation, render the stepper instead of normal content
  if (showTenantCreation) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-foreground">Kyc-Pro Hub</span>
              </div>
              <Badge variant="outline" className="border-blue-600 text-blue-600">Platform Admin</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Welcome, {user?.name || 'Admin'}</span>
                <Button onClick={onLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <TenantCreationStepper 
            onClose={handleCloseTenantCreation}
            onComplete={handleTenantCreationComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-foreground">Kyc-Pro Hub</span>
            </div>
            <Badge variant="outline" className="border-blue-600 text-blue-600">Platform Admin</Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search tenants, users..." 
                className="pl-10 w-64 bg-input-background border-border text-foreground"
              />
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">Welcome, {user?.name || 'Admin'}</span>
              <Button onClick={onLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-card min-h-screen p-6 border-r border-border">
          <div className="space-y-2">
            <Button 
              variant={activeTab === 'overview' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button 
              variant={activeTab === 'tenants' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('tenants')}
            >
              <Building className="mr-2 h-4 w-4" />
              Tenants
            </Button>
            <Button 
              variant={activeTab === 'users' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('users')}
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
            <Button 
              variant={activeTab === 'analytics' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('analytics')}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button 
              variant={activeTab === 'settings' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Debug Info */}
          <DebugInfo user={user} />

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Platform Overview</h1>
                <Button onClick={handleAddTenant} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tenant
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Tenants</CardTitle>
                    <Building className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{mockStats.totalTenants}</div>
                    <p className="text-xs text-green-600">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{mockStats.totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-green-600">+18% from last month</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
                    <Shield className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">${getTotalRevenue().toLocaleString()}</div>
                    <p className="text-xs text-green-600">+24% from last month</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
                    <TrendingUp className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{mockStats.systemHealth}%</div>
                    <p className="text-xs text-green-600">All systems operational</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Recent Alerts</CardTitle>
                    <CardDescription className="text-muted-foreground">System notifications and warnings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <AlertTriangle className={`h-4 w-4 ${
                          alert.type === 'error' ? 'text-red-600' : 
                          alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Top Tenants</CardTitle>
                    <CardDescription className="text-muted-foreground">Most active organizations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(tenants || []).slice(0, 3).map((tenant) => (
                      <div key={tenant.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium text-foreground">{tenant.name}</p>
                          <p className="text-sm text-muted-foreground">{(tenant.users || []).length} users • ${tenant.monthlyRevenue || 0}/month</p>
                        </div>
                        <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                          {tenant.status}
                        </Badge>
                      </div>
                    ))}
                    {(!tenants || tenants.length === 0) && (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No tenants yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'tenants' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Tenant Management</h1>
                <div className="flex space-x-2">
                  <Button variant="outline" className="border-border">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button onClick={handleAddTenant} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tenant
                  </Button>
                </div>
              </div>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">All Tenants</CardTitle>
                  <CardDescription className="text-muted-foreground">Manage your platform tenants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(tenants || []).map((tenant) => {
                      const tenantAdmin = (users || []).find(u => u.id === tenant.tenantAdminId);
                      
                      return (
                        <div key={tenant.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                              <Building className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">{tenant.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {(tenant.users || []).length} users • {tenant.type} • {tenant.industry}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(tenant.subscribedApplications || []).map((appId, index) => {
                                  const app = (applications || []).find(a => a.id === appId);
                                  return app ? (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {app.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                                {tenant.status}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                Revenue: ${tenant.monthlyRevenue || 0}/month
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Admin: {tenantAdmin ? tenantAdmin.name : 'Not assigned'}
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-muted-foreground"
                              onClick={() => handleManageTenant(tenant)}
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    {(!tenants || tenants.length === 0) && (
                      <div className="text-center py-8">
                        <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No tenants created yet</p>
                        <p className="text-sm text-muted-foreground">Click "Add Tenant" to create your first organization</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Additional tabs content */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">User Management</h1>
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">All Users</CardTitle>
                  <CardDescription className="text-muted-foreground">Platform-wide user overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(users || []).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-lg bg-purple-600/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            {user.tenantId && (
                              <p className="text-xs text-muted-foreground">
                                Tenant: {(tenants || []).find(t => t.id === user.tenantId)?.name || user.tenantId}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={
                            user.role === 'platform_admin' ? 'default' :
                            user.role === 'platform_tenant_admin' ? 'secondary' : 'outline'
                          }>
                            {user.role.replace('platform_', '').replace('_', ' ')}
                          </Badge>
                          {user.assignedApplications && user.assignedApplications.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {user.assignedApplications.length} Apps
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {(!users || users.length === 0) && (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No users found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Advanced analytics dashboard coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Platform Settings</h1>
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Platform configuration panel coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Tenant Management Modal */}
      {selectedTenant && (
        <TenantManagementModal
          isOpen={showTenantManagement}
          onClose={handleCloseTenantManagement}
          tenant={selectedTenant}
          users={users || []}
          applications={applications || []}
          onAssignTenantAdmin={onAssignTenantAdmin}
        />
      )}
    </div>
  );
};

export default Hub;