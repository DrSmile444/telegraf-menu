import { GenericMenu, MenuContextUpdate, RadioMenu } from '../../src';
import { LANGUAGE_FILTERS } from '../const';
import { CurrentCtx, LanguageType, MenuAction } from '../interfaces';
import { initStartMenu } from './start.menu';

export const initLanguageMenu = (ctx: CurrentCtx) => {
    new RadioMenu<CurrentCtx, any, { 'language': LanguageType }>(
        {
            action: MenuAction.LANGUAGE,
            message: 'menu.language.start',
            submitMessage: 'menu.language.submit',
            filters: LANGUAGE_FILTERS,
            state: { language: ctx.session.language },
            debug: true,
            replaceWithNextMenu: true,
            menuGetter: (menuCtx: CurrentCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx: CurrentCtx, menu: GenericMenu) => menuCtx.session.keyboardMenu = menu,
            beforeChange(changeCtx: MenuContextUpdate<CurrentCtx>, state): any {
                changeCtx.session.language = state.language;
                changeCtx.i18n.locale(state.language);
            },
            onSubmit(submitCtx: MenuContextUpdate<CurrentCtx, any>, state: { language: LanguageType }): any {
                initStartMenu(submitCtx);
            },
        },
    ).sendMenu(ctx);
};
