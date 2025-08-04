import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Shield, Building, Users, Check, X } from 'lucide-react';
import { Tenant, User as UserType, Application } from '../App';
import { toast } from 'sonner@2.0.3';

interface TenantManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
  users: UserType[];
  applications: Application[];
  onAssignTenantAdmin: (tenantId: string, userId: string) => void;
}

const TenantManagementModal = ({ 
  isOpen, 
  onClose, 
  tenant, 
  users = [], 
  applications = [],
  onAssignTenantAdmin 
}: TenantManagementModalProps) => {
  const [selectedAdminId, setSelectedAdminId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Get available users who can be tenant admins (not already assigned to other tenants)
  const availableAdmins = users.filter(user => 
    (user.role === 'platform_tenant_admin' && !user.tenantId) ||
    (user.role === 'platform_user' && !user.tenantId)
  );

  const currentTenantAdmin = users.find(user => user.id === tenant.tenantAdminId);
  const tenantUsers = users.filter(user => user.tenantId === tenant.id);

  const handleAssignAdmin = async () => {
    if (!selectedAdminId) return;
    
    setIsAssigning(true);
    
    // Simulate API call
    setTimeout(() => {
      onAssignTenantAdmin(tenant.id, selectedAdminId);
      toast.success('Tenant admin assigned successfully!');
      setIsAssigning(false);
      setSelectedAdminId('');
      onClose();
    }, 1000);
  };

  const getTotalMonthlyCost = () => {
    return (tenant.subscribedApplications || []).reduce((total, appId) => {
      const app = applications.find(a => a.id === appId);
      return total + (app?.monthlyPrice || 0);
    }, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-blue-600" />
            <span>Manage {tenant.name}</span>
          </DialogTitle>
          <DialogDescription>
            Configure tenant settings, assign administrators, and manage subscriptions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tenant Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Tenant Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Organization</p>
                  <p className="font-medium text-foreground">{tenant.name}</p>
                  <p className="text-xs text-muted-foreground">{tenant.type} • {tenant.industry}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                    {tenant.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  <p className="font-medium text-foreground">${getTotalMonthlyCost()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User Limit</p>
                  <p className="font-medium text-foreground">{tenant.userLimit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Compliance</p>
                  <p className="font-medium text-foreground">{tenant.complianceLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground">{tenant.createdAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscribed Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Subscribed Applications</CardTitle>
              <CardDescription>Applications available to this tenant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(tenant.subscribedApplications || []).map(appId => {
                  const app = applications.find(a => a.id === appId);
                  if (!app) return null;
                  
                  return (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                          app.isHighlighted ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Shield className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{app.name}</p>
                          <p className="text-xs text-muted-foreground">{app.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">${app.monthlyPrice}/mo</p>
                        {app.isHighlighted && (
                          <Badge variant="outline" className="border-yellow-400 text-yellow-600 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
                {(!tenant.subscribedApplications || tenant.subscribedApplications.length === 0) && (
                  <div className="col-span-full text-center py-4">
                    <p className="text-muted-foreground">No applications subscribed</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tenant Admin Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Tenant Administrator</CardTitle>
              <CardDescription>
                Assign a tenant administrator who will manage users and applications for this organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentTenantAdmin ? (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-green-600/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{currentTenantAdmin.name}</p>
                      <p className="text-sm text-muted-foreground">{currentTenantAdmin.email}</p>
                      <Badge variant="outline" className="border-green-500 text-green-600 text-xs mt-1">
                        Current Admin
                      </Badge>
                    </div>
                  </div>
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Shield className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-foreground">No Administrator Assigned</p>
                      <p className="text-sm text-muted-foreground">This tenant needs an administrator to manage users and applications</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground">Select Administrator</label>
                      <Select value={selectedAdminId} onValueChange={setSelectedAdminId}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose a user to assign as tenant admin" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAdmins.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              <div className="flex items-center space-x-2">
                                <span>{user.name}</span>
                                <span className="text-muted-foreground">({user.email})</span>
                                <Badge variant="outline" className="text-xs">
                                  {user.role === 'platform_tenant_admin' ? 'Tenant Admin' : 'User'}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={handleAssignAdmin}
                      disabled={!selectedAdminId || isAssigning}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isAssigning ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Assigning...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Assign as Tenant Admin
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tenant Users */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Tenant Users</CardTitle>
              <CardDescription>
                Users belonging to this tenant organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tenantUsers.length > 0 ? (
                <div className="space-y-3">
                  {tenantUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-blue-600/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.role === 'platform_tenant_admin' ? 'default' : 'secondary'}>
                          {user.role === 'platform_tenant_admin' ? 'Admin' : 'User'}
                        </Badge>
                        {user.assignedApplications && user.assignedApplications.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {user.assignedApplications.length} Apps
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No users assigned to this tenant yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TenantManagementModal;