import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/components/auth/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, User, Calendar, ArrowLeft, Flag } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface Review {
  id: number;
  reviewer_id: number;
  reviewed_id: number;
  rating: number;
  comment: string;
  is_flagged: boolean;
  date: string;
  reviewer?: { id: number; name: string; avatar?: string };
}

export const ReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const reviewedUserId = Number(userId);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewedUserName, setReviewedUserName] = useState("Unknown User");
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  const BASE_URL = "http://localhost:8000";
  const token = user ? localStorage.getItem("accessToken") : "";
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token || !reviewedUserId) return;
    axios
      .get(`${BASE_URL}/api/users/${reviewedUserId}`, axiosConfig)
      .then((res) => setReviewedUserName(res.data.name || "Unknown User"))
      .catch((err) => console.error(err));
  }, [reviewedUserId, token]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!token || !reviewedUserId) return;
      try {
        const res = await axios.get(`${BASE_URL}/api/reviews?user_id=${reviewedUserId}`, axiosConfig);
        const fetchedReviews = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setReviews(
          fetchedReviews
            .filter((r) => r.reviewed_id === reviewedUserId)
            .map((r) => ({
              ...r,
              reviewer: r.reviewer ?? { id: r.reviewer_id, name: "Anonymous" },
            }))
        );
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Failed to fetch reviews", variant: "destructive" });
      }
    };
    fetchReviews();
  }, [reviewedUserId, token, toast]);

  const handleSubmitReview = async () => {
    if (!user)
      return toast({ title: "Unauthorized", description: "Log in first", variant: "destructive" });
    if (!reviewForm.comment.trim())
      return toast({ title: "Error", description: "Please write a comment", variant: "destructive" });

    try {
      const res = await axios.post(
        `${BASE_URL}/api/reviews`,
        {
          reviewer_id: user.id,
          reviewed_id: reviewedUserId,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        },
        axiosConfig
      );

      toast({ title: "Success", description: "Review submitted!" });
      setIsWritingReview(false);
      setReviewForm({ rating: 5, comment: "" });

      setReviews((prev) => [
        {
          id: res.data.review.id,
          reviewer_id: user.id,
          reviewed_id: reviewedUserId,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          is_flagged: false,
          date: new Date().toISOString(),
          reviewer: { id: user.id, name: user.name, avatar: user.avatar },
        },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to submit review", variant: "destructive" });
    }
  };

  const StarRating: React.FC<{ rating: number; interactive?: boolean; onChange?: (rating: number) => void }> =
    ({ rating, interactive = false, onChange }) => (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-[#f97415] fill-[#f97415]" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-[#f97415]" : ""}`}
            onClick={() => interactive && onChange?.(star)}
          />
        ))}
      </div>
    );

  const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <Card className="shadow-sm hover:shadow-md transition-all duration-200 text-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar always orange */}
          <Avatar className="h-10 w-10 rounded-full flex items-center justify-center bg-[#f97415] text-white font-semibold border border-[#f97415]">
            {review.reviewer?.avatar ? (
              <AvatarImage src={review.reviewer.avatar} className="rounded-full" />
            ) : (
              <AvatarFallback>
                {(review.reviewer?.name?.slice(0, 2) || "NA").toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-1 text-sm text-gray-700">
                <User className="h-3 w-3 text-gray-500" /> {review.reviewer?.name}
              </h3>
              <StarRating rating={review.rating} />
            </div>
            {review.is_flagged && (
              <span className="text-red-500 flex items-center gap-1 text-xs">
                <Flag className="h-3 w-3" /> Flagged
              </span>
            )}
            <p className="text-gray-700 text-sm">{review.comment}</p>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Calendar className="h-3 w-3" /> {review.date ? format(new Date(review.date), "MMM d, yyyy") : "Unknown date"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!user) return <p className="text-center mt-10 text-sm">Please log in to view and submit reviews.</p>;

  const avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Back button: white by default, orange on hover */}
        <Button
          size="sm"
          className="bg-white text-gray-700 border border-gray-300 hover:bg-[#f97415] hover:text-white"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-3 h-3 mr-1" /> Back to User
        </Button>

        {/* Header */}
        <Card className="bg-white shadow-md p-3 text-sm flex items-center justify-between rounded-md">
          <div>
            <h1 className="font-semibold text-base text-gray-700">{reviewedUserName}</h1>
            <div className="flex items-center gap-2 text-gray-500">
              <StarRating rating={Math.round(avgRating)} />
              <span>{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-[#f97415] text-white hover:bg-[#f97415]"
            onClick={() => setIsWritingReview(true)}
          >
            <Star className="w-3 h-3 mr-1" /> Write Review
          </Button>
        </Card>

        {/* Review Form */}
        {isWritingReview && (
          <Card className="shadow-sm p-3 text-sm rounded-md">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-700">Write a Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <label className="text-xs font-medium text-gray-700">Rating</label>
                <div className="mt-1">
                  <StarRating
                    rating={reviewForm.rating}
                    interactive
                    onChange={(rating) => setReviewForm((prev) => ({ ...prev, rating }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Comment</label>
                <Textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                  className="mt-1 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-[#f97415] text-white hover:bg-[#f97415]"
                  onClick={handleSubmitReview}
                >
                  Submit
                </Button>
                <Button
                  size="sm"
                  className="bg-white text-gray-700 border border-gray-300 hover:bg-red-500 hover:text-white"
                  onClick={() => setIsWritingReview(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews */}
        {reviews.length === 0 ? (
          <Card className="shadow-sm p-4 text-center text-sm rounded-md">
            <Star className="h-6 w-6 mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500">No reviews yet. Be the first to share your experience.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
