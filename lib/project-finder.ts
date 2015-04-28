import _ = require('lodash');
import {join, dirname, sep} from 'path';
var glob = require('glob');
var filesToSearch = ['global.json', '*.sln', 'project.json', '*.csproj'];

export function findProject(location: string) {
    location = _.trimRight(location, sep);

    var locations = location.split(sep);
    var mappedLocations = locations.map((loc, index) => {
        return _.take(locations, index + 1).join(sep);
    });

    mappedLocations.reverse();

    var results = _.flatten(
        filesToSearch.map(x =>
            mappedLocations.map(z => join(z, x))));

    var foundFile = _(results).chain().map(file => {
        var g = glob.sync(file);
        if (g && g.length) {
            return g[0];
        }
        return false;
    }).find(z => !!z).value();

    return dirname(foundFile);
}
