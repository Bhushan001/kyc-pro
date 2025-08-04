import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { User, Shield, Eye, FileText, Users, Workflow, MapPin, Star } from 'lucide-react';
import { User as UserType, Application, UserApplicationAccess } from '../App';
import { toast } from 'sonner@2.0.3';

interface UserApplicationManagementProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  applications: Application[];
  subscribedApplications: string[];
  currentAccess: string[];
  onAssignApplications: (userId: string, applicationIds: string[], tenantId: string) => void;
  tenantId: string;
}

const UserApplicationManagement = ({ 
  isOpen, 
  onClose, 
  user, 
  applications,
  subscribedApplications,
  currentAccess,
  onAssignApplications,
  tenantId
}: UserApplicationManagementProps) => {
  const [selectedApplications, setSelectedApplications] = useState<string[]>(currentAccess);
  const [isAssigning, setIsAssigning] = useState(false);

  const availableApplications = applications.filter(app => subscribedApplications.includes(app.id));

  const handleApplicationToggle = (appId: string) => {
    setSelectedApplications(prev => 
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const handleAssignApplications = async () => {
    setIsAssigning(true);
    
    // Simulate API call
    setTimeout(() => {
      onAssignApplications(user.id, selectedApplications, tenantId);
      toast.success(`Applications updated for ${user.name}!`);
      setIsAssigning(false);
      onClose();
    }, 1000);
  };

  const getApplicationIcon = (appId: string) => {
    switch (appId) {
      case 'ekyc':
        return <Eye className="h-6 w-6" />;
      case 'sop':
        return <FileText className="h-6 w-6" />;
      case 'market-maps':
        return <MapPin className="h-6 w-6" />;
      case 'iam':
        return <Users className="h-6 w-6" />;
      case 'api-workflows':
        return <Workflow className="h-6 w-6" />;
      default:
        return <Shield className="h-6 w-6" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Manage Applications for {user.name}</span>
          </DialogTitle>
          <DialogDescription>
            Assign or remove application access for this user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-600/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {user.role === 'platform_user' ? 'User' : 'Tenant Admin'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Available Applications</CardTitle>
              <CardDescription className="text-muted-foreground">
                Select applications this user can access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableApplications.map((app) => (
                <div 
                  key={app.id} 
                  className={`relative p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedApplications.includes(app.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-border hover:border-muted-foreground'
                  } ${app.isHighlighted ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}
                  onClick={() => handleApplicationToggle(app.id)}
                >
                  {app.isHighlighted && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-yellow-500 text-yellow-900">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={selectedApplications.includes(app.id)}
                      onChange={() => handleApplicationToggle(app.id)}
                    />
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      app.isHighlighted ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      {getApplicationIcon(app.id)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground">{app.name}</h3>
                        <div className="text-right">
                          <p className="font-medium text-foreground">${app.monthlyPrice}/month</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{app.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {app.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {app.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{app.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Current vs New Access Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Access Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Current Access</h4>
                  <div className="space-y-1">
                    {currentAccess.length > 0 ? (
                      currentAccess.map(appId => {
                        const app = applications.find(a => a.id === appId);
                        return app ? (
                          <div key={app.id} className="text-sm text-muted-foreground">
                            • {app.name}
                          </div>
                        ) : null;
                      })
                    ) : (
                      <div className="text-sm text-muted-foreground">No applications assigned</div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">New Access</h4>
                  <div className="space-y-1">
                    {selectedApplications.length > 0 ? (
                      selectedApplications.map(appId => {
                        const app = applications.find(a => a.id === appId);
                        const isNew = !currentAccess.includes(appId);
                        return app ? (
                          <div key={app.id} className={`text-sm ${isNew ? 'text-green-600' : 'text-muted-foreground'}`}>
                            • {app.name} {isNew && '(New)'}
                          </div>
                        ) : null;
                      })
                    ) : (
                      <div className="text-sm text-muted-foreground">No applications selected</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Changes Alert */}
          {JSON.stringify(selectedApplications.sort()) !== JSON.stringify(currentAccess.sort()) && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Changes Detected</p>
                    <p className="text-sm text-blue-700">
                      You have made changes to this user's application access. Click "Update Access" to save changes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-between space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssignApplications}
            disabled={isAssigning || JSON.stringify(selectedApplications.sort()) === JSON.stringify(currentAccess.sort())}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isAssigning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Update Access
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserApplicationManagement;