"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppSelector } from "@/lib/hooks";
import ErrorMessage from "@/components/game_components/ErrorMessage/ErrorMessage";

import Gold from "@/assets/svg/gold.svg";
import Diamond from "@/assets/svg/diamond.svg";

import Tabs from "./Tabs/Tabs";

import "./GameSidebar.scss";
import ShipDiamondUpgrade from "./Tabs/Ship/ShipDiamondUpgrade";

export default function GameSidebar() {
  const gameData = useAppSelector((state) => state.game);
  const errorData = useAppSelector((state) => state.error);

  const tabs: Array<string> = ["Store", "Ship", "Stats"];

  const [tabTitle, setTabTitle] = useState<string>(tabs[0]);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleTabTitle = (el: string) => {
    setTabTitle(el);
  };

  const openDiamondUpgrade = () => {
    setIsVisible(true);
  };

  const closeDiamondUpgrade = () => {
    setIsVisible(false);
  };

  return (
    <aside className="game-sidebar">
      {errorData?.isVisible && (
        <ErrorMessage
          message={errorData?.message}
          pos={errorData?.pos}
        ></ErrorMessage>
      )}
      <div className="game-sidebar-currency">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image src={Gold} alt="gold" width={15} height={15}></Image>&nbsp;{" "}
          {gameData?.gold}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image src={Diamond} alt="diamond" width={15} height={15}></Image>
          &nbsp; {gameData?.diamonds}
        </div>
      </div>
      <div className="game-sidebar-options">
        <div className="game-sidebar-tabs">
          {tabs.map((el, i) => {
            return (
              <div
                key={i}
                className="game-sidebar-tab-el"
                onClick={() => handleTabTitle(el)}
              >
                {el}
              </div>
            );
          })}
        </div>
        <div className="game-sidebar-options-content">
          <div style={{ position: "relative" }}>
            {tabTitle === "Ship" && gameData?.diamondUpgradesUnlocked ? (
              <div
                className="game-sidebar-upgrade-dot"
                onClick={() => openDiamondUpgrade()}
              ></div>
            ) : undefined}
            <div className="game-sidebar-options-content-title">{tabTitle}</div>
          </div>
          <Tabs tabTitle={tabTitle}></Tabs>
          {gameData?.diamondUpgradesUnlocked && (
            <ShipDiamondUpgrade
              open={isVisible}
              handleModalClose={closeDiamondUpgrade}
            ></ShipDiamondUpgrade>
          )}
        </div>
      </div>
    </aside>
  );
}
