// src/pages/RequestsPage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Check,
  X,
  MapPin,
  User,
  Users,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
// ✅ Use shadcn avatar wrapper, not raw Radix

import API from "../api";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type RequestStatus = "pending" | "accepted" | "rejected";

interface Party {
  name: string;
  avatar?: string;
  region?: string;
}

interface Request {
  id: number;
  host_id: number;
  // For traveler "Sent" view we prefer host info:
  host?: Party;
  // For host views we may get traveler info:
  traveler?: Party;

  // Fallbacks from backend
  name: string;
  location: string;
  date: string;
  created_at: string;
  number_of_guests: number;
  status: RequestStatus;
  message: string;
}

// --- Role helpers ------------------------------------------------------------
const isTravelerRole = (u: any) =>
  u?.role === "traveler" || u?.role === "user" || u?.roles?.includes?.("traveler");

const isHostRole = (u: any) =>
  u?.role === "host" || u?.roles?.includes?.("host");

export const RequestsPage = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  const [requests, setRequests] = useState<Request[]>([]); // Host: Received
  const [acceptedRequests, setAcceptedRequests] = useState<Request[]>([]); // Host: Accepted
  const [travelerRequests, setTravelerRequests] = useState<Request[]>([]); // Traveler: Sent

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [actionType, setActionType] = useState<"accepted" | "rejected">();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Actions ---------------------------------------------------------------
  const handleRequestAction = async (
    hostingRequestId: number,
    status: "accepted" | "rejected"
  ) => {
    try {
      await API.patch(`/hosting-requests/${hostingRequestId}/status`, { status });

      if (user && isHostRole(user)) {
        const [allRes, acceptedRes] = await Promise.all([
          API.get(`/hosting-requests/host_id/${user.id}`),
          API.get(`/hosting-requests/host_id/${user.id}/accepted`),
        ]);
        setRequests(allRes.data.data || []);
        setAcceptedRequests(acceptedRes.data.data || []);
      }
      console.log(requests);
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

  const handleDelete = async (hostingRequestId: number) => {
    try {
      await API.delete(`/hosting-requests/${hostingRequestId}`);

      setRequests((prev) => prev.filter((req) => req.id !== hostingRequestId));
      setAcceptedRequests((prev) =>
        prev.filter((req) => req.id !== hostingRequestId)
      );
      setTravelerRequests((prev) =>
        prev.filter((req) => req.id !== hostingRequestId)
      );

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

  // --- Data fetching ---------------------------------------------------------
  // Host: accepted
  useEffect(() => {
    if (!user || !isHostRole(user)) return;
    (async () => {
      try {
        const response = await API.get(
          `/hosting-requests/host_id/${user.id}/accepted`
        );
        setAcceptedRequests(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch accepted requests", error);
      }
    })();
  }, [user?.id, user?.role]);

  // Host: received
  useEffect(() => {
    if (!user || !isHostRole(user)) return;
    (async () => {
      try {
        const response = await API.get(`/hosting-requests/host_id/${user.id}`);
        setRequests(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch received requests", error);
      }
    })();
  }, [user?.id, user?.role]);

  // Traveler: sent
  // useEffect(() => {
  //   // if (!user || !isTravelerRole(user)) return;
  //   (async () => {
  //     try {
  //       const response = await API.get(
  //         `/hosting-requests/traveler_id/${user.id}`
  //       );
  //       // If your backend doesn't send host info, the UI will fallback to 'name'
  //       setTravelerRequests(response.data.data || []);
     
  //     } catch (error) {
  //       console.error("Failed to fetch traveler requests", error);
  //     }
  //   })();
  // }, [user?.id, user?.role]);

  //   console.log(travelerRequests)

  // Traveler: sent
useEffect(() => {
  if (!user || !isTravelerRole(user)) return;
  (async () => {
    try {
      const res = await API.get(`/hosting-requests/traveler_id/${user.id}`);
      const d = res?.data?.data;

      // Normalize API → UI Request[]
      const rawList = Array.isArray(d) ? d : d ? [d] : [];
      const normalized: Request[] = rawList.map((item: any) => ({
        // Use the request id for card actions; fall back to listing id if needed
        id: item.request_id ?? item.id,
        host_id: item.user_id,

        // Host block (only name available now)
        host: { name: item.name },

        // UI fallbacks
        name: item.name, // fallback if host?.name missing
        location: item.address ?? "",

        // Dates: prefer requested_at from request, else created_at
        date: item.requested_at ?? item.created_at,
        created_at: item.requested_at ?? item.created_at,

        // Status/message from request_*
        status: (item.request_status ?? "pending") as RequestStatus,
        message: item.request_message ?? "",

        // Not provided by API → choose a sensible default
        number_of_guests: item.number_of_guests ?? 1,
      }));

      setTravelerRequests(normalized);
    } catch (error) {
      console.error("Failed to fetch traveler requests", error);
      setTravelerRequests([]);
    }
  })();
}, [user?.id, user?.role]);



  // --- Loading guard ---------------------------------------------------------
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading Requests...</p>
        </div>
      </div>
    );
  }

  const defaultTab = isTravelerRole(user) ? "sent" : "received";

  // --- Cards -----------------------------------------------------------------
  // Host-side card (shows traveler, actions)
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
          title="Delete request"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={request.traveler?.avatar} />
            <AvatarFallback>
              {(request.traveler?.name || request.name || "??")
                .slice(0, 2)
                .toUpperCase()}
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
              {request.number_of_guests} guests
            </div>

            {request.message && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4 mt-1" />
                <p className="text-sm">{request.message}</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {request.created_at
                  ? format(new Date(request.created_at), "MMM d, yyyy HH:mm")
                  : "—"}
              </div>

              {request.status !== "accepted" && (
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

                  {isHostRole(user) && (
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => onOpenModal("accepted")}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Accept
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Traveler-side card (shows host, status pill)
  const TravelerSentCard = ({ request }: { request: Request }) => {
    // const hostName = request.host?.name || request.name || "Host";
    const travelerName = request?.name || request.name || "Host";
    const hostAvatar = request.host?.avatar;
    const hostRegion = request.host?.region;

    const statusStyles: Record<RequestStatus, string> = {
      accepted: "bg-green-100 text-green-700 ring-green-200",
      rejected: "bg-red-100 text-red-700 ring-red-200",
      pending: "bg-amber-100 text-amber-700 ring-amber-200",
    };

    console.log(request);

    return (
      <Card className="shadow-travel hover:shadow-glow transition-all duration-300 relative">
        <CardContent className="p-6 relative">
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"
            onClick={() => handleDelete(request.id)}
            title="Delete request"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={hostAvatar} />
              <AvatarFallback>{travelerName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{travelerName}</span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ring-1 ${statusStyles[request.status]}`}
                >
                  {request.status[0].toUpperCase() + request.status.slice(1)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{request.location}</span>
                {hostRegion && <span className="text-xs">• {hostRegion}</span>}
              </div>

              {request.message && (
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MessageCircle className="h-4 w-4 mt-1" />
                  <p className="text-sm">{request.message}</p>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {request.created_at
                    ? format(new Date(request.created_at), "MMM d, yyyy HH:mm")
                    : "—"}
                </div>
                {/* Optional: allow cancel while pending
                {request.status === "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(request.id)}
                  >
                    Cancel
                  </Button>
                )} */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // --- Render ---------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
            Hosting Requests
          </h1>
          <p className="text-muted-foreground mt-2">
            History your hosting requests
          </p>
        </div>

        {/* Traveler view (Sent requests) */}

        {isTravelerRole(user) && (
          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="sent" className="flex items-center gap-2">
                Sent ({travelerRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sent" className="space-y-4">
              {travelerRequests.length === 0 ? (
                <Card className="shadow-travel">
                  <CardContent className="text-center py-12">
                    <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      No requests sent
                    </h3>
                    <p className="text-muted-foreground">
                      When you request to stay with a host, they will appear here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                travelerRequests.map((request) => (
                  <div key={request.id} className="relative">
                    <TravelerSentCard request={request} />
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Host view (Received/Accepted requests) */}
        {!isTravelerRole(user) && (
          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="received" className="flex items-center gap-2">
                Received ({requests.length})
              </TabsTrigger>
              <TabsTrigger value="accepted" className="flex items-center gap-2">
                Accepted ({acceptedRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="received" className="space-y-4">
              {requests.length === 0 ? (
                <Card className="shadow-travel">
                  <CardContent className="text-center py-12">
                    <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      No requests received
                    </h3>
                    <p className="text-muted-foreground">
                      When travelers request to stay with you, they'll appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                requests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onOpenModal={(type) => {
                      setSelectedRequest(request);
                      setActionType(type);
                      setIsModalOpen(true);
                    }}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="accepted" className="space-y-4">
              {acceptedRequests.length === 0 ? (
                <Card className="shadow-travel">
                  <CardContent className="text-center py-12">
                    <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      No accepted requests
                    </h3>
                    <p className="text-muted-foreground">
                      Accepted requests will be shown here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                acceptedRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onOpenModal={(type) => {
                      setSelectedRequest(request);
                      setActionType(type);
                      setIsModalOpen(true);
                    }}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Confirmation Modal */}
        {isModalOpen && selectedRequest && actionType && (
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
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
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
    </div>
  );
};
