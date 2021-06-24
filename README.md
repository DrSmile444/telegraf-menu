# telegraf-menu 📋

State-based Telegraf menus (Radio, Checkbox, Range) written with TypeScript.

```bash
$ npm install telegraf-menu
```

![example](https://github.com/DrSmile444/telegraf-menu/raw/main/docs/telegraf-menu.main.gif)
## Table of Contents


- [Philosophy](#philosophy)
- [Features](#features)
- [Installing](#installing)
- [Menu Types](#menu-types)
  - [Regular Menu](#regular-menu)
  - [Checkbox Menu](#checkbox-menu)
  - [Radio Menu](#radio-menu)
  - [Range Menu](#range-menu)
- [Example](#example)
- [Documentation](#documentation)
- [License](#license)

## Philosophy

Telegram allows you to send a message with a keyboard and edit them. You need to create your action handlers for each keyboard that requires extra logic and state mappers to render buttons with additional data.

This logic is complicated and requires time to build this simple block - a menu. I searched available APIs and packages and found no suitable solutions. So the motivation of this package is to create an ultimate package that has TypeScript definition, receives and gives state and has I18n support.

## Features

- [x] Perfectly created using TypeScript;
- [x] State-based. Receives and gives state, no raw buttons;
- [x] Provides extendable GenericMenu class to build new menu types;
- [x] It has the available example in source code on GitHub;
- [x] Simple to use!

## Installing

Using npm:

```bash
$ npm install telegraf-menu
```

## Menu Types

### Regular Menu

RegularMenu allows you to draw a simple menu without logic and handle every button click. Returns button's value.

![regular menu](https://github.com/DrSmile444/telegraf-menu/raw/main/docs/regular-menu.png)

Example code:

```ts
const initStartMenu = (ctx: CurrentCtx) => {
    new RegularMenu<CurrentCtx, MenuAction>(
        {
            action: MenuAction.START,
            message: 'menu.start.start',
            filters: START_MENU_FILTERS,
            replaceable: true,
            debug: true,
            menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx, menu) => menuCtx.session.keyboardMenu = menu,
            onChange(changeCtx, state) {
                switch (state) {
                    case MenuAction.BASKET:
                        // return initBasketMenu(changeCtx);

                    case MenuAction.LANGUAGE:
                        // return initLanguageMenu(changeCtx);

                    case MenuAction.VIDEO_FILTERS:
                        // return initVideoFiltersMenu(changeCtx);
                }
            },
        },
    ).sendMenu(ctx);
};
```

### Checkbox Menu

CheckboxMenu allows you to draw a checkbox menu and handle onChange, onSubmit, and other hooks. You can choose as many options as you want. Returns array of button values.

![checkbox menu](https://github.com/DrSmile444/telegraf-menu/raw/main/docs/checkbox-menu.png)

```ts
export const initBasketMenu = (ctx: CurrentCtx) => {
    new CheckboxMenu<CurrentCtx, Basket['fruit']>(
        {
            action: MenuAction.BASKET,
            message: 'menu.basket.start',
            submitMessage: 'menu.basket.submit',
            filters: FRUITS_FILTERS,
            state: ctx.session.basket?.[FruitsFilterType.FRUIT],
            replaceable: true,
            menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx, menu) => menuCtx.session.keyboardMenu = menu,
            onSubmit(changeCtx, state) {
                changeCtx.session.basket[FruitsFilterType.FRUIT] = state;
                initStartMenu(changeCtx);
            },
        },
    ).sendMenu(ctx);
};
```

### Radio Menu

RadioMenu allows you to draw a radio menu and handle onChange, onSubmit, and other hooks. You can choose only one value. Returns button's values.

![radio menu](https://github.com/DrSmile444/telegraf-menu/raw/main/docs/radio-menu.png)

Code example:

```ts
export const initLanguageMenu = (ctx: CurrentCtx) => {
    new RadioMenu<CurrentCtx, LanguageType>(
        {
            action: MenuAction.LANGUAGE,
            message: 'menu.language.start',
            submitMessage: 'menu.language.submit',
            filters: LANGUAGE_FILTERS,
            state: ctx.session.language,
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
```

### Range Menu

RangeMenu allows you to draw a range menu and handle onChange, onSubmit, and other hooks. You can choose range values. Returns first and last button values.

![range menu](https://github.com/DrSmile444/telegraf-menu/raw/main/docs/range-menu.png)

Code example:

```ts
export const initVideoFiltersMenu = (ctx: CurrentCtx) => {
    new RangeMenu<CurrentCtx, VideoFilters>(
        {
            action: MenuAction.VIDEO_FILTERS,
            message: 'menu.videoFilters.start',
            submitMessage: 'menu.videoFilters.submit',
            filters: VIDEO_FILTERS,
            state: ctx.session.videoFilters,
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
```

## Example

To run a project, you need to set up a bot and sessions.
After that, use GenericMenu middleware in the bot, and you can send your menus!
A basic setup:

```ts
import { Telegraf } from 'telegraf';
import { DefaultCtx, GenericMenu, KeyboardButton, MenuFilters } from 'telegraf-menu';

const bot = new Telegraf(process.env.BOT_TOKEN);
const session = new LocalSession({ database: 'local.db.json' });

bot.use(session.middleware());

/**
 * Required callback parser
 * */
bot.use(GenericMenu.middleware());

type CurrentCtx = DefaultCtx & {
    i18n: I18nContext;
    session: {
        videoFilters: {
            from: string;
            to: string;
        },
        language: LanguageType,
        basket: Basket;
        keyboardMenu: GenericMenu,
    },
};


enum MenuAction {
    BASKET = 'basket',
    VIDEO_FILTERS = 'video_filters',
    LANGUAGE = 'language',
    START = 'start',
}

const START_MENU_FILTERS: MenuFilters<MenuAction> = [
    new KeyboardButton('menu.start.button.basket', MenuAction.BASKET),
    new KeyboardButton('menu.start.button.videoFilters', MenuAction.VIDEO_FILTERS),
    new KeyboardButton('menu.start.button.language', MenuAction.LANGUAGE),
];

const initStartMenu = (ctx: CurrentCtx) => {
    new RegularMenu<CurrentCtx, MenuAction>(
        {
            action: MenuAction.START,
            message: 'menu.start.start',
            filters: START_MENU_FILTERS,
            replaceable: true,
            debug: true,
            menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx, menu) => menuCtx.session.keyboardMenu = menu,
            onChange(changeCtx, state) {
                switch (state) {
                    case MenuAction.BASKET:
                        // return initBasketMenu(changeCtx);

                    case MenuAction.LANGUAGE:
                        // return initLanguageMenu(changeCtx);

                    case MenuAction.VIDEO_FILTERS:
                        // return initVideoFiltersMenu(changeCtx);
                }
            },
        },
    ).sendMenu(ctx);
};


/**
 * Menu example
 * */
bot.command(MenuAction.START, initStartMenu);
bot.action(new RegExp(MenuAction.START), GenericMenu.onAction(
    (ctx: CurrentCtx) => ctx.session.keyboardMenu,
    initStartMenu,
));
```

Full project example is available [here.](https://github.com/DrSmile444/telegraf-menu/tree/main/example)

## Documentation

The package has TypeScript types and example project where you can test the code.
If you have additional comments or suggestions, create a pull request. :)
Thanks!

## License

[MIT](LICENSE)

Created with ❤ by Dmytro Vakulenko, 2021.
