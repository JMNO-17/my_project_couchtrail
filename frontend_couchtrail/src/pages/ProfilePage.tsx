/* eslint-disable react-hooks/rules-of-hooks */
import { ReactNode, useEffect, useState } from 'react';
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
import API from "@/api/index";
import { Skeleton } from '@/components/ui/skeleton';

// ---------------- Types ----------------
type HostingInfo = {
  details: ReactNode;
  is_available: ReactNode;
  id: number;
  host_id: number;
  address: string;
  home_description: string;
  max_guests: number;
  amenities: string;
  additional_details: string;
};

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getEnrichedReviews, getEnrichedHostings, getEnrichedHostingRequests } = useDemo();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    region: user?.region || ''
  });
  const [hostData, setHostData] = useState<HostingInfo | null>(null);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
          className={`h-4 w-4 ${star <= rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-muted-foreground'
            }`}
        />
      ))}
    </div>
  );

  useEffect(() => {
    const fetchHostingInfo = async () => {
      try {
        setIsLoading(true);
        const response = await API.get<HostingInfo[]>('/hosting-listings').finally(() => setIsLoading(false));
        setHostData(response.data[0] ?? null);
      } catch (err) {
        console.log(err);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchLocationAddress(latitude, longitude);
          },
          (error) => {
            console.error("Error fetching location: ", error);
          }
        );
      }
    };

    const fetchLocationAddress = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await response.json();
        setUserLocation(data.display_name); // Set the human-readable address
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    getLocation();
    fetchHostingInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your travel profile and preferences
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compact Profile Card */}
          <Card className="shadow-md rounded-xl overflow-hidden p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-1 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{hostData?.address || 'Location not set'}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              {user.isAdmin && (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <Badge variant="default">Admin</Badge>
                </div>
              )}

                {reviews.length > 0 && (
              <div className="pt-2 border-t mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Overall Rating</span>
                  <StarRating rating={Math.round(averageRating)} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {averageRating.toFixed(1)} from {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
            </div>

          

            {/* Edit Profile Button */}
            {/* <div className="mt-4 text-right">
              <Button size="sm" variant="outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div> */}
          </Card>

          {/* Hosting Info / Become a Host */}
          {isLoading ? (
            <Card className="shadow-md flex items-center justify-center p-6">
              <Skeleton className="w-16 h-16 rounded-full mb-4" />
            </Card>
          ) : hostData ? (
            <Card className="shadow-md rounded-xl p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Home className="w-8 h-8 text-primary" />
              </div>

              <h3 className="text-lg font-semibold text-center">Hosting Information</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Address: </span>
                  <span className="text-muted-foreground">{hostData.address}</span>
                </div>

                <div>
                  <span className="font-medium">Home Description: </span>
                  <span className="text-muted-foreground">{hostData.home_description}</span>
                </div>

                <div>
                  <span className="font-medium">Additional Details: </span>
                  <span className="text-muted-foreground">{hostData.additional_details}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Max Guests: </span>
                  <span className="text-muted-foreground">{hostData.max_guests}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Status: </span>
                  {hostData.is_available === 'active' ? (
                    <Badge variant="outline" className="text-green-700 border-green-700">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-700 border-red-700">
                      Inactive
                    </Badge>
                  )}
                </div>

                <div>
                  <span className="font-medium">Amenities: </span>
                  <span className="text-muted-foreground">{hostData.amenities}</span>
                </div>
              </div>
            </Card>

          ) : (
            <Card className="shadow-md rounded-xl p-6 text-center">
              <Home className="mx-auto mb-2 w-8 h-8 text-primary" />
              <h3 className="text-lg font-semibold mb-1">Become a Host</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share your space and connect with travelers
              </p>
              <Button onClick={() => navigate('/hosting')}>Start Hosting</Button>
            </Card>
          )}
        </div>

        {/* Reviews Tabs */}
        <Tabs defaultValue="reviews" className="space-y-4">
          <TabsList className="grid grid-cols-1">
            <TabsTrigger value="reviews">Recent Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-3">
            {reviews.length === 0 ? (
              <Card className="shadow-md text-center p-6">
                <Star className="mx-auto mb-2 w-12 h-12 text-muted-foreground" />
                <h3 className="font-semibold">No reviews yet</h3>
                <p className="text-sm text-muted-foreground">
                  Reviews from your experiences will appear here
                </p>
              </Card>
            ) : (
              reviews.slice(0, 3).map((review) => (
                <Card key={review.id} className="shadow-md p-4">
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
                      <p className="text-sm text-muted-foreground mb-1">{review.comment}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(review.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>

  );
};
