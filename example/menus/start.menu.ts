import { RegularMenu } from '../../src';
import { START_MENU_FILTERS } from '../const';
import { CurrentCtx, MenuAction } from '../interfaces';
import { initBasketMenu } from './basket.menu';
import { initLanguageMenu } from './language.menu';
import { initVideoFiltersMenu } from './video-filters.menu';
import { initBasketObjectMenu } from './basket-checkbox.menu';

export const initStartMenu = (ctx: CurrentCtx) => {
    new RegularMenu<CurrentCtx, MenuAction>(
        {
            action: MenuAction.START,
            message: 'menu.start.start',
            filters: START_MENU_FILTERS,
            replaceable: true,
            debug: true,
            menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx, menu) => menuCtx.session.keyboardMenu = menu,
            onChange(changeCtx, state) {
                switch (state) {
                    case MenuAction.BASKET:
                        return initBasketMenu(changeCtx);

                    case MenuAction.BASKET_OBJECT:
                        return initBasketObjectMenu(changeCtx);

                    case MenuAction.LANGUAGE:
                        return initLanguageMenu(changeCtx);

                    case MenuAction.VIDEO_FILTERS:
                        return initVideoFiltersMenu(changeCtx);
                }
            },
        },
    ).sendMenu(ctx);
};
