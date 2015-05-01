import {expect} from 'chai';
import {Driver, DriverState} from "../lib/omnisharp-client";
import Stdio = require("../lib/drivers/stdio");

declare var xdescribe: Function;

describe("Omnisharp Local - Stdio", function() {
    it("must construct", () => {
        new Stdio({
            projectPath: process.cwd()
        });
    });

    it("must construct with a specific driver", () => {
        new Stdio({
            driver: Driver.Stdio,
            projectPath: process.cwd()
        });
    });

    describe('state', function() {

        var server: Stdio;
        this.timeout(20000);

        before(() => {
            server = new Stdio({
                driver: Driver.Stdio,
                projectPath: process.cwd()
            });
        })

        it("must connect", function(done) {

            expect(server.currentState).to.be.eq(DriverState.Disconnected);

            server.connect({});
            expect(server.currentState).to.be.eq(DriverState.Connecting);

            var sub = server.state.subscribe(state => {
                expect(server.currentState).to.be.eq(DriverState.Connected);
                sub.dispose();
                done();
            });
        });

        it("must disconnect", function(done) {
            var sub2 = server.state.subscribe(state => {
                expect(server.currentState).to.be.eq(DriverState.Disconnected);
                sub2.dispose();
                done();
            });

            server.disconnect();
        });
    });

    describe("properties", function() {
        this.timeout(20000);
        it('should implement the interface', function(done) {
            var server = new Stdio({
                driver: Driver.Stdio,
                projectPath: process.cwd()
            });

            server.connect({});
            server.state.subscribe(state => {
                expect(server.currentState).to.be.not.null;
                expect(server.commands).to.be.not.null;
                expect(server.events).to.be.not.null;
                expect(server.state).to.be.not.null;
                expect(server.outstandingRequests).to.be.not.null;
            });

            done();
        })


    })
});
