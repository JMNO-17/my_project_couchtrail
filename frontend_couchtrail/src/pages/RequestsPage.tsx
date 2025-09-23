import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Check, X, MapPin, User, Users, MessageCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import API from "../api";

interface Request {
  id: number;
  host_id: number;
  name: string;
  traveler?: { name: string; avatar?: string; region?: string };
  location: string;
  date: string;
  created_at: string;
  number_of_guests: number;
  status: "pending" | "accepted" | "rejected";
  message: string;
}

export const RequestsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>([]);

  // Modal state
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [actionType, setActionType] = useState<"accepted" | "rejected">();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle accept/reject action
  const handleRequestAction = async (hostingRequestId: number, status: "accepted" | "rejected") => {
    try {
      await API.patch(`/hosting-requests/${hostingRequestId}/status`, { status });

      // Remove request from UI
      setRequests((prev) => prev.filter((req) => req.id !== hostingRequestId));

      toast({
        title: status === "accepted" ? "Request Accepted" : "Request Rejected",
        description: `You have ${status} the hosting request.`,
      });

      setIsModalOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error("Failed to update request", error);
      toast({
        title: "Error",
        description: "Could not update the request status. Try again.",
        variant: "destructive",
      });
    }
  };

  const confirmAction = () => {
    if (selectedRequest && actionType) {
      handleRequestAction(selectedRequest.id, actionType);
    }
  };

  // Delete request completely
  const handleDelete = async (hostingRequestId: number) => {
    try {
      await API.delete(`/hosting-requests/${hostingRequestId}`);

      // Remove from UI
      setRequests((prev) => prev.filter((req) => req.id !== hostingRequestId));

      toast({
        title: "Request Deleted",
        description: "The hosting request was permanently removed.",
      });
    } catch (error) {
      console.error("Failed to delete request", error);
      toast({
        title: "Error",
        description: "Could not delete the request. Try again.",
        variant: "destructive",
      });
    }
  };



  // Fetch requests for current host
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      try {
        const response = await API.get(`/hosting-requests/host_id/${user.id}`);
        console.log("Fetched requests:", response.data);
        setRequests(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      }
    };
    fetchRequests();
  }, [user]);

  if (!user) return null;

  // Request card component
  const RequestCard = ({
    request,
    onOpenModal,
  }: {
    request: Request;
    onOpenModal: (type: "accepted" | "rejected") => void;
  }) => (
    <Card className="shadow-travel hover:shadow-glow transition-all duration-300 relative">
      <CardContent className="p-6 relative">

        <Button
            size="sm"
            variant="ghost"
            className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"
            onClick={() => handleDelete(request.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={request.traveler?.avatar} />
            <AvatarFallback>
              {request.traveler?.name?.slice(0, 2).toUpperCase() || request.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          
          <div className="flex-1 space-y-2">


            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              {request.traveler?.name || request.name || "Unknown"}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {request.location}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              {request.number_of_guests}
            </div>
            <div className="flex items-start gap-2 text-muted-foreground">
              <MessageCircle className="h-4 w-4 mt-1" />
              <p className="text-sm">{request.message}</p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {request.created_at ? format(new Date(request.created_at), "MMM d, yyyy HH:mm") : "—"}
              </div>
              <div className="flex gap-2">


                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onOpenModal("rejected")}
                >
                  <X className="h-3 w-3 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="bg-success hover:bg-success/90 text-white"
                  onClick={() => onOpenModal("accepted")}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Accept
                </Button>

              </div>
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
          <p className="text-muted-foreground mt-2">Manage your hosting requests</p>
        </div>

        <Tabs defaultValue="received" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="received" className="flex items-center gap-2">
              Received ({requests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-4">
            {requests.length === 0 ? (
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
              requests.map((request) => (
                <div key={request.id} className="relative">
                  <RequestCard
                    key={request.id}
                    request={request}
                    onOpenModal={(type) => {
                      setSelectedRequest(request);
                      setActionType(type);
                      setIsModalOpen(true);
                    }}
                  />

                  {/* Modal centered on screen */}
                  {isModalOpen && selectedRequest?.id === request.id && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                      <div className="bg-white shadow-lg rounded-lg p-4 w-72">
                        <h3 className="text-sm font-semibold mb-2">Are you sure?</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          Do you really want to {actionType} this request?
                        </p>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsModalOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className={
                              actionType === "accepted"
                                ? "bg-success text-white"
                                : "text-destructive border border-destructive text-white"
                            }
                            onClick={confirmAction}
                          >
                            {actionType === "accepted" ? "Accept" : "Reject"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
