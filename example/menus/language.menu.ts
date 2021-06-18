import { KeyboardMenu, MenuContextUpdate, MenuType } from '../../src';
import { LANGUAGE_FILTERS } from '../const';
import { CurrentCtx, LanguageType, MenuAction } from '../interfaces';

export const initLanguageMenu = (ctx: CurrentCtx) => {
    new KeyboardMenu<CurrentCtx, any, { 'language': LanguageType }>(
        {
            action: MenuAction.LANGUAGE,
            message: 'menu.language.start',
            submitMessage: 'menu.language.submit',
            type: MenuType.RADIO,
            filters: LANGUAGE_FILTERS,
            groups: { language: 'language' },
            state: { language: ctx.session.language },
            menuGetter: (menuCtx: CurrentCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx: CurrentCtx, menu: KeyboardMenu) => menuCtx.session.keyboardMenu = menu,
            beforeChange(changeCtx: MenuContextUpdate<CurrentCtx>, state): any {
                changeCtx.session.language = state.language;
                changeCtx.i18n.locale(state.language);
            },
            onSubmitUpdater(changeCtx): any {
                changeCtx.editMessageText('Test after submit');
            },
        },
    ).sendMenu(ctx);
};
