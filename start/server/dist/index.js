"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var apollo_server_1 = require("apollo-server");
var schema_1 = __importDefault(require("./schema"));
var utils_1 = require("./utils");
var launch_1 = __importDefault(require("./datasources/launch"));
var user_1 = __importDefault(require("./datasources/user"));
var store = utils_1.createStore();
var server = new apollo_server_1.ApolloServer({
    typeDefs: schema_1.default,
    dataSources: function () { return ({
        launchAPI: new launch_1.default(),
        userAPI: new user_1.default(store)
    }); }
});
server.listen().then(function () {
    console.log("\n\t    Server is running!\n\t    Listening on port 4000\n\t    Explore at https://studio.apollographql.com/dev\n\t");
});
