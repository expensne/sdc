import { SimpleDenseNN } from "nn/simple-dense-nn";

export function saveToStorage(key: string, value: SimpleDenseNN | null): void {
    if (value === null) {
        return;
    }
    localStorage.setItem(key, JSON.stringify(value.getModel()));
    console.log("Saved weights to storage");
}

export function getFromStorage(key: string): any {
    const value = localStorage.getItem(key);
    if (value) console.log("Loaded weights from storage");
    return value ? JSON.parse(value) : null;
}

export function removeFromStorage(key: string): void {
    localStorage.removeItem(key);
}
