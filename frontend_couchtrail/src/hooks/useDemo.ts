import { useState, useEffect } from 'react';
import { User, Conversation, Message, Hosting, HostingRequest, Review } from '@/types';

// Demo data for development
const DEMO_USERS: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@travel.com',
    isAdmin: true,
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'John Traveler',
    email: 'john@travel.com',
    isAdmin: false,
    role: 'user',
    region: 'Europe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: 3,
    name: 'Sarah Host',
    email: 'sarah@travel.com',
    isAdmin: false,
    role: 'user',
    region: 'Asia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    created_at: '2024-01-03T00:00:00Z'
  },
  {
    id: 4,
    name: 'Mike Explorer',
    email: 'mike@travel.com',
    isAdmin: false,
    role: 'user',
    region: 'Americas',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    created_at: '2024-01-04T00:00:00Z'
  }
];

const DEMO_HOSTINGS: Hosting[] = [
  {
    id: 1,
    user_id: 3,
    home_description: 'Cozy apartment in the heart of Tokyo with amazing city views',
    address: 'Tokyo, Japan',
    preferences: 'Non-smokers, respect quiet hours after 10pm',
    details: '2 bedroom apartment, shared kitchen and living room',
    additional_info: 'Near metro station, many restaurants nearby',
    availability_calendar: '2024-02-01,2024-02-15,2024-03-01,2024-03-31'
  },
  {
    id: 2,
    user_id: 4,
    home_description: 'Beautiful house with garden in peaceful neighborhood',
    address: 'Barcelona, Spain',
    preferences: 'Pet-friendly, enjoy cultural discussions',
    details: 'Private room with shared bathroom and kitchen access',
    additional_info: 'Garden access, bicycles available',
    availability_calendar: '2024-02-10,2024-02-28,2024-04-01,2024-04-30'
  }
];

const DEMO_HOSTING_REQUESTS: HostingRequest[] = [
  {
    id: 1,
    traveler_id: 2,
    host_id: 3,
    location: 'Tokyo, Japan',
    message: 'Hi Sarah! I\'m planning to visit Tokyo and would love to stay with a local. I\'m clean, respectful, and excited to learn about Japanese culture.',
    date: '2024-02-10',
    status: 'pending',
    is_suspicious: false,
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    traveler_id: 2,
    host_id: 4,
    location: 'Barcelona, Spain',
    message: 'Hello Mike! I\'m a fellow traveler and would appreciate staying with someone who understands the travel lifestyle.',
    date: '2024-03-15',
    status: 'accepted',
    is_suspicious: false,
    created_at: '2024-01-20T14:20:00Z'
  }
];

const DEMO_REVIEWS: Review[] = [
  {
    id: 1,
    reviewer_id: 2,
    reviewed_id: 4,
    type: 'host',
    rating: 5,
    comment: 'Amazing host! Mike was so welcoming and showed me the best local spots. Highly recommend!',
    date: '2024-01-25T00:00:00Z',
    is_flagged: false
  },
  {
    id: 2,
    reviewer_id: 4,
    reviewed_id: 2,
    type: 'traveler',
    rating: 5,
    comment: 'John was the perfect guest - respectful, clean, and great company. Welcome back anytime!',
    date: '2024-01-26T00:00:00Z',
    is_flagged: false
  }
];

const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    user1_id: 2,
    user2_id: 3,
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    user1_id: 2,
    user2_id: 4,
    created_at: '2024-01-20T14:20:00Z'
  }
];

const DEMO_MESSAGES: Message[] = [
  {
    id: 1,
    sender_id: 2,
    receiver_id: 3,
    conversation_id: 1,
    message: 'Hi Sarah! I saw your hosting profile and I\'m interested in staying with you.',
    sent_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    sender_id: 3,
    receiver_id: 2,
    conversation_id: 1,
    message: 'Hello John! I\'d be happy to host you. When are you planning to visit?',
    sent_at: '2024-01-15T11:00:00Z'
  },
  {
    id: 3,
    sender_id: 2,
    receiver_id: 4,
    conversation_id: 2,
    message: 'Hey Mike! Thanks for accepting my hosting request. Looking forward to meeting you!',
    sent_at: '2024-01-21T09:00:00Z'
  }
];

export const useDemo = () => {
  const [users] = useState<User[]>(DEMO_USERS);
  const [hostings, setHostings] = useState<Hosting[]>(DEMO_HOSTINGS);
  const [hostingRequests, setHostingRequests] = useState<HostingRequest[]>(DEMO_HOSTING_REQUESTS);
  const [reviews, setReviews] = useState<Review[]>(DEMO_REVIEWS);
  const [conversations, setConversations] = useState<Conversation[]>(DEMO_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);

  // Add user data to related entities
  const getEnrichedHostings = () => {
    return hostings.map(hosting => ({
      ...hosting,
      user: users.find(u => u.id === hosting.user_id)
    }));
  };

  const getEnrichedHostingRequests = () => {
    return hostingRequests.map(request => ({
      ...request,
      traveler: users.find(u => u.id === request.traveler_id),
      host: users.find(u => u.id === request.host_id),
      hosting: hostings.find(h => h.user_id === request.host_id)
    }));
  };

  const getEnrichedReviews = () => {
    return reviews.map(review => ({
      ...review,
      reviewer: users.find(u => u.id === review.reviewer_id),
      reviewed: users.find(u => u.id === review.reviewed_id)
    }));
  };

  const getEnrichedConversations = () => {
    return conversations.map(conversation => {
      const lastMessage = messages
        .filter(m => m.conversation_id === conversation.id)
        .sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime())[0];
      
      return {
        ...conversation,
        user1: users.find(u => u.id === conversation.user1_id),
        user2: users.find(u => u.id === conversation.user2_id),
        lastMessage
      };
    });
  };

  const getEnrichedMessages = (conversationId: number) => {
    return messages
      .filter(m => m.conversation_id === conversationId)
      .map(message => ({
        ...message,
        sender: users.find(u => u.id === message.sender_id)
      }))
      .sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime());
  };

  const addMessage = (newMessage: Omit<Message, 'id' | 'sent_at'>) => {
    const message: Message = {
      ...newMessage,
      id: messages.length + 1,
      sent_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, message]);
    return message;
  };

  const updateHostingRequest = (id: number, status: 'accepted' | 'rejected') => {
    setHostingRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, status } : request
      )
    );
  };

  const addHosting = (newHosting: Omit<Hosting, 'id'>) => {
    const hosting: Hosting = {
      ...newHosting,
      id: hostings.length + 1
    };
    setHostings(prev => [...prev, hosting]);
    return hosting;
  };

  const addReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const review: Review = {
      ...newReview,
      id: reviews.length + 1,
      date: new Date().toISOString()
    };
    setReviews(prev => [...prev, review]);
    return review;
  };

  const addHostingRequest = (newRequest: Omit<HostingRequest, 'id' | 'created_at'>) => {
    const request: HostingRequest = {
      ...newRequest,
      id: hostingRequests.length + 1,
      created_at: new Date().toISOString()
    };
    setHostingRequests(prev => [...prev, request]);
    return request;
  };

  return {
    users,
    getEnrichedHostings,
    getEnrichedHostingRequests,
    getEnrichedReviews,
    getEnrichedConversations,
    getEnrichedMessages,
    addMessage,
    updateHostingRequest,
    addHosting,
    addReview,
    addHostingRequest
  };
};