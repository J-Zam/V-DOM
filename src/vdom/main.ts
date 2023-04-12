import { render } from "./render";
import { createUIElements } from "./uiElement";
import { bandsList00, bandsList01 } from "../data";
import mount from "./mount";
import diff from "./diff";
import "../style.css";

let nodeTree = document.getElementById("nodeTree") as HTMLElement;
const root = document.getElementById("container")?.children[1] as HTMLElement;
 

let uiOptions = [bandsList00, bandsList01];
let ramdomElement = 0;

let vApp = createUIElements(uiOptions[ramdomElement]);
let $app = render(vApp);
let $rootTag = mount($app, root);
nodeTree.textContent = JSON.stringify(vApp, undefined, 2);

function updateApp() {
  ramdomElement = Math.floor(Math.random() * 2)
  let vNewApp = createUIElements(uiOptions[ramdomElement]);
  let patch = diff(vApp, vNewApp);
  $rootTag = patch($rootTag as HTMLElement)!;
  vApp = vNewApp;
  nodeTree.textContent = JSON.stringify(vApp, undefined, 2);
}

setInterval(updateApp, 1000);
