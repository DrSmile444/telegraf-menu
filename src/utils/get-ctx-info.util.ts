import { DefaultCtx } from '../interfaces';

export function getCtxInfo(ctx: DefaultCtx) {
    const { id, username } = ctx.message?.from || ctx.update.callback_query.from;
    const message = ctx.message?.text || JSON.parse(ctx.update.callback_query.data).p;

    return {
        chatId: id,
        username,
        message,
    };
}
