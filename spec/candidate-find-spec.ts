import {expect} from 'chai';
import * as _ from 'lodash';
import {join} from 'path';

import {findCandidates} from '../lib/candidate-finder';

declare var xdescribe: Function;
declare var xit: Function;

describe("Candidate Finder", function() {
    it('z1 candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/cs'), console).subscribe(cs => {
            expect(cs).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/cs')]);
            done();
        });
    });

    it('z2 candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/cs/'), console).subscribe(cs => {
            expect(cs).to.not.be.null;
            expect(cs).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/cs')]);
            done();
        });
    });

    it('z1 candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/csproj'), console).subscribe(csproj => {
            expect(csproj).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/csproj')]);
            done();
        });
    });

    it('z2 candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/csproj/'), console).subscribe(csproj => {
            expect(csproj).to.not.be.null;
            expect(csproj).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/csproj')]);
            done();
        });
    });

    it('z3 candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/csx'), console).subscribe(csx => {
            expect(csx).to.not.be.null;
            expect(csx).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/csx')]);
            done();
        });
    });

    it('z4 candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/csx/'), console).subscribe(csx => {
            expect(csx).to.not.be.null;
            expect(csx).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/csx')]);
            done();
        });
    });

    it('z5 candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/global'), console).subscribe(global => {
            expect(global).to.not.be.null;
            expect(global).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/global')]);
            done();
        });
    });

    it('z6 candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/global/'), console).subscribe(global => {
            expect(global).to.not.be.null;
            expect(global).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/global')]);
            done();
        });
    });

    it('z7 candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/project'), console).subscribe(project => {
            expect(project).to.not.be.null;
            expect(project).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/project')]);
            done();
        });
    });

    it('z8 candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/project/'), console).subscribe(project => {
            expect(project).to.not.be.null;
            expect(project).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/project')]);
            done();
        });
    });

    it('z9 candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/solution'), console).subscribe(solution => {
            expect(solution).to.not.be.null;
            expect(solution).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/solution/something.sln')]);
            done();
        });
    });

    it('z10 candidate should return root most files', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/solution/'), console).subscribe(solution => {
            expect(solution).to.not.be.null;
            expect(solution).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/solution/something.sln')]);
            done();
        });
    });

    it('z11 candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder'), console).subscribe(csproj => {
            expect(csproj).to.not.be.null;
            expect(csproj).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder')]);
            done();
        });
    });

    it('z12 candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder/csx'), console).subscribe(csx => {
            expect(csx).to.not.be.null;
            expect(csx).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/global-root-folder'),
                join(__dirname, 'fixture/candidate-finder/global-root-folder/csx')
            ]);
            done();
        });
    });

    it('z13 candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder/global'), console).subscribe(global => {
            expect(global).to.not.be.null;
            expect(global).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder/global')]);
            done();
        });
    });

    it('z14 candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder'), console).subscribe(project => {
            expect(project).to.not.be.null;
            expect(project).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder')]);
            done();
        });
    });

    it('z15 candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder/solution'), console).subscribe(solution => {
            expect(solution).to.not.be.null;
            expect(solution).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder/solution/something.sln')]);
            done();
        });
    });

    it('z16 candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/csx-root-folder/csx'), console).subscribe(csx => {
            expect(csx).to.not.be.null;
            expect(csx).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/csx-root-folder/csx')]);
            done();
        });
    });

    it('z17 candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/csx-root-folder/global'), console).subscribe(global => {
            expect(global).to.not.be.null;
            expect(global).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/csx-root-folder/global'),
                join(__dirname, 'fixture/candidate-finder/csx-root-folder'),
            ]);
            done();
        });
    });

    it('z18 candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/csx-root-folder/solution'), console).subscribe(solution => {
            expect(solution).to.not.be.null;
            expect(solution).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/csx-root-folder/solution/something.sln'),
                join(__dirname, 'fixture/candidate-finder/csx-root-folder'),
            ]);
            done();
        });
    });

    it('z19 candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder'), console).subscribe(csproj => {
            expect(csproj).to.not.be.null;
            expect(csproj).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder/something.sln')]);
            done();
        });
    });

    it('z20 candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder/csx'), console).subscribe(csx => {
            expect(csx).to.not.be.null;
            expect(csx).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder/something.sln'), join(__dirname, 'fixture/candidate-finder/solution-root-folder/csx')]);
            done();
        });
    });

    it('z21 candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder/global'), console).subscribe(global => {
            expect(global).to.not.be.null;
            expect(global).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder/global')]);
            done();
        });
    });

    it('z22 candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder'), console).subscribe(project => {
            expect(project).to.not.be.null;
            expect(project).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder/something.sln')]);
            done();
        });
    });

    it('z23 candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder/solution'), console).subscribe(solution => {
            expect(solution).to.not.be.null;
            expect(solution).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder/solution/something.sln')]);
            done();
        });
    });

    it('z23b candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder/two-solution'), { log: () => {}, error: () => {} }).subscribe(solution => {
            expect(solution).to.not.be.null;
            expect(solution).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/solution-root-folder/two-solution/something.sln'),
                join(__dirname, 'fixture/candidate-finder/solution-root-folder/two-solution/somethingelse.sln'),
            ]);
            done();
        });
    });

    it('z24 candidate find projects up the folder heirarchy if not found', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/no-solution'), console).subscribe(csproj => {
            expect(csproj).to.not.be.null;
            expect(csproj).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/no-solution')]);
            done();
        });
    });

    it('z25 should return one solution for unity based projects', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/two-solution-unity'), console).subscribe(csproj => {
            expect(csproj).to.not.be.null;
            expect(csproj).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/two-solution-unity/something-csharp.sln')]);
            done();
        });
    });

    it('z26 should return two solutions for unity based projects with extra solutions', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/three-solution-unity'), console).subscribe(csproj => {
            expect(csproj).to.not.be.null;
            expect(csproj).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/three-solution-unity/something-csharp.sln'),
                join(__dirname, 'fixture/candidate-finder/three-solution-unity/somethingelse.sln'),
            ]);
            done();
        });
    });

    it('z27 should return two solutions projects with extra solutions', function(done) {
        findCandidates(join(__dirname, 'fixture/candidate-finder/two-solution'), console).subscribe(csproj => {
            expect(csproj).to.not.be.null;
            expect(csproj).to.be.deep.equal([
                join(__dirname, 'fixture/candidate-finder/two-solution/something.sln'),
                join(__dirname, 'fixture/candidate-finder/two-solution/somethingelse.sln'),
            ]);
            done();
        });
    });


});
