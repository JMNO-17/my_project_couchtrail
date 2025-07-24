import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/enhanced-button';
import {
  Users,
  Activity,
  AlertTriangle,
  Star
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@radix-ui/react-avatar';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  region?: string;
  isActive: boolean;
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
    {
      id: 1,
      name: 'John Traveler',
      email: 'john@travel.com',
      role: 'user',
      region: 'Europe',
      isActive: true
    },
    {
      id: 2,
      name: 'Sarah Host',
      email: 'sarah@travel.com',
      role: 'user',
      region: 'Asia',
      isActive: true
    },
    {
      id: 3,
      name: 'Mike Explorer',
      email: 'mike@travel.com',
      role: 'user',
      region: 'Americas',
      isActive: false
    }
  ]);

  const [reviews] = useState<Review[]>([
    {
      id: 1,
      reviewerName: 'John Traveler',
      reviewedName: 'Sarah Host',
      type: 'host',
      rating: 5,
      isFlagged: false,
      comment: 'Amazing host, very welcoming!'
    },
    {
      id: 2,
      reviewerName: 'Mike Explorer',
      reviewedName: 'Anna Local',
      type: 'host',
      rating: 2,
      isFlagged: true,
      comment: 'Not what was expected...'
    }
  ]);

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.isActive).length,
    flaggedReviews: reviews.filter((r) => r.isFlagged).length
  };

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-8 text-white shadow-md">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg">Monitor and manage users and reviews efficiently</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle>Total Users</CardTitle>
            <Users className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-indigo-600">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500">Registered users</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle>Active Users</CardTitle>
            <Activity className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600">{stats.activeUsers}</p>
            <p className="text-sm text-gray-500">Currently active</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle>Flagged Reviews</CardTitle>
            <AlertTriangle className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-red-600">{stats.flaggedReviews}</p>
            <p className="text-sm text-gray-500">Need moderation</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-2 gap-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Review user activity and details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center p-4 border rounded-xl bg-muted hover:bg-muted/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-lg">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.region && <Badge variant="outline" className="mt-1">{user.region}</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Badge className={user.isActive ? 'bg-green-500' : 'bg-gray-300'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>{user.role}</Badge>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Moderation</CardTitle>
              <CardDescription>Handle flagged reviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium">
                        {review.reviewerName} reviewed {review.reviewedName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Type: {review.type} • Rating: {review.rating}/5
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {review.isFlagged && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" /> Flagged
                        </Badge>
                      )}
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                  {review.isFlagged && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="success">Approve</Button>
                      <Button size="sm" variant="destructive">Remove</Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
