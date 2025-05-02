import { Button, Grid } from "@mui/material";
import { playerNames } from "../constants/playerList";
import { queryGQL3 } from "../api/startggApi";
import { useState } from "react";
import { Loading } from "../components/Loading";

const Dev = () => {
  const [isLoading, setIsLoading] = useState(false);
  // ここを変更
  const apiPlayers = playerNames.otsu;
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
  const Kagaribi13Api = async () => {
    setIsLoading(true);
    const response = await queryGQL3(apiPlayers, "13-kagaribi-13", "singles");
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
      <Button variant="contained" onClick={Kagaribi13Api}>
        篝火13
      </Button>
      {isLoading && <Loading />}
    </Grid>
  );
};
export default Dev;
