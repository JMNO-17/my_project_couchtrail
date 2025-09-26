// src/pages/HostingPage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import API from "@/api";
import {
  Home,
  Wifi,
  Car,
  Coffee,
  Tv,
  Waves,
  ArrowLeft,
  Camera,
} from "lucide-react";

export const HostingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    address: "",
    home_description: "",
    additional_details: "",
    amenities: [] as string[],
    max_guests: "1",
    is_available: "",
    profileImage: null as File | null,
    homeImages: [] as File[],
  });

  const amenityOptions = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "parking", label: "Parking", icon: Car },
    { id: "kitchen", label: "Kitchen Access", icon: Coffee },
    { id: "tv", label: "TV", icon: Tv },
    { id: "pool", label: "Pool/Beach Access", icon: Waves },
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
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = new FormData();
      data.append("address", formData.address);
      data.append("home_description", formData.home_description);
      data.append("max_guests", formData.max_guests);
      data.append("amenities", formData.amenities.join(","));
      data.append("additional_details", formData.additional_details);
      data.append("is_available", formData.is_available);

      if (formData.profileImage)
        data.append("profile_image", formData.profileImage);
      formData.homeImages.forEach((img) => data.append("home_images[]", img));

      await API.post("/hosting-listings", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: "Hosting Profile Created!",
        description: "Your hosting data has been saved.",
      });

      // ✅ Smart back navigation
      if (location.state?.from === "traveller") {
        navigate("/community");
      } else {
        navigate("/profile");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() =>
              location.state?.from === "traveller"
                ? navigate("/community")
                : navigate("/profile")
            }
            className="mb-2 hover:bg-orange-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {location.state?.from === "traveller"
              ? "Back to Traveller"
              : "Back to Profile"}
          </Button>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
            Become a Host
          </h1>
          <p className="text-gray-600 mt-1">
            Share your space and connect with travelers around the world
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white p-6 rounded-2xl shadow-xl border border-orange-200"
        >
          {/* Profile Image */}
          <Card className="shadow-md border border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Home className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image Upload */}
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    {formData.profileImage ? (
                      <img
                        src={URL.createObjectURL(formData.profileImage)}
                        alt="Profile Preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-orange-400 shadow-md"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-2 border-dashed border-orange-300 flex items-center justify-center text-orange-400">
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
                      className="absolute bottom-1 right-1 bg-orange-500 text-white rounded-full p-2 cursor-pointer hover:bg-orange-600 transition"
                    >
                      <Camera className="h-4 w-4" />
                    </label>
                  </div>
                  {formData.profileImage && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, profileImage: null }))
                      }
                      className="mt-3 text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Address & Description */}
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="Your location (city, country)"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="mt-1 border-orange-300 focus:ring-orange-400"
                />
              </div>

              <div>
                <Label htmlFor="home_description">Home Description *</Label>
                <Textarea
                  id="home_description"
                  placeholder="Describe your home..."
                  value={formData.home_description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      home_description: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[100px] border-orange-300 focus:ring-orange-400"
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      max_guests: e.target.value,
                    }))
                  }
                  className="mt-1 border-orange-300 focus:ring-orange-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Amenities Section */}
          <Card className="shadow-md border border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-600">Amenities</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {amenityOptions.map((amenity) => {
                const Icon = amenity.icon;
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                      formData.amenities.includes(amenity.id)
                        ? "bg-orange-500 text-white border-orange-600"
                        : "bg-white hover:bg-orange-50 border-orange-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {amenity.label}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Submit / Cancel */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                location.state?.from === "traveller"
                  ? navigate("/community")
                  : navigate("/profile")
              }
              className="flex-1 border-orange-400 text-orange-600 hover:bg-orange-100"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
              Create Hosting Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
