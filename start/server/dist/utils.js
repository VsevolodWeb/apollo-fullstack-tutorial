"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStore = exports.paginateResults = void 0;
var sequelize_typescript_1 = require("sequelize-typescript");
var User_1 = __importDefault(require("./Models/User"));
var Trip_1 = __importDefault(require("./models/Trip"));
function paginateResults(_a) {
    var 
    // @ts-ignore
    cursor = _a.after, _b = _a.pageSize, pageSize = _b === void 0 ? 20 : _b, 
    // @ts-ignore
    results = _a.results, 
    // can pass in a function to calculate an item's cursor
    // @ts-ignore
    getCursor = _a.getCursor;
    if (pageSize < 1)
        return [];
    if (!cursor)
        return results.slice(0, pageSize);
    var cursorIndex = results.findIndex(function (item) {
        // if an item has a `cursor` on it, use that, otherwise try to generate one
        var itemCursor = item.cursor ? item.cursor : getCursor(item);
        // if there's still not a cursor, return false by default
        return itemCursor ? cursor === itemCursor : false;
    });
    return cursorIndex >= 0
        ? cursorIndex === results.length - 1 // don't let us overflow
            ? []
            : results.slice(cursorIndex + 1, Math.min(results.length, cursorIndex + 1 + pageSize))
        : results.slice(0, pageSize);
}
exports.paginateResults = paginateResults;
function createStore() {
    new sequelize_typescript_1.Sequelize({
        database: 'database',
        username: 'username',
        password: 'password',
        dialect: 'sqlite',
        storage: './store.sqlite',
        logging: false,
        models: [__dirname + '/models']
    });
    return { users: User_1.default, trips: Trip_1.default };
}
exports.createStore = createStore;
