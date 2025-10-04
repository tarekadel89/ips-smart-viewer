import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import ErrorCard from "./ErrorCard";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

import { useEffect, useState } from "react";
import { oauth2 } from "fhirclient";
import { fhirR4 } from "@smile-cdr/fhirts";
import formatDateDDMMMYYYY from "../helpers/formatDateDDMMMYYYY";

import { conditionOne } from "../data/mockFhirData";
import type { PatientSummary } from "../definitions/PatientSummary";

export default function Conditions(props: {
  patientId?: string;
  conditions: fhirR4.Condition[];
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
      // Only update if conditions are different
      if (
        !props.conditions ||
        props.conditions.length === 0 ||
        props.conditions[0].id !== conditionOne.id
      ) {
        props.setPatientSummary((prev) => ({
          ...prev,
          conditions: [conditionOne],
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
          .request("Condition?patient=Patient/" + props.patientId)
          .then((bundle: any) => {
            const conditions =
              bundle.entry?.map((entry: any) => entry.resource) || [];
            if (
              !props.conditions ||
              conditions.length !== props.conditions.length ||
              conditions.some(
                (c: fhirR4.Condition, i: number) =>
                  c.id !== props.conditions[i]?.id
              )
            ) {
              props.setPatientSummary((prev) => ({
                ...prev,
                conditions: conditions.length > 0 ? conditions : [],
              }));
            }
            setError(null);
            setLoading(false);
          })
          .catch(() => {
            setError("Failed to fetch conditions from server.");
            props.setPatientSummary((prev) => ({
              ...prev,
              conditions: [],
            }));
            setLoading(false);
          });
      })
      .catch(() => {
        setError("No SMART context found.");
        props.setPatientSummary((prev) => ({
          ...prev,
          conditions: [],
        }));
        setLoading(false);
      });
  }, [props.patientId]);

  function getClinicalStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case "active":
      case "recurrence":
      case "relapse":
        return "error";
      case "inactive":
      case "remission":
        return "warning";
      case "resolved":
        return "success";
      default:
        return "default";
    }
  }

  function getVerificationStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case "unconfirmed":
      case "provisional":
      case "differential":
        return "secondary";
      case "confirmed":
        return "primary";
      case "refuted":
        return "warning";
      case "entered-in-error":
        return "error";
      default:
        return "default";
    }
  }

  function getSeverityColor(severity: string) {
    switch (severity.toLowerCase()) {
      case "severe":
        return "error";
      case "moderate":
        return "warning";
      case "mild":
        return "info";
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
            <LocalHospitalIcon color="primary" fontSize="medium" />
            <Typography variant="h6" fontWeight={600}>
              Conditions
            </Typography>
            <Badge
              badgeContent={props.conditions.length}
              color="primary"
              sx={{ ml: 2 }}
            />
          </Box>
        }
      />
      <CardContent>
        {loading ? (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            Loading conditions data...
          </Typography>
        ) : error ? (
          <ErrorCard message={error} />
        ) : props.conditions.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            No information recorded.
          </Typography>
        ) : (
          props.conditions.map((condition) => (
            <Card
              key={condition.id}
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
                      {condition.code?.text ||
                        condition.code?.coding?.[0].display ||
                        `${condition.code?.coding?.[0].code} ${condition.code?.coding?.[0].system}` ||
                        "Unknown Condition"}
                    </Typography>
                    <Chip
                      label={
                        condition.clinicalStatus?.coding?.[0]?.code ||
                        condition.clinicalStatus?.text ||
                        "Unknown"
                      }
                      color={getClinicalStatusColor(
                        condition.clinicalStatus?.coding?.[0]?.code ||
                          condition.clinicalStatus?.text ||
                          "Unknown"
                      )}
                      variant="outlined"
                      sx={{ textTransform: "capitalize", fontWeight: 600 }}
                    />
                    {condition.verificationStatus && (
                      <Chip
                        label={
                          condition.verificationStatus?.coding?.[0]?.display
                        }
                        color={getVerificationStatusColor(
                          condition.verificationStatus?.coding?.[0]?.code ||
                            condition.verificationStatus?.text ||
                            "Unknown"
                        )}
                        variant="outlined"
                        sx={{ textTransform: "capitalize", fontWeight: 600 }}
                      />
                    )}
                    {condition.severity && (
                      <Chip
                        label={
                          condition.severity?.coding?.[0]?.display ||
                          condition.severity?.text ||
                          "Unknown"
                        }
                        color={getSeverityColor(
                          condition.severity?.coding?.[0]?.display ||
                            condition.severity?.text ||
                            "Unknown"
                        )}
                        variant="outlined"
                        sx={{ textTransform: "capitalize", fontWeight: 600 }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {`category: ${
                      condition.category
                        ?.map((cat) => cat.coding?.[0]?.display || cat.text)
                        .join(", ") || "unknown"
                    }`}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Onset:{" "}
                      {condition.onsetDateTime
                        ? formatDateDDMMMYYYY(condition.onsetDateTime)
                        : "Not recorded"}
                    </Typography>
                  </Box>
                  {condition.asserter?.display && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Asserter: {condition.asserter.display}
                    </Typography>
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
