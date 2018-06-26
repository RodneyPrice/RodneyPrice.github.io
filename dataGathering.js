/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global window, FileReader, File */

function readSets() {
    "use strict";
    var reader = new FileReader();
    var stuff = new File([], "all1v1sets.txt")
    var rawSets = reader.readAsText(stuff.slice(0));
    window.console.log(rawSets, stuff);
}

readSets();