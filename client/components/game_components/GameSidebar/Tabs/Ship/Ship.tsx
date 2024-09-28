import ShipElement from "./ShipElement";

import "./Ship.scss";

interface IShipElement {
  title: string;
  desc: string;
}

export default function Ship() {
  const shipElementsArr: IShipElement[] = [
    { title: "Dps", desc: "Damage per second based on click damage" },
    {
      title: "Click damage",
      desc: "Boost the amount of damage dealt through clicks - DPS",
    },
    {
      title: "Critical click",
      desc: "Increase the chance of clicking critically - Chance",
    },
    {
      title: "Planet gold",
      desc: "Gold gained from destroying planets - Bonus",
    },
  ];

  return (
    <div className="ship-content-scroll">
      {shipElementsArr.map((el, i) => {
        return (
          <ShipElement
            key={i}
            index={i + 1}
            title={el.title}
            description={el.desc}
          ></ShipElement>
        );
      })}
    </div>
  );
}
