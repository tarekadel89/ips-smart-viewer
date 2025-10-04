import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Divider,
  Chip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import type { PatientSummary } from "../definitions/PatientSummary";

interface AuthorSummaryPanelProps {
  patientSummary: PatientSummary;
  onClose: () => void;
}

export function AuthorSummaryPanel({
  patientSummary,
  onClose,
}: AuthorSummaryPanelProps) {
  const [summaryData, setSummaryData] = useState({
    chiefComplaint: "",
    reasonForEncounter: "",
    historyOfPresentIllness: "",
    assessmentAndPlan: "",
    medicationsReviewed: false,
    allergiesReviewed: false,
    vitalSignsReviewed: false,
    followUpPlanned: "",
    urgency: "routine",
    authorName: "Dr. John Smith",
    authorRole: "Primary Care Physician",
  });

  const [isDraft, setIsDraft] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleSave = () => {
    setLastSaved(new Date());
    setIsDraft(false);
    // Save to backend/FHIR server here
    console.log("Saving patient summary:", summaryData);
  };

  const handleExport = () => {
    const summary = generateSummaryDocument();
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patient-summary-${patientSummary.patient?.id}-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateSummaryDocument = () => {
    const name = patientSummary.patient?.name?.[0];
    const fullName = name
      ? `${name.given?.join(" ")} ${name.family}`
      : "Unknown Patient";
    const date = new Date().toLocaleDateString();

    return `
PATIENT SUMMARY DOCUMENT
========================

Patient: ${fullName}
Date of Birth: ${
      patientSummary.patient?.birthDate
        ? new Date(patientSummary.patient.birthDate).toLocaleDateString()
        : "Unknown"
    }
Gender: ${patientSummary.patient?.gender}
Patient ID: ${patientSummary.patient?.identifier?.[0]?.value || "Unknown"}
Date of Summary: ${date}

ENCOUNTER INFORMATION
--------------------
Chief Complaint: ${summaryData.chiefComplaint || "Not specified"}
Reason for Encounter: ${summaryData.reasonForEncounter || "Not specified"}

CLINICAL ASSESSMENT
------------------
History of Present Illness:
${summaryData.historyOfPresentIllness || "Not documented"}

Assessment and Plan:
${summaryData.assessmentAndPlan || "Not documented"}

REVIEW STATUS
-------------
- Medications Reviewed: ${summaryData.medicationsReviewed ? "Yes" : "No"}
- Allergies Reviewed: ${summaryData.allergiesReviewed ? "Yes" : "No"}
- Vital Signs Reviewed: ${summaryData.vitalSignsReviewed ? "Yes" : "No"}

FOLLOW-UP
---------
${summaryData.followUpPlanned || "No specific follow-up documented"}

AUTHOR INFORMATION
-----------------
Author: ${summaryData.authorName}
Role: ${summaryData.authorRole}
Priority: ${summaryData.urgency}
Document Status: ${isDraft ? "Draft" : "Final"}
`;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "error";
      case "expedited":
        return "warning";
      case "routine":
        return "success";
      default:
        return "default";
    }
  };

  const name = patientSummary.patient?.name?.[0];
  const fullName = name
    ? `${name.given?.join(" ")} ${name.family}`
    : "Unknown Patient";

  return (
    <Card
      sx={{
        width: 500,
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <FileCopyOutlinedIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Author Summary
            </Typography>
          </Box>
        }
        action={
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            Patient: {fullName}
          </Typography>
        }
        sx={{ pb: 1 }}
      />
      <Divider />
      <CardContent sx={{ flex: 1, overflowY: "auto", pt: 2 }}>
        {/* Review Status */}
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight={500} gutterBottom>
            Review Status
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControlLabel
              control={
                <Checkbox
                  checked={summaryData.medicationsReviewed}
                  onChange={(e) =>
                    setSummaryData((prev) => ({
                      ...prev,
                      medicationsReviewed: e.target.checked,
                    }))
                  }
                />
              }
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  {summaryData.medicationsReviewed ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <WarningAmberIcon color="disabled" fontSize="small" />
                  )}
                  Medications Reviewed
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={summaryData.allergiesReviewed}
                  onChange={(e) =>
                    setSummaryData((prev) => ({
                      ...prev,
                      allergiesReviewed: e.target.checked,
                    }))
                  }
                />
              }
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  {summaryData.allergiesReviewed ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <WarningAmberIcon color="disabled" fontSize="small" />
                  )}
                  Allergies Reviewed
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={summaryData.vitalSignsReviewed}
                  onChange={(e) =>
                    setSummaryData((prev) => ({
                      ...prev,
                      vitalSignsReviewed: e.target.checked,
                    }))
                  }
                />
              }
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  {summaryData.vitalSignsReviewed ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <WarningAmberIcon color="disabled" fontSize="small" />
                  )}
                  Vital Signs Reviewed
                </Box>
              }
            />
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* Clinical Information */}
        <Box mb={3}>
          <TextField
            label="Chief Complaint"
            value={summaryData.chiefComplaint}
            onChange={(e) =>
              setSummaryData((prev) => ({
                ...prev,
                chiefComplaint: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Reason for Encounter"
            value={summaryData.reasonForEncounter}
            onChange={(e) =>
              setSummaryData((prev) => ({
                ...prev,
                reasonForEncounter: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="History of Present Illness"
            value={summaryData.historyOfPresentIllness}
            onChange={(e) =>
              setSummaryData((prev) => ({
                ...prev,
                historyOfPresentIllness: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
            multiline
            minRows={3}
          />
          <TextField
            label="Assessment and Plan"
            value={summaryData.assessmentAndPlan}
            onChange={(e) =>
              setSummaryData((prev) => ({
                ...prev,
                assessmentAndPlan: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
            multiline
            minRows={3}
          />
          <TextField
            label="Follow-up Plan"
            value={summaryData.followUpPlanned}
            onChange={(e) =>
              setSummaryData((prev) => ({
                ...prev,
                followUpPlanned: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
            multiline
            minRows={2}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="urgency-label">Priority Level</InputLabel>
            <Select
              labelId="urgency-label"
              value={summaryData.urgency}
              label="Priority Level"
              onChange={(e) =>
                setSummaryData((prev) => ({
                  ...prev,
                  urgency: e.target.value,
                }))
              }
            >
              <MenuItem value="routine">Routine</MenuItem>
              <MenuItem value="expedited">Expedited</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* Author Information */}
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight={500} gutterBottom>
            <PersonIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            Author Information
          </Typography>
          <TextField
            label="Clinician Name"
            value={summaryData.authorName}
            onChange={(e) =>
              setSummaryData((prev) => ({
                ...prev,
                authorName: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Role/Title"
            value={summaryData.authorRole}
            onChange={(e) =>
              setSummaryData((prev) => ({
                ...prev,
                authorRole: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />
        </Box>
      </CardContent>
      <Divider />
      {/* Footer Actions */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            color="text.secondary"
          >
            <AccessTimeIcon fontSize="small" />
            <Typography variant="body2">
              {lastSaved
                ? `Last saved: ${lastSaved.toLocaleTimeString()}`
                : "Not saved"}
            </Typography>
          </Box>
          <Chip
            label={isDraft ? "Draft" : "Final"}
            color={isDraft ? "default" : "primary"}
            size="small"
          />
          <Chip
            label={
              summaryData.urgency.charAt(0).toUpperCase() +
              summaryData.urgency.slice(1)
            }
            color={getUrgencyColor(summaryData.urgency)}
            size="small"
          />
        </Box>
        <Box display="flex" gap={2}>
          <Button
            onClick={handleSave}
            variant={isDraft ? "contained" : "outlined"}
            color="primary"
            startIcon={<SaveIcon />}
            sx={{ flex: 1 }}
          >
            {isDraft ? "Save Draft" : "Update"}
          </Button>
          <Button
            onClick={handleExport}
            variant="outlined"
            color="secondary"
            startIcon={<DownloadIcon />}
          >
            Export
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
