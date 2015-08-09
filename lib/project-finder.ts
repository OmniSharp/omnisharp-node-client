import _ = require('lodash');
import {ILogger} from './interfaces';
import {join, dirname, sep, normalize} from 'path';
var glob = require('glob');
var primaryFilesToSearch = ['global.json', '*.sln', '*.csx'];
var secondaryFilesToSearch = ['project.json', '*.csproj', '*.cs'];

export function findProject(location: string, logger: ILogger) {
    location = _.trimRight(location, sep);

    var locations = location.split(sep);
    var mappedLocations = locations.map((loc, index) => {
        return _.take(locations, index + 1).join(sep);
    });

    mappedLocations.reverse();

    var primaryResult = searchForFolder(mappedLocations, primaryFilesToSearch, logger);
    if (primaryResult) {
        return primaryResult;
    }

    var secondaryResult = searchForFolder(mappedLocations, secondaryFilesToSearch, logger);
    if (secondaryResult) {
        return secondaryResult;
    }

    return null;
}

function searchForFolder(locations: string[], filesToSearch: string[], logger: ILogger) {
    var foundFiles: string[];

    var foundFiles = _(locations)
    .map(location => ({
        location,
        files: filesToSearch.map(fileName => join(location, fileName))
    }))
    .map(({location, files}) => {
        logger.log(`Omnisharp Project Finder: Searching ${location} for ${filesToSearch}`);

        return _(files).map(file => {
            var g : string[] = glob.sync(file);
            if (g && g.length) {
                return g;
            }
            return [];
        })
        .filter(x => x && x.length)
        .first();
    })
    .filter(x => x && x.length)
    .tap(x => logger.log(`Omnisharp Project Finder: Found ${x}`))
    .first();

    if (foundFiles) {
        if (_.any(foundFiles, x => _.endsWith(x, '.sln')))
            return normalize(foundFiles[0]);
        if (foundFiles.length === 1)
            return normalize(dirname(foundFiles[0]));
        // WTH JUST HAPPENED!
    }
}
