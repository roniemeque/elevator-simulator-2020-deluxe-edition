import { qs, createElement, wait } from "./helpers";

const BUILDING_HEIGHT_FLOORS = 5;

export const build = async () => {
  const buildingNode = qs(".building");

  for (let index = BUILDING_HEIGHT_FLOORS - 1; index >= 0; index--) {
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

  // creating some suspense
  await wait(1000);

  // showing the building
  buildingNode.classList.toggle("building--invisible", false);
};
