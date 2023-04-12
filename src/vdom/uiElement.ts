import createElement from "./createElement";
import { IPlaylist, IElementNode } from "../ts";

export const createUIElements = (bandsData: IPlaylist[]) => {
  let uiElements: IElementNode[] | string = [];
  let node;

  for (let band of bandsData) {
    let bandElement: IElementNode;
    let bandSongs: IElementNode[] = [];

    band.songs.map((item) => {
      let song = createElement({
        tagName: "li",
        attrs: {},
        children: [
          createElement({
            tagName: "a",
            attrs: {
              textContent: item,
              href: "#",
            },
          }),
        ],
      });

      bandSongs.push(song);
    });

    bandElement = createElement({
      tagName: "div",
      attrs: {
        class: "child"
      },
      children: [
        createElement({
          tagName: "h2",
          attrs: {
            textContent: band.title
          },
        }),
        ...bandSongs
      ],
    });

    uiElements.push(bandElement);
  }


  node = createElement({
    tagName: "div",
    attrs: {
      id: "app",
    },
    children: uiElements,
  });

  return node
};

