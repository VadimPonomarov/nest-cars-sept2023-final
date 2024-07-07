"use strict";
import { LogsModule } from './logs/logs.module';
import { LoggerModule } from './logger/logger.module';
import { LoggerModule } from './modules/logger/logger.module';
import { AddsModule } from './modules/adds/adds.module';
import { NewGooService } from './modules/new-goo/new-goo.service';
import { GoogleModule } from './modules/google/google.module';
import { GoogleModule } from './modules/google/google.module';
import { GptModule } from './modules/gpt/gpt.module';
import { MailModule } from './modules/mail/mail.module';
import { MailModule } from './modules/mail/mail.module';
import { UserModule } from './modules/user/user.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggingModule } from './modules/logging/logging.module';
import { ConfigModule } from './modules/config/config.module';
import { LoggerModule } from './modules/logger/logger.module';
import { LoggingModule } from './modules/logging/logging.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggingModule } from './modules/logging/logging.module';
import { RedisModule } from './modules/redis/redis.module';
import { LoggerModule } from './modules/logger/logger.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { PostgresService } from './postgres-connect.service.ts/modules/postgres/postgres.service';
import { PostgresService } from './postgres-connect/modules/postgres/postgres.service';
import { PostgresPostgresConnectService } from './modules/postgres.postgres-connect/postgres.postgres-connect.service';
import { PostgresModule } from './modules/postgres/postgres.module';
import { LoggerModule } from './modules/logger/logger.module';
import { LoggingModule } from './modules/logging/logging.module';
import { LoggingModule } from './logging/logging.module';
import { LoggingModule } from './modules/logging/logging.module';
import { LoggingModule } from './modules/logging/logging.module';
import { LoggerModule } from './modules/logger/logger.module';
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var path_1 = require("path");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var configuration_1 = require("./config/configuration");
var winston_middleware_1 = require("./core/middlewares/winston.middleware");
var db_module_1 = require("./db/db.module");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: (0, path_1.join)(process.cwd(), 'config/configuration.ts'),
                    load: [configuration_1.default],
                }),
                db_module_1.DbModule,
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService, config_1.ConfigService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        // adding logging for all routes
        AppModule_1.prototype.configure = function (consumer) {
            consumer.apply(winston_middleware_1.RequestLoggerMiddleware).forRoutes('*');
        };
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
