/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';

interface HostingInfo {
  id: number;
  address: string;
  home_description: string;
  max_guests: number;
  amenities: string;
  additional_details: string;
  is_available: string | boolean;
  hostImage_url?: string | null;
  homeImages_urls?: string[];
}

interface Review {
  id: number;
  reviewer_id: number;
  reviewed_id: number;
  rating: number;
  comment: string;
  date: string;
  reviewer?: { id: number; name: string; avatar?: string };
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hostData, setHostData] = useState<HostingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  if (!user) return null;

  // Star Rating component with #f97415
  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'fill-[#f97415] text-[#f97415]' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  // Fetch latest 3 reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const res = await axios.get(`http://localhost:8000/api/reviews?reviewed_id=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedReviews = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

        setReviews(
          fetchedReviews
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3)
            .map((r) => ({
              ...r,
              reviewer: r.reviewer ?? { id: r.reviewer_id, name: 'Anonymous' },
            }))
        );
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    };

    fetchReviews();
  }, [user.id]);

  // Fetch hosting info
  useEffect(() => {
    const fetchHostingInfo = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(
          `http://localhost:8000/api/hosting-listings/user/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHostData(res.data);
      } catch (err) {
        console.error('Failed to fetch hosting info:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHostingInfo();
  }, [user.id]);

  const deleteHost = async (id: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:8000/api/hosting-listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHostData(null);
      alert('Back To Traveller');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/community')}
          className="mb-4 bg-white text-gray-700 border border-gray-300 hover:bg-[#f97415] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to User
        </Button>

        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your travel profile and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reviews */}
          <Card className="shadow-md rounded-xl overflow-hidden p-4 flex flex-col justify-between">
            <Tabs defaultValue="reviews" className="space-y-4">
              <TabsList className="grid grid-cols-1">
                <TabsTrigger value="reviews">Recent Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="reviews" className="space-y-3">
                {reviews.length === 0 ? (
                  <Card className="shadow-md text-center p-6">
                    <Star className="mx-auto mb-2 w-12 h-12 text-gray-300" />
                    <h3 className="font-semibold">No reviews yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Reviews from your experiences will appear here
                    </p>
                  </Card>
                ) : (
                  reviews.map((review) => (
                    <Card key={review.id} className="shadow-md p-4">
                      <div className="flex items-start gap-3">
                        {/* Reviewer Avatar */}
                        <Avatar className="h-10 w-10 rounded-full bg-[#f97415] text-white flex items-center justify-center font-semibold text-sm">
                          {review.reviewer?.avatar ? (
                            <AvatarImage src={review.reviewer.avatar} className="rounded-full" />
                          ) : (
                            <AvatarFallback>
                              {review.reviewer?.name
                                ? review.reviewer.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()
                                : 'A'}
                            </AvatarFallback>
                          )}
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{review.reviewer?.name}</span>
                            <StarRating rating={review.rating} />
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
          </Card>

          {/* Hosting Info */}
          {isLoading ? (
            <Card className="shadow-md flex items-center justify-center p-6">
              <Skeleton className="w-16 h-16 rounded-full mb-4" />
            </Card>
          ) : hostData ? (
            <Card className="shadow-md rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {hostData.homeImages_urls && hostData.homeImages_urls.length > 0 ? (
                  hostData.homeImages_urls.map((img, idx) => (
                    <img key={idx} src={img} alt="Hosting" className="w-20 h-20 object-cover rounded" />
                  ))
                ) : (
                  <span className="text-muted-foreground">No images available</span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-center">Hosting Information</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Name: </span>
                  {hostData.hostImage_url ? (
                    <img
                      src={hostData.hostImage_url}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <Avatar className="h-10 w-10 rounded-full bg-[#f97415] text-white flex items-center justify-center font-semibold text-sm">
                      <AvatarFallback>
                        {user.name
                          ? user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                          : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <span className="ml-2 font-medium">{user.name}</span>
                </div>
                <div>
                  <span className="font-medium">Email: </span>
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
                <div>
                  <span className="font-medium">Address: </span>
                  <span className="text-muted-foreground">{hostData.address}</span>
                </div>
                <div>
                  <span className="font-medium">Home Description: </span>
                  <span className="text-muted-foreground">{hostData.home_description}</span>
                </div>
                <div>
                  <span className="font-medium">Maximum Guests: </span>
                  <span className="text-muted-foreground">{hostData.max_guests}</span>
                </div>
                <div>
                  <span className="font-medium">Amenities: </span>
                  <span className="text-muted-foreground">{hostData.amenities}</span>
                </div>
                <div>
                  <span className="font-medium">Additional Details: </span>
                  <span className="text-muted-foreground">{hostData.additional_details}</span>
                </div>
                <div>
                  <span className="font-medium">Availability: </span>
                  <span className="text-muted-foreground">
                    {hostData.is_available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 justify-center mt-4">
                <Button
                  onClick={() => deleteHost(hostData.id)}
                  variant="default"
                  className="#f97415"
                >
                  Back to Traveller
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="shadow-md text-center p-6">No hosting profile yet</Card>
          )}
        </div>
      </div>
    </div>
  );
};
