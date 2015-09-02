/// <reference path="./tsd.d.ts" />
import {expect} from 'chai';
import {Driver, DriverState} from "../lib/enums";
import {resolve} from "path";
import {ClientV2 as OmnisharpClient} from "../lib/clients/client-v2";
import * as _ from "lodash";

declare var xdescribe: Function;

describe("Omnisharp Server", function() {
    it("must construct", () => {
        new OmnisharpClient({
            projectPath: process.cwd()
        });
    });

    it("must construct with a specific driver", () => {
        new OmnisharpClient({
            driver: Driver.Stdio,
            projectPath: process.cwd()
        });
    });

    describe('state', function() {

        this.timeout(20000);
        var server: OmnisharpClient;

        before((done) => {
            server = new OmnisharpClient({
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
        })

        it("must respond to all requests", function(done) {
            var count = 4;
            server.observeCheckalivestatus.subscribe((data) => {
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

    describe("configuration", function() {
        it('should call with given omnisharp parameters', function(done) {
            var server = new OmnisharpClient({
                driver: Driver.Stdio,
                projectPath: resolve(__dirname, '../roslyn/'),
                logger: {
                    log: (message) => {
                        if (_.startsWith(message, "Arguments: ")) {
                            expect(message).to.contain('--Dnx:Alias=notdefault')
                            done();
                        }
                    },
                    error: (message) => { }
                },
                omnisharp: {
                    dnx: { alias: 'notdefault' }
                }
            });

            server.connect({});
        });

        it('should call with given omnisharp parameters', function(done) {
            var server = new OmnisharpClient({
                driver: Driver.Stdio,
                projectPath: resolve(__dirname, '../roslyn/'),
                logger: {
                    log: (message) => {
                        if (_.startsWith(message, "Arguments: ")) {
                            expect(message).to.contain('--Dnx:Alias=beta4')
                            expect(message).to.contain('--FormattingOptions:NewLine=blah')
                            done();
                        }
                    },
                    error: (message) => { }
                },
                omnisharp: {
                    formattingOptions: { newLine: "blah" },
                    dnx: { alias: 'beta4' }
                }
            });

            server.connect({});
        });
    });
});
