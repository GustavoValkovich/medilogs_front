# Medilogs – Frontend

Angular frontend application to manage doctors, patients, and medical consultations.  
This project consumes the REST API provided by the **Medilogs** backend (default URL: `http://localhost:3000`).

---

## Technology Stack

- **Angular 20**
- **TypeScript 5.9**
- **Angular Material**
- **RxJS**
- **Angular Router**
- **SCSS**
- **ESLint**

---

## Main Features

- **Authentication**
  - Login and signup screens.
  - Basic session handling using a storage service.

- **Doctor Profile**
  - Doctor name and basic profile data.
  - Side panel (sidenav) to view and edit the doctor’s information from the main toolbar.

- **Patients**
  - List of patients with basic search.
  - Create and edit patient records.
  - Link patients to consultations.

- **Consultations**
  - Create consultations for a selected patient.
  - Add notes through a dialog.
  - View the details of a consultation in a separate dialog.
  - Display consultation history for a patient.

- **Negatoscopio**
  - Overlay component (`NegatoscopioComponent`) intended to display images or studies (X-rays, etc.).

- **UI / UX**
  - Responsive layout based on Angular Material.
  - Snackbars for success / error feedback.
  - Confirmation dialogs for destructive actions.

---
