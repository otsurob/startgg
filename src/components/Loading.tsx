import { CircularProgress, Grid } from "@mui/material";

export const Loading = () => {
  return (
    <Grid container alignItems="center" justifyContent="center" height="100vh">
      <CircularProgress />
    </Grid>
  );
};
