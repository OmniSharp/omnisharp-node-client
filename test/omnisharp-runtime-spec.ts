/// <reference path="./tsd.d.ts" />
import {expect} from "chai";
//import * as _ from "lodash";
import {findRuntimeById, downloadRuntime} from "../lib/omnisharp-runtime";
import {Runtime} from "../lib/enums";
import {resolve} from "path";

describe("Omnisharp Runtime", function() {
    it("should get a runtime id", () => {
        return findRuntimeById("dnx-coreclr-dos-x64", console, resolve(__dirname, "fixture/runtimes"))
            .map(runtime => {
                expect(runtime).to.be.equal("dnx-coreclr-dos-x64.1.0.0-rc2-16389");
            })
            .toPromise();
    });

    it("should return empty if no runtime", () => {
        return findRuntimeById("dnx-coreclr-solaris-x64", console, resolve(__dirname, "fixture/runtimes"))
            .isEmpty()
            .map(empty => {
                expect(empty).to.be.true;
            })
            .toPromise();
    });

    xit("should download the runtimes", function() {
        this.timeout(60000);
        return downloadRuntime(Runtime.ClrOrMono, process, console)
            .do(artifacts => {
                expect(artifacts[0]).to.contain("omnisharp-");
                expect(artifacts[1]).to.contain("omnisharp.bootstrap-");
            })
            .toPromise();
    });
});
