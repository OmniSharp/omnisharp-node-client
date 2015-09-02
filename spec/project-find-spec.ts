/// <reference path="./tsd.d.ts" />
import {expect} from 'chai';
import * as _ from 'lodash';
import {join} from 'path';

import {findProject} from '../lib/project-finder';

declare var xdescribe: Function;

describe("Project Finder", function() {
    it('should support files existing in the same folder', function() {
        var cs = findProject(join(__dirname, 'fixture/project-finder/same-folder/cs'), console);
        expect(cs).to.not.be.null;
        expect(cs).to.be.eql(join(__dirname, 'fixture/project-finder/same-folder/cs'));

        var cs = findProject(join(__dirname, 'fixture/project-finder/same-folder/cs/'), console);
        expect(cs).to.not.be.null;
        expect(cs).to.be.eql(join(__dirname, 'fixture/project-finder/same-folder/cs'));

        var csproj = findProject(join(__dirname, 'fixture/project-finder/same-folder/csproj'), console);
        expect(csproj).to.not.be.null;
        expect(csproj).to.be.eql(join(__dirname, 'fixture/project-finder/same-folder/csproj'));

        var csproj = findProject(join(__dirname, 'fixture/project-finder/same-folder/csproj/'), console);
        expect(csproj).to.not.be.null;
        expect(csproj).to.be.eql(join(__dirname, 'fixture/project-finder/same-folder/csproj'));

        var csx = findProject(join(__dirname, 'fixture/project-finder/same-folder/csx'), console);
        expect(csx).to.not.be.null;
        expect(csx).to.be.eql(join(__dirname, 'fixture/project-finder/same-folder/csx'));

        var csx = findProject(join(__dirname, 'fixture/project-finder/same-folder/csx/'), console);
        expect(csx).to.not.be.null;
        expect(csx).to.be.eql(join(__dirname, 'fixture/project-finder/same-folder/csx'));

        var global = findProject(join(__dirname, 'fixture/project-finder/same-folder/global'), console);
        expect(global).to.not.be.null;
        expect(global).to.be.eql(join(__dirname, 'fixture/project-finder/same-folder/global'));

        var global = findProject(join(__dirname, 'fixture/project-finder/same-folder/global/'), console);
        expect(global).to.not.be.null;
        expect(global).to.be.eql(join(__dirname, 'fixture/project-finder/same-folder/global'));

        var project = findProject(join(__dirname, 'fixture/project-finder/same-folder/project'), console);
        expect(project).to.not.be.null;
        expect(project).to.be.eql(join(__dirname, 'fixture/project-finder/same-folder/project'));

        var project = findProject(join(__dirname, 'fixture/project-finder/same-folder/project/'), console);
        expect(project).to.not.be.null;
        expect(project).to.be.eql(join(__dirname, 'fixture/project-finder/same-folder/project'));

        var solution = findProject(join(__dirname, 'fixture/project-finder/same-folder/solution'), console);
        expect(solution).to.not.be.null;
        expect(solution).to.be.eql(join(__dirname, 'fixture/project-finder/same-folder/solution/something.sln'));

        var solution = findProject(join(__dirname, 'fixture/project-finder/same-folder/solution/'), console);
        expect(solution).to.not.be.null;
        expect(solution).to.be.eql(join(__dirname, 'fixture/project-finder/same-folder/solution/something.sln'));
    });

    it('should find projects up the folder heirarchy if not found', function() {
        var csproj = findProject(join(__dirname, 'fixture/project-finder/global-root-folder'), console);
        expect(csproj).to.not.be.null;
        expect(csproj).to.be.eql(join(__dirname, 'fixture/project-finder/global-root-folder'));

        var csx = findProject(join(__dirname, 'fixture/project-finder/global-root-folder/csx'), console);
        expect(csx).to.not.be.null;
        expect(csx).to.be.eql(join(__dirname, 'fixture/project-finder/global-root-folder/csx'));

        var global = findProject(join(__dirname, 'fixture/project-finder/global-root-folder/global'), console);
        expect(global).to.not.be.null;
        expect(global).to.be.eql(join(__dirname, 'fixture/project-finder/global-root-folder/global'));

        var project = findProject(join(__dirname, 'fixture/project-finder/global-root-folder'), console);
        expect(project).to.not.be.null;
        expect(project).to.be.eql(join(__dirname, 'fixture/project-finder/global-root-folder'));

        var solution = findProject(join(__dirname, 'fixture/project-finder/global-root-folder/solution'), console);
        expect(solution).to.not.be.null;
        expect(solution).to.be.eql(join(__dirname, 'fixture/project-finder/global-root-folder/solution/something.sln'));

        var csproj = findProject(join(__dirname, 'fixture/project-finder/csx-root-folder'), console);
        expect(csproj).to.not.be.null;
        expect(csproj).to.be.eql(join(__dirname, 'fixture/project-finder/csx-root-folder'));

        var csx = findProject(join(__dirname, 'fixture/project-finder/csx-root-folder/csx'), console);
        expect(csx).to.not.be.null;
        expect(csx).to.be.eql(join(__dirname, 'fixture/project-finder/csx-root-folder/csx'));

        var global = findProject(join(__dirname, 'fixture/project-finder/csx-root-folder/global'), console);
        expect(global).to.not.be.null;
        expect(global).to.be.eql(join(__dirname, 'fixture/project-finder/csx-root-folder/global'));

        var project = findProject(join(__dirname, 'fixture/project-finder/csx-root-folder'), console);
        expect(project).to.not.be.null;
        expect(project).to.be.eql(join(__dirname, 'fixture/project-finder/csx-root-folder'));

        var solution = findProject(join(__dirname, 'fixture/project-finder/csx-root-folder/solution'), console);
        expect(solution).to.not.be.null;
        expect(solution).to.be.eql(join(__dirname, 'fixture/project-finder/csx-root-folder/solution/something.sln'));

        var csproj = findProject(join(__dirname, 'fixture/project-finder/solution-root-folder'), console);
        expect(csproj).to.not.be.null;
        expect(csproj).to.be.eql(join(__dirname, 'fixture/project-finder/solution-root-folder/something.sln'));

        var csx = findProject(join(__dirname, 'fixture/project-finder/solution-root-folder/csx'), console);
        expect(csx).to.not.be.null;
        expect(csx).to.be.eql(join(__dirname, 'fixture/project-finder/solution-root-folder/csx'));

        var global = findProject(join(__dirname, 'fixture/project-finder/solution-root-folder/global'), console);
        expect(global).to.not.be.null;
        expect(global).to.be.eql(join(__dirname, 'fixture/project-finder/solution-root-folder/global'));

        var project = findProject(join(__dirname, 'fixture/project-finder/solution-root-folder'), console);
        expect(project).to.not.be.null;
        expect(project).to.be.eql(join(__dirname, 'fixture/project-finder/solution-root-folder/something.sln'));

        var solution = findProject(join(__dirname, 'fixture/project-finder/solution-root-folder/solution'), console);
        expect(solution).to.not.be.null;
        expect(solution).to.be.eql(join(__dirname, 'fixture/project-finder/solution-root-folder/solution/something.sln'));

        var csproj = findProject(join(__dirname, 'fixture/project-finder/no-solution'), console);
        expect(csproj).to.not.be.null;
        expect(csproj).to.be.eql(join(__dirname, 'fixture/project-finder/no-solution'));

    });
});
