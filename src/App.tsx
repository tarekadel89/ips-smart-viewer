import { useState, lazy } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import PatientContext from "./components/PatientContext";

import type { PatientSummary } from "./definitions/PatientSummary";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";

// Lazy load components
const Allergies = lazy(() => import("./components/Allergies"));
const Conditions = lazy(() => import("./components/Conditions"));
const Medications = lazy(() => import("./components/Medications"));
const Header = lazy(() => import("./components/Header"));
const AuthorSummaryPanel = lazy(
  () => import("./components/AuthorSummaryPanel")
);

function App() {
  const [patientSummary, setPatientSummary] = useState<PatientSummary | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isAuthorPanelOpen, setIsAuthorPanelOpen] = useState(false);

  const handleOpenAuthorPanel = () => setIsAuthorPanelOpen(true);
  const handleCloseAuthorPanel = () => setIsAuthorPanelOpen(false);

  return (
    <>
      <CssBaseline />
      <PatientContext
        setPatientSummary={setPatientSummary}
        setError={setError}
      />
      <Container maxWidth="xl" disableGutters={true} sx={{ p: 2 }}>
        {error ? (
          <Box color="error.main" mt={4}>
            {error}
          </Box>
        ) : !patientSummary ? (
          <Box mt={4} display="flex" flexDirection="column" alignItems="center">
            <CircularProgress />
            <Box mt={2}>Loading...</Box>
          </Box>
        ) : (
          <>
            <Header
              patient={patientSummary?.patient ?? null}
              onAuthorSummary={handleOpenAuthorPanel}
            />
            <Grid container spacing={3} mt={1}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Conditions
                    patientId={patientSummary.patient?.id}
                    conditions={patientSummary.conditions ?? []}
                    setPatientSummary={setPatientSummary}
                  />
                </Grid>
                <Allergies
                  patientId={patientSummary?.patient?.id}
                  allergies={patientSummary.allergies ?? []}
                  setPatientSummary={setPatientSummary}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Medications
                  patientId={patientSummary?.patient?.id}
                  medications={patientSummary.medications ?? []}
                  setPatientSummary={setPatientSummary}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Container>
      {/* Author Summary Panel as a Drawer */}
      <Drawer
        anchor="right"
        open={isAuthorPanelOpen && !!patientSummary?.patient}
        onClose={handleCloseAuthorPanel}
        slotProps={{
          paper: { sx: { width: { xs: "100%", sm: 500, md: 600 } } },
        }}
      >
        {patientSummary && (
          <AuthorSummaryPanel
            patientSummary={patientSummary}
            onClose={handleCloseAuthorPanel}
          />
        )}
      </Drawer>
    </>
  );
}

export default App;
