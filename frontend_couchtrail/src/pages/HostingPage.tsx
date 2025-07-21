import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { useDemo } from '@/hooks/useDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, Calendar, Plus, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const HostingPage = () => {
  const { user } = useAuth();
  const { getEnrichedHostings, addHosting } = useDemo();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    home_description: '',
    address: '',
    preferences: '',
    details: '',
    additional_info: '',
    availability_calendar: ''
  });

  if (!user) return null;

  const hostings = getEnrichedHostings();
  const userHosting = hostings.find(h => h.user_id === user.id);

  const handleSubmit = () => {
    if (!formData.home_description || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill in the required fields",
        variant: "destructive"
      });
      return;
    }

    addHosting({
      user_id: user.id,
      ...formData
    });

    toast({
      title: "Success",
      description: "Your hosting profile has been created!",
    });

    setIsCreating(false);
    setFormData({
      home_description: '',
      address: '',
      preferences: '',
      details: '',
      additional_info: '',
      availability_calendar: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
            My Hosting
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome travelers to your home
          </p>
        </div>

        {userHosting ? (
          <Card className="shadow-travel">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Your Hosting Profile
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Home Description</h3>
                <p className="text-muted-foreground">{userHosting.home_description}</p>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{userHosting.address}</span>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Preferences</h3>
                <p className="text-muted-foreground">{userHosting.preferences}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Details</h3>
                <p className="text-muted-foreground">{userHosting.details}</p>
              </div>

              {userHosting.additional_info && (
                <div>
                  <h3 className="font-semibold mb-2">Additional Information</h3>
                  <p className="text-muted-foreground">{userHosting.additional_info}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Availability
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userHosting.availability_calendar.split(',').map((date, index) => (
                    <Badge key={index} variant="secondary">
                      {new Date(date).toLocaleDateString()}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* {!isCreating ? (
              // <Card className="shadow-travel">
              //   <CardContent className="text-center py-12">
              //     <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              //     <h3 className="text-xl font-semibold mb-2">Create Your Hosting Profile</h3>
              //     <p className="text-muted-foreground mb-6">
              //       Start welcoming travelers and share your local knowledge
              //     </p>
              //     <Button onClick={() => setIsCreating(true)} className="bg-gradient-hero">
              //       <Plus className="h-4 w-4 mr-2" />
              //       Create Hosting Profile
              //     </Button>
              //   </CardContent>
              // </Card>
            ) : ( */}
              <Card className="shadow-travel">
                <CardHeader>
                  <CardTitle>Create Your Hosting Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Home Description *</label>
                    <Textarea
                      placeholder="Describe your home and what makes it special..."
                      value={formData.home_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, home_description: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Address *</label>
                    <Input
                      placeholder="City, Country"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Guest Preferences</label>
                    <Textarea
                      placeholder="What kind of guests do you prefer? Any house rules?"
                      value={formData.preferences}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferences: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Accommodation Details</label>
                    <Textarea
                      placeholder="Room type, bathroom access, shared spaces..."
                      value={formData.details}
                      onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Additional Information</label>
                    <Textarea
                      placeholder="Nearby attractions, transport links, house amenities..."
                      value={formData.additional_info}
                      onChange={(e) => setFormData(prev => ({ ...prev, additional_info: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Available Dates</label>
                    <Input
                      placeholder="2024-02-01,2024-02-15,2024-03-01 (comma-separated)"
                      value={formData.availability_calendar}
                      onChange={(e) => setFormData(prev => ({ ...prev, availability_calendar: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSubmit} >
                      Create Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreating(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            {/* )} */}
          </div>
        )}
      </div>
    </div>
  );
};