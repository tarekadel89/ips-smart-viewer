import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useEffect, useRef, useState } from "react";
import { oauth2 } from "fhirclient";
import { fhirR4 } from "@smile-cdr/fhirts";

import formatDateDDMMMYYYY from "../helpers/formatDateDDMMMYYYY";

import ErrorCard from "./ErrorCard";
import type { PatientSummary } from "../definitions/PatientSummary";
import AllergyAdd from "./AllergyAdd";

import {
  allergyIntoleranceOne,
  allergyIntoleranceTwo,
} from "../data/mockFhirData";

export default function Allergies(props: {
  patientId?: string;
  allergies: fhirR4.AllergyIntolerance[];
  setPatientSummary: React.Dispatch<React.SetStateAction<PatientSummary>>;
}) {
  const MOCK_PATIENT_ID = "patient-example-female"; // Set this to your mock patient's id

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [allergyAddAlert, setAllergyAddAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (props.patientId === MOCK_PATIENT_ID) {
      // Only update if allergies are different
      if (
        !props.allergies ||
        props.allergies.length === 0 ||
        props.allergies[0].id !== allergyIntoleranceOne.id ||
        props.allergies[1].id !== allergyIntoleranceTwo.id
      ) {
        props.setPatientSummary((prev) => ({
          ...prev,
          allergies: [allergyIntoleranceOne, allergyIntoleranceTwo],
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
          .request("AllergyIntolerance?patient=Patient/" + props.patientId)
          .then((bundle: any) => {
            const allergies =
              bundle.entry?.map((entry: any) => entry.resource) || [];
            if (
              !props.allergies ||
              allergies.length !== props.allergies.length ||
              allergies.some(
                (c: fhirR4.AllergyIntolerance, i: number) =>
                  c.id !== props.allergies[i]?.id
              )
            ) {
              props.setPatientSummary((prev) => ({
                ...prev,
                allergies: allergies.length > 0 ? allergies : [],
              }));
            }
            setError(null);
            setLoading(false);
          })
          .catch(() => {
            setError("Failed to fetch allergies from server.");
            props.setPatientSummary((prev) => ({
              ...prev,
              allergies: [],
            }));
            setLoading(false);
          });
      })
      .catch(() => {
        // No SMART context, fallback to mock data
        setError("No SMART context found.");
        props.setPatientSummary((prev) => ({
          ...prev,
          allergies: [],
        }));
        setLoading(false);
      });
  }, [props.patientId]);

  function getClinicalStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case "active":
        return "error";
      case "inactive":
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
        return "error.main";
      case "moderate":
        return "warning.main";
      case "mild":
        return "info.main";
      default:
        return "text.secondary";
    }
  }

  function getOnsetDisplay(onsetDateTime: any) {
    if (!onsetDateTime) return null;
    // Check for data-absent-reason extension
    if (
      onsetDateTime.extension &&
      Array.isArray(onsetDateTime.extension) &&
      onsetDateTime.extension.some(
        (ext: any) =>
          ext.url ===
            "http://hl7.org/fhir/StructureDefinition/data-absent-reason" &&
          ext.valueCode === "unknown"
      )
    ) {
      return "Unknown";
    }
    // Otherwise, display the date/time
    if (onsetDateTime) {
      return formatDateDDMMMYYYY(onsetDateTime);
    }
    return null;
  }

  const handleAddAllergy = async (allergyToAdd: fhirR4.AllergyIntolerance) => {
    //console.log("Adding allergy:", allergyToAdd);
    allergyToAdd.id = allergyToAdd.id || crypto.randomUUID(); // Ensure it has an ID for rendering
    // Update local state to include the new allergy
    props.setPatientSummary((prev) => ({
      ...prev,
      allergies: [...(prev.allergies ?? []), allergyToAdd],
    }));
    setIsAddFormOpen(false);
    try {
      const client = await oauth2.ready();
      // allergyToAdd.recorder = {
      //   reference: `${client.user.fhirUser}`,
      // };
      // allergyToAdd.asserter = {
      //   reference: `${client.user.fhirUser}`,
      // };
      // allergyToAdd.encounter = {
      //   reference: `Encounter/${client.encounter.id}`,
      // };
      console.log("Prepared allergy to add:", JSON.stringify(allergyToAdd));
      //console.log("FHIR client ready:", client);
      await client.request({
        url: "AllergyIntolerance",
        method: "POST",
        headers: {
          accept: "application/json+fhir",
          "content-type": "application/json+fhir",
        },
        body: JSON.stringify(allergyToAdd),
      });
      setAllergyAddAlert({
        type: "success",
        message: "Allergy added successfully!",
      });
      setAlertOpen(true);
      // allergyToAdd.id = allergyToAdd.id || crypto.randomUUID(); // Ensure it has an ID for rendering
      // // Update local state to include the new allergy
      // props.setPatientSummary((prev) => ({
      //   ...prev,
      //   allergies: [...(prev.allergies ?? []), allergyToAdd],
      // }));
    } catch (error) {
      setAllergyAddAlert({ type: "error", message: "Failed to add allergy." });
      setAlertOpen(true);
    }
  };

  return (
    <Card>
      <Snackbar
        open={alertOpen}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setAlertOpen(false)}
      >
        {allergyAddAlert ? (
          <Alert
            severity={allergyAddAlert.type}
            onClose={() => setAlertOpen(false)}
            variant="filled"
            sx={{ minWidth: 300 }}
          >
            {allergyAddAlert.message}
          </Alert>
        ) : (
          <></>
        )}
      </Snackbar>
      <CardHeader
        sx={{ mb: 0, pb: 0 }}
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <WarningAmberIcon color="error" fontSize="medium" />
            <Typography variant="h6" fontWeight={600}>
              Allergies & Intolerances
            </Typography>
            <Badge
              badgeContent={props.allergies.length}
              color="primary"
              sx={{ ml: 2 }}
            />
            <IconButton
              ref={addButtonRef}
              color="primary"
              onClick={() => setIsAddFormOpen(true)}
              sx={{ ml: "auto" }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        {loading ? (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            Loading allergies data...
          </Typography>
        ) : error ? (
          <ErrorCard message={error} />
        ) : props.allergies.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            No information recorded (including no known allergies).
          </Typography>
        ) : (
          props.allergies.map((allergy) => (
            <Card
              key={allergy.id}
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
                      {/* {allergy.code?.text ||
                        allergy.code?.coding?.[0].display ||
                        `${allergy.code?.coding?.[0].code} ${allergy.code?.coding?.[0].system}` ||
                        "Unknown Allergy"} */}
                      {`${allergy.code?.coding?.[0].code} ${allergy.code?.coding?.[0].system} ${allergy.code?.coding?.[0].display}` ||
                        allergy.code?.text ||
                        "Unknown Allergy"}
                    </Typography>
                    <Chip
                      label={
                        allergy.clinicalStatus?.coding?.[0]?.code ||
                        allergy.clinicalStatus?.text ||
                        "Unknown"
                      }
                      color={getClinicalStatusColor(
                        allergy.clinicalStatus?.coding?.[0]?.code ||
                          allergy.clinicalStatus?.text ||
                          "Unknown"
                      )}
                      variant="outlined"
                      sx={{ textTransform: "capitalize", fontWeight: 600 }}
                    />
                    <Chip
                      label={
                        allergy.verificationStatus?.coding?.[0]?.code ||
                        allergy.verificationStatus?.text ||
                        "Unknown"
                      }
                      color={getVerificationStatusColor(
                        allergy.verificationStatus?.coding?.[0]?.code ||
                          allergy.verificationStatus?.text ||
                          "Unknown"
                      )}
                      variant="outlined"
                      sx={{ textTransform: "capitalize", fontWeight: 600 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {`type: ${allergy.type || "unknown"} - category: ${
                      allergy.category?.join(", ") || "unknown"
                    }`}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Onset:{" "}
                      {getOnsetDisplay(allergy.onsetDateTime) || "Not recorded"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {allergy.reaction && allergy.reaction.length > 0 && (
                <Box mt={1}>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color="text.secondary"
                  >
                    Reactions:
                  </Typography>
                  {allergy.reaction.map((reaction, idx) => (
                    <Box
                      key={idx}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      ml={2}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          color: getSeverityColor(
                            reaction.severity || "Unknown"
                          ),
                          textTransform: "capitalize",
                        }}
                      >
                        {reaction.severity}:
                      </Typography>
                      <Typography variant="body2">
                        {reaction.manifestation
                          .map((m) => m.text || m.coding?.[0]?.display)
                          .join(", ")}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Card>
          ))
        )}
      </CardContent>
      <AllergyAdd
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onAdd={handleAddAllergy}
        patientId={props.patientId}
        onClosedAndTransitioned={() => {
          setTimeout(() => {
            addButtonRef.current?.focus();
          }, 0);
        }}
      />
    </Card>
  );
}
