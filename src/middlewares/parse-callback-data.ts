import { GenericMenu } from '../generic-menu';
import { DefaultCtx } from '../interfaces';


/**
 * Modifies callbackQuery context and parses data as JSON
 * @param {DefaultCtx} ctx - telegram context
 * @param {Function} next - next function
 */
export const parseCallbackData = async <T extends DefaultCtx = DefaultCtx>(ctx: T, next: Function) => {
    if (ctx.callbackQuery?.data) {
        try {
            ctx.state.callbackData = GenericMenu.remapCompactToFull(JSON.parse(ctx.callbackQuery.data));
        } catch (error) {
            ctx.state.callbackDataError = {
                message: 'Cannot parse passed data: ' + ctx.callbackQuery.data,
                error,
            };
        }
    }

    return next();
};
