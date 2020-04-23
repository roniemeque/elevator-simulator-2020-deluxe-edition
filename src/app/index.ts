import Building from "./Building";

const DEFAULT_HEIGHT_IN_FLOORS = 5;

const building = new Building(DEFAULT_HEIGHT_IN_FLOORS, ".root");

window.populate = (queue = [2, 3, 1, 2, 3, 4]) => building.setQueue(queue);
window.goTo = (floor: number) => building.pushElevatorButton(floor);
