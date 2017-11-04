// tslint:disable:no-require-imports
import { expect } from 'chai';
import { mkdirSync } from 'fs';
import { resolve } from 'path';
import { findRuntimeById, isSupportedRuntime, RuntimeContext } from '../lib/helpers/runtime';

describe('Omnisharp Runtime', () => {
    it('should get a runtime id', () => {
        return findRuntimeById('dnx-coreclr-dos-x64', resolve(__dirname, 'fixture/runtimes'))
            .map(runtime => {
                expect(runtime).to.be.equal('dnx-coreclr-dos-x64.1.0.0-rc2-16389');
            })
            .toPromise();
    });

    it('should return empty if no runtime', () => {
        return findRuntimeById('dnx-coreclr-solaris-x64', resolve(__dirname, 'fixture/runtimes'))
            .isEmpty()
            .map(empty => {
                // tslint:disable-next-line:no-unused-expression
                expect(empty).to.be.true;
            })
            .toPromise();
    });

    it('should download the runtimes', function (this: Mocha.ISuiteCallbackContext) {
        this.timeout(60000);
        const dir = resolve(__dirname, 'fixture/rtt/default/');
        try { require('rimraf').sync(dir); } catch (e) { /* */ }
        try { mkdirSync(resolve(__dirname, 'fixture/rtt')); } catch (e) { /* */ }
        try { mkdirSync(dir); } catch (e) { /* */ }
        return new RuntimeContext({
            arch: process.arch,
            platform: process.platform,
            destination: dir
        }).downloadRuntime()
            .do(artifacts => {
                expect(artifacts[0]).to.contain('omnisharp');
            })
            .toPromise();
    });

    it('should download a specific runtime', function (this: Mocha.ISuiteCallbackContext) {
        this.timeout(60000);
        const dir = resolve(__dirname, 'fixture/rtt/specific/');
        try { require('rimraf').sync(dir); } catch (e) { /* */ }
        try { mkdirSync(resolve(__dirname, 'fixture/rtt')); } catch (e) { /* */ }
        try { mkdirSync(dir); } catch (e) { /* */ }
        return new RuntimeContext({
            arch: process.arch,
            platform: process.platform,
            version: 'v1.9-alpha1',
            destination: dir
        }).downloadRuntime()
            .do(artifacts => {
                expect(artifacts[0]).to.contain('omnisharp');
            })
            .toPromise();
    });

    it('should support mono or the clr in an environment specific way', () => {
        return isSupportedRuntime(new RuntimeContext({
            arch: process.arch,
            platform: process.platform
        }))
            .toPromise()
            .then(({ path }) => {
                if (process.platform === 'win32') {
                    expect(path).to.be.equal(process.env.PATH);
                } else if (process.env.TRAVIS_MONO) {
                    expect(path).to.not.be.equal(process.env.PATH);
                } else {
                    expect(path).to.be.equal(process.env.PATH);
                }
            });
    });
});
