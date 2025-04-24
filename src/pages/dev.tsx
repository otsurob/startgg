import { Button, Grid } from "@mui/material";
import { wasesuma } from "../constants/playerList";
import { queryGQL3 } from "../api/startggApi";
import { useState } from "react";
import { Loading } from "../components/Loading";

const Dev = () => {
  const [isLoading, setIsLoading] = useState(false);
  const apiPlayers = wasesuma;
  const hitApi = async () => {
    setIsLoading(true);
    const response = await queryGQL3(apiPlayers, "12-kagaribi-12", "singles");
    console.log(response);
    setIsLoading(false);
  };
  const BeeSmashBig5Api = async () => {
    setIsLoading(true);
    const response = await queryGQL3(apiPlayers, "beesmash-big-5-1", "singles");
    console.log(response);
    setIsLoading(false);
  };
  return (
    <Grid container alignItems="center" justifyContent="center" height="100vh">
      <Button variant="contained" onClick={hitApi}>
        篝火12
      </Button>
      <Button variant="contained" onClick={BeeSmashBig5Api}>
        Beeスマ BIG 5
      </Button>
      {isLoading && <Loading />}
    </Grid>
  );
};
export default Dev;
