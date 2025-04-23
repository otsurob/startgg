// import { useEffect, useState } from "react";
// import { Pools } from "../types/types";
// import { queryGQL3 } from "../api/startggApi";
// import { Loading } from "../components/Loading";
import PlyaerPools from "../components/PlayerPools";
import { test } from "../constants/poolData";

const PoolPage = () => {
  // const [poolPlayers, setPoolPlayers] = useState<Pools[]>();
  // useEffect(() => {
  //   const playerList = [
  //     "おつ",
  //     "リム",
  //     "雨飴/uame",
  //     "こげたごはん",
  //     "しゅぞ",
  //     "てんてん",
  //     "T.earth",
  //     "カラス",
  //     "楽園",
  //     "マサミ",
  //     "Ryuk",
  //     "ヘーチョ",
  //     "けんぐー",
  //     "Moby",
  //   ];
  //   async function fetchData() {
  //     const response = await queryGQL3(playerList);
  //     console.log(response);
  //     setPoolPlayers(response);
  //   }
  //   fetchData();
  // }, []);

  // if (!poolPlayers) return <Loading />;
  // return <PlyaerPools pools={poolPlayers} />;
  return <PlyaerPools pools={test} />;
};
export default PoolPage;
