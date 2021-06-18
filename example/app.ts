import { I18n } from '@edjopato/telegraf-i18n';
import * as path from 'path';
import { Telegraf } from 'telegraf';
import * as LocalSession from 'telegraf-session-local';

import { KeyboardMenu, parseCallbackData } from '../src';
import { CurrentCtx } from './interfaces';
import { initBasketMenu, initVideoFiltersMenu } from './menus';
import { initSession } from './middlewares';

require('dotenv').config();


const bot = new Telegraf(process.env.BOT_TOKEN);
const session = new LocalSession({ database: 'local.db.json' });
const i18n = new I18n({
    defaultLanguage: 'en',
    directory: path.resolve(__dirname, 'locales'),
    useSession: true,
    sessionName: 'session',
});

bot.use(session.middleware());
bot.use(i18n.middleware());
bot.use(initSession);
bot.use(parseCallbackData);

bot.command('basket', initBasketMenu);
bot.action(/basket/, KeyboardMenu.onAction(
    (ctx: CurrentCtx) => ctx.session.keyboardMenu,
    initBasketMenu,
));

bot.command('video_filters', initVideoFiltersMenu);
bot.action(/videoFiltersRadio/, KeyboardMenu.onAction(
    (ctx: CurrentCtx) => ctx.session.keyboardMenu,
    initVideoFiltersMenu,
));

bot.launch().then(() => console.log('*** Bot has been started ***'));
