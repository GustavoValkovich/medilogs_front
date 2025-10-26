export interface Patient {
  id?: string;
  firstName: string;
  lastName: string;
  documentNumber?: string;
  email?: string;
  phone?: string;
  birthDate?: string; // ISO
  // agregar campos que tenga su entidad en el back
}