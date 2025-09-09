// Database type definitions for TypeScript
export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          rabbi_id: string;
          created_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          rabbi_id: string;
          created_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          rabbi_id?: string;
          created_at?: string;
          is_active?: boolean;
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          content: string;
          audio_url?: string;
          youtube_url?: string;
          order_number: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          content: string;
          audio_url?: string;
          youtube_url?: string;
          order_number: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          content?: string;
          audio_url?: string;
          youtube_url?: string;
          order_number?: number;
          created_at?: string;
        };
      };
    };
  };
}