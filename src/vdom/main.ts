import createElement from "./createElement";
import mount from "./mount";
import { render } from "./render";

const virtualApp = createElement({
  tagName: "div",
  attrs: {
    id: "app",
  },
  children: [
    "Hello world",
    createElement({
      tagName: "img",
      attrs: {
        src: "https://media.giphy.com/media/3og0IROkdNyWyCG2I0/giphy.gif",
      },
    }),
  ],
});

const $app = render(virtualApp);
mount($app, document.getElementById("app") as HTMLElement);
