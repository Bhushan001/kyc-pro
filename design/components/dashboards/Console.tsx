import React, { useState } from 'react';
import { Users, Shield, FileText, Settings, BarChart3, Plus, Search, Filter, UserPlus, Activity, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { User } from '../../App';

interface ConsoleProps {
  user: User;
  onLogout: () => void;
}

const Console = ({ user, onLogout }: ConsoleProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const mockOrgStats = {
    totalUsers: 245,
    pendingVerifications: 12,
    completedThisMonth: 187,
    complianceScore: 94
  };

  const mockUsers = [
    { id: '1', name: 'Alice Johnson', email: 'alice@techcorp.com', role: 'Manager', status: 'verified', lastLogin: '2 hours ago' },
    { id: '2', name: 'Bob Smith', email: 'bob@techcorp.com', role: 'Employee', status: 'pending', lastLogin: '1 day ago' },
    { id: '3', name: 'Carol Davis', email: 'carol@techcorp.com', role: 'Employee', status: 'verified', lastLogin: '3 hours ago' },
    { id: '4', name: 'David Wilson', email: 'david@techcorp.com', role: 'Manager', status: 'verified', lastLogin: '5 minutes ago' },
  ];

  const mockVerifications = [
    { id: '1', user: 'Alice Johnson', type: 'Identity Document', status: 'completed', date: '2 hours ago' },
    { id: '2', user: 'Bob Smith', type: 'Address Verification', status: 'pending', date: '1 day ago' },
    { id: '3', user: 'Carol Davis', type: 'Enhanced Due Diligence', status: 'in_review', date: '3 hours ago' },
    { id: '4', user: 'David Wilson', type: 'Identity Document', status: 'completed', date: '1 hour ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">Kyc-Pro Console</span>
            </div>
            <Badge variant="outline" className="border-purple-500 text-purple-400">Tenant Admin</Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input 
                placeholder="Search users, verifications..." 
                className="pl-10 w-64 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-300">TechCorp Inc</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{user.name}</span>
              <Button onClick={onLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-slate-800 min-h-screen p-6">
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
              variant={activeTab === 'compliance' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('compliance')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Compliance
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
                <h1 className="text-3xl font-bold text-white">Organization Dashboard</h1>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite User
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Team Members</CardTitle>
                    <Users className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{mockOrgStats.totalUsers}</div>
                    <p className="text-xs text-green-400">+8 this month</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Pending Verifications</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{mockOrgStats.pendingVerifications}</div>
                    <p className="text-xs text-yellow-400">Requires attention</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Completed This Month</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{mockOrgStats.completedThisMonth}</div>
                    <p className="text-xs text-green-400">+15% from last month</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Compliance Score</CardTitle>
                    <Activity className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{mockOrgStats.complianceScore}%</div>
                    <p className="text-xs text-green-400">Excellent rating</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Verifications</CardTitle>
                    <CardDescription className="text-slate-400">Latest KYC activities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockVerifications.slice(0, 4).map((verification) => (
                      <div key={verification.id} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/50">
                        <div className={`h-2 w-2 rounded-full ${
                          verification.status === 'completed' ? 'bg-green-400' :
                          verification.status === 'pending' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-white">{verification.user}</p>
                          <p className="text-xs text-slate-400">{verification.type} • {verification.date}</p>
                        </div>
                        <Badge variant={
                          verification.status === 'completed' ? 'default' :
                          verification.status === 'pending' ? 'secondary' : 'outline'
                        }>
                          {verification.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Team Activity</CardTitle>
                    <CardDescription className="text-slate-400">Recent user activity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockUsers.slice(0, 4).map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/50">
                        <div className="h-8 w-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-400">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{user.name}</p>
                          <p className="text-xs text-slate-400">Last login: {user.lastLogin}</p>
                        </div>
                        <Badge variant={user.status === 'verified' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Team Members</h1>
                <div className="flex space-x-2">
                  <Button variant="outline" className="border-slate-600">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite User
                  </Button>
                </div>
              </div>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">All Team Members</CardTitle>
                  <CardDescription className="text-slate-400">Manage your organization's users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                            <span className="font-medium text-purple-400">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{user.name}</h3>
                            <p className="text-sm text-slate-400">{user.email} • {user.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <Badge variant={user.status === 'verified' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                            <p className="text-xs text-slate-400 mt-1">Last login: {user.lastLogin}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-slate-400">
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Additional tabs content */}
          {activeTab === 'verifications' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white">Verification Management</h1>
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">Verification management interface coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white">Compliance Center</h1>
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">Compliance reporting dashboard coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white">Organization Settings</h1>
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">Organization configuration panel coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Console;