import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
<<<<<<< Updated upstream
import { MapPin, Star, Calendar, MessageCircle, Home, User, ArrowLeft, Send } from 'lucide-react';
=======
import { MapPin, Star, MessageCircle, Home, User, ArrowLeft, Send, Calendar, Mail, Info, Users, XCircle, CheckCircle, Camera, Wifi, Car, Coffee, Tv, Waves } from 'lucide-react';
>>>>>>> Stashed changes
import { useToast } from '@/hooks/use-toast';
import API from '@/api';

interface UserProfilePageProps {
<<<<<<< Updated upstream
  passedUserId?: number;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ passedUserId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { toast } = useToast();
=======
    passedUserId?: number;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ passedUserId }) => {
    const params = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
>>>>>>> Stashed changes

    const userId = passedUserId ?? Number(params.userId);

<<<<<<< Updated upstream
  const [userInfo, setUserInfo] = useState(null);
  const [hostInfo, setHostInfo] = useState(null);
  const [travelerInfo, setTravelerInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(true);
  const [requestData, setRequestData] = useState({ location: '', message: '', date: '' });
=======
    const [userInfo, setUserInfo] = useState({
        id: 0,
        name: '',
        email: '',
        address: '',
        homeDescription: '',
        details: '',
        amenities: [] as string[],
        number_of_guests: '',
        is_available: false,
        images: [] as string[],
        image: ''
    });

    const [hostInfo, setHostInfo] = useState<any>(null);
    const [travelerInfo, setTravelerInfo] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [showRequestForm, setShowRequestForm] = useState(true);
    const [requestData, setRequestData] = useState({
        location: '',
        message: '',
        date: '',
        number_of_guests: '',
    });

    const [isLoading, setIsLoading] = useState(true);
    const [guestError, setGuestError] = useState<string>('');
    const maxGuests = Math.max(1, Number(userInfo.number_of_guests || 1));
    const isSelf = user?.id === Number(userId);

    useEffect(() => {
        if (!userId) return;

        const fetchAllData = async () => {
            setIsLoading(true); // Start loading

            try {
                // Fetch user data
                const userRes = await API.get(`/users/${userId}`);
                const userData = userRes.data;

                // Fetch host listing if the user is a host
                let hostRes = null;
                if (userData.role === 'host') {
                    hostRes = await API.get(`/hosting-listings/user/${userId}`);
                }
                const hostData = hostRes?.data;

                // Fetch traveler profile of the current authenticated user
                let travelerRes = null;
                if (user?.id) {
                    travelerRes = await API.get(`/traveler/user_id/${user.id}`);
                }

                // Fetch reviews for this user
                const reviewRes = await API.get(`/reviews`, { params: { reviewed_id: userId } });

                setUserInfo({
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    address: hostData?.address ?? '',
                    homeDescription: hostData?.home_description ?? '',
                    details: hostData?.additional_details ?? '',
                    amenities: hostData?.amenities ? hostData.amenities.split(',') : [],
                    number_of_guests: hostData?.max_guests ?? '1',
                    is_available: hostData?.is_available === 1,
                    images: userData?.images ?? [],
                    image: userData?.image ?? ''
                });

                setHostInfo(hostData);
                setTravelerInfo(travelerRes?.data ?? null);
                setReviews(Array.isArray(reviewRes.data) ? reviewRes.data : []);
            } catch (err) {
                console.error('Error fetching profile data:', err);
                toast({
                    title: 'Error',
                    description: 'Failed to load user profile.',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false); // End loading
            }
        };

        fetchAllData();
    }, [userId, user?.id]);


    if (isLoading) {
        return (
            <div className="min-h-screen p-4 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
                    <h3 className="text-lg font-semibold mt-4">Loading...</h3>
                </div>
            </div>
        );
    }
>>>>>>> Stashed changes

    if (!userInfo.id) {
        return <div className="min-h-screen flex items-center justify-center">User not found.</div>;
    }

    const isHost = !!hostInfo;
    const isTraveler = !!travelerInfo;
    const canSendRequest = !isSelf && user?.role === 'user' && isHost;
    const averageRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

<<<<<<< Updated upstream
    const fetchAllData = async () => {
      try {
        const [userRes, hostRes, travelerRes, reviewRes] = await Promise.all([
          API.get(`/users/${userId}`),
          API.get(`/hosting-listings`, { params: { user_id: userId } }),
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
=======
    const handleSendRequest = async () => {
        if (!requestData.location || !requestData.message || !requestData.date || !requestData.number_of_guests) {
            toast({
                title: 'Missing Information',
                description: 'Please fill in all fields',
                variant: 'destructive'
            });
            return;
        }

        try {
            const payload = {
                traveler_id: travelerInfo.id,
                host_id: userId,
                location: String(requestData.location).trim(),
                message: String(requestData.message).trim(),
                date: String(requestData.date),
                number_of_guests: Number(requestData.number_of_guests),
                status: 'pending',
            };

            await API.post('/hosting-requests', payload);

            toast({
                title: 'Request Sent',
                description: `Hosting request sent to ${userInfo.name}`,
            });

            setShowRequestForm(true);
            setRequestData({
                location: '',
                message: '',
                date: '',
                number_of_guests: '',
            });

        } catch (err: any) {
            const resp = err?.response?.data;
            console.error('Send request failed', resp || err);
            toast({
                title: 'Error',
                description: resp?.message || 'Failed to send request',
                variant: 'destructive',
            });
        }
>>>>>>> Stashed changes
    };

    const getAmenityIcon = (id: string) => {
        switch (id) {
            case 'wifi': return Wifi;
            case 'parking': return Car;
            case 'kitchen': return Coffee;
            case 'tv': return Tv;
            case 'pool': return Waves;
            default: return Home;
        }
    };

<<<<<<< Updated upstream
  console.log(userInfo)

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

  console.log(hostInfo)
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

  // const profileUser = user.find(u => u.id === parseInt(userId || '0'));
  // if (!profileUser) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 flex items-center justify-center">
  //       <Card>
  //         <CardContent className="text-center py-12">
  //           <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
  //           <h3 className="text-lg font-semibold mb-2">User not found</h3>
  //           <Button onClick={() => navigate(-1)}>Go back</Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }


  
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
                {/* <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={userInfo.avatar} />
                  <AvatarFallback>{userInfo.name?.slice(0, 2)}</AvatarFallback>
                </Avatar> */}
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
                    <div className='flex gap-3'>
                      <img className='bg-red-100' src="./public/img1.jpg" alt="photo.jpg" />
                      <img  src="./public/img1.jpg" alt="photo.jpg" />
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

                {/* {canSendRequest && hostInfo && ( */}
                {!isHost && (
                  <div className="mt-4 border-t pt-4">
                    <Button onClick={() => setShowRequestForm(!showRequestForm)} className="mr-2">
                      <Home className="h-4 w-4 mr-2" /> Request to Stay
                    </Button>
                    <Button variant="outline">
                      <MessageCircle className="h-4 w-4" /> Message
                    </Button>
                  </div>
=======
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
                                <img
                                    src={userInfo?.image || 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=400&w=400&auto=format'}
                                    alt="Profile"
                                    className="h-40 w-45 rounded-full shadow-md object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <div className="space-y-2 text-center flex items-center justify-evenly">
                                    <div className='flex flex-col items-center gap-2 justify-center'>
                                        <h3 className="font-semibold text-lg mb-2">About Me</h3>
                                        <div className="flex items-center gap-2 justify-center">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>{userInfo.name}</span>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-2 justify-center items-start'>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span>{userInfo.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span>{userInfo.address || 'Not specified'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Home className="h-4 w-4 text-muted-foreground" />
                                            <span>{userInfo.homeDescription || 'No home description'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Info className="h-4 w-4 text-muted-foreground" />
                                            <span>{userInfo.details || 'No additional details'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {userInfo.number_of_guests} guest{userInfo.number_of_guests !== '1' ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {userInfo.is_available ? (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-500" />
                                            )}
                                            <span>{userInfo.is_available ? 'Available' : 'Not Available'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>Joined: {new Date().toLocaleDateString()}</span>
                                        </div>
                                        {userInfo.amenities && userInfo.amenities.length > 0 && (
                                            <div>
                                                <div className="flex flex-wrap gap-2 mt-5">
                                                    {userInfo.amenities.map((amenity: string) => {
                                                        const Icon = getAmenityIcon(amenity);
                                                        return (
                                                            <Badge
                                                                key={amenity}
                                                                variant="secondary"
                                                                className="flex items-center gap-1"
                                                            >
                                                                <Icon className="h-3 w-3" />
                                                                {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                                                            </Badge>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {canSendRequest && (
                                    <div className="mt-4 pt-4 ml-[530px]">
                                        <Button onClick={() => setShowRequestForm(!showRequestForm)} className="mr-2">
                                            <Home className="h-4 w-4 mr-2" /> Request to Stay
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
>>>>>>> Stashed changes

                {userInfo.images?.length > 0 && (
                    <Card className="shadow-travel">
                        <CardHeader>
                            <CardTitle>Photos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {userInfo.images.map((photo, index) => (
                                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                                        <img
                                            src={photo}
                                            alt={`${userInfo.name}'s photo ${index + 1}`}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
<<<<<<< Updated upstream
                
              </div>
            </div>
          </CardContent>
        </Card>

        {showRequestForm || canSendRequest || (
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
                  <Send className="h-4 w-4 mr-2" /> Send
                </Button>
                <Button variant="outline" onClick={() => setShowRequestForm(true)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )} 


       
        {/* Photos Gallery */}
        {/* {profileUser.photos && profileUser.photos.length > 0 && (
          <Card className="shadow-travel">
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profileUser.photos.map((photo, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={photo}
                      alt={`${profileUser.name}'s photo ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop';
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        */}


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
=======

                {showRequestForm || (
                    <Card>
                        <CardHeader>
                            <CardTitle>Send Hosting Request</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Location</Label>
                                <Input
                                    name='location'
                                    value={requestData.location}
                                    onChange={(e) => setRequestData(prev => ({ ...prev, location: e.target.value }))}
                                    placeholder="Enter city or region"
                                />
                            </div>
                            <div>
                                <Label>Date</Label>
                                <Input
                                    name='date'
                                    type="date"
                                    value={requestData.date}
                                    onChange={(e) => setRequestData(prev => ({ ...prev, date: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label>Number of Guests</Label>
                                <Input
                                    name="number_of_guests"
                                    type="number"
                                    min={1}
                                    max={maxGuests}
                                    value={requestData.number_of_guests}
                                    onChange={(e) => {
                                        const raw = e.target.value;
                                        if (raw === '') {
                                            setRequestData(prev => ({ ...prev, number_of_guests: '' }));
                                            setGuestError('');
                                            return;
                                        }
                                        const n = Math.max(1, Math.floor(Number(raw) || 1));
                                        if (n > maxGuests) {
                                            setGuestError(`Max allowed by host is ${maxGuests}.`);
                                        } else {
                                            setGuestError('');
                                        }
                                        setRequestData(prev => ({ ...prev, number_of_guests: String(Math.min(n, maxGuests)) }));
                                    }}
                                />
                                {guestError && (
                                    <p className="mt-1 text-sm text-red-600">{guestError}</p>
                                )}
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Host allows up to <b>{maxGuests}</b> guest{maxGuests > 1 ? 's' : ''}.
                                </p>
                            </div>
                            <div>
                                <Label>Message</Label>
                                <Textarea
                                    name='message'
                                    value={requestData.message}
                                    onChange={(e) => setRequestData(prev => ({ ...prev, message: e.target.value }))}
                                    placeholder="Tell the host about your travel plans"
                                />
                            </div>
                            <div className="flex gap-2 ml-[670px]">
                                <Button onClick={handleSendRequest}>
                                    <Send className="h-4 w-4 mr-2" /> Send
                                </Button>
                                <Button variant="outline" onClick={() => setShowRequestForm(true)}>
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
>>>>>>> Stashed changes
};


make images can store under public folder and can show on frontend