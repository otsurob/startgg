import { Button, Grid } from "@mui/material";
import { players } from "../constants/playerList";
import { queryGQL3 } from "../api/startggApi";
import { useState } from "react";
import { Loading } from "../components/Loading";

const Dev = () => {
  const [isLoading, setIsLoading] = useState(false);
  const apiPlayers = players;
  const hitApi = async () => {
    setIsLoading(true);
    const response = await queryGQL3(apiPlayers);
    console.log(response);
    setIsLoading(false);
  };
  return (
    <Grid container alignItems="center" justifyContent="center" height="100vh">
      <Button variant="contained" onClick={hitApi}>
        API
      </Button>
      {isLoading && <Loading />}
    </Grid>
  );
};
export default Dev;
