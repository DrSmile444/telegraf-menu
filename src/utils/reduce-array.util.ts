/**
 * @description Shortcut function for flattering an array.
 * It uses withing reduce function
 * */
export function reduceArray<T>(accumulator: T[], nextArray: T[]): T[] {
    return [...accumulator, ...nextArray];
}
