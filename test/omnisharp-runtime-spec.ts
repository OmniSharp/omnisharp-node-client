/// <reference path="./tsd.d.ts" />
import {expect} from "chai";
import {findRuntimeById, RuntimeContext, isSupportedRuntime} from "../lib/helpers/runtime";
import {Runtime} from "../lib/enums";
import {resolve} from "path";
import {mkdirSync} from "fs";

describe("Omnisharp Runtime", function() {
    it("should get a runtime id", () => {
        return findRuntimeById("dnx-coreclr-dos-x64", resolve(__dirname, "fixture/runtimes"))
            .map(runtime => {
                expect(runtime).to.be.equal("dnx-coreclr-dos-x64.1.0.0-rc2-16389");
            })
            .toPromise();
    });

    it("should return empty if no runtime", () => {
        return findRuntimeById("dnx-coreclr-solaris-x64", resolve(__dirname, "fixture/runtimes"))
            .isEmpty()
            .map(empty => {
                expect(empty).to.be.true;
            })
            .toPromise();
    });

    it("should download the runtimes", function() {
        this.timeout(60000);
        const dir = resolve(__dirname, "fixture/rtt/default/");
        try { require("rimraf").sync(dir); } catch (e) { /* */ }
        try { mkdirSync(resolve(__dirname, "fixture/rtt")); } catch (e) { /* */ }
        try { mkdirSync(dir); } catch (e) { /* */ }
        return new RuntimeContext({
            runtime: Runtime.ClrOrMono,
            arch: process.arch,
            platform: process.platform,
            destination: dir
        }).downloadRuntime()
            .do(artifacts => {
                expect(artifacts[0]).to.contain("omnisharp");
            })
            .toPromise();
    });

    it("should download a specific runtime", function() {
        this.timeout(60000);
        const dir = resolve(__dirname, "fixture/rtt/specific/");
        try { require("rimraf").sync(dir); } catch (e) { /* */ }
        try { mkdirSync(resolve(__dirname, "fixture/rtt")); } catch (e) { /* */ }
        try { mkdirSync(dir); } catch (e) { /* */ }
        return new RuntimeContext({
            runtime: Runtime.ClrOrMono,
            arch: process.arch,
            platform: process.platform,
            version: "v1.9-alpha1",
            destination: dir
        }).downloadRuntime()
            .do(artifacts => {
                expect(artifacts[0]).to.contain("omnisharp");
            })
            .toPromise();
    });

    it("should support coreclr in an environment specific way", function() {
        return isSupportedRuntime(new RuntimeContext({
            runtime: Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        }))
            .toPromise()
            .then(({runtime, path}) => {
                expect(runtime).to.be.equal(Runtime.CoreClr);
                expect(path).to.be.equal(process.env.PATH);
            });
    });

    it("should support mono or the clr in an environment specific way", function() {
        return isSupportedRuntime(new RuntimeContext({
            runtime: Runtime.ClrOrMono,
            arch: process.arch,
            platform: process.platform
        }))
            .toPromise()
            .then(({runtime, path}) => {
                if (process.platform === "win32") {
                    expect(Runtime[runtime]).to.be.equal(Runtime[Runtime.ClrOrMono]);
                    expect(path).to.be.equal(process.env.PATH);
                } else if (process.env.TRAVIS_MONO) {
                    expect(Runtime[runtime]).to.be.equal(Runtime[Runtime.ClrOrMono]);
                    expect(path).to.not.be.equal(process.env.PATH);
                } else {
                    expect(Runtime[runtime]).to.be.equal(Runtime[Runtime.CoreClr]);
                    expect(path).to.be.equal(process.env.PATH);
                }
            });
    });
});
