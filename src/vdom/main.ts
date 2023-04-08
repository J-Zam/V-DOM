import { render } from "./render";
import { createUIElements } from "./uiElement";
import { bandsList00, bandsList01 } from "../data";
import mount from "./mount";
import diff from "./diff";
import "../style.css";

let nodeTree = document.getElementById("nodeTree") as HTMLElement;

let uiOptions = [bandsList00, bandsList01];
let ramdomElement = 1;

let vApp = createUIElements(uiOptions[ramdomElement]);
let $app = render(vApp);
let $rootTag = mount($app, document.getElementById("app") as HTMLElement);
nodeTree.textContent = JSON.stringify(vApp, undefined, 2);
update()

  function update() {
   setTimeout(() => {
     let vNewApp = createUIElements(uiOptions[0]);
     let patch = diff(vApp, vNewApp);
     $rootTag = patch($rootTag as HTMLElement)!;
     vApp = vNewApp;
     nodeTree.textContent = JSON.stringify(vApp, undefined, 2);
   }, 5000) 
 } 