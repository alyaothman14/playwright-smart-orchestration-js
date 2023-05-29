"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function smartOrchestrationGitHub(shard) {
    // Read the JSON file with test results
    var results = JSON.parse(fs.readFileSync('test_results.json', 'utf-8'));
    // Sort the results based on execution time in ascending order
    var sortedResults = results.sort(function (a, b) { return a.execution_time - b.execution_time; });
    // Group tests into categories (slow and medium)
    var testCategories = {
        slow: [],
        medium: []
    };
    for (var _i = 0, sortedResults_1 = sortedResults; _i < sortedResults_1.length; _i++) {
        var result = sortedResults_1[_i];
        var test = result.test, execution_time = result.execution_time;
        if (execution_time >= 30) {
            testCategories.slow.push(test);
        }
        else {
            testCategories.medium.push(test);
        }
    }
    // Calculate the number of test shards and total number of tests
    var numShards = parseInt(process.env.SHARD_TOTAL || '3', 10);
    var totalTests = sortedResults.length;
    // Calculate the number of slow tests per shard and the remaining slow tests
    var slowTestsPerShard = Math.floor(testCategories.slow.length / numShards);
    var remainingSlowTests = testCategories.slow.length % numShards;
    // Calculate the number of medium tests per shard and the remaining medium tests
    var mediumTestsPerShard = Math.floor(testCategories.medium.length / numShards);
    var remainingMediumTests = testCategories.medium.length % numShards;
    // Allocate slow tests to shards
    var slowTestsAllocated = [];
    if (shard <= remainingSlowTests) {
        var startIndex = (shard - 1) * (slowTestsPerShard + 1);
        slowTestsAllocated = testCategories.slow.slice(startIndex, startIndex + slowTestsPerShard + 1);
    }
    else {
        var startIndex = remainingSlowTests * (slowTestsPerShard + 1) + (shard - remainingSlowTests - 1) * slowTestsPerShard;
        slowTestsAllocated = testCategories.slow.slice(startIndex, startIndex + slowTestsPerShard);
    }
    // Allocate medium tests to shards
    var mediumTestsAllocated = [];
    if (shard <= remainingMediumTests) {
        var startIndex = (shard - 1) * (mediumTestsPerShard + 1);
        mediumTestsAllocated = testCategories.medium.slice(startIndex, startIndex + mediumTestsPerShard + 1);
    }
    else {
        var startIndex = remainingMediumTests * (mediumTestsPerShard + 1) + (shard - remainingMediumTests - 1) * mediumTestsPerShard;
        mediumTestsAllocated = testCategories.medium.slice(startIndex, startIndex + mediumTestsPerShard);
    }
    // Combine allocated tests from both categories
    var testsAllocated = __spreadArray(__spreadArray([], slowTestsAllocated, true), mediumTestsAllocated, true);
    // Return the test names with '|' delimiter
    return testsAllocated.join('|');
}
var shard = parseInt(process.argv[2], 10);
var testNames = smartOrchestrationGitHub(shard);
console.log(testNames);
