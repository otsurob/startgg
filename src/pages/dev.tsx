import { Button, Grid } from "@mui/material";
import { players } from "../constants/playerList";
import { queryGQL3 } from "../api/startggApi";

const Dev = () => {
  const apiPlayers = players;
  const hitApi = async () => {
    const response = await queryGQL3(apiPlayers);
    console.log(response);
  };
  return (
    <Grid container alignItems="center" justifyContent="center" height="100vh">
      <Button onClick={hitApi}>API</Button>
    </Grid>
  );
};
export default Dev;
