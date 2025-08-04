import React, { useState } from 'react';
import { Users, Shield, FileText, Settings, BarChart3, Plus, Search, Filter, UserPlus, Activity, CheckCircle, Clock, Eye, MapPin, Workflow } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { User, Tenant, Application, UserApplicationAccess } from '../../App';
import UserApplicationManagement from '../UserApplicationManagement';

interface ConsoleProps {
  user: User;
  onLogout: () => void;
  tenant?: Tenant;
  tenantUsers: User[];
  applications: Application[];
  userApplicationAccess: UserApplicationAccess[];
  onAssignUserApplications: (userId: string, applicationIds: string[], tenantId: string) => void;
}

const Console = ({ user, onLogout, tenant, tenantUsers, applications, userApplicationAccess, onAssignUserApplications }: ConsoleProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserAppManagement, setShowUserAppManagement] = useState(false);

  // If no tenant is assigned, show a message
  if (!tenant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Tenant Assigned</h2>
            <p className="text-muted-foreground mb-4">
              You need to be assigned to a tenant organization to access the Console.
            </p>
            <Button onClick={onLogout} variant="outline">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mockOrgStats = {
    totalUsers: tenantUsers.length,
    pendingVerifications: 12,
    completedThisMonth: 187,
    complianceScore: 94
  };

  const mockVerifications = [
    { id: '1', user: 'Alice Johnson', type: 'Identity Document', status: 'completed', date: '2 hours ago' },
    { id: '2', user: 'Bob Smith', type: 'Address Verification', status: 'pending', date: '1 day ago' },
    { id: '3', user: 'Carol Davis', type: 'Enhanced Due Diligence', status: 'in_review', date: '3 hours ago' },
    { id: '4', user: 'David Wilson', type: 'Identity Document', status: 'completed', date: '1 hour ago' },
  ];

  const getApplicationIcon = (appId: string) => {
    switch (appId) {
      case 'ekyc':
        return <Eye className="h-5 w-5" />;
      case 'sop':
        return <FileText className="h-5 w-5" />;
      case 'market-maps':
        return <MapPin className="h-5 w-5" />;
      case 'iam':
        return <Users className="h-5 w-5" />;
      case 'api-workflows':
        return <Workflow className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getUserApplicationAccess = (userId: string): string[] => {
    const access = userApplicationAccess.find(a => a.userId === userId);
    return access ? access.applicationIds : [];
  };

  const handleManageUserApplications = (user: User) => {
    setSelectedUser(user);
    setShowUserAppManagement(true);
  };

  const handleCloseUserAppManagement = () => {
    setShowUserAppManagement(false);
    setSelectedUser(null);
  };

  const subscribedApplications = applications.filter(app => tenant.subscribedApplications.includes(app.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-foreground">Kyc-Pro Console</span>
            </div>
            <Badge variant="outline" className="border-purple-600 text-purple-600">Tenant Admin</Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search users, verifications..." 
                className="pl-10 w-64 bg-input-background border-border text-foreground"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">{tenant.name}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{user.name}</span>
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
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant={activeTab === 'applications' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('applications')}
            >
              <Shield className="mr-2 h-4 w-4" />
              Applications
            </Button>
            <Button 
              variant={activeTab === 'users' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('users')}
            >
              <Users className="mr-2 h-4 w-4" />
              Team Members
            </Button>
            <Button 
              variant={activeTab === 'verifications' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('verifications')}
            >
              <Shield className="mr-2 h-4 w-4" />
              Verifications
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
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{tenant.name} Dashboard</h1>
                  <p className="text-muted-foreground">{tenant.type} • {tenant.industry}</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite User
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Team Members</CardTitle>
                    <Users className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{mockOrgStats.totalUsers}</div>
                    <p className="text-xs text-green-600">+8 this month</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
                    <Shield className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{tenant.subscribedApplications.length}</div>
                    <p className="text-xs text-blue-600">Subscribed services</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Cost</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">${tenant.monthlyRevenue}</div>
                    <p className="text-xs text-green-600">Active subscription</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Score</CardTitle>
                    <Activity className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{mockOrgStats.complianceScore}%</div>
                    <p className="text-xs text-green-600">Excellent rating</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Subscribed Applications</CardTitle>
                    <CardDescription className="text-muted-foreground">Applications available to your team</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {subscribedApplications.map((app) => (
                      <div key={app.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                          app.isHighlighted ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          {getApplicationIcon(app.id)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{app.name}</p>
                          <p className="text-xs text-muted-foreground">${app.monthlyPrice}/month</p>
                        </div>
                        {app.isHighlighted && (
                          <Badge variant="outline" className="border-yellow-400 text-yellow-600 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Team Activity</CardTitle>
                    <CardDescription className="text-muted-foreground">Recent user activity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tenantUsers.slice(0, 4).map((member) => {
                      const userApps = getUserApplicationAccess(member.id);
                      return (
                        <div key={member.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                          <div className="h-8 w-8 rounded-full bg-purple-600/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-600">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{member.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {userApps.length} applications assigned
                            </p>
                          </div>
                          <Badge variant={member.role === 'platform_tenant_admin' ? 'default' : 'secondary'}>
                            {member.role === 'platform_tenant_admin' ? 'Admin' : 'User'}
                          </Badge>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Application Management</h1>
              </div>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Subscribed Applications</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Applications your organization has subscribed to
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {subscribedApplications.map((app) => (
                      <Card key={app.id} className="bg-muted/30 border-border">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                                app.isHighlighted ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'
                              }`}>
                                {getApplicationIcon(app.id)}
                              </div>
                              <div>
                                <h3 className="font-medium text-foreground">{app.name}</h3>
                                <p className="text-sm text-muted-foreground">{app.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {app.features.slice(0, 3).map((feature, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-foreground">${app.monthlyPrice}/month</p>
                              {app.isHighlighted && (
                                <Badge variant="outline" className="border-yellow-400 text-yellow-600 text-xs mt-1">
                                  Featured
                                </Badge>
                              )}
                              <div className="mt-2">
                                <p className="text-xs text-muted-foreground">
                                  {userApplicationAccess.filter(access => access.applicationIds.includes(app.id)).length} users assigned
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Team Members</h1>
                <div className="flex space-x-2">
                  <Button variant="outline" className="border-border">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite User
                  </Button>
                </div>
              </div>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">All Team Members</CardTitle>
                  <CardDescription className="text-muted-foreground">Manage your organization's users and their application access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tenantUsers.map((member) => {
                      const userApps = getUserApplicationAccess(member.id);
                      const assignedAppNames = userApps.map(appId => applications.find(a => a.id === appId)?.name).filter(Boolean);
                      
                      return (
                        <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-purple-600/10 flex items-center justify-center">
                              <span className="font-medium text-purple-600">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">{member.name}</h3>
                              <p className="text-sm text-muted-foreground">{member.email}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {assignedAppNames.map((appName, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {appName}
                                  </Badge>
                                ))}
                                {userApps.length === 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    No applications assigned
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <Badge variant={member.role === 'platform_tenant_admin' ? 'default' : 'secondary'}>
                                {member.role === 'platform_tenant_admin' ? 'Admin' : 'User'}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {userApps.length} app{userApps.length !== 1 ? 's' : ''} assigned
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-muted-foreground"
                              onClick={() => handleManageUserApplications(member)}
                            >
                              Manage Apps
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Additional tabs content */}
          {activeTab === 'verifications' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Verification Management</h1>
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Verification management interface coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Organization Settings</h1>
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Tenant Configuration</CardTitle>
                  <CardDescription className="text-muted-foreground">Settings specific to {tenant.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Organization Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Name:</span> {tenant.name}</p>
                        <p><span className="text-muted-foreground">Type:</span> {tenant.type}</p>
                        <p><span className="text-muted-foreground">Industry:</span> {tenant.industry}</p>
                        <p><span className="text-muted-foreground">Country:</span> {tenant.country}</p>
                        <p><span className="text-muted-foreground">Contact:</span> {tenant.contactEmail}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Configuration</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">User Limit:</span> {tenant.userLimit}</p>
                        <p><span className="text-muted-foreground">Compliance Level:</span> {tenant.complianceLevel}</p>
                        <p><span className="text-muted-foreground">Data Retention:</span> {tenant.dataRetention}</p>
                        <p><span className="text-muted-foreground">SSO Enabled:</span> {tenant.ssoEnabled ? 'Yes' : 'No'}</p>
                        {tenant.customDomain && (
                          <p><span className="text-muted-foreground">Custom Domain:</span> {tenant.customDomain}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* User Application Management Modal */}
      {selectedUser && (
        <UserApplicationManagement
          isOpen={showUserAppManagement}
          onClose={handleCloseUserAppManagement}
          user={selectedUser}
          applications={applications}
          subscribedApplications={tenant.subscribedApplications}
          currentAccess={getUserApplicationAccess(selectedUser.id)}
          onAssignApplications={onAssignUserApplications}
          tenantId={tenant.id}
        />
      )}
    </div>
  );
};

export default Console;