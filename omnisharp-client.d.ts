/// <reference path="./omnisharp-server.d.ts" />

declare module "omnisharp-client" {
    import client = require('./lib/omnisharp-client');
    export = client;
}
