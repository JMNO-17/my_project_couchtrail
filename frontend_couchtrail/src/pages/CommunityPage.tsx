import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Star, MessageCircle, Heart, Globe, Home, Calendar } from 'lucide-react';
import API from '@/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | string;
  created_at: string;
}

type Idish = number | string;

interface HostingImage {
  id: number;
  image_path: string;
}

interface Host {
  id: number;
  user_id: Idish;
  address?: string;
  user?: User;
  name?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  description?: string;
  amenities?: string[] | string;
  isVerified?: boolean;
  responseTime?: string;
  images?: HostingImage[];
}

interface Traveler {
  id: number;
  user_id: Idish;
  address?: string;
  name?: string;
  email?: string;
  currentLocation?: string;
  joinedDate?: string;
  tripCount?: number;
  images?: HostingImage[];
}

export const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hosts' | 'travelers'>('hosts');
  const [searchQuery, setSearchQuery] = useState('');
  const [hostData, setHostData] = useState<Host[]>([]);
  const [travellerData, setTravellerData] = useState<Traveler[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  // Helpers
  const toId = (v: Idish) => String(v ?? '');
  const normalizeAmenities = (amenities?: Host['amenities']) => {
    if (!amenities) return [];
    if (Array.isArray(amenities)) return amenities.filter(Boolean);
    return amenities.split(',').map((s) => s.trim()).filter(Boolean);
  };

  // Filters
  const filteredHosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return hostData;
    return hostData.filter(
      (h) =>
        (h.name ?? '').toLowerCase().includes(q) ||
        (h.address ?? '').toLowerCase().includes(q)
    );
  }, [hostData, searchQuery]);

  const filteredTravelers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return travellerData;
    return travellerData.filter(
      (t) =>
        (t.name ?? '').toLowerCase().includes(q) ||
        (t.currentLocation ?? '').toLowerCase().includes(q)
    );
  }, [travellerData, searchQuery]);

  // Fetch data
  useEffect(() => {
    let ignore = false;

    const fetchHosts = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await API.get('/hosts');
        console.log('Hosts API Response:', res.data);

        const payload = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        if (!ignore) setHostData(payload);
      } catch (err) {
        console.error(err);
        if (!ignore) setErrorMsg('Failed to load hosts.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    const fetchTravelers = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await API.get('/travelers');
        console.log('Travelers API Response:', res.data);

        const payload = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        if (!ignore) setTravellerData(payload);
      } catch (err) {
        console.error(err);
        if (!ignore) setErrorMsg('Failed to load travelers.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (activeTab === 'hosts') fetchHosts();
    if (activeTab === 'travelers') fetchTravelers();

    return () => {
      ignore = true;
    };
  }, [activeTab]);

  console.log(filteredTravelers);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Our Community
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet welcoming hosts & curious travelers from all around the world.
          </p>
        </div>

        {/* Search + Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-2xl border-border/50 focus:border-primary shadow-sm"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button
              aria-pressed={activeTab === 'hosts'}
              variant={activeTab === 'hosts' ? 'hero' : 'outline'}
              onClick={() => setActiveTab('hosts')}
              className="px-5 py-2 rounded-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Hosts
            </Button>
            <Button
              aria-pressed={activeTab === 'travelers'}
              variant={activeTab === 'travelers' ? 'hero' : 'outline'}
              onClick={() => setActiveTab('travelers')}
              className="px-5 py-2 rounded-full"
            >
              <Globe className="w-4 h-4 mr-2" />
              Travelers
            </Button>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="text-center py-16 text-muted-foreground text-lg">
            Loading {activeTab}…
          </div>
        )}
        {!loading && errorMsg && (
          <div className="text-center py-16 text-destructive text-lg">
            {errorMsg}
          </div>
        )}

        {/* Content */}
        {!loading && !errorMsg && (
          <>
            {activeTab === 'hosts' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHosts.map((host) => {
                  const uid = toId(host.user_id);
                  const amenities = normalizeAmenities(host.amenities);
                  return (
                    <Card
                      key={host.id}
                      className="group hover:shadow-2xl transition-all duration-300 border border-border/40 rounded-2xl overflow-hidden bg-gradient-to-br from-card to-secondary/20"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <span className="truncate max-w-[180px]">
                                  {host.name ?? 'Unnamed Host'}
                                </span>
                                {host.isVerified && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-success/10 text-success border-success/20"
                                  >
                                    Verified
                                  </Badge>
                                )}
                              </CardTitle>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span>{host.address ?? 'No location set'}</span>
                              </div>
                            </div>
                          </div>
                          {/* <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-red-500"
                          >
                            <Heart className="w-5 h-5" />
                          </Button> */}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <CardDescription className="text-sm leading-relaxed min-h-[40px] text-muted-foreground flex items-center gap-2">
                          <Home className="w-4 h-4 text-muted-foreground" />
                          {host.description ?? 'No description provided.'}
                        </CardDescription>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1">
                            {/* <Star className="w-4 h-4 text-yellow-400 fill-current" /> */}
                            {/* <span className="font-medium">
                              {host.rating ?? '-'}
                            </span> */}
                            {/* <span className="text-muted-foreground">
                              ({host.reviewCount ?? 0})
                            </span> */}
                          </div>
                          {/* <Badge
                            variant="outline"
                            className="text-xs rounded-full px-2 py-1"
                          >
                            <Calendar className="w-3 h-3 mr-1" />
                            {host.responseTime ?? '—'}
                          </Badge> */}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {amenities.map((amenity) => (
                            <Badge
                              key={`${host.id}-${amenity}`}
                              variant="secondary"
                              className="text-xs capitalize px-2 py-0.5 rounded-full"
                            >
                              {amenity}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex space-x-3 pt-2">
                          <Button
                            variant="hero"
                            size="sm"
                            className="flex-1 rounded-full"
                            onClick={() => navigate(`/messages?user=${uid}`)}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => navigate(`/profile/${uid}`)}
                          >
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTravelers.map((traveler) => {
                  const uid = toId(traveler.user_id);
                  return (
                    <Card
                      key={traveler.id}
                      className="group hover:shadow-2xl transition-all duration-300 border border-border/40 rounded-2xl overflow-hidden bg-gradient-to-br from-card to-secondary/20"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <CardTitle className="text-xl font-semibold truncate max-w-[220px]">
                                {traveler.name ?? 'Unnamed Traveler'}
                              </CardTitle>
                              <p className="text-sm text-gray-500 truncate max-w-[220px]">
                                {traveler.email ?? 'No email provided'}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => navigate(`/messages?user=${uid}`)}
                          >
                            <MessageCircle className="w-5 h-5" />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex space-x-3 pt-2">
                          <Button
                            variant="travel"
                            size="sm"
                            className="flex-1 rounded-full"
                            onClick={() => navigate(`/messages?user=${uid}`)}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Connect
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {((activeTab === 'hosts' && filteredHosts.length === 0) ||
              (activeTab === 'travelers' && filteredTravelers.length === 0)) && (
              <div className="text-center py-20">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <p className="text-lg font-medium">No {activeTab} found</p>
                <p className="text-sm text-muted-foreground">
                  Try changing your search terms.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
