// Global type definitions for BookMeHere application

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

// User and Authentication types
export interface User {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'customer' | 'admin' | 'business_owner';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Service types
export interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  image_path?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Skill types
export interface Skill {
  id: number;
  name: string;
  emoji: string;
  created_at: string;
}

// Master types
export interface Master {
  id: number;
  name: string;
  description: string;
  image_path?: string;
  phone?: string;
  email?: string;
  rating: number;
  total_reviews: number;
  working_hours: WorkingHours;
  skills: Skill[];
  services?: Service[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Working hours type
export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  start: string;
  end: string;
  off: boolean;
}

// Booking types
export interface Booking {
  id: number;
  service_id: number;
  master_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  user_id?: number;
  is_guest: boolean;
  created_at: string;
  updated_at: string;
}

// Time slot types
export interface TimeSlot {
  time: string;
  display: string;
  available: boolean;
}

// Business settings types
export interface BusinessSettings {
  id: number;
  currency: string;
  currency_symbol: string;
  business_name: string;
  business_phone: string;
  business_email: string;
  created_at: string;
  updated_at: string;
}

// Business hours types
export interface BusinessHour {
  id: number;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_open: boolean;
}

// Form data types
export interface ServiceFormData {
  name: string;
  description: string;
  duration: string;
  price: string;
}

export interface MasterFormData {
  name: string;
  description: string;
  phone: string;
  email: string;
  skillIds: number[];
  serviceIds: number[];
}

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  notes: string;
  contact_preference: ContactPreference;
}

export type ContactPreference = 
  | 'telegram'
  | 'viber' 
  | 'messenger'
  | 'whatsapp'
  | 'sms'
  | 'phone_call'
  | 'gmail';

// Booking flow state types
export interface BookingState {
  selectedService: Service | null;
  selectedMaster: Master | null;
  selectedDate: string;
  selectedTime: string;
  customerData: CustomerData;
}

// Statistics types
export interface BusinessStats {
  totalServices: number;
  activeServices: number;
  totalBookings: number;
  totalMasters: number;
  activeMasters: number;
}

