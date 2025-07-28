import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import API from '@/api';

import {
  Home,
  Users,
  Wifi,
  Car,
  Coffee,
  Tv,
  Waves,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

export const HostingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    address: '',
    homeDescription: '',
    details: '',
    amenities: [] as string[],
    maxGuests: '1',
    is_available: '',
  });

  const amenityOptions = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'kitchen', label: 'Kitchen Access', icon: Coffee },
    { id: 'tv', label: 'TV', icon: Tv },
    { id: 'pool', label: 'Pool/Beach Access', icon: Waves },
  ];

  const handleAmenityToggle = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.address || !formData.homeDescription) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await API.post('/hosting-listings', {
        address: formData.address,
        home_description: formData.homeDescription,
        max_guests: parseInt(formData.maxGuests),
        amenities: formData.amenities.join(','),
        additional_details: formData.details,
        is_available: formData.is_available,
      });

      toast({
        title: 'Hosting Profile Created!',
        description: 'Your data has been saved.',
      });

      navigate('/profile');
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Error',
        description: error?.response?.data?.error || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/profile')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>

          <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
            Become a Host
          </h1>
          <p className="text-muted-foreground mt-2">
            Share your space and connect with travelers from around the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="shadow-travel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="Your location (city, country)"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="homeDescription">Home Description *</Label>
                <Textarea
                  id="homeDescription"
                  placeholder="Describe your home and what makes it special..."
                  value={formData.homeDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, homeDescription: e.target.value }))
                  }
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="maxGuests">Maximum Guests</Label>
                <Input
                  id="maxGuests"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.maxGuests}
                  onChange={(e) => setFormData((prev) => ({ ...prev, maxGuests: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="shadow-travel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Amenities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenityOptions.map((amenity) => {
                  const Icon = amenity.icon;
                  const isSelected = formData.amenities.includes(amenity.id);

                  return (
                    <Button
                      key={amenity.id}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className="h-auto py-3 flex flex-col gap-2"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{amenity.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card className="shadow-travel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Additional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="details">House Rules & Additional Info</Label>
                <Textarea
                  id="details"
                  placeholder="Share any house rules, nearby attractions, or other helpful information for guests..."
                  value={formData.details}
                  onChange={(e) => setFormData((prev) => ({ ...prev, details: e.target.value }))}
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="is_available">is_available</Label>
                <Input
                  id="is_available"
                  placeholder="When are you available to host? (e.g., Weekends, Summer months)"
                  value={formData.is_available}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_available: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/profile')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Hosting Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
