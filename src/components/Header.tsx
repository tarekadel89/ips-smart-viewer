import { fhirR4 } from "@smile-cdr/fhirts";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import formatDateDDMMMYYYY from "../helpers/formatDateDDMMMYYYY";
import calculateAge from "../helpers/calculateAge";
import Button from "@mui/material/Button";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

export default function Header({
  patient,
  onAuthorSummary,
}: {
  patient: fhirR4.Patient | null;
  onAuthorSummary: () => void;
}) {
  // Extract patient name
  const name = patient?.name?.[0];
  const fullName = name
    ? `${name.given?.join(" ")} ${name.family}`
    : "Unknown Patient";

  // Extract patient identifier
  const identifier = patient?.identifier?.[0];

  // Calculate age from birth date
  const age = patient?.birthDate ? calculateAge(patient.birthDate) : null;

  return (
    <Card>
      <CardContent sx={{ position: "relative" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" fontWeight={600}>
            {fullName}
          </Typography>
          <Chip
            label={
              <span style={{ fontWeight: 600 }}>
                {patient?.gender || "Unknown"}
              </span>
            }
            variant="filled"
            sx={{ textTransform: "capitalize" }}
          />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap={4}
          mt={2}
          color="text.secondary"
        >
          {patient?.birthDate && (
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarMonthIcon fontSize="small" />
              <span>
                {formatDateDDMMMYYYY(patient.birthDate)}
                {age !== null && ` (${age})`}
              </span>
            </Box>
          )}
          {identifier && (
            <Box display="flex" alignItems="center" gap={1}>
              <span>
                {identifier.type?.coding?.[0]?.display?.trim() || "ID"}
                {": "}
                {identifier.value}
              </span>
            </Box>
          )}
        </Box>
        {onAuthorSummary && (
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              zIndex: 1,
            }}
          >
            <Button
              onClick={onAuthorSummary}
              variant="outlined"
              startIcon={<DescriptionOutlinedIcon />}
              sx={{
                bgcolor: "#fff",
                color: "#222",
                borderColor: "#ccc",
                boxShadow: 1,
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  borderColor: "#888",
                },
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Author Summary
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
