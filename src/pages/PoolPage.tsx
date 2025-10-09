import { useNavigate, useSearchParams } from "react-router-dom";
import PlayerPools from "../components/PlayerPools";
import { Pools } from "../types/types";

// Build a map of tournament slug -> JSON data using Vite glob import
const datasets = import.meta.glob("../poolDatas/*.json", { eager: true, import: "default" }) as Record<string, any>;

function getTournamentMap() {
  const map = new Map<string, any>();
  for (const p in datasets) {
    const filename = p.split("/").pop() || "";
    const slug = filename.replace(/\.json$/, "");
    map.set(slug, datasets[p]);
  }
  return map;
}

const PoolPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const players = searchParams.get("players"); // e.g., "wasesuma", "roesuma"
  const tournament = searchParams.get("tournament"); // e.g., "12-kagaribi-12"

  if (!players || !tournament) {
    navigate("/");
    return null;
  }

  const tMap = getTournamentMap();
  const dataForTournament = tMap.get(tournament) as Record<string, Pools[]> | undefined;
  const groupPools = dataForTournament?.[players];

  if (!groupPools) {
    navigate("/");
    return null;
  }

  return <PlayerPools pools={groupPools} />;
};

export default PoolPage;
