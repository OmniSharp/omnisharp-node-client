/// <reference path="./tsd.d.ts" />
import {expect} from "chai";
declare const xdescribe: Function;
import {ReactiveClient} from "../lib/reactive/reactive-client";
import {ReactiveObservationClient} from "../lib/reactive/reactive-observation-client";
import {ReactiveCombinationClient} from "../lib/reactive/reactive-combination-client";

describe("Decorator Methods", function() {
    it("ReactiveClient", function() {
        const client = new ReactiveClient({ projectPath: process.cwd() });

        expect(client.updatebuffer).to.equal(client.updatebuffer);
        expect(client.changebuffer).to.equal(client.changebuffer);
        expect(client.codecheck).to.equal(client.codecheck);
        expect(client.formatAfterKeystroke).to.equal(client.formatAfterKeystroke);
        expect(client.codeformat).to.equal(client.codeformat);

        expect(client.observe.updatebuffer).to.equal(client.observe.updatebuffer);
        expect(client.observe.changebuffer).to.equal(client.observe.changebuffer);
        expect(client.observe.codeformat).to.equal(client.observe.codeformat);
        expect(client.observe.packageRestoreStarted).to.equal(client.observe.packageRestoreStarted);
        expect(client.observe.events).to.equal(client.observe.events);
    });

    it("ReactiveObservationClient", function() {
        const client = new ReactiveObservationClient();

        expect(client.updatebuffer).to.equal(client.updatebuffer);
        expect(client.changebuffer).to.equal(client.changebuffer);
        expect(client.codecheck).to.equal(client.codecheck);
        expect(client.formatAfterKeystroke).to.equal(client.formatAfterKeystroke);
        expect(client.codeformat).to.equal(client.codeformat);
        expect(client.signatureHelp).to.equal(client.signatureHelp);
    });

    it("ReactiveCombinationClient", function() {
        const client = new ReactiveCombinationClient();

        expect(client.updatebuffer).to.equal(client.updatebuffer);
        expect(client.changebuffer).to.equal(client.changebuffer);
        expect(client.codecheck).to.equal(client.codecheck);
        expect(client.formatAfterKeystroke).to.equal(client.formatAfterKeystroke);
        expect(client.codeformat).to.equal(client.codeformat);
    });
});
