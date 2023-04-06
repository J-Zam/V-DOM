import createElement from "./createElement";
import mount from "./mount";
import { render } from "./render";
import diff from "./diff";

const createVirtualApp = (count: number) =>
  createElement({
    tagName: "div",
    attrs: {
      id: "app",
      dataCount: count,
    },
    children: [
      "The current count is: ",
      String(count),
      ...Array.from({ length: count }, () =>
        createElement({
          tagName: "img",
          attrs: {
            src: "https://media.giphy.com/media/3og0IROkdNyWyCG2I0/giphy.gif",
            width: "250"
          },
        })
      ),
    ],
  });

let vApp = createVirtualApp(1);
let $app = render(vApp);
let $rootTag = mount($app, document.getElementById("app") as HTMLElement);

 setInterval(() => {
   const n = Math.floor((Math.random() * 5) + 1);
   const vNewApp = createVirtualApp(n);
   const patch = diff(vApp, vNewApp);
  // @ts-ignore
   $rootTag = patch($rootTag as HTMLElement);
   vApp = vNewApp;
 }, 3000);
