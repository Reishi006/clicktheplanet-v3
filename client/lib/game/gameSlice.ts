import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";

export interface Store {
  index: number;
  level: number;
  cost: string;
  damage: string;
}

export interface Ship {
  index: number;
  level: number;
  cost: string;
  multiplier: number;
  damage: string;
}

export interface Data {
  gold: string;
  diamonds: number;
  currentDamage: string;
  maxDamage: string;
  planetName: string;
  currentHealth: string;
  healthPercent: number;
  maxHealth: string;
  currentLevel: number;
  maxLevel: number;
  currentStage: number;
  maxStage: number;
  planetsDestroyed: string;
  store: Store[];
  ship: Ship[];
}

export interface UpgradeMessage {
  upgrade: "store" | "ship";
  index: number;
}

export const gameObject: Data = {
  gold: "100",
  diamonds: 0,
  currentDamage: "1",
  maxDamage: "1",
  planetName: "Planet_name",
  currentHealth: "10",
  healthPercent: 100,
  maxHealth: "10",
  currentLevel: 1,
  maxLevel: 1,
  currentStage: 1,
  maxStage: 1,
  planetsDestroyed: "0",
  store: [
    {
      index: 1,
      level: 0,
      cost: "0",
      damage: "0",
    },
  ],
  ship: [
    {
      index: 1,
      level: 0,
      cost: "0",
      multiplier: 0.0,
      damage: "0",
    },
  ],
};

export const gameSlice = createSlice({
  name: "game",
  initialState: gameObject,
  reducers: {
    Init: (state, action: PayloadAction<Data>) => {
      console.log("Init reducer");
      console.log(state);
      return { ...action.payload };
    },
    Click: (state, action: PayloadAction<Data>) => {
      console.log("Click reducer");
      console.log(state);
      return { ...action.payload };
    },
    UpdateStore: (state, action: PayloadAction<Store>) => {
      // HUGE NOTE - it is important to note that
      // store AND ship are obth returned from API as objects
      // of which keys are like `1` or `2` and so on
      // they are in fact NOT Arrays, which had to be unfortunately
      // found out the hard way
      return {
        ...state,
        store: { ...state.store, [action.payload.index]: action.payload },
      };
    },
  },
});

export const { Init, Click, UpdateStore } = gameSlice.actions;

export default gameSlice.reducer;