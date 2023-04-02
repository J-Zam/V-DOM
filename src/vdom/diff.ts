import { render } from "./render";
import {IElementNode} from "../ts"

export default function diff(oldVTree: IElementNode, newVTree: IElementNode) {
    if (newVTree === undefined) {
        return ($node: HTMLElement | Text )=> {
            $node.remove();
            return undefined
        }
    }

    if (typeof oldVTree === "string" || typeof newVTree === "string") {
        if (oldVTree !== newVTree) {
            return ($node: HTMLElement | Text )=> {
                const $newNode = render(newVTree);
                $node.replaceWith($newNode)
                return $newNode
            }
        } else {
            return ($node: HTMLElement | Text )=> $node
        }
    }

    if (oldVTree.tagName !== newVTree.tagName) {
        return ($node: HTMLElement | Text) => {
            const $newNode = render(newVTree)
            $node.replaceWith($newNode)
            return $newNode
        };
    }
}