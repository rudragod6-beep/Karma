import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AccountType = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type AvailabilityStatus = 'AVAILABLE_NOW' | 'BUSY' | 'OFFLINE';
export type KarmaLevel = 'NONE' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
export type BookingStatus = 'REQUESTED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
export type FtlType = 'LOST_ITEM' | 'LOST_PET' | 'MISSING_PERSON';
export type FtlStatus = 'ACTIVE' | 'RESOLVED' | 'EXPIRED' | 'REMOVED';

export interface Profile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  profile_photo?: string;
  account_type: AccountType;
  is_phone_verified: boolean;
  is_email_verified: boolean;
  city?: string;
  created_at: string;
}

export interface ServiceProvider {
  id: string;
  user_id: string;
  bio?: string;
  profession: string;
  category_id?: string;
  experience: number;
  hourly_rate?: number;
  service_area: string;
  skills: string[];
  languages: string[];
  verification_status: VerificationStatus;
  verified_at?: string;
  is_available: boolean;
  availability_status: AvailabilityStatus;
  karma_points: number;
  karma_level: KarmaLevel;
  average_rating: number;
  total_jobs_completed: number;
  commission_rate: number;
  profile_completion: number;
  profiles?: Profile;
  service_categories?: ServiceCategory;
}

export interface ServiceCategory {
  id: string;
  name: string;
  name_nepali?: string;
  icon: string;
  is_active: boolean;
}

export interface Booking {
  id: string;
  customer_id: string;
  provider_id: string;
  status: BookingStatus;
  job_description: string;
  job_address: string;
  scheduled_date: string;
  agreed_price?: number;
  payment_status: string;
  created_at: string;
  profiles?: Profile;
  service_providers?: ServiceProvider;
}

export interface FtlAlert {
  id: string;
  user_id: string;
  type: FtlType;
  title: string;
  description: string;
  last_seen_location: string;
  photos: string[];
  qr_code?: string;
  latitude?: number;
  longitude?: number;
  contact_method: string;
  status: FtlStatus;
  expires_at: string;
  created_at: string;
  profiles?: Profile;
}
