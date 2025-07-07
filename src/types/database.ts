export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          name: string;
          pin: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          pin: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          pin?: string;
          created_at?: string;
        };
      };
      problems: {
        Row: {
          id: string;
          title: string;
          link: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          link: string;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          link?: string;
          category?: string;
          created_at?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          member_id: string;
          problem_id: string;
          is_solved: boolean;
          solution: string | null;
          notes: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          problem_id: string;
          is_solved?: boolean;
          solution?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          problem_id?: string;
          is_solved?: boolean;
          solution?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}