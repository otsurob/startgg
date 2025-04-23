import { useState } from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Pools } from "../types/types";

type Props = {
  pools: Pools[]; // [{ letter:"A", pools:[…] }, …]
  width?: number | string; // オプション: カード幅
};

const PlyaerPools = ({ pools, width = 480 }: Props) => {
  // 並び順が保証されている前提。必要なら .sort() を追加
  const [index, setIndex] = useState(0);
  const max = pools.length - 1;

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(max, i + 1));

  const current = pools[index];

  return (
    <Paper
      elevation={3}
      sx={{ p: 2, mx: "auto", maxWidth: width, bgcolor: "background.paper" }}
    >
      {/* --- ナビバー --- */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        mb={2}
      >
        <IconButton onClick={goPrev} disabled={index === 0}>
          <ArrowBackIos fontSize="small" />
        </IconButton>

        <Typography variant="h6" component="span">
          Wave&nbsp;{current.letter}&nbsp;Group
        </Typography>

        <IconButton onClick={goNext} disabled={index === max}>
          <ArrowForwardIos fontSize="small" />
        </IconButton>
      </Stack>

      {/* --- プール & プレイヤーリスト --- */}
      {current.poolNums.map((pool) => (
        <Box key={pool.poolNum} mb={2}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {pool.poolNum}
          </Typography>

          <List dense disablePadding>
            {pool.players.map((player) => (
              <ListItem key={player} sx={{ pl: 2 }}>
                <ListItemText primary={player} />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Paper>
  );
};

export default PlyaerPools;
