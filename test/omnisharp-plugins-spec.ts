/// <reference path="./tsd.d.ts" />
import {expect} from "chai";
import {Runtime} from "../lib/enums";
import {downloadRuntimeIfMissing, getRuntimeLocation} from "../lib/helpers/runtime";
import {getPluginPath} from "../lib/helpers/plugin";
import {join} from "path";

describe("Omnisharp Plugin", function() {
    before(function() {
        this.timeout(60000);
        return Promise.all([
            downloadRuntimeIfMissing({ runtime: Runtime.CoreClr, arch: process.arch, platform: process.platform }, console).toPromise(),
            downloadRuntimeIfMissing({ runtime: Runtime.ClrOrMono, arch: process.arch, platform: process.platform }, console).toPromise()
        ]);
    });

    xit("should return the default path to the omnisharp install if no plugins are found", function() {
        const ctx = {
            runtime: Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        };
        return getPluginPath(join(__dirname, "fixture/plugins/sln"), ctx, [], console)
            .toPromise()
            .then((result) => {
                expect(getRuntimeLocation(ctx)).to.be.eql(result);
            });
    });

    xit("should return a custom path when plugins are found", function() {
        const ctx = {
            runtime: Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        };
        return getPluginPath(join(__dirname, "fixture/plugins/sln-with-plugins"), ctx, [], console)
            .toPromise()
            .then((result) => {
                expect(getRuntimeLocation(ctx)).to.not.be.eql(result);
            });
    });

    xit("should return the same custom path when called more than once when finding a set of plugins", function() {
        const ctx = {
            runtime: Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        };
        return getPluginPath(join(__dirname, "fixture/plugins/sln-with-plugins"), ctx, [], console)
            .toPromise()
            .then((result) => {
                expect(getRuntimeLocation(ctx)).to.not.be.eql(result);

                return getPluginPath(join(__dirname, "fixture/plugins/sln-with-plugins"), ctx, [], console)
                    .toPromise()
                    .then((result2) => {
                        expect(result).to.be.eql(result2);
                    });
            });
    });

    xit("should return a custom path when plugins are given", function() {
        const ctx = {
            runtime: Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        };
        return getPluginPath(join(__dirname, "fixture/plugins/sln"), ctx, [{ "name": "OmniSharp.Dnx", "version": "1.0.0-*" }, { "name": "OmniSharp.MSBuild", "version": "1.0.0-*" }], console)
            .toPromise()
            .then((result) => {
                expect(getRuntimeLocation(ctx)).to.not.be.eql(result);
            });
    });

    xit("should return the same custom path when called more than once given a set of plugins", function() {
        const ctx = {
            runtime: Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        };
        return getPluginPath(join(__dirname, "fixture/plugins/sln"), ctx, [{ "name": "OmniSharp.Dnx", "version": "1.0.0-*" }, { "name": "OmniSharp.MSBuild", "version": "1.0.0-*" }], console)
            .toPromise()
            .then((result) => {
                expect(getRuntimeLocation(ctx)).to.not.be.eql(result);

                return getPluginPath(join(__dirname, "fixture/plugins/sln"), ctx, [{ "name": "OmniSharp.Dnx", "version": "1.0.0-*" }, { "name": "OmniSharp.MSBuild", "version": "1.0.0-*" }], console)
                    .toPromise()
                    .then(result2 => {
                        expect(result).to.be.eql(result2);
                    });
            });
    });

    xit("should return the same custom path when called more than once given the same set of plugins", function() {
        const ctx = {
            runtime: Runtime.CoreClr,
            arch: process.arch,
            platform: process.platform
        };
        return getPluginPath(join(__dirname, "fixture/plugins/sln"), ctx, [{ "name": "OmniSharp.Dnx", "version": "1.0.0-*" }, { "name": "OmniSharp.MSBuild", "version": "1.0.0-*" }], console)
            .toPromise()
            .then((result) => {
                expect(getRuntimeLocation(ctx)).to.not.be.eql(result);

                return getPluginPath(join(__dirname, "fixture/plugins/sln-with-plugins"), ctx, [], console)
                    .toPromise()
                    .then(result2 => {
                        expect(result).to.be.eql(result2);
                    });
            });
    });
});
