export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'visitor' | 'subscriber' | 'admin';
export type MembershipTier = 'free' | 'supporter' | 'scholarship';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          membership_tier: MembershipTier;
          phone: string | null;
          bio: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          membership_tier?: MembershipTier;
          phone?: string | null;
          bio?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          membership_tier?: MembershipTier;
          phone?: string | null;
          bio?: string | null;
        };
      };
      exclusive_content: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          description: string;
          type: 'webinar' | 'plantilla' | 'guia_avanzada' | 'evento_privado' | 'kit_sensorial';
          video_url: string | null;
          download_url: string | null;
          file_size: string | null;
          access_tier: 'subscriber' | 'admin';
          is_published: boolean;
          thumbnail_url: string | null;
          author: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          description: string;
          type: 'webinar' | 'plantilla' | 'guia_avanzada' | 'evento_privado' | 'kit_sensorial';
          video_url?: string | null;
          download_url?: string | null;
          file_size?: string | null;
          access_tier?: 'subscriber' | 'admin';
          is_published?: boolean;
          thumbnail_url?: string | null;
          author?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          description?: string;
          type?: 'webinar' | 'plantilla' | 'guia_avanzada' | 'evento_privado' | 'kit_sensorial';
          video_url?: string | null;
          download_url?: string | null;
          file_size?: string | null;
          access_tier?: 'subscriber' | 'admin';
          is_published?: boolean;
          thumbnail_url?: string | null;
          author?: string;
        };
      };
      programs_catalog: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          category: string;
          short_description: string;
          full_description: string | null;
          icon: string;
          image_url: string | null;
          target_audience: string | null;
          format: string;
          duration: string | null;
          features: string[];
          is_active: boolean;
        };
        Insert: {
          id: string;
          created_at?: string;
          title: string;
          category: string;
          short_description: string;
          full_description?: string | null;
          icon?: string;
          image_url?: string | null;
          target_audience?: string | null;
          format?: string;
          duration?: string | null;
          features?: string[];
          is_active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          category?: string;
          short_description?: string;
          full_description?: string | null;
          icon?: string;
          image_url?: string | null;
          target_audience?: string | null;
          format?: string;
          duration?: string | null;
          features?: string[];
          is_active?: boolean;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          phone: string | null;
          topic: string;
          message: string;
          status: 'unread' | 'in_progress' | 'resolved' | 'archived';
          admin_notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          phone?: string | null;
          topic?: string;
          message: string;
          status?: 'unread' | 'in_progress' | 'resolved' | 'archived';
          admin_notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          topic?: string;
          message?: string;
          status?: 'unread' | 'in_progress' | 'resolved' | 'archived';
          admin_notes?: string | null;
        };
      };
      program_inquiries: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          phone: string;
          program_id: string;
          program_name: string;
          preferred_modality: 'virtual' | 'presencial' | 'indiferente';
          notes: string | null;
          status: 'pending' | 'contacted' | 'enrolled' | 'cancelled';
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          phone: string;
          program_id: string;
          program_name: string;
          preferred_modality?: 'virtual' | 'presencial' | 'indiferente';
          notes?: string | null;
          status?: 'pending' | 'contacted' | 'enrolled' | 'cancelled';
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          phone?: string;
          program_id?: string;
          program_name?: string;
          preferred_modality?: 'virtual' | 'presencial' | 'indiferente';
          notes?: string | null;
          status?: 'pending' | 'contacted' | 'enrolled' | 'cancelled';
        };
      };
      volunteers: {
        Row: {
          id: string;
          created_at: string;
          full_name: string;
          email: string;
          phone: string;
          city: string;
          occupation: string | null;
          skills: string[];
          availability: string | null;
          motivation: string;
          status: 'received' | 'interview_scheduled' | 'active' | 'inactive';
        };
        Insert: {
          id?: string;
          created_at?: string;
          full_name: string;
          email: string;
          phone: string;
          city?: string;
          occupation?: string | null;
          skills?: string[];
          availability?: string | null;
          motivation: string;
          status?: 'received' | 'interview_scheduled' | 'active' | 'inactive';
        };
        Update: {
          id?: string;
          created_at?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          city?: string;
          occupation?: string | null;
          skills?: string[];
          availability?: string | null;
          motivation?: string;
          status?: 'received' | 'interview_scheduled' | 'active' | 'inactive';
        };
      };
      donations: {
        Row: {
          id: string;
          created_at: string;
          donor_name: string;
          donor_email: string;
          donor_phone: string | null;
          amount: number;
          currency: string;
          frequency: 'one_time' | 'monthly' | 'annual';
          payment_method: string;
          transaction_reference: string | null;
          is_anonymous: boolean;
          status: 'pledged' | 'pending' | 'completed' | 'failed';
          message: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          donor_name: string;
          donor_email: string;
          donor_phone?: string | null;
          amount: number;
          currency?: string;
          frequency?: 'one_time' | 'monthly' | 'annual';
          payment_method?: string;
          transaction_reference?: string | null;
          is_anonymous?: boolean;
          status?: 'pledged' | 'pending' | 'completed' | 'failed';
          message?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          donor_name?: string;
          donor_email?: string;
          donor_phone?: string | null;
          amount?: number;
          currency?: string;
          frequency?: 'one_time' | 'monthly' | 'annual';
          payment_method?: string;
          transaction_reference?: string | null;
          is_anonymous?: boolean;
          status?: 'pledged' | 'pending' | 'completed' | 'failed';
          message?: string | null;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          email: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          is_active?: boolean;
        };
      };
      resources: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          category: string;
          description: string;
          file_type: string;
          file_size: string;
          download_url: string;
          download_count: number;
          is_featured: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          category: string;
          description: string;
          file_type?: string;
          file_size?: string;
          download_url: string;
          download_count?: number;
          is_featured?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          category?: string;
          description?: string;
          file_type?: string;
          file_size?: string;
          download_url?: string;
          download_count?: number;
          is_featured?: boolean;
        };
      };
    };
  };
}
