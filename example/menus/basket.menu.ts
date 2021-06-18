import { KeyboardMenu, MenuType } from '../../src';
import { FRUITS_FILTERS } from '../const';
import { Basket, CurrentCtx, FruitsFilterType, VideoFilterType } from '../interfaces';

export const initBasketMenu = (ctx: CurrentCtx) => {
    new KeyboardMenu<CurrentCtx, FruitsFilterType, Basket['fruit']>(
        {
            action: 'basket',
            message: 'menu.basket.start',
            submitMessage: 'menu.basket.submit',
            type: MenuType.CHECKBOX,
            filters: FRUITS_FILTERS,
            groups: VideoFilterType,
            state: ctx.session.basket?.[FruitsFilterType.FRUIT],
            debug: true,
            menuGetter: (menuCtx: CurrentCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx: CurrentCtx, menu: KeyboardMenu) => menuCtx.session.keyboardMenu = menu,
            onSubmit(changeCtx, state): any {
                changeCtx.reply('submit:' + JSON.stringify(state));
                changeCtx.session.basket[FruitsFilterType.FRUIT] = state;
            },
            onSubmitUpdater(changeCtx): any {
                changeCtx.editMessageText('Test after submit');
            },
        },
    ).sendMenu(ctx);
};
