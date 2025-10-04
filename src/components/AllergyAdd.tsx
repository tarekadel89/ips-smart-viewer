import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Box,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Typography,
  Autocomplete,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import { useEffect, useState } from "react";
import { fhirR4 } from "@smile-cdr/fhirts";

const clinicalStatusOptions = [
  { code: "active", label: "Active" },
  { code: "inactive", label: "Inactive" },
  { code: "resolved", label: "Resolved" },
];

const verificationStatusOptions = [
  { code: "confirmed", label: "Confirmed" },
  { code: "unconfirmed", label: "Unconfirmed" },
  { code: "refuted", label: "Refuted" },
  { code: "entered-in-error", label: "Entered in Error" },
];

const typeOptions = [
  { code: "allergy", label: "Allergy" },
  { code: "intolerance", label: "Intolerance" },
];

const categoryOptions = [
  { code: "food", label: "Food" },
  { code: "medication", label: "Medication" },
  { code: "environment", label: "Environment" },
  { code: "biologic", label: "Biologic" },
];

const criticalityOptions = [
  { code: "low", label: "Low" },
  { code: "high", label: "High" },
  { code: "unable-to-assess", label: "Unable to Assess" },
];

const severityOptions = [
  { code: "mild", label: "Mild" },
  { code: "moderate", label: "Moderate" },
  { code: "severe", label: "Severe" },
];

export default function AllergyAdd({
  isOpen,
  onClose,
  onAdd,
  patientId,
  onClosedAndTransitioned,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (allergy: fhirR4.AllergyIntolerance) => void;
  patientId?: string;
  onClosedAndTransitioned?: () => void;
}) {
  const [substanceText, setSubstanceText] = useState("");
  const [substanceOptions, setSubstanceOptions] = useState<any[]>([]);
  const [selectedSubstance, setSelectedSubstance] = useState<any | null>(null);
  const [loadingSubstance, setLoadingSubstance] = useState(false);
  const [clinicalStatus, setClinicalStatus] = useState("active");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [criticality, setCriticality] = useState("");
  const [note, setNote] = useState("");
  const [onsetDate, setOnsetDate] = useState<Dayjs | null>(null);
  const [reactions, setReactions] = useState<
    { manifestation: string; severity?: "mild" | "moderate" | "severe" }[]
  >([{ manifestation: "", severity: undefined }]);

  const handleReactionChange = (
    idx: number,
    field: "manifestation" | "severity",
    value: string
  ) => {
    setReactions((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
    );
  };

  const handleAddReaction = () => {
    setReactions((prev) => [
      ...prev,
      { manifestation: "", severity: undefined },
    ]);
  };

  const handleRemoveReaction = (idx: number) => {
    setReactions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    const newAllergy: fhirR4.AllergyIntolerance = {
      resourceType: "AllergyIntolerance",
      //id: crypto.randomUUID(),
      patient: {
        reference: patientId ? `Patient/${patientId}` : undefined,
      },
      code:
        selectedSubstance && selectedSubstance.code
          ? {
              coding: [
                {
                  system: selectedSubstance.system,
                  code: selectedSubstance.code,
                  display: selectedSubstance.display,
                },
              ],
              text: selectedSubstance.display,
            }
          : {
              text: substanceText,
            },
      clinicalStatus: {
        coding: [
          {
            system:
              "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
            code: clinicalStatus,
          },
        ],
      },
      verificationStatus: {
        coding: [
          {
            system:
              "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
            code: verificationStatus,
          },
        ],
      },
      type: type as "allergy" | "intolerance",
      category: [
        category as "food" | "medication" | "environment" | "biologic",
      ],
      criticality: criticality as "low" | "high" | "unable-to-assess",
      onsetDateTime: onsetDate ? onsetDate.toISOString() : undefined,
      //recordedDate: new Date().toISOString(),
      //   note: note ? [{ text: note }] : undefined,
      //   reaction: reactions
      //     .filter((r) => r.manifestation.trim())
      //     .map((r) => ({
      //       manifestation: [
      //         {
      //           text: r.manifestation,
      //         },
      //       ],
      //       severity: r.severity,
      //     })),
    };
    onAdd(newAllergy);
    onClose();

    setSubstanceText("");
    setNote("");
    setClinicalStatus("active");
    setVerificationStatus("");
    setType("");
    setCategory("");
    setCriticality("");
    setOnsetDate(null);
    setReactions([{ manifestation: "", severity: undefined }]);
  };

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    // 1. Manually blur the button that was clicked
    event.currentTarget.blur();

    // 2. Call the onClose handler
    onClose();
  };

  useEffect(() => {
    if (substanceText.length > 2) {
      setLoadingSubstance(true);
      fetch(
        `https://tx.ontoserver.csiro.au/fhir/ValueSet/$expand?url=https://healthterminologies.gov.au/fhir/ValueSet/indicator-hypersensitivity-intolerance-to-substance-2&count=5&filter=${encodeURIComponent(
          substanceText
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          setSubstanceOptions(data.expansion?.contains ?? []);
          setLoadingSubstance(false);
        })
        .catch(() => setLoadingSubstance(false));
    } else {
      setSubstanceOptions([]);
    }
  }, [substanceText]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        disableRestoreFocus={true}
        slotProps={{
          transition: {
            onExited: onClosedAndTransitioned,
          },
        }}
      >
        <DialogTitle>Add New Allergy</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <FormControl fullWidth>
              <Autocomplete
                id="allergy-substance"
                autoFocus
                freeSolo
                options={substanceOptions}
                loading={loadingSubstance}
                getOptionLabel={(option) =>
                  option.display ||
                  option.code ||
                  (typeof option === "string" ? option : "")
                }
                value={selectedSubstance}
                inputValue={substanceText}
                onInputChange={(_, value) => setSubstanceText(value)}
                onChange={(_, value) => setSelectedSubstance(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Substance (e.g. Penicillin, Eggs)"
                    required
                    fullWidth
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="allergy-clinical-status">
                Clinical Status
              </InputLabel>
              <Select
                name="allergy-clinical-status"
                label="Clinical Status"
                value={clinicalStatus}
                onChange={(e) => setClinicalStatus(e.target.value)}
                inputProps={{
                  id: "allergy-clinical-status",
                }}
              >
                {clinicalStatusOptions.map((opt) => (
                  <MenuItem key={opt.code} value={opt.code}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel htmlFor="allergy-verification-status">
                Verification Status
              </InputLabel>
              <Select
                name="allergy-verification-status"
                label="Verification Status"
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
                inputProps={{
                  id: "allergy-verification-status",
                }}
              >
                {verificationStatusOptions.map((opt) => (
                  <MenuItem key={opt.code} value={opt.code}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="allergy-type">Type</InputLabel>
              <Select
                name="allergy-type"
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                inputProps={{
                  id: "allergy-type",
                }}
              >
                {typeOptions.map((opt) => (
                  <MenuItem key={opt.code} value={opt.code}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="allergy-category">Category</InputLabel>
              <Select
                name="allergy-category"
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                inputProps={{
                  id: "allergy-category",
                }}
              >
                {categoryOptions.map((opt) => (
                  <MenuItem key={opt.code} value={opt.code}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="allergy-criticality">Criticality</InputLabel>
              <Select
                name="allergy-criticality"
                label="Criticality"
                value={criticality}
                onChange={(e) => setCriticality(e.target.value)}
                inputProps={{
                  id: "allergy-criticality",
                }}
              >
                {criticalityOptions.map((opt) => (
                  <MenuItem key={opt.code} value={opt.code}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <DatePicker
                label="Date of Onset"
                value={onsetDate}
                onChange={(newValue) => setOnsetDate(newValue)}
                maxDate={dayjs()}
                slotProps={{
                  textField: {
                    id: "allergy-onset-date",
                    name: "allergy-onset-date",
                    fullWidth: true,
                  },
                }}
              />
            </FormControl>

            <TextField
              id="allergy-note"
              label="Reaction/Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
          </Box>
          <Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <Typography variant="subtitle2">Reactions</Typography>
              <IconButton
                size="small"
                color="primary"
                onClick={handleAddReaction}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Box>
            {reactions.map((reaction, idx) => (
              <Box key={idx} display="flex" gap={1} alignItems="center" mb={1}>
                <TextField
                  id={`reaction-manifestation-${idx}`}
                  label="Manifestation"
                  value={reaction.manifestation}
                  onChange={(e) =>
                    handleReactionChange(idx, "manifestation", e.target.value)
                  }
                  required
                  fullWidth
                />
                <TextField
                  id={`reaction-severity-${idx}`}
                  label="Severity"
                  select
                  value={reaction.severity || ""}
                  onChange={(e) =>
                    handleReactionChange(idx, "severity", e.target.value)
                  }
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="">None</MenuItem>
                  {severityOptions.map((opt) => (
                    <MenuItem key={opt.code} value={opt.code}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
                {reactions.length > 1 && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveReaction(idx)}
                    aria-label="Remove reaction"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            color="primary"
            disabled={!substanceText.trim()}
          >
            Add Allergy
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
