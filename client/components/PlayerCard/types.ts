import { PlayerType } from "@/types";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Dispatch, SetStateAction } from "react";

type PlayerCardPropsType = {
  userType: "host" | "spectator";
  player: PlayerType;
  gameState: {
    // type: "host" | "spectator",
    id: string;
    players: PlayerType[];
  };
  setGameState: Dispatch<SetStateAction<{
    // type: "host" | "spectator",
    id: string;
    players: PlayerType[];
  }>>;
  gameChannel: RealtimeChannel | undefined;
}

export type { PlayerCardPropsType };