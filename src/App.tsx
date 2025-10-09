import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

// Discover available tournaments (generated JSON files) and player groups
const poolFiles = import.meta.glob("./poolDatas/*.json", {
  eager: true,
  import: "default",
});
const playerFiles = import.meta.glob("./players/*.json", { eager: true, import: "default" });
const hiddenPlayers = new Set(["otsu"]); //選択肢には入れない集団 urlに直接入力でのみ表示可能

const App = () => {
  const navigate = useNavigate();

  const tournamentOptions = useMemo(() => {
    // Build { slug, name } from files
    return Object.entries(poolFiles)
      .map(([p, data]) => {
        const filename = p.split("/").pop() || "";
        const slug = filename.replace(/\.json$/, "");
        const json: any = data as any;
        const name = (json?.tournament ?? slug) as string;
        return { slug, name };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const playerOptions = useMemo(() => {
    // Build { slug, name } from files (use groupName if present)
    return Object.entries(playerFiles)
      .map(([p, data]) => {
        const filename = p.split("/").pop() || "";
        const slug = filename.replace(/\.json$/, "");
        const json: any = data as any;
        const name = (json?.groupName ?? slug) as string;
        return { slug, name };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);
  const selectablePlayers = useMemo(
    () => playerOptions.filter((opt) => !hiddenPlayers.has(opt.slug)),
    [playerOptions]
  );

  const [players, setPlayers] = useState<string>(selectablePlayers[0]?.slug || "");
  const [tournament, setTournament] = useState<string>(
    tournamentOptions[0]?.slug || ""
  );

  // Keep selections valid when options change (during dev HMR, etc.)
  useEffect(() => {
    if (players === "" && selectablePlayers.length > 0)
      setPlayers(selectablePlayers[0].slug);
    if (tournament === "" && tournamentOptions.length > 0)
      setTournament(tournamentOptions[0].slug);
  }, []);

  const go = () => {
    if (!players || !tournament) return;
    navigate(
      `/playerPools?players=${encodeURIComponent(
        players
      )}&tournament=${encodeURIComponent(tournament)}`
    );
  };

  return (
    <Grid container alignItems="center" justifyContent="center" height="100vh">
      <Stack spacing={2} direction="column" sx={{ minWidth: 320 }}>
        <Typography variant="h5" textAlign="center">
          プール表示
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="players-label">players</InputLabel>
          <Select
            labelId="players-label"
            label="players"
            value={players}
            onChange={(e) => setPlayers(e.target.value)}
          >
            {selectablePlayers.map((opt) => (
              <MenuItem key={opt.slug} value={opt.slug}>
                {opt.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="tournament-label">トーナメント名</InputLabel>
          <Select
            labelId="tournament-label"
            label="トーナメント名"
            value={tournament}
            onChange={(e) => setTournament(e.target.value)}
          >
            {tournamentOptions.map((opt) => (
              <MenuItem key={opt.slug} value={opt.slug}>
                {opt.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={go}
          disabled={!players || !tournament}
        >
          表示する
        </Button>
      </Stack>
    </Grid>
  );
};

export default App;
