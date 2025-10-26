export interface Consultation {
  id?: string;
  patientId: string;
  doctorId: string;
  date: string; // ISO
  notes?: string;
}