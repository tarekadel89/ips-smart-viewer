import { fhirR4 } from "@smile-cdr/fhirts";

export type PatientSummary = {
  patient?: fhirR4.Patient;
  allergies?: fhirR4.AllergyIntolerance[];
  conditions?: fhirR4.Condition[];
  medications?: fhirR4.MedicationRequest[];
  // Add more resource types as needed
};
