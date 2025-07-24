import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';

import { useAuth } from '@/components/auth/AuthContext';
import { useDemo } from '@/hooks/useDemo';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  Users, 
  Calendar, 
  MapPin, 
  Star,
  Clock,
  Home,
  ArrowRight,
  Bell
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { users, getEnrichedHostingRequests, getEnrichedReviews } = useDemo();
  
  // Get enriched data
  const hostingRequests = getEnrichedHostingRequests();
  const reviews = getEnrichedReviews();

  // Get user's recent activity
  const userRequests = hostingRequests.filter(req => 
    req.traveler_id === user?.id || req.host_id === user?.id
  );
  const recentRequests = userRequests.slice(0, 3);

  const userReviews = reviews.filter(review => 
    review.reviewed_id === user?.id
  );
  const recentReviews = userReviews.slice(0, 3);

  // Quick stats
  const pendingRequests = userRequests.filter(req => req.status === 'pending');
  const totalConnections = users.length - 1; // Exclude current user

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground">
              Your travel community dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              All time requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConnections}</div>
            <p className="text-xs text-muted-foreground">
              Available connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userReviews.length}</div>
            <p className="text-xs text-muted-foreground">
              Reviews received
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Recent Requests</span>
            </CardTitle>
            <CardDescription>
              Your latest hosting requests and applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRequests.length > 0 ? (
              recentRequests.map((request) => {
                const otherUser = request.traveler_id === user?.id 
                  ? request.host
                  : request.traveler;
                
                const isHost = request.host_id === user?.id;
                
                return (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={otherUser?.avatar} alt={otherUser?.name} />
                        <AvatarFallback>
                          {otherUser?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {isHost ? 'Request from' : 'Request to'} {otherUser?.name}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {request.location}
                        </p>
                      </div>
                    </div>
                    <Badge variant={
                      request.status === 'pending' ? 'secondary' :
                      request.status === 'accepted' ? 'default' : 'destructive'
                    }>
                      {request.status}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No recent requests
              </p>
            )}
            <div className="pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/requests">
                  View All Requests
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Recent Reviews</span>
            </CardTitle>
            <CardDescription>
              What others are saying about you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReviews.length > 0 ? (
              recentReviews.map((review) => {
                const reviewer = review.reviewer;
                
                return (
                  <div key={review.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={reviewer?.avatar} alt={reviewer?.name} />
                          <AvatarFallback className="text-xs">
                            {reviewer?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{reviewer?.name}</span>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${
                              i < review.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "{review.comment}"
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No reviews yet
              </p>
            )}
            <div className="pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/reviews">
                  View All Reviews
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and navigation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col space-y-2" asChild>
                <Link to="/community">
                  <Users className="h-6 w-6" />
                  <span>Browse Community</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2" asChild>
                <Link to="/messages">
                  <MessageCircle className="h-6 w-6" />
                  <span>Messages</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2" asChild>
                <Link to="/hosting">
                  <Home className="h-6 w-6" />
                  <span>My Hosting</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2" asChild>
                <Link to="/profile">
                  <Star className="h-6 w-6" />
                  <span>Edit Profile</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};