import { PlayerType } from "@/types";
import { Dispatch, SetStateAction } from "react";

type PlayerCardPropsType = {
  player: PlayerType,
  gameState: {
    players: PlayerType[];
  },
  setGameState: Dispatch<SetStateAction<{
    players: PlayerType[];
  }>>
}

export type { PlayerCardPropsType };