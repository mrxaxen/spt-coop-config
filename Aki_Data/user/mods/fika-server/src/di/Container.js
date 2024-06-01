"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const FikaConfig_1 = require("../utils/FikaConfig");
const Overrider_1 = require("../overrides/Overrider");
const LocationCallbacks_1 = require("../overrides/callbacks/LocationCallbacks");
const ProfileCallbacks_1 = require("../overrides/callbacks/ProfileCallbacks");
const LauncherBackground_1 = require("../overrides/other/LauncherBackground");
const Locales_1 = require("../overrides/other/Locales");
const HttpRouter_1 = require("../overrides/routers/HttpRouter");
const FikaMatchService_1 = require("../services/FikaMatchService");
const FikaClientController_1 = require("../controllers/FikaClientController");
const FikaLocationController_1 = require("../controllers/FikaLocationController");
const FikaRaidController_1 = require("../controllers/FikaRaidController");
const FikaSendItemController_1 = require("../controllers/FikaSendItemController");
const FikaUpdateController_1 = require("../controllers/FikaUpdateController");
const FikaClientCallbacks_1 = require("../callbacks/FikaClientCallbacks");
const FikaLocationCallbacks_1 = require("../callbacks/FikaLocationCallbacks");
const FikaRaidCallbacks_1 = require("../callbacks/FikaRaidCallbacks");
const FikaSendItemCallbacks_1 = require("../callbacks/FikaSendItemCallbacks");
const FikaUpdateCallbacks_1 = require("../callbacks/FikaUpdateCallbacks");
const FikaClientStaticRouter_1 = require("../routers/static/FikaClientStaticRouter");
const FikaLocationStaticRouter_1 = require("../routers/static/FikaLocationStaticRouter");
const FikaRaidStaticRouter_1 = require("../routers/static/FikaRaidStaticRouter");
const FikaSendItemStaticRouter_1 = require("../routers/static/FikaSendItemStaticRouter");
const FikaUpdateStaticRouter_1 = require("../routers/static/FikaUpdateStaticRouter");
const FikaItemEventRouter_1 = require("../routers/item_events/FikaItemEventRouter");
const Fika_1 = require("../Fika");
class Container {
    static register(container) {
        Container.registerUtils(container);
        Container.registerOverrides(container);
        Container.registerServices(container);
        Container.registerControllers(container);
        Container.registerCallbacks(container);
        Container.registerRouters(container);
        Container.registerListTypes(container);
        container.register("Fika", Fika_1.Fika, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerListTypes(container) {
        container.registerType("Overrides", "ProfileCallbacksOverride");
        container.registerType("Overrides", "LocationCallbacksOverride");
        container.registerType("Overrides", "HttpRouterOverride");
        container.registerType("Overrides", "LauncherBackgroundOverride");
        container.registerType("Overrides", "LocalesOverride");
        container.registerType("StaticRoutes", "FikaClientStaticRouter");
        container.registerType("StaticRoutes", "FikaLocationStaticRouter");
        container.registerType("StaticRoutes", "FikaRaidStaticRouter");
        container.registerType("StaticRoutes", "FikaSendItemStaticRouter");
        container.registerType("StaticRoutes", "FikaUpdateStaticRouter");
        container.registerType("IERouters", "FikaItemEventRouter");
    }
    static registerUtils(container) {
        container.register("FikaConfig", FikaConfig_1.FikaConfig, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerOverrides(container) {
        container.register("ProfileCallbacksOverride", ProfileCallbacks_1.ProfileCallbacksOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("LocationCallbacksOverride", LocationCallbacks_1.LocationCallbacksOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("HttpRouterOverride", HttpRouter_1.HttpRouterOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("LauncherBackgroundOverride", LauncherBackground_1.LauncherBackgroundOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("LocalesOverride", Locales_1.LocalesOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("Overrider", Overrider_1.Overrider, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerServices(container) {
        container.register("FikaMatchService", FikaMatchService_1.FikaMatchService, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerControllers(container) {
        container.register("FikaClientController", { useClass: FikaClientController_1.FikaClientController });
        container.register("FikaLocationController", { useClass: FikaLocationController_1.FikaLocationController });
        container.register("FikaRaidController", { useClass: FikaRaidController_1.FikaRaidController });
        container.register("FikaSendItemController", { useClass: FikaSendItemController_1.FikaSendItemController });
        container.register("FikaUpdateController", { useClass: FikaUpdateController_1.FikaUpdateController });
    }
    static registerCallbacks(container) {
        container.register("FikaClientCallbacks", { useClass: FikaClientCallbacks_1.FikaClientCallbacks });
        container.register("FikaLocationCallbacks", { useClass: FikaLocationCallbacks_1.FikaLocationCallbacks });
        container.register("FikaRaidCallbacks", { useClass: FikaRaidCallbacks_1.FikaRaidCallbacks });
        container.register("FikaSendItemCallbacks", { useClass: FikaSendItemCallbacks_1.FikaSendItemCallbacks });
        container.register("FikaUpdateCallbacks", { useClass: FikaUpdateCallbacks_1.FikaUpdateCallbacks });
    }
    static registerRouters(container) {
        container.register("FikaClientStaticRouter", { useClass: FikaClientStaticRouter_1.FikaClientStaticRouter });
        container.register("FikaLocationStaticRouter", { useClass: FikaLocationStaticRouter_1.FikaLocationStaticRouter });
        container.register("FikaRaidStaticRouter", { useClass: FikaRaidStaticRouter_1.FikaRaidStaticRouter });
        container.register("FikaSendItemStaticRouter", { useClass: FikaSendItemStaticRouter_1.FikaSendItemStaticRouter });
        container.register("FikaUpdateStaticRouter", { useClass: FikaUpdateStaticRouter_1.FikaUpdateStaticRouter });
        container.register("FikaItemEventRouter", { useClass: FikaItemEventRouter_1.FikaItemEventRouter });
    }
}
exports.Container = Container;
//# sourceMappingURL=Container.js.map