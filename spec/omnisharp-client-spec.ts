import {expect} from 'chai';
import {OmnisharpClient} from "../lib/omnisharp-client";
import {Driver, DriverState} from "../lib/drivers";

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

        this.timeout(7000);
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
                console.log("observeCheckalivestatus", data)
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

            var sub = server.status.subscribe(status => {
                sub.dispose();
                done();
            })

            server.checkalivestatus();
            server.checkalivestatus();

        });
    });

});
