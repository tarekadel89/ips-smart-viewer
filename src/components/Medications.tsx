import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import ErrorCard from "./ErrorCard";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { useEffect, useState } from "react";
import { oauth2 } from "fhirclient";
import { fhirR4 } from "@smile-cdr/fhirts";
//import formatDateDDMMMYYYY from "../helpers/formatDateDDMMMYYYY";

import { MedicationRequestOne } from "../data/mockFhirData";
import type { PatientSummary } from "../definitions/PatientSummary";

export default function Medications(props: {
  patientId?: string;
  medications: fhirR4.MedicationRequest[];
  setPatientSummary: React.Dispatch<
    React.SetStateAction<PatientSummary | null>
  >;
}) {
  const MOCK_PATIENT_ID = "patient-example-female"; // Set this to your mock patient's id

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    if (props.patientId === MOCK_PATIENT_ID) {
      // Only update if medications are different
      if (
        !props.medications ||
        props.medications.length === 0 ||
        props.medications[0].id !== MedicationRequestOne.id
      ) {
        props.setPatientSummary((prev) => ({
          ...prev,
          medications: [MedicationRequestOne],
        }));
      }
      setError(null);
      setLoading(false);
      return;
    }
    oauth2
      .ready()
      .then((client) => {
        client
          .request("MedicationRequest?patient=Patient/" + props.patientId)
          .then((bundle: any) => {
            const meds =
              bundle.entry?.map((entry: any) => entry.resource) || [];
            if (
              !props.medications ||
              meds.length !== props.medications.length ||
              meds.some(
                (c: fhirR4.MedicationRequest, i: number) =>
                  c.id !== props.medications[i]?.id
              )
            ) {
              props.setPatientSummary((prev) => ({
                ...prev,
                medications: meds.length > 0 ? meds : [],
              }));
            }
            setError(null);
            setLoading(false);
          })
          .catch(() => {
            setError("Failed to fetch medications from server.");
            props.setPatientSummary((prev) => ({
              ...prev,
              medications: [],
            }));
            setLoading(false);
          });
      })
      .catch(() => {
        setError("No SMART context found.");
        props.setPatientSummary((prev) => ({
          ...prev,
          medications: [],
        }));
        setLoading(false);
      });
  }, [props.patientId]);

  function getStatusColor(status: string) {
    switch (status?.toLowerCase()) {
      case "active":
        return "primary";
      case "completed":
        return "success";
      case "on-hold":
        return "warning";
      case "cancelled":
      case "entered-in-error":
        return "error";
      default:
        return "default";
    }
  }

  return (
    <Card>
      <CardHeader
        sx={{ mb: 0, pb: 0 }}
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <LocalPharmacyIcon color="primary" fontSize="medium" />
            <Typography variant="h6" fontWeight={600}>
              Medications
            </Typography>
            <Badge
              badgeContent={props.medications.length}
              color="primary"
              sx={{ ml: 2 }}
            />
          </Box>
        }
      />
      <CardContent>
        {loading ? (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            Loading medications data...
          </Typography>
        ) : error ? (
          <ErrorCard message={error} />
        ) : props.medications.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            No information recorded.
          </Typography>
        ) : (
          props.medications.map((med) => (
            <Card
              key={med.id}
              variant="outlined"
              sx={{
                mb: 1,
                p: 2,
                backgroundColor: "background.paper",
                "&:hover": { backgroundColor: "action.hover" },
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    flexWrap="wrap"
                    mb={0.5}
                  >
                    <Typography variant="subtitle1" fontWeight={500}>
                      {med.medicationReference?.display ||
                        med.medicationCodeableConcept?.text ||
                        "Unknown Medication"}
                    </Typography>
                    <Chip
                      label={med.status || "Unknown"}
                      color={getStatusColor(med.status)}
                      variant="outlined"
                      sx={{ textTransform: "capitalize", fontWeight: 600 }}
                    />
                    <Chip
                      label={med.intent || "Unknown"}
                      color="info"
                      variant="outlined"
                      sx={{ textTransform: "capitalize", fontWeight: 600 }}
                    />
                  </Box>
                  {med.dosageInstruction?.[0]?.text && (
                    <Typography variant="body2" color="text.secondary">
                      Dosage: {med.dosageInstruction[0].text}
                    </Typography>
                  )}
                  {med.dispenseRequest?.validityPeriod?.start && (
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <AccessTimeIcon fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        Start:{" "}
                        {/* {formatDateDDMMMYYYY(med.dispenseRequest.validityPeriod.start)} */}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
