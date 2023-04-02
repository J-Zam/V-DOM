
export default ($node: HTMLElement | Text, $target: HTMLElement | Text) => {
    $target.replaceWith($node)
    return $node
}