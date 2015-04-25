import {expect} from 'chai';
import {OmnisharpServer} from "../lib/omnisharp-server";
import {Driver, DriverState} from "../lib/drivers";

declare var xdescribe: Function;

describe("Omnisharp Server", function() {
    it("must construct", () => {
        new OmnisharpServer({
            projectPath: process.cwd()
        });
    });

    it("must construct with a specific driver", () => {
        new OmnisharpServer({
            driver: Driver.Stdio,
            projectPath: process.cwd()
        });
    });

    describe('state', function() {

        this.timeout(10000);
        var server: OmnisharpServer;

        before((done) => {
            server = new OmnisharpServer({
                driver: Driver.Stdio,
                projectPath: process.cwd()
            });

            server.connect();

            var sub = server.state.subscribe(state => {
                sub.dispose();
                done();
            });
        })

        it("must connect", function(done) {
            server.checkalivestatus();
            expect(server.outstandingRequests).to.be.eq(1);
            server.checkalivestatus();
            server.checkalivestatus();
            server.checkalivestatus();
            expect(server.outstandingRequests).to.be.eq(4);

            server.subscribe
            done();
        });
    });

});
