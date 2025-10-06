export function isWindowScrollAtBottom(maxDistToEdge = 0) {
    return (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 1 - maxDistToEdge;
}