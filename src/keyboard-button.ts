export class KeyboardButton<T = string> {
    constructor(
        public label: string,
        public value: T,
    ) {}
}
