"use client";

import { useState, useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import type { DamageDone } from "@/lib/game/gameSlice";

import "./GameMain.scss";
import DamageText from "./DamageText";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { setLevel } from "@/lib/game/levelSlice";

export interface Health {
  currentHealth: string;
  maxHealth: string;
}

interface GameMainProps {
  planetClick(data: string): void;
}

interface DmgText {
  damageDone: DamageDone;
  x: number;
  y: number;
}

export default function GameMain({ planetClick }: GameMainProps) {
  const gameData = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const [health, setHealth] = useState<Health>({
    currentHealth: "10",
    maxHealth: "10",
  });
  const [width, setWidth] = useState<number>(100);
  const [dmgTextArr, setDmgTextArr] = useState<DmgText[]>([]);
  const planetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameData) {
      setHealth({
        ...health,
        currentHealth: gameData.currentHealth,
        maxHealth: gameData.maxHealth,
      });
      setWidth(gameData.healthPercent);
    }
  }, [gameData]);

  const duration: number = 700;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (dmgTextArr.length >= 1 && dmgTextArr)
        setDmgTextArr((prev) => prev.slice(0, -1));
    }, duration);

    return () => clearTimeout(timeout);
  }, [dmgTextArr]);

  const handlePlanetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // after WebSocket connection -> send click message to the server
    // for now the click mechanic is as below: `for now` - that's funny :D
    planetClick("click");
    if (e.target === planetRef.current) {
      setDmgTextArr([
        ...dmgTextArr,
        {
          damageDone: {
            damage: gameData?.damageDone?.damage,
            critical: gameData?.damageDone?.critical,
          },
          x: e.clientX,
          y: e.clientY,
        },
      ]);
    }
  };

  const healthbarStyle = {
    width: `${width}%`,
  };

  return (
    <main className="game-main">
      <div className="main-spacing"></div>
      <div className="main-current-level">Level {gameData?.currentLevel}</div>
      <div className="main-current-stage">{gameData?.currentStage}/10</div>
      <div className="main-planet-name-title">Planet name:</div>
      <div className="main-planet-name">{gameData?.planetName}</div>
      <div className="main-planet-image-wrapper">
        <KeyboardArrowLeft
          onClick={() => dispatch(setLevel({ action: "previous" }))}
          sx={{
            marginRight: "3em",
            cursor: "pointer",
            fontSize: "30px",
            "&:hover": {
              filter: "drop-shadow(0px 0px 12px white)",
            },
          }}
        ></KeyboardArrowLeft>
        <div
          className="main-planet-image"
          ref={planetRef}
          onClick={(e) => handlePlanetClick(e)}
        ></div>
        <KeyboardArrowRight
          onClick={() => dispatch(setLevel({ action: "next" }))}
          sx={{
            marginLeft: "3em",
            cursor: "pointer",
            fontSize: "30px",
            "&:hover": {
              filter: "drop-shadow(0px 0px 12px white)",
            },
          }}
        ></KeyboardArrowRight>
      </div>
      {/* Temporary */}
      <div className="main-planet-health-title">Health</div>
      <div className="main-planet-healthbar">
        <div className="main-planet-healthbar-amount">
          {health.currentHealth}/{health.maxHealth}
        </div>
        <div className="main-planet-healthbar-wrapper">
          <div
            className="main-planet-healthbar-above"
            style={healthbarStyle}
          ></div>
          <div className="main-planet-healthbar-under"></div>
        </div>
      </div>
      <>
        {dmgTextArr?.map((el, i) => {
          return (
            <DamageText
              key={i}
              damageDone={el.damageDone}
              pos={{
                x: el.x,
                y: el.y,
              }}
              duration={duration}
            ></DamageText>
          );
        })}
      </>
    </main>
  );
}
