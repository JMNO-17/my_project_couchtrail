import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { useDemo } from '@/hooks/useDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, MapPin, Calendar, Star, Home, MessageCircle, Edit, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getEnrichedReviews, getEnrichedHostings, getEnrichedHostingRequests } = useDemo();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    region: user?.region || ''
  });

  if (!user) return null;

  const reviews = getEnrichedReviews().filter(r => r.reviewed_id === user.id);
  const hostings = getEnrichedHostings().filter(h => h.user_id === user.id);
  const requests = getEnrichedHostingRequests().filter(r => r.traveler_id === user.id || r.host_id === user.id);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile
    setIsEditing(false);
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-muted-foreground'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your travel profile and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Profile Card */}
          <Card className="shadow-travel">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Profile Info</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xl">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Name"
                    />
                    <Input
                      value={editForm.region}
                      onChange={(e) => setEditForm(prev => ({ ...prev, region: e.target.value }))}
                      placeholder="Region"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveProfile}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {user.region || 'No region set'}
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {user.email}
                </div>
                {/* <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Joined {format(new Date(user.created_at), 'MMM yyyy')}
                </div> */}
                {user.isAdmin && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <Badge variant="default">Admin</Badge>
                  </div>
                )}
              </div>

              {reviews.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Rating</span>
                    <StarRating rating={Math.round(averageRating)} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {averageRating.toFixed(1)} from {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Become a Host Card */}
          <Card className="shadow-travel">
            <CardContent className="text-center py-8 h-full flex flex-col justify-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mx-auto mb-4">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Become a Host</h3>
              <p className="text-muted-foreground mb-4">
                Share your space and connect with travelers from around the world
              </p>
              <Button 
                // className="bg-gradient-hero"
                onClick={() => navigate('/hosting')}
              >
                Start Hosting
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Activity Tabs */}
        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="reviews">Recent Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-4">
            {reviews.length === 0 ? (
              <Card className="shadow-travel">
                <CardContent className="text-center py-12">
                  <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">
                    Reviews from your experiences will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              reviews.slice(0, 3).map((review) => (
                <Card key={review.id} className="shadow-travel">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.reviewer?.avatar} />
                        <AvatarFallback>
                          {review.reviewer?.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{review.reviewer?.name}</span>
                          <StarRating rating={review.rating} />
                          <Badge variant={review.type === 'host' ? 'default' : 'secondary'}>
                            {review.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(review.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};