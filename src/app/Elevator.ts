import { wait, qsAll, qs } from "./helpers";

export default class Elevator {
  currentFloor: number;
  moving: boolean;
  direction: "up" | "down";

  constructor() {
    this.currentFloor = 0;
    this.moving = false;
    this.direction = "up";
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

  async move(direction: "up" | "down") {
    const nextFloor =
      direction === "up"
        ? this.getCurrentFloor() + 1
        : this.getCurrentFloor() - 1;

    await wait(1500);

    this.setCurrentFloor(nextFloor);
  }

  async waitForPeopleToGetOff() {
    await wait(2000);
  }

  async travelTo(desiredFloor: number) {
    this.closeAllDoors();

    if (desiredFloor > this.getCurrentFloor()) {
      while (desiredFloor > this.getCurrentFloor()) {
        await this.move("up");
      }
    }
    if (desiredFloor < this.getCurrentFloor()) {
      while (desiredFloor < this.getCurrentFloor()) {
        await this.move("down");
      }
    }

    this.openDoorOnCurrentFloor();
    await this.waitForPeopleToGetOff();
  }
}
