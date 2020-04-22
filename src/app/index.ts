import { wait, log, qs, qsAll, createElement } from "./helpers";
import { build } from "./setup";

const DEFAULT_FLOOR = 0;

let currentFloor = DEFAULT_FLOOR;

const closeAllDoors = () =>
  qsAll(".door").forEach((door) => door.classList.toggle("door--open", false));

const openDoorOnCurrentFloor = () =>
  qs(`[data-floor="${currentFloor}"] .door`).classList.toggle(
    "door--open",
    true
  );

const move = async (direction: "up" | "down") => {
  const [goingUp, goingDown] = [direction === "up", direction === "down"];
  const nextFloor = goingUp ? currentFloor + 1 : currentFloor - 1;

  log(false, `going from ${currentFloor} to ${nextFloor}`);
  await wait();
  currentFloor = nextFloor;
  log(false, `arrived on ${nextFloor}`);
};

const travelTo = async (desiredFloor: number) => {
  if (currentFloor === desiredFloor) return;

  closeAllDoors();

  if (desiredFloor > currentFloor) {
    while (desiredFloor > currentFloor) {
      await move("up");
    }
  }

  openDoorOnCurrentFloor();
};

build();
window.travelTo = travelTo;
