import { RegularMenu } from '../../src';
import { START_MENU_FILTERS } from '../const';
import { CurrentCtx, MenuAction } from '../interfaces';
import { initBasketMenu } from './basket.menu';
import { initLanguageMenu } from './language.menu';
import { initVideoFiltersMenu } from './video-filters.menu';

export const initStartMenu = (ctx: CurrentCtx) => {
    new RegularMenu<CurrentCtx>(
        {
            action: MenuAction.START,
            message: 'menu.start.start',
            filters: START_MENU_FILTERS,
            replaceable: true,
            debug: true,
            menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx, menu) => menuCtx.session.keyboardMenu = menu,
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
