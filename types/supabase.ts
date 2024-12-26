// types/supabase.ts

export type Tables = {
    products: {
      Row: {
        id: number
        name: string
        description: string
        price: number
        image_url: string
        created_at: string
      }
      Insert: {
        id?: number
        name: string
        description: string
        price: number
        image_url: string
        created_at?: string
      }
      Update: {
        id?: number
        name?: string
        description?: string
        price?: number
        image_url?: string
        created_at?: string
      }
    }
  }
  
  export type Database = {
    public: {
      Tables: Tables
    }
  }