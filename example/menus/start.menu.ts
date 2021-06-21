import { KeyboardMenu, MenuType } from '../../src';
import { START_MENU_FILTERS } from '../const';
import { CurrentCtx, MenuAction } from '../interfaces';
import { initBasketMenu } from './basket.menu';
import { initLanguageMenu } from './language.menu';
import { initVideoFiltersMenu } from './video-filters.menu';

export const initStartMenu = (ctx: CurrentCtx) => {
    new KeyboardMenu<CurrentCtx, any, MenuAction>(
        {
            action: MenuAction.START,
            message: 'menu.start.start',
            type: MenuType.MENU,
            filters: START_MENU_FILTERS,
            replaceWithNextMenu: true,
            debug: true,
            menuGetter: (menuCtx: CurrentCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx: CurrentCtx, menu: KeyboardMenu) => menuCtx.session.keyboardMenu = menu,
            onChange(changeCtx, state): any {
                switch (state) {
                    case MenuAction.BASKET:
                        return initBasketMenu(changeCtx);

                    case MenuAction.LANGUAGE:
                        return initLanguageMenu(changeCtx);

                    case MenuAction.VIDEO_FILTERS:
                        return initVideoFiltersMenu(changeCtx);
                }
            },
        },
    ).sendMenu(ctx);
};
