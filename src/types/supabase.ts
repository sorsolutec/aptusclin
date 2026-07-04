import { Database as GeneratedDatabase } from '@supabase/supabase-js'

// Since we don't have generated Supabase types, we use a permissive database type
// that allows any table name. This avoids TypeScript errors when calling .from('tableName')
// on tables that don't have generated type definitions.
declare module '@supabase/supabase-js' {
  interface SupabaseClientOptions<SchemaName> {
    db?: { schema?: SchemaName }
  }
}

export type Database = {
  public: {
    Tables: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Row: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Insert: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Update: any
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
