import React, { useState } from 'react';
import { User, FileText, Shield, Clock, CheckCircle, Upload, Camera, AlertCircle, Download, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { User as UserType } from '../../App';

interface WorkspaceProps {
  user: UserType;
  onLogout: () => void;
}

const Workspace = ({ user, onLogout }: WorkspaceProps) => {
  const [activeTab, setActiveTab] = useState('overview');

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
    { id: '1', title: 'Upload Bank Statement', priority: 'high', dueDate: '2024-02-05', completed: false },
    { id: '2', title: 'Update Address Information', priority: 'medium', dueDate: '2024-02-10', completed: false },
    { id: '3', title: 'Complete Enhanced Verification', priority: 'low', dueDate: '2024-02-15', completed: false },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold text-white">Kyc-Pro Workspace</span>
            </div>
            <Badge variant="outline" className="border-green-500 text-green-400">Platform User</Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-slate-300">Welcome back, {user.name}</p>
              <p className="text-xs text-slate-400">Last login: 2 hours ago</p>
            </div>
            <Button onClick={onLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-slate-800 min-h-screen p-6">
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
              variant={activeTab === 'documents' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('documents')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Documents
            </Button>
            <Button 
              variant={activeTab === 'verification' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('verification')}
            >
              <Shield className="mr-2 h-4 w-4" />
              Verification
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">My Profile</h1>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>

              {/* Profile Completion */}
              <Card className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border-green-500/50">
                <CardHeader>
                  <CardTitle className="text-white">Profile Completion</CardTitle>
                  <CardDescription className="text-slate-300">Complete your verification to unlock full access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Progress</span>
                      <span className="text-white font-medium">{mockProfile.completionProgress}%</span>
                    </div>
                    <Progress value={mockProfile.completionProgress} className="h-3" />
                    <p className="text-sm text-slate-300">
                      {mockProfile.documentsUploaded} of 4 documents uploaded • Last update: {mockProfile.lastUpdate}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Documents</CardTitle>
                    <FileText className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{mockProfile.documentsUploaded}/4</div>
                    <p className="text-xs text-slate-400">Uploaded</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Status</CardTitle>
                    <Shield className="h-4 w-4 text-yellow-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white capitalize">{mockProfile.verificationStatus.replace('_', ' ')}</div>
                    <p className="text-xs text-yellow-400">Review in progress</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Tasks</CardTitle>
                    <Clock className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{mockTasks.filter(t => !t.completed).length}</div>
                    <p className="text-xs text-blue-400">Pending</p>
                  </CardContent>
                </Card>
              </div>

              {/* Action Items */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Pending Tasks</CardTitle>
                    <CardDescription className="text-slate-400">Complete these items to finish verification</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockTasks.filter(task => !task.completed).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                        <div className="flex items-center space-x-3">
                          <div className={`h-2 w-2 rounded-full ${
                            task.priority === 'high' ? 'bg-red-400' :
                            task.priority === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                          }`} />
                          <div>
                            <p className="text-sm text-white">{task.title}</p>
                            <p className="text-xs text-slate-400">Due: {task.dueDate}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-slate-600">
                          Start
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Documents</CardTitle>
                    <CardDescription className="text-slate-400">Your uploaded verification documents</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockDocuments.filter(doc => doc.status !== 'required').slice(0, 3).map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-slate-400" />
                          <div>
                            <p className="text-sm text-white">{doc.name}</p>
                            <p className="text-xs text-slate-400">{doc.type}</p>
                          </div>
                        </div>
                        <Badge variant={doc.status === 'verified' ? 'default' : 'secondary'}>
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Document Management</h1>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Document
                </Button>
              </div>

              <div className="grid gap-6">
                {mockDocuments.map((doc) => (
                  <Card key={doc.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                            doc.status === 'verified' ? 'bg-green-600/20' :
                            doc.status === 'pending' ? 'bg-yellow-600/20' : 'bg-slate-600/20'
                          }`}>
                            {doc.status === 'required' ? (
                              <Upload className="h-6 w-6 text-slate-400" />
                            ) : (
                              <FileText className={`h-6 w-6 ${
                                doc.status === 'verified' ? 'text-green-400' :
                                doc.status === 'pending' ? 'text-yellow-400' : 'text-slate-400'
                              }`} />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{doc.name}</h3>
                            <p className="text-sm text-slate-400">{doc.type}</p>
                            {doc.uploadDate && (
                              <p className="text-xs text-slate-500">Uploaded: {doc.uploadDate}</p>
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
                              <p className="text-xs text-slate-400 mt-1">Expires: {doc.expiryDate}</p>
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
                                <Button size="sm" variant="ghost" className="text-slate-400">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-slate-400">
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

          {/* Additional tabs content */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white">Verification Status</h1>
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">Detailed verification status coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-white">Activity History</h1>
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">Activity history timeline coming soon...</p>
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