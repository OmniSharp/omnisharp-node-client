import _ = require('lodash');
import {ILogger} from './interfaces';
import {join, dirname, sep, normalize} from 'path';
import {Observable, AsyncSubject, Scheduler} from "rx";
var sepRegex = /[\\|\/]/g;
var glob: (file: string[]) => Observable<string[]> = <any> Observable.fromNodeCallback(require('globby'));
var solutionFilesToSearch = ['global.json', '*.sln'];
var projectFilesToSearch = ['project.json', '*.csproj'];
var scriptCsFilesToSearch = ['*.csx'];
var csharpFilesToSearch = ['*.cs'];

export function findCandidates(location: string, logger: ILogger) {
    location = _.trimRight(location, sep);

    var projects = Observable.merge(
        searchForCandidates(location, solutionFilesToSearch, logger),
        searchForCandidates(location, projectFilesToSearch, logger)
    )
        .map(z => z.split(sepRegex).join(sep))
        .toArray()
        .map(squashCandidates);

    var scriptCs = searchForCandidates(location, scriptCsFilesToSearch, logger)
        .map(z => z.split(sepRegex).join(sep))
        .toArray();

    var baseFiles = Observable.concat(projects, scriptCs)
        .flatMap(x => Observable.from(x))
        .shareReplay();

    return baseFiles.isEmpty()
        .flatMap(isEmpty => {
            if (isEmpty) {
                // Load csharp files as a fallback
                return searchForCandidates(location, csharpFilesToSearch, logger)
                    .map(z => z.split(sepRegex).join(sep));
            } else {
                return baseFiles;
            }
        })
        .distinct()
        .toArray()
        .tapOnNext(candidates => logger.log(`Omni Project Candidates: Found ${candidates}`));
}

function squashCandidates(candidates: string[]) {
    var rootCandidateCount = getMinCandidate(candidates);
    var r = _.unique(candidates.filter(z => z.split(sepRegex).length === rootCandidateCount))
    return r;
}

function getMinCandidate(candidates: string[]) {
    if (!candidates.length) return -1;

    return _.min(candidates, z => {
        return z.split(sepRegex).length;
    }).split(sepRegex).length;
}

function searchForCandidates(location: string, filesToSearch: string[], logger: ILogger) {
    var locations = location.split(sep);
    locations = locations.map((loc, index) => {
        return _.take(locations, locations.length - index).join(sep);
    });

    locations = locations.slice(0, Math.min(5, locations.length));

    var rootObservable = Observable.from(locations)
        .subscribeOn(Scheduler.timeout)
        .map(loc => ({
            loc,
            files: filesToSearch.map(fileName => join(loc, fileName))
        }))
        .flatMap(function({loc, files}) {
            logger.log(`Omni Project Candidates: Searching ${loc} for ${filesToSearch}`);

            return Observable.from(files)
                .flatMap(file => glob([file]))
                .map(x => {
                    if (x.length > 1) {
                        // Handle the unity project case
                        // Also handle optional solutions that may also exist with the unity ones.
                        var unitySolutionIndex = _.findIndex(x, z => _.endsWith(z, '-csharp.sln'));
                        if (unitySolutionIndex > -1) {
                            var unitySolution = x[unitySolutionIndex];
                            var baseSolution = unitySolution.substr(0, unitySolution.indexOf('-csharp.sln')) + '.sln';

                            var baseSolutionIndex = _.findIndex(x, x => x.toLowerCase() === baseSolution.toLowerCase());
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
        .flatMap(z => Observable.from(z))
        .map(file => _.endsWith(file, ".sln") ? file : dirname(file))
        .tapOnNext(x => console.log('hell!!!!', x));

    return rootObservable;
}
