import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { useDemo } from '@/hooks/useDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, User, Home, Calendar, Flag, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

export const ReviewsPage = () => {
  const { user } = useAuth();
  const { getEnrichedReviews, addReview, users } = useDemo();
  const { toast } = useToast();
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    reviewed_id: 0,
    type: 'host' as 'host' | 'traveler',
    rating: 5,
    comment: ''
  });

  if (!user) return null;

  const allReviews = getEnrichedReviews();
  const receivedReviews = allReviews.filter(r => r.reviewed_id === user.id);
  const writtenReviews = allReviews.filter(r => r.reviewer_id === user.id);

  const handleSubmitReview = () => {
    if (!reviewForm.comment.trim()) {
      toast({
        title: "Error",
        description: "Please write a comment",
        variant: "destructive"
      });
      return;
    }

    addReview({
      reviewer_id: user.id,
      reviewed_id: reviewForm.reviewed_id,
      type: reviewForm.type,
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
      is_flagged: false
    });

    toast({
      title: "Success",
      description: "Your review has been submitted!",
    });

    setIsWritingReview(false);
    setReviewForm({
      reviewed_id: 0,
      type: 'host',
      rating: 5,
      comment: ''
    });
  };

  const StarRating = ({ rating, interactive = false, onChange }: { 
    rating: number; 
    interactive?: boolean; 
    onChange?: (rating: number) => void; 
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-muted-foreground'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={() => interactive && onChange?.(star)}
        />
      ))}
    </div>
  );

  const ReviewCard = ({ review, showReviewer = true }: { review: any; showReviewer?: boolean }) => (
    <Card className="shadow-travel hover:shadow-glow transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={showReviewer ? review.reviewer?.avatar : review.reviewed?.avatar} />
            <AvatarFallback>
              {(showReviewer ? review.reviewer?.name : review.reviewed?.name)?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {showReviewer ? (
                    <User className="h-4 w-4" />
                  ) : (
                    review.type === 'host' ? <Home className="h-4 w-4" /> : <User className="h-4 w-4" />
                  )}
                  {showReviewer ? review.reviewer?.name : review.reviewed?.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={review.rating} />
                  <Badge variant={review.type === 'host' ? 'default' : 'secondary'}>
                    {review.type === 'host' ? 'Host Review' : 'Traveler Review'}
                  </Badge>
                  {review.is_flagged && (
                    <Badge variant="destructive">
                      <Flag className="h-3 w-3 mr-1" />
                      Flagged
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm">{review.comment}</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {format(new Date(review.date), 'MMM d, yyyy')}
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
                Reviews
              </h1>
              <p className="text-muted-foreground mt-2">
                Share your experiences and see what others say
              </p>
            </div>
            <Button 
              onClick={() => setIsWritingReview(true)}
              className="bg-gradient-hero"
            >
              <Plus className="h-4 w-4 mr-2" />
              Write Review
            </Button>
          </div>
        </div>

        {isWritingReview && (
          <Card className="shadow-travel mb-6">
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select User</label>
                <select
                  value={reviewForm.reviewed_id}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, reviewed_id: Number(e.target.value) }))}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  <option value={0}>Select a user to review</option>
                  {users.filter(u => u.id !== user.id).map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Review Type</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="host"
                      checked={reviewForm.type === 'host'}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, type: e.target.value as 'host' | 'traveler' }))}
                    />
                    Host Review
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="traveler"
                      checked={reviewForm.type === 'traveler'}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, type: e.target.value as 'host' | 'traveler' }))}
                    />
                    Traveler Review
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Rating</label>
                <div className="mt-1">
                  <StarRating 
                    rating={reviewForm.rating} 
                    interactive 
                    onChange={(rating) => setReviewForm(prev => ({ ...prev, rating }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Comment</label>
                <Textarea
                  placeholder="Share your experience..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmitReview} className="bg-gradient-hero">
                  Submit Review
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsWritingReview(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="received" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received" className="flex items-center gap-2">
              Received ({receivedReviews.length})
            </TabsTrigger>
            <TabsTrigger value="written" className="flex items-center gap-2">
              Written ({writtenReviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-4">
            {receivedReviews.length === 0 ? (
              <Card className="shadow-travel">
                <CardContent className="text-center py-12">
                  <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No reviews received</h3>
                  <p className="text-muted-foreground">
                    Reviews from your guests and hosts will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              receivedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} showReviewer={true} />
              ))
            )}
          </TabsContent>

          <TabsContent value="written" className="space-y-4">
            {writtenReviews.length === 0 ? (
              <Card className="shadow-travel">
                <CardContent className="text-center py-12">
                  <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No reviews written</h3>
                  <p className="text-muted-foreground">
                    Reviews you write will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              writtenReviews.map((review) => (
                <ReviewCard key={review.id} review={review} showReviewer={false} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};