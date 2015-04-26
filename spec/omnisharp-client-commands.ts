import {expect} from 'chai';
import {OmnisharpClient, Driver, DriverState} from "../lib/omnisharp-client";

declare var xdescribe: Function;

describe("Commands", function() {
    var server: OmnisharpClient;
    beforeEach(function() {
        server = new OmnisharpClient({
            projectPath: process.cwd()
        });
    });

    describe("updatebuffer", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.updatebuffer({
                    FileName: null,
                    Buffer: ""
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Buffer is null", function() {
            expect(() => {
                server.updatebuffer({
                    FileName: "",
                    Buffer: null
                })
            }).to.throw(/must not be null/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.updatebuffer({
                    FileName: "",
                    Buffer: ""
                })
            }).to.not.throw(/must not be null/);
        });
    });

    describe("updatebuffer", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.changebuffer({
                    FileName: null,
                    NewText: '',
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if NewText is null", function() {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: null,
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if StartLine is null", function() {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: null,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if StartLine is less than 1", function() {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: -1,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if StartColumn is null", function() {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: null,
                    EndLine: 1,
                    EndColumn: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if StartColumn is less than 1", function() {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: -1,
                    EndLine: 1,
                    EndColumn: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if EndLine is null", function() {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: null,
                    EndColumn: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if EndLine is less than 1", function() {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: -1,
                    EndColumn: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if EndColumn is null", function() {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: null
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if EndColumn is less than 1", function() {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: -1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.changebuffer({
                    FileName: '',
                    NewText: '',
                    StartLine: 1,
                    StartColumn: 1,
                    EndLine: 1,
                    EndColumn: 1
                })
            }).to.not.throw;
        });
    });

    describe("codecheck", function() {
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.codecheck({})
            }).to.not.throw;
        });
    });

    describe("formatAfterKeystroke", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.formatAfterKeystroke({
                    FileName: null,
                    Line: 1,
                    Column: 1,
                    Character: ''
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is null", function() {
            expect(() => {
                server.formatAfterKeystroke({
                    FileName: '',
                    Line: null,
                    Column: 1,
                    Character: ''
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is less than 1", function() {
            expect(() => {
                server.formatAfterKeystroke({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    Character: ''
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if Column is null", function() {
            expect(() => {
                server.formatAfterKeystroke({
                    FileName: '',
                    Line: 1,
                    Column: null,
                    Character: ''
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Column is less than 1", function() {
            expect(() => {
                server.formatAfterKeystroke({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    Character: ''
                })
            }).to.throw(/must be greater than 0/);
        });

        it("should throw if Character && Char is null", function() {
            expect(() => {
                server.formatAfterKeystroke({
                    FileName: null,
                    Line: 1,
                    Column: 1,
                    Character: null,
                    Char: null
                })
            }).to.throw(/must not be null/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.formatAfterKeystroke({
                    FileName: null,
                    Line: 1,
                    Column: 1,
                    Character: '',
                    Char: null
                })
            }).to.not.throw;
        });
    });


    describe("formatRange", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.formatRange({
                    FileName: null,
                    Line: 1,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is null", function() {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: null,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is less than 1", function() {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if Column is null", function() {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: null,
                    EndLine: 1,
                    EndColumn: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Column is less than 1", function() {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    EndLine: 1,
                    EndColumn: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if EndLine is null", function() {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    EndLine: null,
                    EndColumn: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if EndLine is less than 1", function() {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    EndLine: -1,
                    EndColumn: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if EndColumn is null", function() {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: null
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if EndColumn is less than 1", function() {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: -1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.formatRange({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    EndLine: 1,
                    EndColumn: 1
                })
            }).to.not.throw;
        });
    });

    describe("codeformat", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.codeformat({
                    FileName: null
                })
            }).to.throw(/must not be null/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.codeformat({
                    FileName: null
                })
            }).to.not.throw;
        });
    });

    describe("autocomplete", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.autocomplete({
                    FileName: null,
                    Line: 1,
                    Column: 1,
                    WordToComplete: '',
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is null", function() {
            expect(() => {
                server.autocomplete({
                    FileName: '',
                    Line: null,
                    Column: 1,
                    WordToComplete: ''
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is less than 1", function() {
            expect(() => {
                server.autocomplete({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    WordToComplete: ''
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if Column is null", function() {
            expect(() => {
                server.autocomplete({
                    FileName: '',
                    Line: 1,
                    Column: null,
                    WordToComplete: ''
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Column is less than 1", function() {
            expect(() => {
                server.autocomplete({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    WordToComplete: ''
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if WordToComplete is null", function() {
            expect(() => {
                server.autocomplete({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    WordToComplete: null,
                })
            }).to.throw(/must not be null/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.autocomplete({
                    FileName: null
                })
            }).to.not.throw;
        });
    });

    describe("findimplementations", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.findimplementations({
                    FileName: null,
                    Line: 1,
                    Column: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is null", function() {
            expect(() => {
                server.findimplementations({
                    FileName: '',
                    Line: null,
                    Column: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is less than 1", function() {
            expect(() => {
                server.findimplementations({
                    FileName: '',
                    Line: -1,
                    Column: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if Column is null", function() {
            expect(() => {
                server.findimplementations({
                    FileName: '',
                    Line: 1,
                    Column: null
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Column is less than 1", function() {
            expect(() => {
                server.findimplementations({
                    FileName: '',
                    Line: 1,
                    Column: -1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.findimplementations({
                    FileName: '',
                    Line: 1,
                    Column: 1
                })
            }).to.not.throw;
        });
    });

    describe("findsymbols", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.findsymbols({
                    Filter: null
                })
            }).to.throw(/must not be null/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.findsymbols({
                    Filter: ''
                })
            }).to.not.throw;
        });
    });

    describe("findusages", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.findusages({
                    FileName: null,
                    Line: 1,
                    Column: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is null", function() {
            expect(() => {
                server.findusages({
                    FileName: '',
                    Line: null,
                    Column: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is less than 1", function() {
            expect(() => {
                server.findusages({
                    FileName: '',
                    Line: -1,
                    Column: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if Column is null", function() {
            expect(() => {
                server.findusages({
                    FileName: '',
                    Line: 1,
                    Column: null
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Column is less than 1", function() {
            expect(() => {
                server.findusages({
                    FileName: '',
                    Line: 1,
                    Column: -1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.findusages({
                    FileName: '',
                    Line: 1,
                    Column: 1
                })
            }).to.not.throw;
        });
    });

    describe("gotodefinition", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.gotodefinition({
                    FileName: null,
                    Line: 1,
                    Column: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is null", function() {
            expect(() => {
                server.gotodefinition({
                    FileName: '',
                    Line: null,
                    Column: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is less than 1", function() {
            expect(() => {
                server.gotodefinition({
                    FileName: '',
                    Line: -1,
                    Column: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if Column is null", function() {
            expect(() => {
                server.gotodefinition({
                    FileName: '',
                    Line: 1,
                    Column: null
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Column is less than 1", function() {
            expect(() => {
                server.gotodefinition({
                    FileName: '',
                    Line: 1,
                    Column: -1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.gotodefinition({
                    FileName: '',
                    Line: 1,
                    Column: 1
                })
            }).to.not.throw;
        });
    });

    describe("navigateup", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.navigateup({
                    FileName: null,
                    Line: 1,
                    Column: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is null", function() {
            expect(() => {
                server.navigateup({
                    FileName: '',
                    Line: null,
                    Column: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is less than 1", function() {
            expect(() => {
                server.navigateup({
                    FileName: '',
                    Line: -1,
                    Column: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if Column is null", function() {
            expect(() => {
                server.navigateup({
                    FileName: '',
                    Line: 1,
                    Column: null
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Column is less than 1", function() {
            expect(() => {
                server.navigateup({
                    FileName: '',
                    Line: 1,
                    Column: -1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.navigateup({
                    FileName: '',
                    Line: 1,
                    Column: 1
                })
            }).to.not.throw;
        });
    });

    describe("navigatedown", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.navigatedown({
                    FileName: null,
                    Line: 1,
                    Column: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is null", function() {
            expect(() => {
                server.navigatedown({
                    FileName: '',
                    Line: null,
                    Column: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is less than 1", function() {
            expect(() => {
                server.navigatedown({
                    FileName: '',
                    Line: -1,
                    Column: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if Column is null", function() {
            expect(() => {
                server.navigatedown({
                    FileName: '',
                    Line: 1,
                    Column: null
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Column is less than 1", function() {
            expect(() => {
                server.navigatedown({
                    FileName: '',
                    Line: 1,
                    Column: -1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.navigatedown({
                    FileName: '',
                    Line: 1,
                    Column: 1
                })
            }).to.not.throw;
        });
    });

    describe("rename", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.rename({
                    FileName: null,
                    Line: 1,
                    Column: 1,
                    RenameTo: ''
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is null", function() {
            expect(() => {
                server.rename({
                    FileName: '',
                    Line: null,
                    Column: 1,
                    RenameTo: ''
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is less than 1", function() {
            expect(() => {
                server.rename({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    RenameTo: ''
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if Column is null", function() {
            expect(() => {
                server.rename({
                    FileName: '',
                    Line: 1,
                    Column: null,
                    RenameTo: ''
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Column is less than 1", function() {
            expect(() => {
                server.rename({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    RenameTo: ''
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if RenameTo is null", function() {
            expect(() => {
                server.rename({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    RenameTo: null
                })
            }).to.throw(/must not be null/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.rename({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    RenameTo: ''
                })
            }).to.not.throw;
        });
    });

    describe("signatureHelp", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.signatureHelp({
                    FileName: null,
                    Line: 1,
                    Column: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is null", function() {
            expect(() => {
                server.signatureHelp({
                    FileName: '',
                    Line: null,
                    Column: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is less than 1", function() {
            expect(() => {
                server.signatureHelp({
                    FileName: '',
                    Line: -1,
                    Column: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if Column is null", function() {
            expect(() => {
                server.signatureHelp({
                    FileName: '',
                    Line: 1,
                    Column: null
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Column is less than 1", function() {
            expect(() => {
                server.signatureHelp({
                    FileName: '',
                    Line: 1,
                    Column: -1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.signatureHelp({
                    FileName: '',
                    Line: 1,
                    Column: 1
                })
            }).to.not.throw;
        });
    });

    describe("typelookup", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.typelookup({
                    FileName: null,
                    Line: 1,
                    Column: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is null", function() {
            expect(() => {
                server.typelookup({
                    FileName: '',
                    Line: null,
                    Column: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is less than 1", function() {
            expect(() => {
                server.typelookup({
                    FileName: '',
                    Line: -1,
                    Column: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if Column is null", function() {
            expect(() => {
                server.typelookup({
                    FileName: '',
                    Line: 1,
                    Column: null
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Column is less than 1", function() {
            expect(() => {
                server.typelookup({
                    FileName: '',
                    Line: 1,
                    Column: -1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.typelookup({
                    FileName: '',
                    Line: 1,
                    Column: 1
                })
            }).to.not.throw;
        });
    });

    describe("getcodeactions", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.getcodeactions({
                    FileName: null,
                    Line: 1,
                    Column: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is null", function() {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Line: null,
                    Column: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is less than 1", function() {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Line: -1,
                    Column: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if Column is null", function() {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Line: 1,
                    Column: null
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Column is less than 1", function() {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Line: 1,
                    Column: -1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.getcodeactions({
                    FileName: '',
                    Line: 1,
                    Column: 1
                })
            }).to.not.throw;
        });
    });

    describe("checkalivestatus", function() {
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.checkalivestatus()
            }).to.not.throw;
        });
    });

    describe("checkreadystatus", function() {
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.checkreadystatus()
            }).to.not.throw;
        });
    });

    describe("currentfilemembersastree", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.currentfilemembersastree({
                    FileName: null
                })
            }).to.throw(/must not be null/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.currentfilemembersastree({
                    FileName: ''
                })
            }).to.not.throw;
        });
    });

    describe("currentfilemembersasflat", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.currentfilemembersasflat({
                    FileName: null
                })
            }).to.throw(/must not be null/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.currentfilemembersasflat({
                    FileName: ''
                })
            }).to.not.throw;
        });
    });

    describe("filesChanged", function() {
        it("should throw if request is null", function() {
            expect(() => {
                server.filesChanged(null)
            }).to.throw(/must not be null/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.filesChanged([])
            }).to.not.throw;
        });
    });

    describe("projects", function() {
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.projects()
            }).to.not.throw;
        });
    });

    describe("project", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.project({
                    FileName: null
                })
            }).to.throw(/must not be null/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.project({
                    FileName: ''
                })
            }).to.not.throw;
        });
    });

    describe("runcodeaction", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.runcodeaction({
                    FileName: null,
                    Line: 1,
                    Column: 1,
                    CodeAction: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is null", function() {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Line: null,
                    Column: 1,
                    CodeAction: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is less than 1", function() {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    CodeAction: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if Column is null", function() {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Line: 1,
                    Column: null,
                    CodeAction: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Column is less than 1", function() {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    CodeAction: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if CodeAction is null", function() {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    CodeAction: null
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if CodeAction is less than 0", function() {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    CodeAction: -1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.runcodeaction({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    CodeAction: 1
                })
            }).to.not.throw;
        });
    });

    describe("gettestcontext", function() {
        it("should throw if FileName is null", function() {
            expect(() => {
                server.gettestcontext({
                    FileName: null,
                    Line: 1,
                    Column: 1,
                    Type: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is null", function() {
            expect(() => {
                server.gettestcontext({
                    FileName: '',
                    Line: null,
                    Column: 1,
                    Type: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Line is less than 1", function() {
            expect(() => {
                server.gettestcontext({
                    FileName: '',
                    Line: -1,
                    Column: 1,
                    Type: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if Column is null", function() {
            expect(() => {
                server.gettestcontext({
                    FileName: '',
                    Line: 1,
                    Column: null,
                    Type: 1
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Column is less than 1", function() {
            expect(() => {
                server.gettestcontext({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    Type: 1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should throw if Type is null", function() {
            expect(() => {
                server.gettestcontext({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    Type: null
                })
            }).to.throw(/must not be null/);
        });
        it("should throw if Type is less than 0", function() {
            expect(() => {
                server.gettestcontext({
                    FileName: '',
                    Line: 1,
                    Column: -1,
                    Type: -1
                })
            }).to.throw(/must be greater than 0/);
        });
        it("should not throw of required fields are set", function() {
            expect(() => {
                server.gettestcontext({
                    FileName: '',
                    Line: 1,
                    Column: 1,
                    Type: 1
                })
            }).to.not.throw;
        });
    });
});
