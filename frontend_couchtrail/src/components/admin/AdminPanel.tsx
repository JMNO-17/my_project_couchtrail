import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/enhanced-button';

import { 
  Users, 
  Home, 
  MessageSquare, 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
// import adminImage from '@/assets/admin-dashboard.jpg';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  region?: string;
  isActive: boolean;
}

interface HostingRequest {
  id: number;
  travelerName: string;
  hostName: string;
  location: string;
  status: 'pending' | 'accepted' | 'rejected';
  isSuspicious: boolean;
  date: string;
}

interface Review {
  id: number;
  reviewerName: string;
  reviewedName: string;
  type: 'host' | 'traveler';
  rating: number;
  isFlagged: boolean;
  comment: string;
}

export const AdminPanel: React.FC = () => {
  const [users] = useState<User[]>([
    { id: 1, name: 'John Traveler', email: 'john@travel.com', role: 'user', region: 'Europe', isActive: true },
    { id: 2, name: 'Sarah Host', email: 'sarah@travel.com', role: 'user', region: 'Asia', isActive: true },
    { id: 3, name: 'Mike Explorer', email: 'mike@travel.com', role: 'user', region: 'Americas', isActive: false },
  ]);

  const [hostingRequests] = useState<HostingRequest[]>([
    { id: 1, travelerName: 'John Traveler', hostName: 'Sarah Host', location: 'Tokyo, Japan', status: 'pending', isSuspicious: false, date: '2024-01-15' },
    { id: 2, travelerName: 'Mike Explorer', hostName: 'Anna Local', location: 'Paris, France', status: 'accepted', isSuspicious: true, date: '2024-01-14' },
    { id: 3, travelerName: 'Emma Wanderer', hostName: 'Carlos Guide', location: 'Barcelona, Spain', status: 'rejected', isSuspicious: false, date: '2024-01-13' },
  ]);

  const [reviews] = useState<Review[]>([
    { id: 1, reviewerName: 'John Traveler', reviewedName: 'Sarah Host', type: 'host', rating: 5, isFlagged: false, comment: 'Amazing host, very welcoming!' },
    { id: 2, reviewerName: 'Mike Explorer', reviewedName: 'Anna Local', type: 'host', rating: 2, isFlagged: true, comment: 'Not what was expected...' },
  ]);

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    pendingRequests: hostingRequests.filter(r => r.status === 'pending').length,
    flaggedReviews: reviews.filter(r => r.isFlagged).length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'accepted': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <img 
        //   src={adminImage} 
        src='https://example.com/admin-dashboard.jpg' 
          alt="Admin Dashboard" 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-glow/60 flex items-center">
          <div className="text-white p-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-white/90">Manage your travel community platform</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Reviews</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.flaggedReviews}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="requests">All Hosting Requests</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage registered users and their accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.region && (
                          <Badge variant="outline" className="mt-1">{user.region}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={user.isActive ? 'bg-success' : 'bg-muted'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                        {user.role}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Hosting Requests</CardTitle>
              <CardDescription>Admin view of all hosting requests in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hostingRequests.map((request) => (
                  <div key={request.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">
                          {request.travelerName} → {request.hostName}
                        </p>
                        <p className="text-sm text-muted-foreground">{request.location}</p>
                        <p className="text-xs text-muted-foreground">Date: {request.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {request.isSuspicious && (
                          <Badge variant="destructive" className="animate-pulse">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Suspicious
                          </Badge>
                        )}
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="success">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Management</CardTitle>
              <CardDescription>Monitor and moderate user reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">
                          {review.reviewerName} reviewed {review.reviewedName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Type: {review.type} • Rating: {review.rating}/5
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {review.isFlagged && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Flagged
                          </Badge>
                        )}
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>
                    {review.isFlagged && (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="success">
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};