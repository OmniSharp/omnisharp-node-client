import _ = require('lodash');
import {ILogger} from './drivers';
import {join, dirname, sep} from 'path';
var glob = require('glob');
var primaryFilesToSearch = ['global.json', '*.sln', '*.csx'];
var secondaryFilesToSearch = ['project.json', '*.csproj'];

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
    var foundFile: string;
    var results = locations.map(location => ({
        location,
        files: filesToSearch.map(fileName => join(location, fileName))
    }));

    _.each(results, ({location, files} : { location: string; files: string[] }) => {
        logger.log(`Omnisharp Project Finder: Searching ${location} for ${filesToSearch}`);

        var found = _.find(files, file => {
            var g = glob.sync(file);
            if (g && g.length) {
                return true;
            }
            return false;
        });

        if (found) {
            foundFile = found;
            logger.log(`Omnisharp Project Finder: Found ${found}`);
            return false;
        }
    });

    if (foundFile) {
        return dirname(foundFile);
    }
}
