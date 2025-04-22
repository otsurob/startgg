import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { queryGQL3 } from "./api/startggApi";
import { useEffect, useState } from "react";
import { Loading } from "./components/Loading";

const App = () => {
  const [poolPlayers, setPoolPlayers] = useState<Map<string, string[]>>();
  // const getInfo = async () => {
  //   const response = await queryGQL("add868f3");
  //   console.log(response);
  // };
  // const getInfo2 = async () => {
  //   const response = await queryGQL2();
  //   console.log(response);
  // };
  // const getInfo3 = async () => {
  //   const response = await queryGQL3(playerList);
  //   console.log(response);
  // };
  useEffect(() => {
    const playerList = [
      "おつ",
      "リム",
      "雨飴/uame",
      "こげたごはん",
      "しゅぞ",
      "てんてん",
      "T.earth",
    ];
    async function fetchData() {
      const response = await queryGQL3(playerList);
      console.log(response);
      setPoolPlayers(response);
    }
    fetchData();
  }, []);
  if (!poolPlayers) return <Loading />;
  return (
    <Grid container alignItems="center" justifyContent="center" height="100vh">
      {/* <Button variant="contained" onClick={getInfo}>
        WOW
      </Button>
      <Button variant="contained" onClick={getInfo2}>
        Test
      </Button>
      <Button variant="contained" onClick={getInfo3}>
        TestTest
      </Button> */}
      <Grid container alignItems="left" flexDirection="column">
        {Array.from(poolPlayers?.entries() ?? []).map(([pool, players]) => (
          <Box key={pool} sx={{ mb: 2 }}>
            <Typography variant="h5">{pool}</Typography>
            <List>
              {players.map((player, index) => (
                <ListItem key={index}>
                  <ListItemText>{player}</ListItemText>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Grid>
    </Grid>
  );
};
export default App;
