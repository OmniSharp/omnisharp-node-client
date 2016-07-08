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
        this.timeout(60000);
        let server: OmnisharpClient;

        beforeEach(() => {
            server = new OmnisharpClient({
                projectPath: process.cwd()
            });

            server.requests.subscribe(x => console.log("requests", x));
            server.responses.subscribe(x => console.log("responses", x));
            server.connect();

            return server.state
                .startWith(server.currentState)
                .filter(state => state === DriverState.Connected)
                .take(1)
                .toPromise();
        });

        afterEach(() => {
            server.disconnect();
            return Observable.timer(1000).toPromise();
        });

        it("must respond to all requests (string)", function() {
            _.defer(() => {
                server.request("/checkalivestatus");
                server.request("/checkalivestatus");
                server.request("/checkalivestatus");
                server.request("/checkalivestatus");
            });

            return server.observe.checkalivestatus
                .take(4)
                .toPromise();
        });

        it("must respond to all requests (method)", function() {
            _.defer(() => {
                server.checkalivestatus();
                server.checkalivestatus();
                server.checkalivestatus();
                server.checkalivestatus();
            });

            return server.observe.checkalivestatus
                .take(4)
                .toPromise();
        });

        it("must give status", function() {
            _.defer(() => {
                server.checkalivestatus();
                server.checkalivestatus();
            });

            return server.status
                .delay(1)
                .take(1)
                .toPromise();
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
