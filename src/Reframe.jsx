import {
  Container,
  Button,
  Typography,
  FormControl,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  Box,
  Alert,
} from "@mui/material";
import { useState } from "react";

function Reframe() {
  const [reframeService, setReframeService] = useState("LV95 to WGS84");
  const [easting, setEasting] = useState("");
  const [northing, setNorthing] = useState("");
  const [transformedX, setTransformedX] = useState("");
  const [transformedY, setTransformedY] = useState("");
  const [error, setError] = useState(null);

  const baseUrl = "https://geodesy.geo.admin.ch/reframe";
  const endpoint =
    reframeService === "WGS84 to LV95" ? "wgs84tolv95" : "lv95towgs84";

  const url = `${baseUrl}/${endpoint}?easting=${easting}&northing=${northing}&format=json`;

  const handleTransform = async () => {
    setError(null);
    setTransformedX("");
    setTransformedY("");

    if (!easting || !northing) {
      setError("Bitte beide Koordinaten eingeben.");
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Fehler bei der Transformation.");
      }

      const data = await response.json();
      setTransformedX(data.easting);
      setTransformedY(data.northing);
    } catch (err) {
      setError("Transformation fehlgeschlagen. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: "left", marginTop: "30px" }}>
      <Typography variant="h4" style={{ marginBottom: "30px" }}>
        Coordinate Transform
      </Typography>

      <Box display="flex" marginBottom="30px">
        <FormControl style={{ flex: 1, marginRight: "280px" }}>
          <InputLabel>REFRAME Service</InputLabel>
          <Select
            label="REFRAME Service"
            value={reframeService}
            onChange={(e) => setReframeService(e.target.value)}
          >
            <MenuItem value="LV95 to WGS84">LV95 to WGS84</MenuItem>
            <MenuItem value="WGS84 to LV95">WGS84 to LV95</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box display="flex" marginBottom="30px">
        <TextField
          id="outlined-basic"
          label="Easting"
          variant="outlined"
          type="number"
          value={easting}
          onChange={(e) => setEasting(e.target.value)}
          style={{ flex: 1, marginRight: "5px" }}
        />

        <TextField
          id="outlined-basic"
          label="Northing"
          variant="outlined"
          type="number"
          value={northing}
          onChange={(e) => setNorthing(e.target.value)}
          style={{ flex: 1, marginLeft: "5px" }}
        />
      </Box>

      {error && (
        <Alert severity="error" style={{ marginBottom: "20px" }}>
          {error}
        </Alert>
      )}

      <Button
        fullWidth
        style={{ marginBottom: "30px", padding: "10px", fontSize: "16px" }}
        variant="contained"
        onClick={handleTransform}
      >
        Transform
      </Button>

      <Box display="flex">
        <TextField
          id="outlined-basic"
          label="Transformed X"
          variant="outlined"
          type="number"
          value={transformedX}
          style={{ flex: 1, marginRight: "5px" }}
          disabled
        />

        <TextField
          id="outlined-basic"
          label="Transformed Y"
          variant="outlined"
          type="number"
          value={transformedY}
          style={{ flex: 1, marginLeft: "5px" }}
          disabled
        />
      </Box>
    </Container>
  );
}

export default Reframe;
