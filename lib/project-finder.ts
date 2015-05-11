import _ = require('lodash');
import {join, dirname, sep} from 'path';
var glob = require('glob');
var primaryFilesToSearch = ['global.json', '*.sln', '*.csx'];
var secondaryFilesToSearch = ['project.json', '*.csproj'];

export function findProject(location: string) {
    location = _.trimRight(location, sep);

    var locations = location.split(sep);
    var mappedLocations = locations.map((loc, index) => {
        return _.take(locations, index + 1).join(sep);
    });

    mappedLocations.reverse();

    var primaryResult = searchForFolder(mappedLocations, primaryFilesToSearch);
    if (primaryResult) {
        return primaryResult;
    }

    var secondaryResult = searchForFolder(mappedLocations, secondaryFilesToSearch);
    if (secondaryResult) {
        return secondaryResult;
    }

    return null;
}

function searchForFolder(locations: string[], filesToSearch: string[]) {
    var foundFile: string;
    var results = locations.map(location => ({
        location,
        files: filesToSearch.map(fileName => join(location, fileName))
    }));

    _.each(results, ({location, files} : { location: string; files: string[] }) => {
        console.log(`Omnisharp Client: Searching ${location} for ${filesToSearch}.`);

        var found = _.find(files, file => {
            var g = glob.sync(file);
            if (g && g.length) {
                return true;
            }
            return false;
        });

        if (found) {
            foundFile = found;
            console.log(`Omnisharp Client: Found ${found}.`);
            return false;
        }
    });

    if (foundFile) {
        return dirname(foundFile);
    }
}
