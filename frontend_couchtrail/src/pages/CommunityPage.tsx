import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Search, 
  Star, 
  MessageCircle, 
  Heart, 
  Filter,
  Globe,
  Home,
  Calendar
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { AvatarImage } from '@/components/ui/avator';

interface Host {
  id: number;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  description: string;
  amenities: string[];
  isVerified: boolean;
  responseTime: string;
}

interface Traveler {
  id: number;
  name: string;
  currentLocation: string;
  avatar: string;
  interests: string[];
  joinedDate: string;
  tripCount: number;
}

export const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hosts' | 'travelers'>('hosts');
  const [searchQuery, setSearchQuery] = useState('');
const navigate = useNavigate();

  const hosts: Host[] = [
    {
      id: 1,
      name: 'Sarah Chen',
      location: 'Tokyo, Japan',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      rating: 4.9,
      reviewCount: 127,
      description: 'Traditional Japanese home in quiet neighborhood. Perfect for experiencing local culture!',
      amenities: ['WiFi', 'Kitchen', 'Garden', 'Bike'],
      isVerified: true,
      responseTime: '< 1 hour'
    },
    {
      id: 2,
      name: 'Marco Rivera',
      location: 'Barcelona, Spain',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marco',
      rating: 4.7,
      reviewCount: 89,
      description: 'Cozy apartment near the beach. Love showing guests the best local spots!',
      amenities: ['WiFi', 'Beach Access', 'Terrace'],
      isVerified: true,
      responseTime: '< 2 hours'
    },
    {
      id: 3,
      name: 'Emma Thompson',
      location: 'London, UK',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
      rating: 4.8,
      reviewCount: 156,
      description: 'Victorian house in charming neighborhood. Great for exploring London!',
      amenities: ['WiFi', 'Tea/Coffee', 'Library', 'Garden'],
      isVerified: false,
      responseTime: '< 3 hours'
    }
  ];

  const travelers: Traveler[] = [
    {
      id: 1,
      name: 'Alex Kim',
      currentLocation: 'Seoul, South Korea',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      interests: ['Photography', 'Food', 'History'],
      joinedDate: '2023-03-15',
      tripCount: 23
    },
    {
      id: 2,
      name: 'Luna Rodriguez',
      currentLocation: 'Mexico City, Mexico',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna',
      interests: ['Art', 'Music', 'Architecture'],
      joinedDate: '2022-11-08',
      tripCount: 31
    },
    {
      id: 3,
      name: 'David Wilson',
      currentLocation: 'Sydney, Australia',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
      interests: ['Surfing', 'Nature', 'Wildlife'],
      joinedDate: '2023-01-22',
      tripCount: 18
    }
  ];

  const filteredHosts = hosts.filter(host =>
    host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    host.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTravelers = travelers.filter(traveler =>
    traveler.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    traveler.currentLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Discover Our Community
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with amazing hosts and fellow travelers from around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-border/50 focus:border-primary"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={activeTab === 'hosts' ? 'hero' : 'outline'}
              onClick={() => setActiveTab('hosts')}
              className="flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Hosts</span>
            </Button>
            <Button
              variant={activeTab === 'travelers' ? 'hero' : 'outline'}
              onClick={() => setActiveTab('travelers')}
              className="flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>Travelers</span>
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'hosts' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHosts.map((host) => (
              <Card key={host.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card via-card to-secondary/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={host.avatar} alt={host.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {host.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <span>{host.name}</span>
                          {host.isVerified && (
                            <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
                              Verified
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          {host.location}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm leading-relaxed">
                    {host.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{host.rating}</span>
                      <span className="text-muted-foreground">({host.reviewCount})</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {host.responseTime}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {host.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="hero" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.location.href = `/messages?user=${host.id}`}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/profile/${host.id}`)}

                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTravelers.map((traveler) => (
              <Card key={traveler.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card via-card to-secondary/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={traveler.avatar} alt={traveler.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {traveler.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{traveler.name}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          {traveler.currentLocation}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Globe className="w-4 h-4" />
                      <span>{traveler.tripCount} trips</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Joined {new Date(traveler.joinedDate).toLocaleDateString()}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Interests:</p>
                    <div className="flex flex-wrap gap-1">
                      {traveler.interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="travel" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.location.href = `/messages?user=${traveler.id}`}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Connect
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                     onClick={() => navigate(`/profile/${traveler.id}`)}

                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {((activeTab === 'hosts' && filteredHosts.length === 0) || 
          (activeTab === 'travelers' && filteredTravelers.length === 0)) && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No {activeTab} found matching your search.</p>
              <p className="text-sm">Try adjusting your search terms or filters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};