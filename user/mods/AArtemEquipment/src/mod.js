"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
class Mod {
    // Code added here will load BEFORE the server has started loading
    postDBLoad(container) {
        const logger = container.resolve("WinstonLogger");
        const db = container.resolve("DatabaseServer").getTables();
        const modLoader = container.resolve("PreAkiModLoader");
        const ImporterUtil = container.resolve("ImporterUtil");
        const JsonUtil = container.resolve("JsonUtil");
        const VFS = container.resolve("VFS");
        const locales = db.locales.global;
        const items = db.templates.items;
        const handbook = db.templates.handbook.Items;
        const modPath = path_1.default.resolve(__dirname.toString()).split(path_1.default.sep).join("/") + "/";
        const mydb = ImporterUtil.loadRecursive(`${modPath}../db/`);
        const itemPath = `${modPath}../db/templates/items/`;
        const handbookPath = `${modPath}../db/templates/handbook/`;
        db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[5]._props.filters[0].Filter.push("ARTEM_GHOSTMASK");
        db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[5]._props.filters[0].Filter.push("ARTEM_GHOSTMASKB");
        db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[5]._props.filters[0].Filter.push("ARTEM_GHOSTMASKR");
        db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[5]._props.filters[0].Filter.push("ARTEM_NIKOMASK");
        db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[5]._props.filters[0].Filter.push("ARTEM_BALLISTICMASK");
        db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[5]._props.filters[0].Filter.push("ARTEM_BALLISTICMASK2");
        //db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[5]._props.filters[0].Filter.push("ARTEM_TACHELMET2");
        db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[5]._props.filters[0].Filter.push("ARTEM_TACHELMET3");
        db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[5]._props.filters[0].Filter.push("ARTEM_TACHELMET10");
        db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[5]._props.filters[0].Filter.push("ARTEM_TACHELMET11");
        db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[5]._props.filters[0].Filter.push("ARTEM_TACHELMET12");
        db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[5]._props.filters[0].Filter.push("ARTEM_TACHELMET13");
        db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[5]._props.filters[0].Filter.push("ARTEM_GASMASK1");
        for (const itemFile in mydb.templates.items) {
            const item = JsonUtil.deserialize(VFS.readFile(`${itemPath}${itemFile}.json`));
            const hb = JsonUtil.deserialize(VFS.readFile(`${handbookPath}${itemFile}.json`));
            const itemId = item._id;
            //logger.info(itemId);
            items[itemId] = item;
            //logger.info(hb.ParentId);
            //logger.info(hb.Price);
            handbook.push({
                "Id": itemId,
                "ParentId": hb.ParentId,
                "Price": hb.Price
            });
        }
        for (const trader in mydb.traders.assort) {
            const traderAssort = db.traders[trader].assort;
            for (const item of mydb.traders.assort[trader].items) {
                traderAssort.items.push(item);
            }
            for (const bc in mydb.traders.assort[trader].barter_scheme) {
                traderAssort.barter_scheme[bc] = mydb.traders.assort[trader].barter_scheme[bc];
            }
            for (const level in mydb.traders.assort[trader].loyal_level_items) {
                traderAssort.loyal_level_items[level] = mydb.traders.assort[trader].loyal_level_items[level];
            }
        }
        //logger.info("Test");
        // default localization
        for (const localeID in locales) {
            for (const id in mydb.locales.en.templates) {
                const item = mydb.locales.en.templates[id];
                //logger.info(item);
                for (const locale in item) {
                    //logger.info(locale);
                    //logger.info(item[locale]);
                    //logger.info(`${id} ${locale}`);
                    locales[localeID][`${id} ${locale}`] = item[locale];
                }
            }
            for (const id in mydb.locales.en.preset) {
                const item = mydb.locales.en.preset[id];
                for (const locale in item) {
                    //logger.info(`${id} ${locale}`);
                    locales[localeID][`${id}`] = item[locale];
                }
            }
        }
        for (const localeID in mydb.locales) {
            for (const id in mydb.locales[localeID].templates) {
                const item = mydb.locales[localeID].templates[id];
                //logger.info(item);
                for (const locale in item) {
                    locales[localeID][`${id}`] = item[locale];
                }
            }
            for (const id in mydb.locales[localeID].preset) {
                const item = mydb.locales[localeID].preset[id];
                for (const locale in item) {
                    //logger.info(`${id} ${locale}`);
                    locales[localeID][`${id} ${locale}`] = item[locale];
                }
            }
        }
    }
}
module.exports = { mod: new Mod() };
//# sourceMappingURL=mod.js.map