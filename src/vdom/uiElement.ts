import createElement from "./createElement";
import { IBand, IElementNode } from "../ts";

export const createUIElements = (bandsData: IBand[]) => {
  let uiElements: IElementNode[] | string = [];

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
      tagName: "h2",
      attrs: {
        textContent: band.bandName,
      },
      children: bandSongs,
    });

    uiElements.push(bandElement);
  }

  return createElement({
    tagName: "div",
    attrs: {
      id: "app",
    },
    children: uiElements,
  });
};

