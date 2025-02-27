export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      attendance: {
        Row: {
          id: number
          created_at: string
          date: string
          name: string
          option1: boolean
          option2: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          date: string
          name: string
          option1: boolean
          option2: boolean
        }
        Update: {
          id?: number
          created_at?: string
          date?: string
          name?: string
          option1?: boolean
          option2?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}