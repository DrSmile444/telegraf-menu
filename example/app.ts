import { I18n } from '@edjopato/telegraf-i18n';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Telegraf } from 'telegraf';
import * as LocalSession from 'telegraf-session-local';

dotenv.config();

import { GenericMenu } from '../src';
import { CurrentCtx, MenuAction } from './interfaces';
import { initBasketMenu, initBasketObjectMenu, initLanguageMenu, initStartMenu, initVideoFiltersMenu } from './menus';
import { initSession } from './middlewares';

const bot = new Telegraf(process.env.BOT_TOKEN);
const session = new LocalSession({ database: 'local.db.json' });
const i18n = new I18n({
    defaultLanguage: 'en',
    directory: path.resolve(__dirname, 'locales'),
    useSession: true,
    sessionName: 'session',
});

// bot.use(Telegraf.log((log) => console.log('>>> Telegraf "' + new Date().toString() + '" :' + log)));
bot.use(session.middleware());
bot.use(i18n.middleware());
bot.use(initSession);
/**
 * Required callback parser
 * */
bot.use(GenericMenu.middleware());

/**
 * Menu example
 * */
bot.command(MenuAction.START, initStartMenu);
bot.action(new RegExp(MenuAction.START), GenericMenu.onAction(
    (ctx: CurrentCtx) => ctx.session.keyboardMenu,
    initStartMenu,
));

/**
 * Checkbox example
 * */
bot.command(MenuAction.BASKET, initBasketMenu);
bot.action(new RegExp(MenuAction.BASKET), GenericMenu.onAction(
    (ctx: CurrentCtx) => ctx.session.keyboardMenu,
    initBasketMenu,
));

/**
 * Checkbox object example
 * */
bot.command(MenuAction.BASKET_OBJECT, initBasketObjectMenu);
bot.action(new RegExp(MenuAction.BASKET_OBJECT), GenericMenu.onAction(
    (ctx: CurrentCtx) => ctx.session.keyboardMenu,
    initBasketObjectMenu,
));

/**
 * Radio example
 * */
bot.command(MenuAction.LANGUAGE, initLanguageMenu);
bot.action(new RegExp(MenuAction.LANGUAGE), GenericMenu.onAction(
    (ctx: CurrentCtx) => ctx.session.keyboardMenu,
    initLanguageMenu,
));

/**
 * Range example
 * */
bot.command(MenuAction.VIDEO_FILTERS, initVideoFiltersMenu);
bot.action(new RegExp(MenuAction.VIDEO_FILTERS), GenericMenu.onAction(
    (ctx: CurrentCtx) => ctx.session.keyboardMenu,
    initVideoFiltersMenu,
));

bot.launch().then(() => console.log('*** Bot has been started ***'));
