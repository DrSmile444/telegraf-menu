import { GenericMenu, MenuContextUpdate, RadioMenu } from '../../src';
import { LANGUAGE_FILTERS } from '../const';
import { CurrentCtx, LanguageType, MenuAction } from '../interfaces';
import { initStartMenu } from './start.menu';

export const initLanguageMenu = (ctx: CurrentCtx) => {
    new RadioMenu<CurrentCtx, { 'language': LanguageType }>(
        {
            action: MenuAction.LANGUAGE,
            message: 'menu.language.start',
            submitMessage: 'menu.language.submit',
            // @ts-ignore
            filters: LANGUAGE_FILTERS,
            state: { language: ctx.session.language },
            debug: true,
            replaceable: true,
            menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx, menu) => menuCtx.session.keyboardMenu = menu,
            beforeChange(changeCtx, state): any {
                changeCtx.session.language = state.language;
                changeCtx.i18n.locale(state.language);
            },
            onSubmit(submitCtx: MenuContextUpdate<CurrentCtx, any>): any {
                initStartMenu(submitCtx);
            },
        },
    ).sendMenu(ctx);
};
