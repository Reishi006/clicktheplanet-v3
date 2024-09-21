"use client";

import { useState, useEffect, useRef, createContext } from "react";
import { useRouter } from "next/navigation";

import GameNavbar from "@/components/game_components/GameNavbar/GameNavbar";
import GameSidebar from "@/components/game_components/GameSidebar/GameSidebar";
import GameMain from "@/components/game_components/GameMain/GameMain";
import type { RootState } from "@/lib/store";
import {
  Init,
  Click,
  UpgradeStore,
  UpgradeShip,
  gameObject,
} from "@/lib/game/gameSlice";
import type { Store, Ship, Data } from "@/lib/game/gameSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

interface UpgradeFunc {
  (upgrade: "store" | "ship", index: number | string): void;
}

interface Upgrade {
  upgrade: "store" | "ship";
  index: number | string;
}

interface ActionMessage {
  action: string;
  data: any;
}

export const GameContext = createContext<Data | undefined>(gameObject);
export const UpgradeContext = createContext<UpgradeFunc | null>(null);

export default function Game() {
  const gameData = useAppSelector((state: RootState) => state.game);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<Data | undefined>(gameObject);
  const socket = useRef<WebSocket | null>(null);
  const router = useRouter();

  const handleGetGame = async () => {
    let res = await fetch("http://localhost:8000/game", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .catch((err) => {
        if (err instanceof Error) {
          console.error("Error: ", err.message);
        } else {
          console.error("Error: ", String(err));
        }
        //router.push("/"); //if token is not valid
      });

    console.log(res);
  };

  const handlePlanetClickData = (data: string) => {
    if (socket.current) socket.current.send(data);
    console.log("click");
  };

  const handleUpgrade: UpgradeFunc = (upgrade, index) => {
    const upgradeObj: Upgrade = {
      upgrade: upgrade,
      index: index,
    };
    if (socket.current) socket.current.send(JSON.stringify(upgradeObj));
    console.log(`${upgrade} - ${index}`);
  };

  useEffect(() => {
    handleGetGame();

    socket.current = new WebSocket("ws://localhost:8000/ws_game");

    socket.current.onopen = (e: Event) => {
      console.log("WebSocket connection established");
      if (socket.current) {
        socket.current.send("init");
      }
    };

    socket.current.onmessage = (e: MessageEvent) => {
      let message: ActionMessage = JSON.parse(e.data);
      console.log("From the server: ", message);
      if (message.action === "init") {
        setData(message.data);
        dispatch(Init(message.data));
      }
      if (message.action === "click") {
        setData(message.data);
        dispatch(Click(message.data));
      }
      if (message.action === "store") console.log(message.data);
    };

    socket.current.onclose = () => {
      console.log("Disconnected");
    };
  }, []);

  return (
    <div className="game-wrapper">
      <GameContext.Provider value={data}>
        <GameNavbar></GameNavbar>
        <div className="game-content-wrapper">
          <UpgradeContext.Provider value={handleUpgrade}>
            <GameSidebar></GameSidebar>
          </UpgradeContext.Provider>
          <GameMain planetClick={handlePlanetClickData}></GameMain>
        </div>
      </GameContext.Provider>
    </div>
  );
}
