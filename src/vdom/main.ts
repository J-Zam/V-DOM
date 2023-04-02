import createElement from "./createElement";
import mount from "./mount";
import { render } from "./render";
import diff from "./diff"

const createVirtualApp = (count: number) =>
  createElement({
    tagName: "div",
    attrs: {
      id: "app",
    },
    children: [
      "Hello world",
      String(count),
      createElement({
        tagName: "img",
        attrs: {
          src: "https://media.giphy.com/media/3og0IROkdNyWyCG2I0/giphy.gif",
        },
      }),
    ],
  });

let count = 0;
let vApp = createVirtualApp(count);
let $app = render(vApp);
let $rootTag = mount($app, document.getElementById("app") as HTMLElement);

/* setInterval(() => {
  count++;
  const vNewApp = createVirtualApp(count)
  const patch = diff(vApp, vNewApp)
  $rootTag = patch($rootTag)
  vApp = vNewApp;
}, 1000); */
