// import { useEffect, useState } from "react";
// import { Pools } from "../types/types";
// import { queryGQL3 } from "../api/startggApi";
// import { Loading } from "../components/Loading";
import { useNavigate, useSearchParams } from "react-router-dom";
import PlyaerPools from "../components/PlayerPools";
import { roesumaPools, wasesumaPools } from "../constants/poolData";
import { Pools } from "../types/types";

const PoolPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const group = searchParams.get("group");
  const groupMap = new Map<string, Pools[]>([
    ["wasesuma", wasesumaPools],
    ["roesuma", roesumaPools],
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
