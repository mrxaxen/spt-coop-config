"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
// New trader settings
const baseJson = __importStar(require("../db/base.json"));
const traderHelpers_1 = require("./traderHelpers");
const fluentTraderAssortCreator_1 = require("./fluentTraderAssortCreator");
const Money_1 = require("C:/snapshot/project/obj/models/enums/Money");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
class HideoutHarry {
    mod;
    logger;
    traderHelper;
    fluentAssortCreator;
    static config;
    static itemsPath = path.resolve(__dirname, "../config/items.json");
    static configPath = path.resolve(__dirname, "../config/config.json");
    constructor() {
        this.mod = "acidphantasm-harryhideout"; // Set name of mod so we can log it to console later
    }
    /**
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container Dependency container
     */
    preAkiLoad(container) {
        // Get a logger
        this.logger = container.resolve("WinstonLogger");
        // Get SPT code/data we need later
        const preAkiModLoader = container.resolve("PreAkiModLoader");
        const imageRouter = container.resolve("ImageRouter");
        const hashUtil = container.resolve("HashUtil");
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        // Create helper class and use it to register our traders image/icon + set its stock refresh time
        this.traderHelper = new traderHelpers_1.TraderHelper();
        this.fluentAssortCreator = new fluentTraderAssortCreator_1.FluentAssortConstructor(hashUtil, this.logger);
        this.traderHelper.registerProfileImage(baseJson, this.mod, preAkiModLoader, imageRouter, "harry.jpg");
        this.traderHelper.setTraderUpdateTime(traderConfig, baseJson, 3600, 4000);
        // Add trader to trader enum
        Traders_1.Traders[baseJson._id] = baseJson._id;
        // Add trader to flea market
        ragfairConfig.traders[baseJson._id] = true;
    }
    /**
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     * @param container Dependency container
     */
    postDBLoad(container) {
        HideoutHarry.config = JSON.parse(fs.readFileSync(HideoutHarry.configPath, "utf-8"));
        // Resolve SPT classes we'll use
        const logger = container.resolve("WinstonLogger");
        const databaseServer = container.resolve("DatabaseServer");
        const configServer = container.resolve("ConfigServer");
        const jsonUtil = container.resolve("JsonUtil");
        const priceTable = databaseServer.getTables().templates.prices;
        const handbookTable = databaseServer.getTables().templates.handbook;
        // Get a reference to the database tables
        const tables = databaseServer.getTables();
        // Add new trader to the trader dictionary in DatabaseServer - has no assorts (items) yet
        this.traderHelper.addTraderToDb(baseJson, tables, jsonUtil);
        const start = performance.now();
        const itemList = JSON.parse(fs.readFileSync(HideoutHarry.itemsPath, "utf-8"));
        const nonBarterItems = itemList.nonBarterItems;
        const barterItems = itemList.barterItems;
        const lowFleaRange = 0.85;
        // Non-Barter Items Iteration
        for (const item in nonBarterItems) {
            {
                const itemID = nonBarterItems[item].itemID;
                if (HideoutHarry.config.useFleaPrices) {
                    let price = (priceTable[itemID] * HideoutHarry.config.itemPriceMultiplier);
                    if (!price) {
                        price = (handbookTable.Items.find(x => x.Id === itemID)?.Price ?? 1) * HideoutHarry.config.itemPriceMultiplier;
                    }
                    this.fluentAssortCreator.createSingleAssortItem(itemID)
                        .addUnlimitedStackCount()
                        .addMoneyCost(Money_1.Money.ROUBLES, Math.round(price * lowFleaRange))
                        .addLoyaltyLevel(1)
                        .export(tables.traders[baseJson._id]);
                    if (HideoutHarry.config.enableConsoleDebug) {
                        logger.log("ItemID: " + itemID + " for price: " + Math.round(price), "cyan");
                    }
                }
                else {
                    const price = nonBarterItems[item].price;
                    this.fluentAssortCreator.createSingleAssortItem(itemID)
                        .addUnlimitedStackCount()
                        .addMoneyCost(Money_1.Money.ROUBLES, Math.round(price * lowFleaRange))
                        .addLoyaltyLevel(1)
                        .export(tables.traders[baseJson._id]);
                    if (HideoutHarry.config.enableConsoleDebug) {
                        logger.log("ItemID: " + itemID + " for price: " + Math.round(price), "cyan");
                    }
                }
            }
        }
        // Barter Items Iteration
        for (const item in barterItems) {
            {
                const itemID = barterItems[item].itemID;
                const barterItem = barterItems[item].barterItemID;
                const barterAmount = barterItems[item].barterAmount;
                if (HideoutHarry.config.useBarters) {
                    this.fluentAssortCreator.createSingleAssortItem(itemID)
                        .addUnlimitedStackCount()
                        .addBarterCost(barterItem, barterAmount)
                        .addLoyaltyLevel(1)
                        .export(tables.traders[baseJson._id]);
                    if (HideoutHarry.config.enableConsoleDebug) {
                        logger.log("ItemID: " + itemID + " for barter: " + barterAmount + " " + barterItem, "cyan");
                    }
                }
                else {
                    const price = barterItems[item].price;
                    this.fluentAssortCreator.createSingleAssortItem(itemID)
                        .addUnlimitedStackCount()
                        .addMoneyCost(Money_1.Money.ROUBLES, Math.round(price))
                        .addLoyaltyLevel(1)
                        .export(tables.traders[baseJson._id]);
                    if (HideoutHarry.config.enableConsoleDebug) {
                        logger.log("ItemID: " + itemID + " for price: " + Math.round(price), "cyan");
                    }
                }
            }
        }
        // Add trader to locale file, ensures trader text shows properly on screen
        // WARNING: adds the same text to ALL locales (e.g. chinese/french/english)
        this.traderHelper.addTraderToLocales(baseJson, tables, baseJson.name, "Hideout Harry", baseJson.nickname, baseJson.location, "I'm sellin', what are you buyin'?");
        this.logger.debug(`[${this.mod}] loaded... `);
        const timeTaken = performance.now() - start;
        logger.log(`[${this.mod}] Assort generation took ${timeTaken.toFixed(3)}ms.`, "green");
    }
}
module.exports = { mod: new HideoutHarry() };
//# sourceMappingURL=mod.js.map