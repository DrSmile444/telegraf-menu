import { GenericMenu, MenuContextUpdate, RadioMenu } from '../../src';
import { LANGUAGE_FILTERS } from '../const';
import { CurrentCtx, LanguageType, MenuAction } from '../interfaces';
import { initStartMenu } from './start.menu';

export const initLanguageMenu = (ctx: CurrentCtx) => {
    new RadioMenu<CurrentCtx, LanguageType>(
        {
            action: MenuAction.LANGUAGE,
            message: 'menu.language.start',
            submitMessage: 'menu.language.submit',
            filters: LANGUAGE_FILTERS,
            state: ctx.session.language,
            debug: true,
            replaceable: true,
            menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx, menu) => menuCtx.session.keyboardMenu = menu,
            beforeChange(changeCtx, language) {
                changeCtx.session.language = language;
                changeCtx.i18n.locale(language);
            },
            onSubmit(submitCtx) {
                initStartMenu(submitCtx);
            },
        },
    ).sendMenu(ctx);
};
