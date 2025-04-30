// import { useEffect, useState } from "react";
// import { Pools } from "../types/types";
// import { queryGQL3 } from "../api/startggApi";
// import { Loading } from "../components/Loading";
import { useNavigate, useSearchParams } from "react-router-dom";
import PlyaerPools from "../components/PlayerPools";

import { Pools } from "../types/types";
import { poolData } from "../constants/poolData";

const PoolPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const group = searchParams.get("group");
  // ここに追加
  // クエリパラメータの値をキーとして、poolDataの値と紐づける
  const groupMap = new Map<string, Pools[]>([
    ["wasesuma", poolData.wasesumaPools],
    ["roesuma", poolData.roesumaPools],
    ["wasesumaBeeSmashBig5", poolData.wasesumaBeeSmashBig5],
    ["wasesumaKagaribi13", poolData.wasesumaKagaribi13],
    ["otsuKagaribi13", poolData.otsuKagaribi13],
  ]);
  if (!group) {
    navigate("/");
    return;
  }
  const groupPools = groupMap.get(group);
  if (!groupPools) {
    navigate("/");
    return;
  }
  return <PlyaerPools pools={groupPools} />;
};
export default PoolPage;
