import { useNavigate } from "react-router-dom";
import { Button, Grid } from "@mui/material";

const App = () => {
  const navigate = useNavigate();
  return (
    <Grid container alignItems="center" justifyContent="center" height="100vh">
      <Button
        variant="contained"
        onClick={() => navigate("/playerPools?group=wasesuma")}
      >
        わせスマ
      </Button>
      <Button
        variant="contained"
        onClick={() => navigate("/playerPools?group=roesuma")}
      >
        ろえスマ
      </Button>
      <Button
        variant="contained"
        onClick={() => navigate("/playerPools?group=wasesumaBeeSmashBig5")}
      >
        わせスマBeeSmashBig5
      </Button>
    </Grid>
  );
};
export default App;
