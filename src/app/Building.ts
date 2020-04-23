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
    this.setElevator(new Elevator(this));
    this.setHeightInFloors(height);
    this.setQueue([]);
    this.setFoundationNode(rootSelector);

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
    console.log(value);
    this.queue = value;
  }

  // removeFromQueue(attended: number) {
  //   this.setQueue(this.getQueue().filter((floor) => floor !== attended));
  // }

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

    for (let i = this.getHeightInFloors() - 1; i >= 0; i--) {
      const newFloorElement = createElement("div", {
        className: "floor",
        dataset: {
          floor: `${i}`,
        },
        addToElement: buildingNode,
      });

      const newDoorElement = createElement("div", {
        className: "door",
        addToElement: newFloorElement,
      });

      const callButtonElement = createElement("button", {
        className: "call-button",
        dataset: {
          floor: `${i}`,
        },
        addToElement: newFloorElement,
      });
      callButtonElement.innerText = "call";
      callButtonElement.addEventListener("click", (e) => {
        const {
          dataset: { floor },
        } = e.target as HTMLElement;
        this.pushElevatorButton(parseInt(floor, 10));
      });

      // adding buttons for other floors
      for (let j = 0; j < this.getHeightInFloors(); j++) {
        const callButtonElement = createElement("button", {
          className: "floor-button",
          dataset: {
            floor: `${i}`,
            desiredFloor: `${j}`,
          },
          addToElement: newFloorElement,
        });
        callButtonElement.innerText = `${!j ? "T" : j}`;
        callButtonElement.addEventListener("click", (e) => {
          const {
            dataset: { floor, desiredFloor },
          } = e.target as HTMLElement;
          this.pushElevatorButton(parseInt(floor, 10));
          this.pushElevatorButton(parseInt(desiredFloor, 10));
        });
      }

      if (!i) {
        newDoorElement.classList.add("door--open");
      }
    }
  }

  pushElevatorButton(floor: number) {
    console.log("what");

    if (this.getElevator().getCurrentFloor() === floor) return;
    this.setQueue([...this.getQueue(), floor]);
  }
}
