import React, { useState, useEffect } from 'react';
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
import API from '@/api';

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
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, reviewsRes] = await Promise.all([
          API.get('/users'),
          API.get('/reviews')
        ]);
        setUsers(usersRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchData();
  }, []);

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.isActive).length,
    flaggedReviews: reviews.filter((r) => r.isFlagged).length
  };

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-8 text-white shadow-md">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg">Monitor and manage users and reviews efficiently</p>
      </div>

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
                  className="flex justify-between items-center p-4 border rounded-xl bg-muted hover:bg-muted/50 transition flex-wrap"
                >
                  <div className="flex items-center gap-4 mb-2 sm:mb-0">
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

                  <div className="flex flex-wrap gap-2 items-center">
                    <Button
                      size="sm"
                      className={user.isActive ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 hover:bg-gray-400 text-black'}
                      onClick={async () => {
                        try {
                          const res = await API.patch(`/users/${user.id}/toggle-active`);
                          setUsers(prev =>
                            prev.map(u => u.id === user.id ? res.data : u)
                          );
                        } catch (err) {
                          console.error('Toggle active failed:', err);
                          alert('Failed to toggle user status.');
                        }
                      }}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Button>

                    <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>{user.role}</Badge>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        if (confirm(`Are you sure to remove ${user.name}?`)) {
                          try {
                            await API.delete(`/users/${user.id}`);
                            setUsers(prev => prev.filter(u => u.id !== user.id));
                          } catch (err) {
                            console.error('Delete failed:', err);
                            alert('Failed to delete user.');
                          }
                        }
                      }}
                    >
                      Remove
                    </Button>
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
