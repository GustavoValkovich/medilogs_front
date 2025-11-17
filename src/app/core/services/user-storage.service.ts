import { Injectable } from '@angular/core';
import { Doctor } from '../models/doctor.model';

const STORAGE_KEY = 'medilogs_user';

@Injectable({ providedIn: 'root' })
export class UserStorageService {
  getDoctor(): Doctor | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as Doctor;
    } catch {
      return null;
    }
  }

  setDoctor(doctor: Doctor | null): void {
    try {
      if (!doctor) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(doctor));
      }
    } catch {
      // ignore
    }
  }

  isLoggedIn(): boolean {
    return !!this.getDoctor();
  }

  clear(): void {
    this.setDoctor(null);
  }
}
