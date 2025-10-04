import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Box from "@mui/material/Box";

export default function ErrorCard({ message }: { message: string }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <ErrorOutlineIcon color="error" />
          <Typography color="error" fontWeight={600}>
            {message}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
