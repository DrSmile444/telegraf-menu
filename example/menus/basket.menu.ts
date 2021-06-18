import { KeyboardMenu, MenuType } from '../../src';
import { FRUITS_FILTERS } from '../const';
import { Basket, CurrentCtx, FruitsFilterType, MenuAction, VideoFilterType } from '../interfaces';
import { initStartMenu } from './start.menu';

export const initBasketMenu = (ctx: CurrentCtx) => {
    new KeyboardMenu<CurrentCtx, FruitsFilterType, Basket['fruit']>(
        {
            action: MenuAction.BASKET,
            message: 'menu.basket.start',
            submitMessage: 'menu.basket.submit',
            type: MenuType.CHECKBOX,
            filters: FRUITS_FILTERS,
            groups: VideoFilterType,
            state: ctx.session.basket?.[FruitsFilterType.FRUIT],
            debug: true,
            replaceWithNextMenu: true,
            menuGetter: (menuCtx: CurrentCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx: CurrentCtx, menu: KeyboardMenu) => menuCtx.session.keyboardMenu = menu,
            onSubmit(changeCtx, state): any {
                changeCtx.session.basket[FruitsFilterType.FRUIT] = state;
                initStartMenu(changeCtx);
            },
        },
    ).sendMenu(ctx);
};
