export const wait = (timeout: number) => {
    return new Promise((res) => setTimeout(() => res(null), timeout));
}