/// <reference path="./tsd.d.ts" />
import {expect} from "chai";
declare const xdescribe: Function;
import {ClientV1} from "../lib/clients/client-v1";
import {ClientV2} from "../lib/clients/client-v2";
import {ObservationClientV1, AggregateClientV1} from "../lib/aggregate/composite-client-v1";
import {ObservationClientV2, AggregateClientV2} from "../lib/aggregate/composite-client-v2";

describe("Decorator Methods", function() {
    it("ClientV1", function() {
        const client = new ClientV1({ projectPath: process.cwd() });

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

    it("ClientV2", function() {
        const client = new ClientV2({ projectPath: process.cwd() });

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

    it("ObservationClientV1", function() {
        const client = new ObservationClientV1();

        expect(client.updatebuffer).to.equal(client.updatebuffer);
        expect(client.changebuffer).to.equal(client.changebuffer);
        expect(client.codecheck).to.equal(client.codecheck);
        expect(client.formatAfterKeystroke).to.equal(client.formatAfterKeystroke);
        expect(client.codeformat).to.equal(client.codeformat);
    });

    it("ObservationClientV2", function() {
        const client = new ObservationClientV2();

        expect(client.updatebuffer).to.equal(client.updatebuffer);
        expect(client.changebuffer).to.equal(client.changebuffer);
        expect(client.codecheck).to.equal(client.codecheck);
        expect(client.formatAfterKeystroke).to.equal(client.formatAfterKeystroke);
        expect(client.codeformat).to.equal(client.codeformat);
        expect(client.signatureHelp).to.equal(client.signatureHelp);
    });

    it("AggregateClientV1", function() {
        const client = new AggregateClientV1();

        expect(client.updatebuffer).to.equal(client.updatebuffer);
        expect(client.changebuffer).to.equal(client.changebuffer);
        expect(client.codecheck).to.equal(client.codecheck);
        expect(client.formatAfterKeystroke).to.equal(client.formatAfterKeystroke);
        expect(client.codeformat).to.equal(client.codeformat);
    });

    it("AggregateClientV2", function() {
        const client = new AggregateClientV2();

        expect(client.updatebuffer).to.equal(client.updatebuffer);
        expect(client.changebuffer).to.equal(client.changebuffer);
        expect(client.codecheck).to.equal(client.codecheck);
        expect(client.formatAfterKeystroke).to.equal(client.formatAfterKeystroke);
        expect(client.codeformat).to.equal(client.codeformat);
    });
});
