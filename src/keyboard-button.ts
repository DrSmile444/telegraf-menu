export class KeyboardButton<TValue extends string = string> {
    public isDefault: boolean;

    constructor(
        public label: string,
        public value: TValue,
        isDefault?: boolean,
    ) {
        if (isDefault) {
            this.isDefault = isDefault;
        }
    }
}
