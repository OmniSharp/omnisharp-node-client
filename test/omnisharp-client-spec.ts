/// <reference path="./tsd.d.ts" />
import {expect} from "chai";
import {DriverState} from "../lib/enums";
import {resolve} from "path";
import {ReactiveClient as OmnisharpClient} from "../lib/reactive/reactive-client";
import _ from "lodash";
import {Observable} from "rxjs";

declare const xdescribe: Function;

describe("Omnisharp Server", function() {
    it("must construct", () => {
        new OmnisharpClient({
            projectPath: process.cwd()
        });
    });

    describe("state", function() {

        this.timeout(60000 * 10);
        let server: OmnisharpClient;

        beforeEach((done) => {
            server = new OmnisharpClient({
                projectPath: process.cwd()
            });

            const sub = server.state.startWith(server.currentState).filter(state => state === DriverState.Connected).subscribe(state => {
                sub.unsubscribe();
                done();
            });

            server.connect();
        });

        afterEach(() => {
            server.disconnect();
            return Observable.timer(1000).toPromise();
        });

        it("must respond to all requests", function(done) {
            let count = 4;
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
            const sub = server.status.delay(1).subscribe(status => {
                sub.unsubscribe();
                done();
            });

            server.checkalivestatus();
            server.checkalivestatus();
        });
    });

    describe("configuration", function() {

        this.timeout(60000 * 10);
        it("should call with given omnisharp parameters", function(done) {
            const server = new OmnisharpClient({
                projectPath: resolve(__dirname, "../"),
                logger: {
                    log: (message) => {
                        if (_.startsWith(message, "Arguments: ")) {
                            expect(message).to.contain("--Dnx:Alias=notdefault");
                            server.disconnect();
                            done();
                        }
                    },
                    error: (message) => { /* */ }
                },
                omnisharp: {
                    dnx: { alias: "notdefault" }
                }
            });

            server.connect();
        });

        it("should call with given omnisharp parameters (formatting)", function(done) {
            const server = new OmnisharpClient({
                projectPath: resolve(__dirname, "../"),
                logger: {
                    log: (message) => {
                        if (_.startsWith(message, "Arguments: ")) {
                            expect(message).to.contain("--Dnx:Alias=beta4");
                            expect(message).to.contain("--FormattingOptions:NewLine=blah");
                            server.disconnect();
                            done();
                        }
                    },
                    error: (message) => { /* */ }
                },
                omnisharp: {
                    formattingOptions: { newLine: "blah" },
                    dnx: { alias: "beta4" }
                }
            });

            server.connect();
        });
    });
});
