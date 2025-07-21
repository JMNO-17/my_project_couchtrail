import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { useDemo } from '@/hooks/useDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { MapPin, Star, Calendar, MessageCircle, Home, User, ArrowLeft, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

export const UserProfilePage = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { users, getEnrichedReviews, getEnrichedHostings, addHostingRequest } = useDemo();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    location: '',
    message: '',
    date: ''
  });

  if (!user) return null;

  const profileUser = users.find(u => u.id === parseInt(userId || '0'));
  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">User not found</h3>
            <Button onClick={() => navigate(-1)}>Go back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userReviews = getEnrichedReviews().filter(r => r.reviewed_id === profileUser.id);
  const userHosting = getEnrichedHostings().find(h => h.user_id === profileUser.id);
  const averageRating = userReviews.length > 0 
    ? userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length 
    : 0;

  const handleSendRequest = () => {
    if (!requestData.location || !requestData.message || !requestData.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    addHostingRequest({
      traveler_id: user.id,
      host_id: profileUser.id,
      location: requestData.location,
      message: requestData.message,
      date: requestData.date,
      status: 'pending',
      is_suspicious: false
    });

    toast({
      title: "Request Sent",
      description: `Your hosting request has been sent to ${profileUser.name}`,
    });

    setShowRequestForm(false);
    setRequestData({ location: '', message: '', date: '' });
  };

  const isHost = !!userHosting;
  const canSendRequest = user.id !== profileUser.id && isHost;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">User Profile</h1>
        </div>

        {/* User Info Card */}
        <Card className="shadow-travel">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profileUser.avatar} />
                  <AvatarFallback className="text-xl">
                    {profileUser.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold">{profileUser.name}</h2>
                  {profileUser.region && (
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      {profileUser.region}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={isHost ? "default" : "secondary"}>
                      {isHost ? "Host" : "Traveler"}
                    </Badge>
                    {userReviews.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{averageRating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({userReviews.length})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                {isHost && userHosting && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">About My Home</h3>
                      <p className="text-muted-foreground">{userHosting.home_description}</p>
                    </div>
                    
                    {userHosting.address && (
                      <div>
                        <h4 className="font-medium mb-1">Location</h4>
                        <p className="text-sm text-muted-foreground">{userHosting.address}</p>
                      </div>
                    )}

                    {userHosting.preferences && (
                      <div>
                        <h4 className="font-medium mb-1">Guest Preferences</h4>
                        <p className="text-sm text-muted-foreground">{userHosting.preferences}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {!isHost && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">About {profileUser.name}</h3>
                    <p className="text-muted-foreground">
                      Traveler exploring the world and connecting with local communities.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Member since {new Date(profileUser.created_at).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {canSendRequest && (
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setShowRequestForm(!showRequestForm)}
                        className="flex items-center gap-2"
                      >
                        <Home className="h-4 w-4" />
                        Request to Stay
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Message
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hosting Request Form */}
        {showRequestForm && canSendRequest && (
          <Card className="shadow-travel">
            <CardHeader>
              <CardTitle>Send Hosting Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={requestData.location}
                  onChange={(e) => setRequestData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City or region you'd like to visit"
                />
              </div>
              
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={requestData.date}
                  onChange={(e) => setRequestData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={requestData.message}
                  onChange={(e) => setRequestData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell the host about yourself and your travel plans..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSendRequest} className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Request
                </Button>
                <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews */}
        {userReviews.length > 0 && (
          <Card className="shadow-travel">
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userReviews.map(review => (
                <div key={review.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.reviewer?.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {review.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};