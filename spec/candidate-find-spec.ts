import {expect} from 'chai';
import * as _ from 'lodash';
import {join} from 'path';

import {findCandidates} from '../lib/candidate-finder';

declare var xdescribe: Function;

describe("Candidate Finder", function() {
    it('candidate should return root most files', function() {
        var csproj = findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/csproj'), console);
        expect(csproj).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/csproj')]);

        var csproj = findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/csproj/'), console);
        expect(csproj).to.not.be.null;
        expect(csproj).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/csproj')]);

        var csx = findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/csx'), console);
        expect(csx).to.not.be.null;
        expect(csx).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/csx')]);

        var csx = findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/csx/'), console);
        expect(csx).to.not.be.null;
        expect(csx).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/csx')]);

        var global = findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/global'), console);
        expect(global).to.not.be.null;
        expect(global).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/global')]);

        var global = findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/global/'), console);
        expect(global).to.not.be.null;
        expect(global).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/global')]);

        var project = findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/project'), console);
        expect(project).to.not.be.null;
        expect(project).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/project')]);

        var project = findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/project/'), console);
        expect(project).to.not.be.null;
        expect(project).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/project')]);

        var solution = findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/solution'), console);
        expect(solution).to.not.be.null;
        expect(solution).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/solution')]);

        var solution = findCandidates(join(__dirname, 'fixture/candidate-finder/same-folder/solution/'), console);
        expect(solution).to.not.be.null;
        expect(solution).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/same-folder/solution')]);
    });

    it('candidate find projects up the folder heirarchy if not found', function() {
        var csproj = findCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder'), console);
        expect(csproj).to.not.be.null;
        expect(csproj).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder')]);

        var csx = findCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder/csx'), console);
        expect(csx).to.not.be.null;
        expect(csx).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder')]);

        var global = findCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder/global'), console);
        expect(global).to.not.be.null;
        expect(global).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder/global')]);

        var project = findCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder'), console);
        expect(project).to.not.be.null;
        expect(project).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder')]);

        var solution = findCandidates(join(__dirname, 'fixture/candidate-finder/global-root-folder/solution'), console);
        expect(solution).to.not.be.null;
        expect(solution).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/global-root-folder/solution')]);

        var csproj = findCandidates(join(__dirname, 'fixture/candidate-finder/csx-root-folder'), console);
        expect(csproj).to.not.be.null;
        expect(csproj).to.be.deep.equal([
            join(__dirname, 'fixture/candidate-finder/csx-root-folder'),
            join(__dirname, 'fixture/candidate-finder/csx-root-folder/global'),
            join(__dirname, 'fixture/candidate-finder/csx-root-folder/solution'),
            join(__dirname, 'fixture/candidate-finder/csx-root-folder/project'),
            join(__dirname, 'fixture/candidate-finder/csx-root-folder/csproj'),
        ]);

        var csx = findCandidates(join(__dirname, 'fixture/candidate-finder/csx-root-folder/csx'), console);
        expect(csx).to.not.be.null;
        expect(csx).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/csx-root-folder/csx')]);

        var global = findCandidates(join(__dirname, 'fixture/candidate-finder/csx-root-folder/global'), console);
        expect(global).to.not.be.null;
        expect(global).to.be.deep.equal([
            join(__dirname, 'fixture/candidate-finder/csx-root-folder'),
            join(__dirname, 'fixture/candidate-finder/csx-root-folder/global'),
        ]);

        var project = findCandidates(join(__dirname, 'fixture/candidate-finder/csx-root-folder'), console);
        expect(project).to.not.be.null;
        expect(project).to.be.deep.equal([
            join(__dirname, 'fixture/candidate-finder/csx-root-folder'),
            join(__dirname, 'fixture/candidate-finder/csx-root-folder/global'),
            join(__dirname, 'fixture/candidate-finder/csx-root-folder/solution'),
            join(__dirname, 'fixture/candidate-finder/csx-root-folder/project'),
            join(__dirname, 'fixture/candidate-finder/csx-root-folder/csproj'),
        ]);

        var solution = findCandidates(join(__dirname, 'fixture/candidate-finder/csx-root-folder/solution'), console);
        expect(solution).to.not.be.null;
        expect(solution).to.be.deep.equal([
            join(__dirname, 'fixture/candidate-finder/csx-root-folder'),
            join(__dirname, 'fixture/candidate-finder/csx-root-folder/solution'),
        ]);

        var csproj = findCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder'), console);
        expect(csproj).to.not.be.null;
        expect(csproj).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder')]);

        var csx = findCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder/csx'), console);
        expect(csx).to.not.be.null;
        expect(csx).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder')]);

        var global = findCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder/global'), console);
        expect(global).to.not.be.null;
        expect(global).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder/global')]);

        var project = findCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder'), console);
        expect(project).to.not.be.null;
        expect(project).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder')]);

        var solution = findCandidates(join(__dirname, 'fixture/candidate-finder/solution-root-folder/solution'), console);
        expect(solution).to.not.be.null;
        expect(solution).to.be.deep.equal([join(__dirname, 'fixture/candidate-finder/solution-root-folder/solution')]);

    });
});
