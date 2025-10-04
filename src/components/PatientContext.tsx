import { useEffect } from "react";
import { oauth2 } from "fhirclient";
import { mockPatient } from "../data/mockFhirData";
import type { PatientSummary } from "../definitions/PatientSummary";

export default function PatientContext({
  setPatientSummary,
  setError,
}: {
  setPatientSummary: React.Dispatch<
    React.SetStateAction<PatientSummary | null>
  >;
  setError: (error: string | null) => void;
}) {
  useEffect(() => {
    oauth2
      .ready()
      .then((client) => {
        if (!client.patient || !client.patient.id) {
          setError(
            "Error: No patient context. Launch this app from within the EHR."
          );
          return;
        }
        client
          .request("Patient/" + client.patient.id)
          .then((data) => {
            setPatientSummary((prev) => ({
              ...(prev ?? {}),
              patient: data,
            }));
          })
          .catch((err) => {
            setError(
              "Failed to load patient: " + (err.message || JSON.stringify(err))
            );
          });
      })
      .catch(() => {
        // setError(
        //   "No SMART launch context found. Please launch the app from your EHR."
        // );
        setPatientSummary((prev) => ({
          ...(prev ?? {}),
          patient: mockPatient,
        }));
      });
  }, [setPatientSummary, setError]);

  return null; // This component only handles logic
}
