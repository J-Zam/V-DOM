import { render } from "./render";
import { createUIElements } from "./uiElement";
import { bandsList00, bandsList01 } from "../data";
import mount from "./mount";
import diff from "./diff";

let uiOptions = [bandsList00, bandsList01]
let ramdomElement = 0; 

let vApp = createUIElements(uiOptions[ramdomElement]);
let $app = render(vApp)
let $rootTag = mount($app, document.getElementById("app") as HTMLElement)

  setInterval(() => {
    ramdomElement = Math.floor(Math.random() * 2);
    const vNewApp = createUIElements(uiOptions[ramdomElement]);
    console.log(uiOptions[ramdomElement])
    const patch = diff(vApp, vNewApp);
    // @ts-ignore
    $rootTag = patch($rootTag as HTMLElement);
    vApp = vNewApp;
  }, 3000);


  