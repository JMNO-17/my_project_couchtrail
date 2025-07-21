export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at?: string;
  isAdmin: boolean;
  region?: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Conversation {
  id: number;
  user1_id: number;
  user2_id: number;
  created_at: string;
  user1?: User;
  user2?: User;
  lastMessage?: Message;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  conversation_id: number;
  message: string;
  sent_at: string;
  sender?: User;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: number;
  message_id: number;
  name: string;
  path: string;
  mime: string;
  size: number;
}

export interface Hosting {
  id: number;
  user_id: number;
  home_description: string;
  address: string;
  preferences: string;
  details: string;
  additional_info: string;
  availability_calendar: string;
  user?: User;
}

export interface HostingRequest {
  id: number;
  traveler_id: number;
  host_id: number;
  location: string;
  message: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
  is_suspicious: boolean;
  created_at: string;
  traveler?: User;
  host?: User;
  hosting?: Hosting;
}

export interface Review {
  id: number;
  reviewer_id: number;
  reviewed_id: number;
  type: 'host' | 'traveler';
  rating: number;
  comment: string;
  date: string;
  is_flagged: boolean;
  reviewer?: User;
  reviewed?: User;
}