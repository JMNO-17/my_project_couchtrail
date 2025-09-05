import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Star, Calendar, MessageCircle, Home, User, ArrowLeft, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import API from '@/api';

interface UserProfilePageProps {
  passedUserId?: number;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ passedUserId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const userId = passedUserId ?? Number(params.userId);

  const [userInfo, setUserInfo] = useState(null);
  const [hostInfo, setHostInfo] = useState(null);
  const [travelerInfo, setTravelerInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({ location: '', message: '', date: '' });

  const isSelf = user?.id === Number(userId);

  useEffect(() => {
    if (!userId) return;

    const fetchAllData = async () => {
      try {
        const [userRes, hostRes, travelerRes, reviewRes] = await Promise.all([
          API.get(`/users/${userId}`),
          API.get(`/hosts`, { params: { user_id: userId } }),
          API.get(`/travelers`, { params: { user_id: userId } }),
          API.get(`/reviews`, { params: { reviewed_id: userId } })
        ]);

        setUserInfo(userRes.data);
        setHostInfo(Array.isArray(hostRes.data) && hostRes.data.length > 0 ? hostRes.data[0] : null);
        setTravelerInfo(Array.isArray(travelerRes.data) && travelerRes.data.length > 0 ? travelerRes.data[0] : null);
        setReviews(Array.isArray(reviewRes.data) ? reviewRes.data : []);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
    };

    fetchAllData();
  }, [userId]);

  if (!userInfo) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
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

  const isHost = !!hostInfo;
  const isTraveler = !!travelerInfo;
  const canSendRequest = !isSelf && user?.role === 'user' && isTraveler;
  const averageRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleSendRequest = async () => {
    if (!requestData.location || !requestData.message || !requestData.date) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      await API.post('/hosting-requests', {
        traveler_id: user.id,
        host_id: userInfo.id,
        host_entry_id: hostInfo?.id,
        location: requestData.location,
        message: requestData.message,
        date: requestData.date,
        status: 'pending',
        is_suspicious: false
      });

      toast({
        title: 'Request Sent',
        description: `Hosting request sent to ${userInfo.name}`
      });

      setShowRequestForm(false);
      setRequestData({ location: '', message: '', date: '' });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to send request',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">User Profile</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={userInfo.avatar} />
                  <AvatarFallback>{userInfo.name?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{userInfo.name}</h2>
                <p className="text-sm text-muted-foreground">{userInfo.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={isHost ? 'default' : 'secondary'}>
                    {isHost ? 'Host' : 'Traveler'}
                  </Badge>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{averageRating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({reviews.length})</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                {isHost && hostInfo && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg mb-2">About My Home</h3>
                    <p className="text-muted-foreground">{hostInfo.home_description}</p>
                    <div className="text-sm text-muted-foreground">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      {hostInfo.address}
                    </div>
                  </div>
                )}

                {isTraveler && !isHost && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg mb-2">About Me</h3>
                    <p className="text-muted-foreground">
                      Traveler exploring the world and connecting with locals.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Joined: {new Date(userInfo.created_at).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {canSendRequest && hostInfo && (
                  <div className="mt-4 border-t pt-4">
                    <Button onClick={() => setShowRequestForm(!showRequestForm)} className="mr-2">
                      <Home className="h-4 w-4" /> Request to Stay
                    </Button>
                    <Button variant="outline">
                      <MessageCircle className="h-4 w-4" /> Message
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {showRequestForm && canSendRequest && (
          <Card>
            <CardHeader>
              <CardTitle>Send Hosting Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Location</Label>
                <Input
                  value={requestData.location}
                  onChange={(e) => setRequestData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter city or region"
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={requestData.date}
                  onChange={(e) => setRequestData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea
                  value={requestData.message}
                  onChange={(e) => setRequestData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell the host about your travel plans"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSendRequest}>
                  <Send className="h-4 w-4" /> Send
                </Button>
                <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {reviews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">{review.reviewer_name}</span>{' '}
                      <Badge variant="outline" className="ml-1 text-xs">{review.type}</Badge>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
