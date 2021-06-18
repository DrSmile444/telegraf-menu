import { KeyboardMenu, MenuType } from '../../src';
import { VIDEO_FILTERS } from '../const';
import { CurrentCtx, MenuAction, VideoFilters, VideoFilterType } from '../interfaces';

export const initVideoFiltersMenu = (ctx: CurrentCtx) => {
    new KeyboardMenu<CurrentCtx, VideoFilterType, VideoFilters>(
        {
            action: MenuAction.VIDEO_FILTERS,
            message: 'menu.videoFilters.start',
            submitMessage: 'menu.videoFilters.submit',
            type: MenuType.RANGE,
            filters: VIDEO_FILTERS,
            groups: VideoFilterType,
            state: ctx.session.videoFilters,
            debug: true,
            menuGetter: (menuCtx: CurrentCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx: CurrentCtx, menu: KeyboardMenu) => menuCtx.session.keyboardMenu = menu,
            onSubmit(changeCtx, state): any {
                changeCtx.reply('submit:' + JSON.stringify(state));
                changeCtx.session.videoFilters = state;
            },
            onSubmitUpdater(changeCtx): any {
                changeCtx.editMessageText('Test after submit');
            },
        },
    ).sendMenu(ctx);
};
