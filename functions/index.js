import { requireFunctions } from "../app/utils";
import { Mechanic } from "../app/utils/mechanic";
import { getTimeStamp } from "../app/utils";
const functions = requireFunctions();
const root = document.getElementById("root");

// THIS FILE IS FOR CANVAS ONLY
// WE NEED A FRAMEWORK WITH RUNNERS FOR EACH TYPE.
// THIS FILE IS NEEDED SO WE DO NOT NEED TO INCLUDE EVERY FRAMEWORK INSIDE MECHANIC

let randomSeed = null;

window.preview = (functionName, values) => {
  const mechanic = new Mechanic(functions[functionName], { preview: true });

  mechanic.addEventListener("init", (el, values) => {
    root.innerHTML = "";
    root.appendChild(el);
    randomSeed = values.randomSeed;
  });

  mechanic.run(values);
};

window.export = (functionName, values) => {
  const mechanic = new Mechanic(functions[functionName]);

  mechanic.addEventListener("done", () => {
    mechanic.download(`${name}-${getTimeStamp()}`);
  });

  mechanic.run(values);
};
