import { CurrentCtx, FruitsFilterType } from '../interfaces';

export const initSession = async <T extends CurrentCtx = CurrentCtx>(ctx: T, next: Function) => {
    if (!ctx.session.basket) {
        ctx.session.basket = {
            [FruitsFilterType.FRUIT]: [],
            [FruitsFilterType.FRUIT_OBJECT]: {},
        };
    }

    return next();
};
