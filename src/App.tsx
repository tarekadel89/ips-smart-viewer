import { useEffect, useState } from "react";
import { fhirR4 } from "@smile-cdr/fhirts";
import { oauth2 } from "fhirclient";

function App() {
  const [patient, setPatient] = useState<fhirR4.Patient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    oauth2
      .ready()
      .then((client) => {
        client.request("Patient").then((data) => {
          // Wrap the raw data in a strongly typed Patient class
          setPatient(data);
        });
      })
      .catch(() => {
        setError(
          "No SMART launch context found. Please launch the app from your EHR."
        );
      });
  }, []);

  return (
    <div className="App">
      <h1>IPS SMART Viewer</h1>
      {patient ? (
        <div>
          <h2>Patient Information</h2>
          <p>
            Name: {patient.name?.[0]?.given?.join(" ")}{" "}
            {patient.name?.[0]?.family}
          </p>
          <p>Gender: {patient.gender}</p>
          <p>Date of Birth: {patient.birthDate}</p>
        </div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default App;
