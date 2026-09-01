export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          sort_order: number;
          is_active: boolean;
          merchandising_media_path: string | null;
          merchandising_media_alt: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          sort_order: number;
          is_active?: boolean;
          merchandising_media_path?: string | null;
          merchandising_media_alt?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          sort_order?: number;
          is_active?: boolean;
          merchandising_media_path?: string | null;
          merchandising_media_alt?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          category_id: string;
          slug: string;
          name: string;
          brand: string;
          price: number;
          old_price: number | null;
          rating: number | null;
          review_count: number;
          is_new: boolean;
          popularity_score: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          slug: string;
          name: string;
          brand: string;
          price: number;
          old_price?: number | null;
          rating?: number | null;
          review_count?: number;
          is_new?: boolean;
          popularity_score?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          slug?: string;
          name?: string;
          brand?: string;
          price?: number;
          old_price?: number | null;
          rating?: number | null;
          review_count?: number;
          is_new?: boolean;
          popularity_score?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          storage_path: string;
          alt: string;
          position: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          storage_path: string;
          alt: string;
          position: number;
        };
        Update: {
          id?: string;
          product_id?: string;
          storage_path?: string;
          alt?: string;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
