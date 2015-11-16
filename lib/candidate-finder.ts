import * as _ from "lodash";
import {ILogger} from "./interfaces";
import {join, dirname, sep, normalize} from "path";
import {CompositeDisposable} from "./helpers/Disposable";
import {Observable, Scheduler, Subscriber} from "@reactivex/rxjs";
import {readFileSync} from "fs";
const glob: (file: string[]) => Promise<string[]> = require("globby");

export interface Options {
    solutionFilesToSearch?: string[];
    projectFilesToSearch?: string[];
    sourceFilesToSearch?: string[];
    solutionIndependentSourceFilesToSearch?: string[];
}

export function ifEmpty<T>(observable: Observable<T>, other: Observable<T>): Observable<T> {
    return Observable.create((subscriber: Subscriber<T>) => {
        let hasValue = false;
        const cd = new CompositeDisposable();
        cd.add(observable.subscribe(
            value => {
                hasValue = true;
                subscriber.next(value);
            },
            e => subscriber.error(e),
            () => {
                if (!hasValue) {
                    cd.add(other.subscribe(subscriber));
                } else {
                    subscriber.complete();
                }
            }
        ));
        return cd;
    });
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

export const findCandidates = (function() {
    function realFindCandidates(location: string, logger: ILogger, options: Options = {}) {
        location = _.trimRight(location, sep);

        const solutionFilesToSearch = options.solutionFilesToSearch || (options.solutionFilesToSearch = ["global.json", "*.sln"]);
        const projectFilesToSearch = options.projectFilesToSearch || (options.projectFilesToSearch = ["project.json", "*.csproj"]);
        const sourceFilesToSearch = options.sourceFilesToSearch || (options.sourceFilesToSearch = ["*.cs"]);
        const solutionIndependentSourceFilesToSearch = options.solutionIndependentSourceFilesToSearch || (options.solutionIndependentSourceFilesToSearch = ["*.csx"]);

        const solutionsOrProjects = searchForCandidates(location, solutionFilesToSearch, projectFilesToSearch, logger)
            .toArray()
            .flatMap(result => result.length ? Observable.from(result) : searchForCandidates(location, projectFilesToSearch, [], logger))
            .toArray()
            .map(squashCandidates);

        const independentSourceFiles = searchForCandidates(location, solutionIndependentSourceFilesToSearch, [], logger)
            .toArray();

        const baseFiles = Observable.concat(solutionsOrProjects, independentSourceFiles)
            .flatMap(x => Observable.from(x));

        const sourceFiles = searchForCandidates(location, sourceFilesToSearch, [], logger);

        const predicate = (path: string) => _.any(solutionFilesToSearch.concat(projectFilesToSearch), pattern => _.endsWith(path, _.trimLeft(pattern, "*")));

        return ifEmpty(baseFiles, sourceFiles)
            .map(file => new Candidate(file, predicate))
            .distinctUntilChanged((x, y) => y.path === x.path)
            .toArray()
            .do(candidates => logger.log(`Omni Project Candidates: Found ${candidates}`));
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
    return _.unique(_.filter(_.map(candidates, normalize), z => z.split(sep).length === rootCandidateCount));
}

function getMinCandidate(candidates: string[]) {
    if (!candidates.length) return -1;

    return _.min(_.map(candidates, normalize), z => z.split(sep).length).split(sep).length;
}

function searchForCandidates(location: string, filesToSearch: string[], projectFilesToSearch: string[], logger: ILogger) {
    let locations = location.split(sep);
    locations = locations.map((loc, index) => {
        return _.take(locations, locations.length - index).join(sep);
    });

    locations = locations.slice(0, Math.min(5, locations.length));

    const rootObservable = Observable.from(locations)
        .subscribeOn(Scheduler.nextTick)
        .map(loc => ({
            loc,
            files: filesToSearch.map(fileName => join(loc, fileName))
        }))
        .do(({loc}) => logger.log(`Omni Project Candidates: Searching ${loc} for ${filesToSearch}`))
        .flatMap(({files}) => Observable.from(files) // Is this inference a TS bug or declarations bug?
            .flatMap(file => glob([file]))
            .map(x => { // Is this inference a TS bug or declarations bug?
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

                if (_.any(x, file => _.endsWith(file, ".sln"))) {
                    return x.filter(file => {
                        const content = readFileSync(file).toString();
                        return _.any(projectFilesToSearch, path => content.indexOf(_.trimLeft(path, "*")) > -1);
                    });
                }

                return x;
            }))
        .filter(z => z.length > 0)
        .defaultIfEmpty(<string[]>[])
        .first()
        .flatMap(z => Observable.from(z));

    return rootObservable;
}
