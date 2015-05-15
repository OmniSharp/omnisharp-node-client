import _ = require('lodash');
import {ILogger} from './drivers';
import {join, dirname, sep} from 'path';
var sepRegex = /[\\|\/]/g;
var glob = require('glob');
var projectFilesToSearch = ['global.json', '*.sln', 'project.json', '*.csproj'];
var scriptCsFilesToSearch = ['*.csx'];

export function findCandidates(location: string, logger: ILogger) {
    location = _.trimRight(location, sep);

    var locations = location.split(sep);
    var mappedLocations = locations.map((loc, index) => {
        return _.take(locations, index + 1).join(sep);
    });

    mappedLocations.reverse();

    var candidates = searchForCandidates(mappedLocations, projectFilesToSearch, logger);
    console.log('candidates', candidates);

    var scriptCsCandidates = searchForCandidates(mappedLocations, scriptCsFilesToSearch, logger);
    console.log('scriptCsCandidates', scriptCsCandidates);
    if (scriptCsCandidates.length && candidates.length) {
        console.log('getMinCandidate(candidates)', getMinCandidate(candidates), 'getMinCandidate(scriptCsCandidates)', getMinCandidate(scriptCsCandidates));
        console.log('getMinCandidate(candidates) >= getMinCandidate(scriptCsCandidates)', getMinCandidate(candidates) >= getMinCandidate(scriptCsCandidates));
        if (getMinCandidate(candidates) >= getMinCandidate(scriptCsCandidates)) {
            candidates = candidates.concat(scriptCsCandidates);
            candidates = _.sortBy(candidates, z => z.split(sep).length);
        }
        scriptCsCandidates = [];
    }

    if (scriptCsCandidates.length)
        return scriptCsCandidates

    return candidates;
}

function getMinCandidate(candidates: string[]) {
    if (!candidates.length) return -1;

    return _.min(candidates, z => {
        return z.split(sepRegex).length;
    }).split(sepRegex).length;
}

function searchForCandidates(locations: string[], filesToSearch: string[], logger: ILogger) {
    var results = locations.map(location => ({
        location,
        files: filesToSearch.map(fileName => join(location, fileName))
    }));

    var candidates: string[] = [];

    if (locations.length) {
        // Take the most specific location, and then search inside it.
        var nestedResults = _(filesToSearch).chain()
            .map(fileName => join(locations[0], '**', fileName))
            .map(file => glob.sync(file) || [])
            .flatten()
            .map((z: string) => z.split(sepRegex).join(sep))
            .map((file: string) => dirname(file))
            .unique()
            .value();

        console.log('nestedResults', nestedResults)

        nestedResults.forEach(found => logger.log(`Omnisharp Candidate Finder: Found ${found}`));

        candidates.push(...nestedResults);
    }

    _.each(results, ({location, files}: { location: string; files: string[] }) => {
        logger.log(`Omnisharp Candidate Finder: Searching ${location} for ${filesToSearch}`);

        var found = _.find(files, file => {
            var g = glob.sync(file);
            if (g && g.length) {
                return true;
            }
            return false;
        });

        if (found) {
            candidates.push(dirname(found));
            logger.log(`Omnisharp Candidate Finder: Found ${found}`);
            return false;
        }
    });

    if (candidates.length) {
        var rootCandidateCount = getMinCandidate(candidates);
        return _.unique(candidates.filter(z => z.split(sep).length === rootCandidateCount));
    }

    return [];
}
