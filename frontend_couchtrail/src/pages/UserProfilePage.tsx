import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Star, MessageCircle, Home, User, ArrowLeft, Send, Calendar, Mail, Info, Users, XCircle, CheckCircle, Camera, Wifi, Car, Coffee, Tv, Waves } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import API from '@/api';

import { TLSSocket } from 'tls';


type TravelerRequest = {
  travler_id: number
}
interface UserProfilePageProps {
  passedUserId?: number
  travelerRequest?: TravelerRequest
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ passedUserId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const userId = passedUserId ?? Number(params.userId);

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
    image: []
  });

  const [hostInfo, setHostInfo] = useState<any>();
  const [h, seth] = useState(false)
  const [travelerInfo, setTravelerInfo] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(true);
  const [requestData, setRequestData] = useState({id: '',traveler_id: '',host_id: '', user_id: '' ,name: '',location: '', message: '', date: '', number_of_guests: '', status: 'pending',created_at: ''});
  const [travelerRequest, setTravelerRequest] = useState<any>();


  const maxGuests = Math.max(1, Number(userInfo.number_of_guests || 1));
const [guestError, setGuestError] = useState<string>('');

  const isSelf = user?.id === Number(userId);

  useEffect(() => {
    if (!userId) return;

    const fetchAllData = async () => {
      try {
        const [userRes, travelerRes, reviewRes] = await Promise.all([
          API.get(`/users/${userId}`),
          API.get(`/traveler/user_id/${userId}`),
          API.get(`/reviews`, { params: { reviewed_id: userId } })
        ]);


        const host = await API.get(`/hosting-listings/user/${userId}`);

        if (host) {
          seth(true)
        } else {
          seth(false)
        }

        console.log(userRes.data);
        const hostData = Array.isArray(userRes.data) && userRes.data.length > 0 ? userRes.data[0] : null;

        setUserInfo({
          id: userRes.data.id,
          name: userRes.data.name,
          email: userRes.data.email,
          // avatar: userRes.data.avatar ?? '',
          address: host.data?.address ?? '',
          homeDescription: host.data?.home_description ?? '',
          details: host.data?.additional_details ?? '',
          amenities: host.data?.amenities ? host.data.amenities.split(',') : [],
          number_of_guests: host.data?.max_guests ?? '1',
          is_available: host.data?.is_available == 1,
          images: userRes.data?.images ?? [],
          image: userRes.data?.image ?? []
        });

        setHostInfo(host.data);
        setTravelerInfo(travelerRes.data)
        setReviews(Array.isArray(reviewRes.data) ? reviewRes.data : []);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
    };

    fetchAllData();
  }, [userId]);


 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // simulate loading (replace with real data fetch)
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);


  if (!userInfo.id) {
    return (
      // <div className="min-h-screen p-4 flex items-center justify-center">
      //   <Card>
      //     <CardContent className="text-center py-12">
      //       <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      //       <h3 className="text-lg font-semibold mb-2">Loading</h3>
      //       {/* <Button onClick={() => navigate(-1)}>Go back</Button>  */}
      //     </CardContent>
      //   </Card>
      // </div>

      <div className="min-h-screen p-4 flex items-center justify-center">
      {isLoading ? (
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="h-12 w-12 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
          <h3 className="text-lg font-semibold mt-4">Loading...</h3>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <h3 className="text-lg font-semibold mt-4">Loaded!</h3>
        </div>
      )}
    </div>

    );
  }

  const isHost = !!hostInfo;

  const isTraveler = !!travelerInfo;
  const canSendRequest = !isSelf && user?.role === 'user' && isTraveler;
  const averageRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

console.log('roel ', user.role)
  // const handleSendRequest = async () => {
  //   if (!requestData.location || !requestData.message || !requestData.date) {
  //     toast({
  //       title: 'Missing Information',
  //       description: 'Please fill in all fields',
  //       variant: 'destructive'
  //     });
  //     return;
  //   }

  //   try {
  //     const value = {
  //       traveler_id: travelerInfo.id,
  //       host_id: userId,
  //       location: requestData.location,
  //       message: requestData.message,
  //       date: requestData.date,
  //       number_of_guests: requestData.number_of_guests,
  //       status:requestData.status,
  //       name: requestData.name,
  //       created_at: requestData.created_at,
  //       user_id: requestData.user_id,
  //     }
  //     console.log('values ', value)
  //     // const response = await API.post('/hosting-requests', {
  //     //   value
  //     // });
  //     const response = await API.post('/hosting-requests', value);

  //     console.log('g', response.data);


  //     setTravelerRequest({
  //       traveler_id: travelerInfo.id,
  //       host_id: userId,
  //       location: requestData.location,
  //       message: requestData.message,
  //       date: requestData.date,
  //       number_of_guests: requestData.number_of_guests,
  //       created_at: requestData.created_at,
  //       user_id: requestData.user_id,
  //       name:requestData.name,
  //       status:requestData.status,
  //       id:requestData.id,
  //     })

  //     console.log('this is traveler req ', travelerRequest)

  //     toast({
  //       title: 'Request Sent',
  //       description: `Hosting request sent to ${userInfo.name}`,
  //     });

  //     setShowRequestForm(false);
  //     setRequestData({id: '',traveler_id: '',host_id: '', user_id: '' ,name: '',location: '', message: '', date: '', number_of_guests: '', status: 'pending',created_at: ''});
  //   } catch (err) {
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to send request',
  //       variant: 'destructive',
  //     });
  //   }
  // };

  // Replace ONLY your handleSendRequest with this:

// Replace ONLY this function
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
    // Ensure numeric IDs
    const travelerId = Number(travelerInfo?.id);
    const hostId = Number(userId);

    // Normalize date to YYYY-MM-DD (Laravel 'date' friendly)
    const d = new Date(requestData.date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = isNaN(d.getTime()) ? String(requestData.date) : `${yyyy}-${mm}-${dd}`;

    // Build CLEAN payload: only fields your API expects/validates
    console.log('adsff ', travelerInfo)
    console.log('asdfasdf ', travelerInfo.id)
    const payload = {
      traveler_id: travelerInfo.id,
      host_id: hostId,
      location: String(requestData.location).trim(),
      message: String(requestData.message).trim(),
      date: dateStr,
      // keep if backend still requires this; otherwise remove this line
      number_of_guests: requestData.number_of_guests
        ? Number(requestData.number_of_guests)
        : 1,
      status: requestData.status ? String(requestData.status).trim() : 'pending',
    };

    console.log('payload', payload);

    const response = await API.post('/hosting-requests', payload);
    console.log('created', response.data);

    // keep your existing UI/state flows
    setTravelerRequest({
      traveler_id: travelerInfo.id,
      host_id: userId,
      location: requestData.location,
      message: requestData.message,
      date: requestData.date,
      number_of_guests: requestData.number_of_guests,
      created_at: requestData.created_at,
      user_id: requestData.user_id,
      name: requestData.name,
      status: requestData.status,
      id: requestData.id,
    });

    toast({
      title: 'Request Sent',
      description: `Hosting request sent to ${userInfo.name}`,
    });

    setShowRequestForm(true);
    setRequestData({
      id: '',
      traveler_id: '',
      host_id: '',
      user_id: '',
      name: '',
      location: '',
      message: '',
      date: '',
      number_of_guests: '',
      status: 'pending',
      created_at: ''
    });
  } catch (err: any) {
    const resp = err?.response?.data;
    console.error('Send request failed', resp || err);
    toast({
      title: 'Error',
      description: resp?.message
        ? `${resp.message}${resp.errors ? ' — ' + JSON.stringify(resp.errors) : ''}`
        : 'Failed to send request',
      variant: 'destructive',
    });
  }
};

// console.log(userr)

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
                {/* <h2 className="text-2xl font-bold">{userInfo.name}</h2>
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
                </div> */}
              </div>

              <div className="flex-1">
                {/* {isHost && hostInfo && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg mb-2">About My Home</h3>
                    <p className="text-muted-foreground">{hostInfo.home_description}</p>
                    <div className="text-sm text-muted-foreground">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      {hostInfo.address}
                    </div>
                    <div className='flex gap-3'>
                      <img className='bg-red-100' src="./public/img1.jpg" alt="photo.jpg" />
                      <img src="./public/img1.jpg" alt="photo.jpg" />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      Amenities: {hostInfo.amenities}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      HomeDescription: {hostInfo.homeDescription}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      Details: {hostInfo.details}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      MaxGuests: {hostInfo.number_of_guests}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      Is_available: {hostInfo.is_available}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {hostInfo.images}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Joined: {new Date().toLocaleDateString()}
                    </div>

                  </div>
                )} */}

                {/* {isTraveler && !!isHost && ( */}
                  <div className="space-y-2 text-center flex items-center justify-evenly">
                    {/* <p className="text-muted-foreground">
                      Traveler exploring the world and connecting with locals.
                    </p> */}
                    <div className='flex flex-col items-center gap-2 justify-center'>
                      <h3 className="font-semibold text-lg mb-2">About Me</h3>

                      <div className="flex items-center gap-2 justify-center">
                        <img
                          src={userInfo?.image}
                          alt="Profile"
                          className="h-40 w-45 rounded-full shadow-md object-cover"
                        />

                        {/* {userInfo.images?.length > 0 ? (
                          <img
                            src={userInfo.images[0]}
                            alt="Profile"
                            className="h-12 w-12 rounded-full shadow-md object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center shadow-md">
                            <Camera className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {userInfo.images?.length || 0} image(s) uploaded
                        </span> */}
                      </div>


                      <div className="flex items-center gap-2 justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{userInfo.name}</span>
                      </div>

                    </div>

                    <div className='flex flex-col  gap-2 justify-center items-start'>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{userInfo.email}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{userInfo.address}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span>{userInfo.homeDescription}</span>
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
                        Joined: {new Date().toLocaleDateString()}
                      </div>

                      {userInfo.amenities && userInfo.amenities.length > 0 && (
                        <div>
                          <div className="flex flex-wrap gap-2 mt-5">
                            {userInfo.amenities.map((amenity: string) => {
                              const getAmenityIcon = (id: string) => {
                                switch (id) {
                                  case 'wifi':
                                    return Wifi
                                  case 'parking':
                                    return Car
                                  case 'kitchen':
                                    return Coffee
                                  case 'tv':
                                    return Tv
                                  case 'pool':
                                    return Waves
                                  default:
                                    return Home
                                }
                              }
                              const Icon = getAmenityIcon(amenity)
                              return (
                                <Badge
                                  key={amenity}
                                  variant="secondary"
                                  className="flex items-center gap-1"
                                >
                                  <Icon className="h-3 w-3" />
                                  {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}

                    </div>


                  </div>
                {/* // )} */}


                {/* <div className="border-t mt-4 ml-0 mr-0 p-0"></div> */}


                {/* {canSendRequest && hostInfo && ( */}


                {user.role != 'host' && (
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

       
        {/* Photos Gallery */}
        {/* {userInfo.image && userInfo.image.length > 0 && ( */}
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

           {showRequestForm  || (
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
              {/* <div>
                <Label>Number of Guest</Label>
                <Input
                  name='number_of_guests'
                  type='number_of_guests'
                  value={requestData.number_of_guests}
                  onChange={(e) => setRequestData(prev => ({ ...prev, number_of_guests: e.target.value }))}
                />
              </div> */}
              <div>
  <Label>Number of Guests</Label>
  <Input
    name="number_of_guests"
    type="number"
    min={1}
    max={maxGuests}                 // hard UI cap
    value={requestData.number_of_guests}
    onChange={(e) => {
      const raw = e.target.value;
      // allow empty while typing
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
      // clamp to max in state
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

        {/* )} */}

        {/* {reviews.length > 0 && (
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
        )} */}
      </div>
    </div>
  );
};
