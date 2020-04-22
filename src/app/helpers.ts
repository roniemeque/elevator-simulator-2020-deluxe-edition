// simply waits
export const wait = (ms = 2000) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });

// shortcuts for querying elements
export const qs = (query: string): HTMLElement => document.querySelector(query);
// also converting to array for mapping and stuff
export const qsAll = (query: string): HTMLElement[] => [
  ...(document.querySelectorAll(query) as NodeListOf<HTMLElement>),
];

// shortcut for creating new elements with class, dataset and parent
export const createElement = (
  tag: string,
  {
    className = "",
    dataset = {},
    addToElement,
  }: {
    className?: string;
    dataset?: { [key: string]: string };
    addToElement?: HTMLElement;
  }
): HTMLElement => {
  const element = document.createElement(tag);

  element.classList.add(className);

  Object.keys(dataset).forEach((key) => {
    element.dataset[key] = dataset[key];
  });

  if (addToElement) {
    addToElement.appendChild(element);
  }

  return element;
};

export const log = (enabled = false, ...args: any[]) => {
  if (enabled) {
    console.log(args);
  }
};
