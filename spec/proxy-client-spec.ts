/// <reference path="./tsd.d.ts" />
import {expect} from 'chai';
import {Driver, DriverState} from "../lib/enums";
import {resolve} from "path";
import {ProxyManager} from "../lib/proxy/proxy-manager";
import {ProxyClientV2} from "../lib/proxy/proxy-client-v2";
import * as _ from "lodash";

declare var xdescribe: Function;

describe("ProxyManager", function() {
    it("must construct", () => {
        var manager = new ProxyManager();
        manager.getClientV2({
            projectPath: process.cwd()
        });
    });

    it("must construct with a specific driver", () => {
        var manager = new ProxyManager();
        manager.getClientV2({
            driver: Driver.Stdio,
            projectPath: process.cwd()
        });
    });

    describe('state', function() {

        this.timeout(20000);
        var server: ProxyClientV2;
        var manager:ProxyManager;

        before((done) => {
            manager  = new ProxyManager();
            server = manager.getClientV2({
                driver: Driver.Stdio,
                projectPath: process.cwd()
            });

            server.connect();

            var sub = server.state.subscribe(state => {
                if (state === DriverState.Connected) {
                    sub.dispose();
                    done();
                }
            });
        });

        after(() => {
            manager.dispose();
        })

        it("must respond to all requests", function(done) {
            var count = 4;
            server.observe.checkalivestatus.subscribe((data) => {
                count--;
                if (!count)
                    done();
            });

            server.checkalivestatus();
            server.checkalivestatus();
            server.checkalivestatus();
            server.checkalivestatus();
        });

        it("must give status", function(done) {
            var sub = server.status.delay(1).subscribe(status => {
                sub.dispose();
                done();
            })

            server.checkalivestatus();
            server.checkalivestatus();
        });
    });
});
