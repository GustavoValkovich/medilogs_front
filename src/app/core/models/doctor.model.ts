export interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  license_number?: string;
  specialty?: string;
  phone?: string;
}
