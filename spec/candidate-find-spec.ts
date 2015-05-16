import {expect} from 'chai';
import * as _ from 'lodash';
import {join} from 'path';

import {findCandidates} from '../lib/candidate-finder';

declare var xdescribe: Function;

describe("Candidate Finder", function() {
    it('z1 candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/csproj'), console).subscribe(csproj => {
            expect(csproj).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/csproj')]);
            done();
        });
    });

    it('candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/csproj/'), console).subscribe(csproj => {
            expect(csproj).to.not.be.null;
            expect(csproj).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/csproj')]);
            done();
        });
    });

    it('candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/csx'), console).subscribe(csx => {
            expect(csx).to.not.be.null;
            expect(csx).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/csx')]);
            done();
        });
    });

    it('candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/csx/'), console).subscribe(csx => {
            expect(csx).to.not.be.null;
            expect(csx).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/csx')]);
            done();
        });
    });

    it('candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/global'), console).subscribe(global => {
            expect(global).to.not.be.null;
            expect(global).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/global')]);
            done();
        });
    });

    it('candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/global/'), console).subscribe(global => {
            expect(global).to.not.be.null;
            expect(global).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/global')]);
            done();
        });
    });

    it('candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/project'), console).subscribe(project => {
            expect(project).to.not.be.null;
            expect(project).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/project')]);
            done();
        });
    });

    it('candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/project/'), console).subscribe(project => {
            expect(project).to.not.be.null;
            expect(project).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/project')]);
            done();
        });
    });

    it('candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/solution'), console).subscribe(solution => {
            expect(solution).to.not.be.null;
            expect(solution).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/solution')]);
            done();
        });
    });

    it('candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/solution/'), console).subscribe(solution => {
            expect(solution).to.not.be.null;
            expect(solution).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/solution')]);
            done();
        });
    });

    it('candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder'), console).subscribe(csproj => {
            expect(csproj).to.not.be.null;
            expect(csproj).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder')]);
            done();
        });
    });

    it('candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder/csx'), console).subscribe(csx => {
            expect(csx).to.not.be.null;
            expect(csx).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder')]);
            done();
        });
    });

    it('candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder/global'), console).subscribe(global => {
            expect(global).to.not.be.null;
            expect(global).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder/global')]);
            done();
        });
    });

    it('candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder'), console).subscribe(project => {
            expect(project).to.not.be.null;
            expect(project).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder')]);
            done();
        });
    });

    it('candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder/solution'), console).subscribe(solution => {
            expect(solution).to.not.be.null;
            expect(solution).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder/solution')]);
            done();
        });
    });

    it('candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/csx-root-folder'), console).subscribe(csproj => {
            expect(csproj).to.not.be.null;
            expect(csproj).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/csx-root-folder'),
                join(__dirname, 'fixture/candidate-finder/csx-root-folder/global'),
                join(__dirname, 'fixture/candidate-finder/csx-root-folder/solution'),
                join(__dirname, 'fixture/candidate-finder/csx-root-folder/csproj'),
                join(__dirname, 'fixture/candidate-finder/csx-root-folder/project'),
            ]);
            done();
        });
    });

    it('candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/csx-root-folder/csx'), console).subscribe(csx => {
            expect(csx).to.not.be.null;
            expect(csx).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/csx-root-folder/csx')]);
            done();
        });
    });

    it('candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/csx-root-folder/global'), console).subscribe(global => {
            expect(global).to.not.be.null;
            expect(global).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/csx-root-folder'),
                join(__dirname, 'fixture/candidate-finder/csx-root-folder/global'),
            ]);
            done();
        });
    });

    it('candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/csx-root-folder'), console).subscribe(project => {
            expect(project).to.not.be.null;
            expect(project).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/csx-root-folder'),
                join(__dirname, 'fixture/candidate-finder/csx-root-folder/global'),
                join(__dirname, 'fixture/candidate-finder/csx-root-folder/solution'),
                join(__dirname, 'fixture/candidate-finder/csx-root-folder/csproj'),
                join(__dirname, 'fixture/candidate-finder/csx-root-folder/project'),
            ]);
            done();
        });
    });

    it('candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/csx-root-folder/solution'), console).subscribe(solution => {
            expect(solution).to.not.be.null;
            expect(solution).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/csx-root-folder'),
                join(__dirname, 'fixture/candidate-finder/csx-root-folder/solution'),
            ]);
            done();
        });
    });

    it('candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder'), console).subscribe(csproj => {
            expect(csproj).to.not.be.null;
            expect(csproj).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder')]);
            done();
        });
    });

    it('candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder/csx'), console).subscribe(csx => {
            expect(csx).to.not.be.null;
            expect(csx).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder')]);
            done();
        });
    });

    it('candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder/global'), console).subscribe(global => {
            expect(global).to.not.be.null;
            expect(global).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder/global')]);
            done();
        });
    });

    it('candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder'), console).subscribe(project => {
            expect(project).to.not.be.null;
            expect(project).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder')]);
            done();
        });
    });

    it('candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder/solution'), console).subscribe(solution => {
            expect(solution).to.not.be.null;
            expect(solution).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder/solution')]);
            done();
        });
    });
});
