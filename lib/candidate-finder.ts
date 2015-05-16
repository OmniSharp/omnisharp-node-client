import _ = require('lodash');
import {ILogger} from './drivers';
import {join, dirname, sep} from 'path';
import {Observable, AsyncSubject, Scheduler} from "rx";
var sepRegex = /[\\|\/]/g;
var glob: (file: string[]) => Observable<string[]> = <any> Observable.fromNodeCallback(require('globby'));
var projectFilesToSearch = ['global.json', '*.sln', 'project.json', '*.csproj'];
var scriptCsFilesToSearch = ['*.csx'];

export function findCandidates(location: string, logger: ILogger) {
    location = _.trimRight(location, sep);


    var candidates = searchForCandidates(location, projectFilesToSearch, logger);
    var scriptCsCandidates = searchForCandidates(location, scriptCsFilesToSearch, logger);
    return Observable.zip(candidates, scriptCsCandidates, (candidates, scriptCsCandidates) => {
        if (scriptCsCandidates.length && candidates.length) {
            if (getMinCandidate(candidates) >= getMinCandidate(scriptCsCandidates)) {
                candidates = candidates.concat(scriptCsCandidates);
                candidates = _.sortBy(candidates, z => z.split(sep).length);
            }
            scriptCsCandidates = [];
        }

        if (scriptCsCandidates.length)
            return scriptCsCandidates

        return candidates;
    });
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

    // TODO: Searching is expensive, should we control the max depth?
    // locations = _.take(locations, 5);

    var rootObservable = Observable.from(locations, x => x, Scheduler.timeout)
        .map(loc => ({
            loc,
            files: filesToSearch.map(fileName => join(loc, fileName))
        }))
        .flatMap(function({loc, files}) {
            logger.log(`Omni Project Candidates: Searching ${loc} for ${filesToSearch}`);
            return Observable.from(files, x => x, Scheduler.timeout)
                .flatMap(file => glob([file]))
                .selectMany(x => Observable.from(x))
                .map(file => dirname(file))
                .distinct()
        })
    // take the first result only.
        .take(1)
        .toArray();

    var result = rootObservable.map(candidates => {
        var rootCandidateCount = getMinCandidate(candidates);
        var r = _.unique(candidates.filter(z => z.split(sepRegex).length === rootCandidateCount))
            .map(z => z.split(sepRegex).join(sep));
        logger.log(`Omni Project Candidates: Found ${r}`);
        return r;
    });

    return result;
}
