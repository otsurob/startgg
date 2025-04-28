// import { useEffect, useState } from "react";
// import { Pools } from "../types/types";
// import { queryGQL3 } from "../api/startggApi";
// import { Loading } from "../components/Loading";
import { useNavigate, useSearchParams } from "react-router-dom";
import PlyaerPools from "../components/PlayerPools";
import {
  roesumaPools,
  wasesumaBeeSmashBig5,
  wasesumaPools,
} from "../constants/poolData";
import { Pools } from "../types/types";

const PoolPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const group = searchParams.get("group");
  // ここに追加
  // クエリパラメータの値をキーとして、poolDataの値と紐づける
  const groupMap = new Map<string, Pools[]>([
    ["wasesuma", wasesumaPools],
    ["roesuma", roesumaPools],
    ["wasesumaBeeSmashBig5", wasesumaBeeSmashBig5],
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
