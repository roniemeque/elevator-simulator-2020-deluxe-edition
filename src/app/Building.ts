import { qs, createElement, wait } from "./helpers";
import Elevator from "./Elevator";

export default class Building {
  foundationNode: HTMLElement;
  heightInFloors: number;
  queue: number[];
  queueWatcher: any;
  elevator: Elevator;

  constructor(height = 5, rootSelector: string) {
    // setting initial properties
    this.setHeightInFloors(height);
    this.setQueue([]);
    this.setFoundationNode(rootSelector);
    this.setElevator(new Elevator());

    this.start();
  }

  getFoundationNode(): HTMLElement {
    return this.foundationNode;
  }

  getHeightInFloors(): number {
    return this.heightInFloors;
  }

  getQueue(): number[] {
    return this.queue;
  }

  getQueueWatcher(): any {
    return this.queueWatcher;
  }

  getElevator(): Elevator {
    return this.elevator;
  }

  setFoundationNode(selector: string) {
    this.foundationNode = qs(selector);
  }

  setHeightInFloors(value: number) {
    this.heightInFloors = value;
  }

  setQueue(value: number[]) {
    this.queue = value;
  }

  setQueueWatcher(value: any) {
    this.queueWatcher = value;
  }

  setElevator(value: Elevator) {
    this.elevator = value;
  }

  async start() {
    // TODO: destroy previous tower

    // building tower
    this.buildTower();

    // starting watcher
    this.setQueueWatcher(
      setInterval(async () => {
        if (!this.getQueue().length || this.getElevator().getMoving()) return;
        this.getElevator().setMoving(true);

        const [nextFloor, ...remaining] = this.getQueue();
        this.getElevator().calculateDirection(nextFloor);
        this.setQueue(remaining);

        console.log(
          `moving from ${this.getElevator().getCurrentFloor()} to ${nextFloor} in direction ${this.getElevator().getDirection()}`
        );

        // moving yada yada
        await this.getElevator().travelTo(nextFloor);

        console.log(`arrived on ${this.getElevator().getCurrentFloor()}`);

        this.getElevator().setMoving(false);
      }, 500)
    );
  }

  async buildTower() {
    const buildingNode = createElement("div", {
      className: "building",
      addToElement: this.getFoundationNode(),
    });

    for (let index = this.getHeightInFloors() - 1; index >= 0; index--) {
      const newFloorElement = createElement("div", {
        className: "floor",
        dataset: {
          floor: `${index}`,
        },
        addToElement: buildingNode,
      });

      const newDoorElement = createElement("div", {
        className: "door",
        addToElement: newFloorElement,
      });

      if (!index) {
        newDoorElement.classList.add("door--open");
      }
    }
  }

  pushElevatorButton(floor: number) {
    if (this.getElevator().getCurrentFloor() === floor) return;
    this.setQueue([...this.getQueue(), floor]);
  }
}
