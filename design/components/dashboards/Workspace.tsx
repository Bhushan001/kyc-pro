import React, { useState } from 'react';
import { User, FileText, Shield, Clock, CheckCircle, Upload, Camera, AlertCircle, Download, Eye, MapPin, Workflow, Users as UsersIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { User as UserType, Tenant, Application } from '../../App';
import EKYCApplication from '../EKYCApplication';
import DebugInfo from '../DebugInfo';

interface WorkspaceProps {
  user: UserType;
  onLogout: () => void;
  tenant?: Tenant;
  assignedApplications: Application[];
}

const Workspace = ({ user, onLogout, tenant, assignedApplications }: WorkspaceProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [showEKYCApp, setShowEKYCApp] = useState(false);

  // If no tenant is assigned, show a message
  if (!tenant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Organization Assigned</h2>
            <p className="text-muted-foreground mb-4">
              You need to be assigned to an organization to access the Workspace.
            </p>
            <Button onClick={onLogout} variant="outline">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If E-KYC application is launched
  if (showEKYCApp) {
    return (
      <EKYCApplication 
        onClose={() => setShowEKYCApp(false)}
        userInfo={{
          name: user.name,
          organization: tenant.name
        }}
      />
    );
  }

  const mockProfile = {
    completionProgress: 75,
    documentsUploaded: 3,
    verificationStatus: 'in_progress',
    lastUpdate: '2 days ago'
  };

  const mockDocuments = [
    { 
      id: '1', 
      name: 'Driver\'s License', 
      type: 'Identity Document', 
      status: 'verified', 
      uploadDate: '2024-01-15',
      expiryDate: '2026-01-15'
    },
    { 
      id: '2', 
      name: 'Passport', 
      type: 'Identity Document', 
      status: 'verified', 
      uploadDate: '2024-01-16',
      expiryDate: '2028-05-20'
    },
    { 
      id: '3', 
      name: 'Utility Bill', 
      type: 'Address Verification', 
      status: 'pending', 
      uploadDate: '2024-01-20',
      expiryDate: null
    },
    { 
      id: '4', 
      name: 'Bank Statement', 
      type: 'Financial Verification', 
      status: 'required', 
      uploadDate: null,
      expiryDate: null
    }
  ];

  const mockTasks = [
    { id: '1', title: 'Complete E-KYC Verification', priority: 'high', dueDate: '2024-02-05', completed: false },
    { id: '2', title: 'Update Address Information', priority: 'medium', dueDate: '2024-02-10', completed: false },
    { id: '3', title: 'Review SOP Documentation', priority: 'low', dueDate: '2024-02-15', completed: false },
  ];

  const recentEKYCActivity = [
    { id: '1', type: 'Aadhaar', customer: 'RAHUL KUMAR', status: 'completed', time: '2 hours ago' },
    { id: '2', type: 'PAN', customer: 'ANJALI SINGH', status: 'in_progress', time: '4 hours ago' },
    { id: '3', type: 'Aadhaar', customer: 'VIKRAM SHAH', status: 'completed', time: '1 day ago' },
    { id: '4', type: 'PAN', customer: 'MEERA PATEL', status: 'pending', time: '2 days ago' },
  ];

  const getApplicationIcon = (appId: string) => {
    switch (appId) {
      case 'ekyc':
        return <Eye className="h-8 w-8" />;
      case 'sop':
        return <FileText className="h-8 w-8" />;
      case 'market-maps':
        return <MapPin className="h-8 w-8" />;
      case 'iam':
        return <UsersIcon className="h-8 w-8" />;
      case 'api-workflows':
        return <Workflow className="h-8 w-8" />;
      default:
        return <Shield className="h-8 w-8" />;
    }
  };

  const getApplicationDescription = (appId: string) => {
    switch (appId) {
      case 'ekyc':
        return 'Complete identity verification, document processing, and compliance checks for customers';
      case 'sop':
        return 'Access standard operating procedures and workflow documentation for your role';
      case 'market-maps':
        return 'View market intelligence reports and customer analytics for your region';
      case 'iam':
        return 'Manage your account settings and access permissions within the organization';
      case 'api-workflows':
        return 'Configure and monitor API integrations and workflows for your department';
      default:
        return 'Application workspace and tools for your daily tasks';
    }
  };

  const handleLaunchApplication = (appId: string) => {
    setSelectedApp(appId);
    if (appId === 'ekyc') {
      setShowEKYCApp(true);
    } else {
      setActiveTab('app-workspace');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-foreground">Kyc-Pro Workspace</span>
            </div>
            <Badge variant="outline" className="border-green-600 text-green-600">Platform User</Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
              <p className="text-xs text-muted-foreground">{tenant.name}</p>
            </div>
            <Button onClick={onLogout} variant="outline" size="sm">
              Logout
            </Button>
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
              <User className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button 
              variant={activeTab === 'applications' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('applications')}
            >
              <Shield className="mr-2 h-4 w-4" />
              My Applications
            </Button>
            {selectedApp && activeTab === 'app-workspace' && (
              <div className="ml-4 space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => setActiveTab('app-workspace')}
                >
                  • {assignedApplications.find(app => app.id === selectedApp)?.name} Workspace
                </Button>
              </div>
            )}
            <Button 
              variant={activeTab === 'documents' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('documents')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Documents
            </Button>
            <Button 
              variant={activeTab === 'history' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('history')}
            >
              <Clock className="mr-2 h-4 w-4" />
              History
            </Button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Debug Info */}
          <DebugInfo user={user} tenant={tenant} />

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
                  <p className="text-muted-foreground">{tenant.name} • {assignedApplications.length} applications available</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowEKYCApp(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Quick E-KYC
                </Button>
              </div>

              {/* Application Access Summary */}
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-foreground">Application Access</CardTitle>
                  <CardDescription className="text-muted-foreground">Applications assigned to you by your organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assignedApplications.length > 0 ? (
                      assignedApplications.map((app) => (
                        <div key={app.id} className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg hover:bg-white/90 transition-colors cursor-pointer"
                             onClick={() => handleLaunchApplication(app.id)}>
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            app.isHighlighted ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'
                          }`}>
                            {getApplicationIcon(app.id)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{app.name}</p>
                            <p className="text-xs text-muted-foreground">Click to launch</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No applications assigned</p>
                        <p className="text-sm text-muted-foreground">Contact your administrator to request access</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
                    <Shield className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{assignedApplications.length}</div>
                    <p className="text-xs text-muted-foreground">Assigned to you</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Tasks</CardTitle>
                    <Clock className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{mockTasks.filter(t => !t.completed).length}</div>
                    <p className="text-xs text-blue-600">Pending</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">E-KYC Today</CardTitle>
                    <Eye className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">12</div>
                    <p className="text-xs text-green-600">+3 from yesterday</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Recent E-KYC Activity</CardTitle>
                    <CardDescription className="text-muted-foreground">Latest verification requests you processed</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentEKYCActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center space-x-3">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            activity.type === 'Aadhaar' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                          }`}>
                            {activity.type === 'Aadhaar' ? 'A' : 'P'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{activity.customer}</p>
                            <p className="text-xs text-muted-foreground">{activity.type} verification • {activity.time}</p>
                          </div>
                        </div>
                        <Badge variant={
                          activity.status === 'completed' ? 'default' :
                          activity.status === 'in_progress' ? 'secondary' : 'outline'
                        }>
                          {activity.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Pending Tasks</CardTitle>
                    <CardDescription className="text-muted-foreground">Items requiring your attention</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockTasks.filter(t => !t.completed).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center space-x-3">
                          <div className={`h-2 w-2 rounded-full ${
                            task.priority === 'high' ? 'bg-red-500' :
                            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <div>
                            <p className="text-sm font-medium text-foreground">{task.title}</p>
                            <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
              </div>

              {assignedApplications.length > 0 ? (
                <div className="grid gap-6">
                  {assignedApplications.map((app) => (
                    <Card key={app.id} className="bg-card border-border hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`h-16 w-16 rounded-lg flex items-center justify-center ${
                              app.isHighlighted ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'
                            }`}>
                              {getApplicationIcon(app.id)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-xl font-medium text-foreground">{app.name}</h3>
                                {app.isHighlighted && (
                                  <Badge variant="outline" className="border-yellow-400 text-yellow-600">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{getApplicationDescription(app.id)}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {app.features.slice(0, 4).map((feature, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Button 
                              className={app.isHighlighted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}
                              onClick={() => handleLaunchApplication(app.id)}
                            >
                              Launch {app.name}
                            </Button>
                            <div className="text-center">
                              <Badge variant="outline" className="text-xs">
                                Active
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="p-8 text-center">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Applications Assigned</h3>
                    <p className="text-muted-foreground">
                      You don't have access to any applications yet. Contact your administrator to request access to applications.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'app-workspace' && selectedApp && (
            <div className="space-y-6">
              {(() => {
                const app = assignedApplications.find(a => a.id === selectedApp);
                if (!app) return null;
                
                return (
                  <div>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        app.isHighlighted ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'
                      }`}>
                        {getApplicationIcon(app.id)}
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-foreground">{app.name} Workspace</h1>
                        <p className="text-muted-foreground">{app.description}</p>
                      </div>
                    </div>

                    <Card className="bg-card border-border">
                      <CardContent className="p-8 text-center">
                        <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                          app.isHighlighted ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          {getApplicationIcon(app.id)}
                        </div>
                        <h3 className="text-xl font-medium text-foreground mb-2">{app.name} Interface</h3>
                        <p className="text-muted-foreground mb-4">
                          {app.id === 'ekyc' 
                            ? 'Process customer identity verification requests, upload documents, and manage verification workflows.'
                            : `The ${app.name} interface will be loaded here with full functionality for your role.`
                          }
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          {app.features.map((feature, index) => (
                            <div key={index} className="p-3 bg-muted/30 rounded-lg">
                              <p className="text-sm font-medium text-foreground">{feature}</p>
                            </div>
                          ))}
                        </div>
                        
                        {app.id === 'ekyc' && (
                          <div className="mt-6">
                            <Button 
                              onClick={() => setShowEKYCApp(true)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Launch Full E-KYC Application
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Document Management</h1>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Document
                </Button>
              </div>

              <div className="grid gap-6">
                {mockDocuments.map((doc) => (
                  <Card key={doc.id} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                            doc.status === 'verified' ? 'bg-green-100' :
                            doc.status === 'pending' ? 'bg-yellow-100' : 'bg-muted'
                          }`}>
                            {doc.status === 'required' ? (
                              <Upload className="h-6 w-6 text-muted-foreground" />
                            ) : (
                              <FileText className={`h-6 w-6 ${
                                doc.status === 'verified' ? 'text-green-600' :
                                doc.status === 'pending' ? 'text-yellow-600' : 'text-muted-foreground'
                              }`} />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{doc.name}</h3>
                            <p className="text-sm text-muted-foreground">{doc.type}</p>
                            {doc.uploadDate && (
                              <p className="text-xs text-muted-foreground">Uploaded: {doc.uploadDate}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <Badge variant={
                              doc.status === 'verified' ? 'default' :
                              doc.status === 'pending' ? 'secondary' : 'outline'
                            }>
                              {doc.status}
                            </Badge>
                            {doc.expiryDate && (
                              <p className="text-xs text-muted-foreground mt-1">Expires: {doc.expiryDate}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            {doc.status === 'required' ? (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload
                              </Button>
                            ) : (
                              <>
                                <Button size="sm" variant="ghost" className="text-muted-foreground">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-muted-foreground">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Activity History</h1>
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Activity history timeline coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Workspace;