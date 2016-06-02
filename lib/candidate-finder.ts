import _ from "lodash";
import {ILogger} from "./enums";
import {join, dirname, sep, normalize} from "path";
import {Observable, Scheduler} from "rxjs";
import "rxjs/add/operator/distinctKey";
const glob: (file: string[], options?: any) => Promise<string[]> = require("globby");

export interface Options {
    solutionFilesToSearch?: string[];
    projectFilesToSearch?: string[];
    sourceFilesToSearch?: string[];
    solutionIndependentSourceFilesToSearch?: string[];
}

export class Candidate {
    public path: string;
    public originalFile: string;
    public isProject: boolean;

    constructor(originalFile: string, predicate: (path: string) => boolean) {
        this.originalFile = originalFile = normalize(originalFile);
        this.path = _.endsWith(originalFile, ".sln") ? originalFile : dirname(originalFile);
        this.isProject = predicate(originalFile);

        Object.freeze(this);
    }

    public toString() {
        return this.path;
    }
}

export const findCandidates = (function () {
    function realFindCandidates(location: string, logger: ILogger, options: Options = {}) {
        location = _.trimEnd(location, sep);

        const solutionFilesToSearch = options.solutionFilesToSearch || (options.solutionFilesToSearch = ["global.json", "*.sln"]);
        const projectFilesToSearch = options.projectFilesToSearch || (options.projectFilesToSearch = ["project.json", "*.csproj"]);
        const sourceFilesToSearch = options.sourceFilesToSearch || (options.sourceFilesToSearch = ["*.cs"]);
        const solutionIndependentSourceFilesToSearch = options.solutionIndependentSourceFilesToSearch || (options.solutionIndependentSourceFilesToSearch = ["*.csx"]);

        const solutionsOrProjects = searchForCandidates(location, solutionFilesToSearch, logger)
            .toArray()
            .flatMap(result => {
                if (result.length) {
                    return Observable.from(result);
                }
                return searchForCandidates(location, projectFilesToSearch, logger);
            })
            .toArray()
            .map(squashCandidates);

        const independentSourceFiles = searchForCandidates(location, solutionIndependentSourceFilesToSearch, logger)
            .toArray();

        const baseFiles = Observable.concat(solutionsOrProjects, independentSourceFiles)
            .flatMap(x => x);

        const sourceFiles = searchForCandidates(location, sourceFilesToSearch, logger);

        const predicate = (path: string) => _.some(solutionFilesToSearch.concat(projectFilesToSearch), pattern => _.endsWith(path, _.trimStart(pattern, "*")));

        let hasFiles = false;
        return baseFiles
            .do(() => hasFiles = true)
            .concat(Observable.defer(() => {
                if (hasFiles) {
                    return Observable.empty<string>();
                }
                return sourceFiles;
            }))
            .map(file => new Candidate(file, predicate))
            .distinctKey("path")
            .toArray()
            .do(candidates => logger.log(`Omni Project Candidates: Found ${candidates}`))
            .share();
    }

    function findCandidates(location: string, logger: ILogger, options: Options = {}) {
        return realFindCandidates(location, logger, options)
            .map(z => z.map(x => x.toString()));
    }

    (<any>findCandidates).withCandidates = realFindCandidates;

    return <{ (location: string, logger: ILogger, options: Options = {}): Observable<string[]>; withCandidates: typeof realFindCandidates }>findCandidates;
})();

function squashCandidates(candidates: string[]) {
    const rootCandidateCount = getMinCandidate(candidates);
    return _.uniq(_.filter(_.map(candidates, normalize), z => z.split(sep).length === rootCandidateCount));
}

function getMinCandidate(candidates: string[]) {
    if (!candidates.length) return -1;

    return _.minBy(_.map(candidates, normalize), z => z.split(sep).length).split(sep).length;
}

function searchForCandidates(location: string, filesToSearch: string[], logger: ILogger) {
    let locations = location.split(sep);
    locations = locations.map((loc, index) => {
        return _.take(locations, locations.length - index).join(sep);
    });

    locations = locations.slice(0, Math.min(10, locations.length));

    const rootObservable = Observable.from(locations)
        .subscribeOn(Scheduler.queue)
        .map(loc => ({
            loc,
            files: filesToSearch.map(fileName => join(loc, fileName))
        }))
        .flatMap(function ({loc, files}) {
            logger.log(`Omni Project Candidates: Searching ${loc} for ${filesToSearch}`);

            return Observable.from<string>(files)
                .flatMap(file => glob([file], { cache: {} }))
                .map(x => {
                    if (x.length > 1) {
                        // Handle the unity project case
                        // Also handle optional solutions that may also exist with the unity ones.
                        const unitySolutionIndex = _.findIndex(x, z => _.endsWith(z, "-csharp.sln"));
                        if (unitySolutionIndex > -1) {
                            const unitySolution = x[unitySolutionIndex];
                            const baseSolution = unitySolution.substr(0, unitySolution.indexOf("-csharp.sln")) + ".sln";

                            const baseSolutionIndex = _.findIndex(x, z => z.toLowerCase() === baseSolution.toLowerCase());
                            if (baseSolutionIndex > -1) {
                                // Remove the index
                                x.splice(baseSolutionIndex, 1);
                            }
                        }
                    }
                    return x;
                });
        })
        .filter(z => z.length > 0)
        .defaultIfEmpty([])
        .first()
        .flatMap(z => z)
        .share();

    return rootObservable;
}
