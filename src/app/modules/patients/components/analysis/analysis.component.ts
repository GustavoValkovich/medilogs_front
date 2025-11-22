import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../../../core/services/patient.service';
import { Patient } from '../../../../core/models/patient.model';
import { MaterialModule } from '../../../../shared/material.module';
import { PieChartComponent } from '../../../../shared/pie-chart/pie-chart.component';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, PieChartComponent],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
  form: FormGroup;
  patients: Patient[] = [];
  filtered: Patient[] = [];
  // groupBy removed: chart will auto-select grouping based on filters

  availableInsurances: string[] = [];
  availableCities: string[] = [];

  pieData: Array<{ label: string; value: number; color?: string }> = [];

  constructor(private fb: FormBuilder, private patientService: PatientService) {
    this.form = this.fb.group({
      ageRanges: [[]],
      genders: [[]],
      insurance: [''],
      city: [''],
      // no explicit grouping control
    });
  }

  ngOnInit(): void {
    this.loadPatients();
    this.form.valueChanges.subscribe(() => this.applyFiltersAndCompute());
  }

  loadPatients(): void {
    this.patientService.list().subscribe((list) => {
      this.patients = list || [];
      this.availableInsurances = Array.from(new Set(this.patients.map(p => p.insurance).filter(Boolean))) as string[];
      this.availableCities = Array.from(new Set(this.patients.map(p => p.city).filter(Boolean))) as string[];
      this.applyFiltersAndCompute();
    });
  }

  applyFiltersAndCompute(): void {
    const { ageRanges, genders, insurance, city } = this.form.value;

    this.filtered = this.patients.filter(p => {
      // gender filter
      if (genders && genders.length) {
        if (!p.gender || !genders.includes(p.gender)) return false;
      }
      // insurance
      if (insurance) {
        if ((p.insurance || '') !== insurance) return false;
      }
      // city
      if (city) {
        if ((p.city || '') !== city) return false;
      }
      // age ranges (OR among ranges). Ranges: "0-10", "11-30", "31-60", "61+"
      if (ageRanges && ageRanges.length) {
        const age = this.getAge(p.birth_date);
        let match = false;
        for (const r of ageRanges) {
          if (r === '0-10' && age >= 0 && age <= 10) match = true;
          if (r === '11-30' && age >= 11 && age <= 30) match = true;
          if (r === '31-60' && age >= 31 && age <= 60) match = true;
          if (r === '61+' && age >= 61) match = true;
        }
        if (!match) return false;
      }
      return true;
    });

    this.computePieData();
  }

  computePieData(): void {
    const map = new Map<string, number>();
    // read current filters from form
    const { ageRanges, genders, insurance, city } = this.form.value || {};

    const colors = ['#3f51b5', '#e91e63', '#ff9800', '#4caf50', '#9c27b0', '#00bcd4', '#ffc107', '#795548'];
    if (!this.filtered.length) {
      this.pieData = [];
      return;
    }

    // detect whether any filters are applied
    const noFilters = (!ageRanges || !ageRanges.length) && (!genders || !genders.length) && !insurance && !city;
    if (noFilters) {
      // no filters -> single unlabeled slice
      this.pieData = [{ label: '', value: this.filtered.length, color: colors[0] }];
      return;
    }

    // Decide grouping automatically. Priority: explicit selections -> gender, ageRanges, insurance, city
    let grouping: 'gender' | 'age' | 'insurance' | 'city' | null = null;
    if (genders && genders.length) grouping = 'gender';
    else if (ageRanges && ageRanges.length) grouping = 'age';
    else if (insurance) grouping = 'insurance';
    else if (city) grouping = 'city';

    // if no explicit selection, infer grouping from available distinct values (same priority)
    if (!grouping) {
      const genderSet = new Set(this.filtered.map(p => (p.gender || '—').toString().trim()).filter(Boolean));
      if (genderSet.size > 1) grouping = 'gender';
      else {
        // age buckets
        const buckets = new Set(this.filtered.map(p => {
          const a = this.getAge(p.birth_date);
          if (a >= 0 && a <= 10) return '0-10';
            if (a >= 11 && a <= 30) return '11-30';
            if (a >= 31 && a <= 60) return '31-60';
            return '61+';
        }));
        if (buckets.size > 1) grouping = 'age';
        else {
          const insSet = new Set(this.filtered.map(p => (p.insurance || '—').toString().trim()).filter(Boolean));
          if (insSet.size > 1) grouping = 'insurance';
          else {
            const citySet = new Set(this.filtered.map(p => (p.city || '—').toString().trim()).filter(Boolean));
            if (citySet.size > 1) grouping = 'city';
          }
        }
      }
    }

    // If no meaningful grouping found, aggregate into a single slice
    if (!grouping) {
      this.pieData = [{ label: '', value: this.filtered.length, color: colors[0] }];
      return;
    }

    if (grouping === 'age') {
      // buckets: 0-10, 11-30, 31-60, 61+
      for (const p of this.filtered) {
        const age = this.getAge(p.birth_date);
        let key = '61+';
          if (age >= 0 && age <= 10) key = '0-10';
          else if (age >= 11 && age <= 30) key = '11-30';
          else if (age >= 31 && age <= 60) key = '31-60';
          else if (age >= 61) key = '61+';
        map.set(key, (map.get(key) || 0) + 1);
      }
    } else if (grouping === 'insurance') {
      for (const p of this.filtered) {
        const key = (p.insurance || '—').toString().trim();
        map.set(key, (map.get(key) || 0) + 1);
      }
    } else if (grouping === 'city') {
      for (const p of this.filtered) {
        const key = (p.city || '—').toString().trim();
        map.set(key, (map.get(key) || 0) + 1);
      }
    } else {
      // gender
      for (const p of this.filtered) {
        const key = (p.gender || '—').toString().trim().toUpperCase();
        map.set(key, (map.get(key) || 0) + 1);
      }
    }
    // debug: show grouping and counts in console to help diagnose
    try { console.debug('[analysis] grouping=', grouping, 'filtered=', this.filtered.length, 'map=', Array.from(map.entries())); } catch (e) {}

    let i = 0;
    this.pieData = Array.from(map.entries()).map(([label, value]) => ({ label, value, color: colors[(i++) % colors.length] }));
    try { console.debug('[analysis] pieData=', this.pieData); } catch (e) {}
  }

  getAge(dateString?: string): number {
    if (!dateString) return 0;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 0;
    const diff = Date.now() - d.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  trackByPatientId(_index: number, p: Patient): number {
    return p.id;
  }

}
