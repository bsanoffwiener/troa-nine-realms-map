export function setHoverPointer(active: boolean): void {
    document.body.style.cursor = active ? 'pointer' : 'default';
}
