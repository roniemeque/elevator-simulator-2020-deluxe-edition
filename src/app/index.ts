import { wait, log, qs, qsAll, createElement } from "./helpers";
import { build } from "./setup";

const DEFAULT_FLOOR = 0;

let currentFloor = DEFAULT_FLOOR;
let moving = false;
let direction = "up";
let queue = [];
let queueWatcher;

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
  closeAllDoors();
  if (desiredFloor > currentFloor) {
    while (desiredFloor > currentFloor) {
      await move("up");
    }
  }
  if (desiredFloor < currentFloor) {
    while (desiredFloor < currentFloor) {
      await move("down");
    }
  }
  openDoorOnCurrentFloor();
  // waiting for people to get off ?
  await wait(2000);
};

const pushElevatorButton = (floor: number) => {
  if (currentFloor === floor) return;
  queue.push(currentFloor);
};

queueWatcher = setInterval(async () => {
  if (!queue.length || moving) return;
  moving = true;

  const [nextFloor, ...remaining] = queue;
  direction = nextFloor >= currentFloor ? "up" : "down";
  queue = remaining;

  console.log(
    `moving from ${currentFloor} to ${nextFloor} in direction ${direction}`
  );

  // moving yada yada
  await travelTo(nextFloor);
  currentFloor = nextFloor;

  console.log(`arrived on ${currentFloor}`);

  moving = false;
}, 500);

build();

window.goTo = pushElevatorButton;
window.setQueue = (array = [2, 4, 2, 1, 3, 4, 2, 3]) => (queue = [...array]);
