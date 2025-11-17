export interface Patient {
  id: number;
  deleted_at?: string | null;
  doctor_id?: number;
  full_name: string;
  document?: string;
  birth_date?: string;
  notes?: string;
  gender?: string;
  insurance?: string;
  email?: string;
  city?: string;
}
