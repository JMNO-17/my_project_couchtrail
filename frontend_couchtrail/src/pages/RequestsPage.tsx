import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { useDemo } from '@/hooks/useDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, User, Clock, Check, X, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

export const RequestsPage = () => {
  const { user } = useAuth();
  const { getEnrichedHostingRequests, updateHostingRequest } = useDemo();
  const { toast } = useToast();

  if (!user) return null;

  const allRequests = getEnrichedHostingRequests();
  const receivedRequests = allRequests.filter(r => r.host_id === user.id);
  const sentRequests = allRequests.filter(r => r.traveler_id === user.id);

  const handleRequestAction = (requestId: number, action: 'accepted' | 'rejected') => {
    updateHostingRequest(requestId, action);
    toast({
      title: action === 'accepted' ? "Request Accepted" : "Request Rejected",
      description: `You have ${action} the hosting request.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-success/20 text-success-foreground border-success/50';
      case 'rejected': return 'bg-destructive/20 text-destructive-foreground border-destructive/50';
      default: return 'bg-warning/20 text-warning-foreground border-warning/50';
    }
  };

  const RequestCard = ({ request, isReceived }: { request: any; isReceived: boolean }) => (
    <Card className="shadow-travel hover:shadow-glow transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={isReceived ? request.traveler?.avatar : request.host?.avatar} />
            <AvatarFallback>
              {(isReceived ? request.traveler?.name : request.host?.name)?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {isReceived ? request.traveler?.name : request.host?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isReceived ? request.traveler?.region : request.host?.region}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(request.status)}>
                  {request.status}
                </Badge>
                {request.is_suspicious && (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Flagged
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {request.location}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(new Date(request.date), 'MMM d, yyyy')}
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm">{request.message}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {format(new Date(request.created_at), 'MMM d, yyyy HH:mm')}
              </div>
              
              {isReceived && request.status === 'pending' && user.id === request.host_id && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRequestAction(request.id, 'rejected')}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleRequestAction(request.id, 'accepted')}
                    className="bg-success hover:bg-success/90 text-white"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Accept
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
            Hosting Requests
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your hosting requests and applications
          </p>
        </div>

        <Tabs defaultValue="received" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received" className="flex items-center gap-2">
              Received ({receivedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              Sent ({sentRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-4">
            {receivedRequests.length === 0 ? (
              <Card className="shadow-travel">
                <CardContent className="text-center py-12">
                  <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No requests received</h3>
                  <p className="text-muted-foreground">
                    When travelers request to stay with you, they'll appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              receivedRequests.map((request) => (
                <RequestCard key={request.id} request={request} isReceived={true} />
              ))
            )}
          </TabsContent>

          <TabsContent value="sent" className="space-y-4">
            {sentRequests.length === 0 ? (
              <Card className="shadow-travel">
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No requests sent</h3>
                  <p className="text-muted-foreground">
                    Your hosting requests will appear here after you apply to stay with hosts
                  </p>
                </CardContent>
              </Card>
            ) : (
              sentRequests.map((request) => (
                <RequestCard key={request.id} request={request} isReceived={false} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};