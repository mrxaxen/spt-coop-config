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
// New trader settings\
const traderHelpers_1 = require("./traderHelpers");
const fluentTraderAssortCreator_1 = require("./fluentTraderAssortCreator");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
const baseJson = __importStar(require("../db/base.json"));
const questAssort = __importStar(require("../db/questassort.json"));
class Scorpion {
    mod;
    logger;
    traderHelper;
    fluentAssortCreator;
    static config;
    static configPath = path.resolve(__dirname, "../config/config.json");
    static assortPath = path.resolve(__dirname, "../db/assort.json");
    constructor() {
        this.mod = "acidphantasm-scorpion"; // Set name of mod so we can log it to console later
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
        //Load config file before accessing it
        Scorpion.config = JSON.parse(fs.readFileSync(Scorpion.configPath, "utf-8"));
        // Set config values to local variables for validation & use
        let minRefresh = Scorpion.config.traderRefreshMin;
        let maxRefresh = Scorpion.config.traderRefreshMax;
        const addToFlea = Scorpion.config.addTraderToFlea;
        if (minRefresh >= maxRefresh) {
            minRefresh = 1800;
            maxRefresh = 3600;
            this.logger.error(`[${this.mod}] [Config]  traderRefreshMin must be less than traderRefreshMax. Refresh timers have been reset to default.`);
        }
        if (maxRefresh <= 2) {
            minRefresh = 1800;
            maxRefresh = 3600;
            this.logger.error(`[${this.mod}] [Config]  You set traderRefreshMax too low. Refresh timers have been reset to default.`);
        }
        // Create helper class and use it to register our traders image/icon + set its stock refresh time
        this.traderHelper = new traderHelpers_1.TraderHelper();
        this.fluentAssortCreator = new fluentTraderAssortCreator_1.FluentAssortConstructor(hashUtil, this.logger);
        this.traderHelper.registerProfileImage(baseJson, this.mod, preAkiModLoader, imageRouter, "scorpion.jpg");
        this.traderHelper.setTraderUpdateTime(traderConfig, baseJson, minRefresh, maxRefresh);
        // Add trader to trader enum
        Traders_1.Traders[baseJson._id] = baseJson._id;
        // Add trader to flea market
        if (addToFlea) {
            ragfairConfig.traders[baseJson._id] = true;
        }
        else {
            ragfairConfig.traders[baseJson._id] = false;
        }
    }
    /**
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     * @param container Dependency container
     */
    postDBLoad(container) {
        const start = performance.now();
        // Resolve SPT classes we'll use
        const logger = container.resolve("WinstonLogger");
        const databaseServer = container.resolve("DatabaseServer");
        const jsonUtil = container.resolve("JsonUtil");
        const assortJson = JSON.parse(fs.readFileSync(Scorpion.assortPath, "utf-8"));
        //Update Assort Pricing via config multiplier
        if (Scorpion.config.priceMultiplier != 1) {
            const assortPriceTable = assortJson["barter_scheme"];
            for (const key in assortPriceTable) {
                //this.logger.log(`assortPriceTable: [${key}]`, "cyan");
                assortPriceTable[key].forEach(item => {
                    const count = item[0].count;
                    const newPrice = Math.round(count * Scorpion.config.priceMultiplier);
                    item[0].count = newPrice;
                    //this.logger.log(`Old price: [${count}], new price: [${newPrice}]`, "cyan");
                });
            }
        }
        // Set local variable for assort to pass to traderHelper regardless of priceMultiplier config
        const newAssort = assortJson;
        // Get a reference to the database tables
        const tables = databaseServer.getTables();
        // Add new trader to the trader dictionary in DatabaseServer       
        // Add quest assort
        // Add trader to locale file, ensures trader text shows properly on screen
        this.traderHelper.addTraderToDb(baseJson, tables, jsonUtil, newAssort);
        tables.traders[baseJson._id].questassort = questAssort;
        this.traderHelper.addTraderToLocales(baseJson, tables, baseJson.name, "Scorpion", baseJson.nickname, baseJson.location, "I'm sellin', what are you buyin'?");
        this.logger.debug(`[${this.mod}] loaded... `);
        const timeTaken = performance.now() - start;
        logger.log(`[${this.mod}] Trader load took ${timeTaken.toFixed(3)}ms.`, "green");
    }
}
module.exports = { mod: new Scorpion() };
//# sourceMappingURL=mod.js.map