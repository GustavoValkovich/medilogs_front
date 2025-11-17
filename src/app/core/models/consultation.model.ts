export interface Consultation {
  id: number;
  patient_id: number;
  deleted_at?: string | null;
  doctor_id?: number;
  date: string;
  reason?: string;
  notes?: string;
}
