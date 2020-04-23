import { wait, qsAll, qs } from "./helpers";
import Building from "./Building";

export default class Elevator {
  currentFloor: number;
  moving: boolean;
  direction: "up" | "down";
  building: Building;

  constructor(building: Building) {
    this.currentFloor = 0;
    this.moving = false;
    this.direction = "up";
    this.building = building;
  }

  getCurrentFloor(): number {
    return this.currentFloor;
  }

  getMoving(): boolean {
    return this.moving;
  }

  getDirection(): "up" | "down" {
    return this.direction;
  }

  setCurrentFloor(value?: number) {
    this.currentFloor = value;
  }

  setMoving(value?: boolean) {
    this.moving = value !== undefined ? value : !this.moving;
  }

  setDirection(value: "up" | "down") {
    this.direction = value;
  }

  calculateDirection(nextFloor: number) {
    this.setDirection(nextFloor >= this.getCurrentFloor() ? "up" : "down");
  }

  closeAllDoors() {
    qsAll(".door").forEach((door) =>
      door.classList.toggle("door--open", false)
    );
  }

  openDoorOnCurrentFloor() {
    qs(`[data-floor="${this.getCurrentFloor()}"] .door`).classList.toggle(
      "door--open",
      true
    );
  }

  async move() {
    this.closeAllDoors();

    const nextFloor =
      this.getDirection() === "up"
        ? this.getCurrentFloor() + 1
        : this.getCurrentFloor() - 1;

    this.setCurrentFloor(nextFloor);

    if (this.building.getQueue().includes(nextFloor)) {
      await this.waitForPeopleToGetOff();
      this.openDoorOnCurrentFloor();
    }

    await wait(1500);

    // this.building.setQueue(
    //   this.building.getQueue().filter((floor) => floor !== nextFloor)
    // );
  }

  async waitForPeopleToGetOff() {
    await wait(2000);
  }

  async travelTo(desiredFloor: number) {
    this.calculateDirection(desiredFloor);
    while (desiredFloor !== this.getCurrentFloor()) {
      await this.move();
    }
  }
}
