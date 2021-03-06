import { RangeMenu } from '../../src';
import { VIDEO_FILTERS } from '../const';
import { CurrentCtx, MenuAction, VideoFilters } from '../interfaces';
import { initStartMenu } from './start.menu';

export const initVideoFiltersMenu = (ctx: CurrentCtx) => {
    new RangeMenu<CurrentCtx, VideoFilters>(
        {
            action: MenuAction.VIDEO_FILTERS,
            message: 'menu.videoFilters.start',
            submitMessage: 'menu.videoFilters.submit',
            filters: VIDEO_FILTERS,
            state: ctx.session.videoFilters,
            debug: true,
            replaceable: true,
            menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx, menu) => menuCtx.session.keyboardMenu = menu,
            onSubmit(changeCtx, state) {
                changeCtx.session.videoFilters = state;
                initStartMenu(changeCtx);
            },
        },
    ).sendMenu(ctx);
};
