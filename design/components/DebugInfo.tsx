import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, Tenant } from '../App';

interface DebugInfoProps {
  user: User;
  tenant?: Tenant;
}

const DebugInfo = ({ user, tenant }: DebugInfoProps) => {
  return (
    <Card className="mb-4 bg-yellow-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="text-sm text-yellow-800">Debug Information</CardTitle>
        <CardDescription className="text-yellow-700">
          Current user and tenant context
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-yellow-800 mb-2">User Details</h4>
            <div className="space-y-1 text-yellow-700">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> <Badge variant="outline">{user.role}</Badge></p>
              {user.tenantId && <p><strong>Tenant ID:</strong> {user.tenantId}</p>}
              {user.assignedApplications && (
                <p><strong>Apps:</strong> {user.assignedApplications.join(', ')}</p>
              )}
            </div>
          </div>
          
          {tenant && (
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">Tenant Details</h4>
              <div className="space-y-1 text-yellow-700">
                <p><strong>ID:</strong> {tenant.id}</p>
                <p><strong>Name:</strong> {tenant.name}</p>
                <p><strong>Type:</strong> {tenant.type}</p>
                <p><strong>Industry:</strong> {tenant.industry}</p>
                <p><strong>Admin ID:</strong> {tenant.tenantAdminId || 'None'}</p>
                <p><strong>Apps:</strong> {tenant.subscribedApplications.join(', ')}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugInfo;