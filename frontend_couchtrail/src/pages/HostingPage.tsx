// src/pages/HostingPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import API from '@/api';
import { Switch } from '@/components/ui/switch';

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
  Camera,
} from 'lucide-react';

export const HostingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    address: '',
    home_description: '',
    additional_details: '',
    amenities: [] as string[],
    max_guests: '1',
    is_available: false, // ⬅️ switched to boolean and controlled by Switch
    profileImage: null as File | null,
    homeImages: [] as File[],
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

    if (!formData.address || !formData.home_description) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const data = new FormData();
      data.append('address', formData.address);
      data.append('home_description', formData.home_description);
      data.append('max_guests', formData.max_guests);
      data.append('amenities', formData.amenities.join(','));
      data.append('additional_details', formData.additional_details);
      // backend expects 1/0 – convert boolean from Switch
      data.append('is_available', formData.is_available ? '1' : '0');
      if (formData.profileImage) data.append('profile_image', formData.profileImage);

      // If you want to send home images as an array:
      // formData.homeImages.forEach((file) => data.append('home_images[]', file));

      const response = await API.post('/hosting-listings', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response.data?.error);

      toast({
        title: 'Hosting Profile Created!',
        description: 'Your data has been saved.',
      });

      navigate('/profile');
    } catch (error: any) {
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
          <Button variant="ghost" onClick={() => navigate('/profile')} className="mb-0">
            <ArrowLeft className="w-4 h-4 mr-2 mb-0" />
            Back to Profile
          </Button>

          <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent mt-0 mb-0">
            Become a Host
          </h1>
          <p className="text-muted-foreground mt-0">
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
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    {formData.profileImage ? (
                      <img
                        src={URL.createObjectURL(formData.profileImage)}
                        alt="Profile Preview"
                        className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                        <Camera className="h-8 w-8" />
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      id="profile-upload"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormData((prev) => ({
                            ...prev,
                            profileImage: e.target.files![0],
                          }));
                        }
                      }}
                    />

                    <label
                      htmlFor="profile-upload"
                      className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition"
                    >
                      <Camera className="h-4 w-4" />
                    </label>
                  </div>

                  {formData.profileImage && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          profileImage: null,
                        }))
                      }
                      className="mt-3 text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

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
                <Label htmlFor="home_description">Home Description *</Label>
                <Textarea
                  id="home_description"
                  placeholder="Describe your home and what makes it special..."
                  value={formData.home_description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, home_description: e.target.value }))
                  }
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="max_guests">Maximum Guests</Label>
                <Input
                  id="max_guests"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.max_guests}
                  onChange={(e) => setFormData((prev) => ({ ...prev, max_guests: e.target.value }))}
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
                <Label htmlFor="additional_details">House Rules & Additional Info</Label>
                <Textarea
                  id="additional_details"
                  placeholder="Share any house rules, nearby attractions, or other helpful information for guests..."
                  value={formData.additional_details}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, additional_details: e.target.value }))
                  }
                  className="mt-1 min-h-[100px]"
                />
              </div>

              {/* is_available Switch (replaces 1/0 input) */}
              {/* <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label className="text-base">Available to host</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle on if you’re currently accepting stay requests.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{formData.is_available ? 'Yes' : 'No'}</span>
                  <Switch
                    checked={formData.is_available}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_available: checked }))
                    }
                  />
                </div>
              </div> */}

              {/* Home Images Uploader */}
              <div className="space-y-2">
                <Label>Upload Your Home Images</Label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer relative"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
                      file.type.startsWith('image/')
                    );
                    if (droppedFiles.length > 0) {
                      setFormData((prev) => ({
                        ...prev,
                        homeImages: [...prev.homeImages, ...droppedFiles],
                      }));
                    }
                  }}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files) {
                        setFormData((prev) => ({
                          ...prev,
                          homeImages: [...prev.homeImages, ...Array.from(e.target.files)],
                        }));
                      }
                    }}
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Camera className="h-6 w-6 text-gray-400" />
                    <p className="text-gray-500 text-sm">
                      Drag and drop images here, or click to select
                    </p>
                  </div>

                  {/* Preview Gallery */}
                  {formData.homeImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {formData.homeImages.map((file, index) => {
                        const url = URL.createObjectURL(file);
                        return (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Preview ${index}`}
                              className="w-full h-24 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  homeImages: prev.homeImages.filter((_, i) => i !== index),
                                }))
                              }
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
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
