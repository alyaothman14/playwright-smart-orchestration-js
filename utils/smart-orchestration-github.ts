import * as fs from 'fs';
/**
 * Performs smart orchestration of tests based on their execution times.
 * @param shard - The shard number for which to allocate tests.
 * @returns A string containing the test names allocated to the specified shard, separated by '|'.
 */

interface TestResult {
    test: string;
    executionTime: number;
}

interface TestCategories {
    slow: string[];
    medium: string[];
    fast: string[];
}
const SLOW_TEST_THRESHOLD = 40
const MEDIUM_TEST_THRESHOLD = 20

function smartOrchestrationGitHub(shard: number): string {
    // Read the JSON file with test results
    const results = JSON.parse(fs.readFileSync('test_execuction_results.json', 'utf-8')) as TestResult[];

    // Group tests into categories (slow, medium, fast)
    const testCategories: TestCategories = {
        slow: [],
        medium: [],
        fast: []
    };

    // Categorize tests based on their execution times
    for (const result of results) {
        const { test, executionTime } = result;
        if (executionTime >= SLOW_TEST_THRESHOLD) {
            testCategories.slow.push(test);
        } else if (executionTime >= MEDIUM_TEST_THRESHOLD) {
            testCategories.medium.push(test);
        } else {
            testCategories.fast.push(test);
        }
    }

    // Calculate the number of test shards and total number of tests
    // Default value is for debugging purpose
    const numShards = parseInt(process.env.SHARD_TOTAL || '3', 10);

    // Calculate the number of slow tests per shard and the remaining slow tests
    const slowTestsPerShard = Math.floor(testCategories.slow.length / numShards);
    const remainingSlowTests = testCategories.slow.length % numShards;

    // Calculate the number of medium tests per shard and the remaining medium tests
    const mediumTestsPerShard = Math.floor(testCategories.medium.length / numShards);
    const remainingMediumTests = testCategories.medium.length % numShards;

    // Calculate the number of fast tests per shard and the remaining fast tests
    const fastTestsPerShard = Math.floor(testCategories.fast.length / numShards);
    const remainingFastTests = testCategories.fast.length % numShards;

    // Allocate slow tests to shards
    let slowTestsAllocated: string[] = [];
    if (shard <= remainingSlowTests) {
        const startIndex = (shard - 1) * (slowTestsPerShard + 1);
        slowTestsAllocated = testCategories.slow.slice(startIndex, startIndex + slowTestsPerShard + 1);
    } else {
        const startIndex =
            remainingSlowTests * (slowTestsPerShard + 1) + (shard - remainingSlowTests - 1) * slowTestsPerShard;
        slowTestsAllocated = testCategories.slow.slice(startIndex, startIndex + slowTestsPerShard);
    }

    // Allocate medium tests to shards
    let mediumTestsAllocated: string[] = [];
    if (shard <= remainingMediumTests) {
        const startIndex = (shard - 1) * (mediumTestsPerShard + 1);
        mediumTestsAllocated = testCategories.medium.slice(startIndex, startIndex + mediumTestsPerShard + 1);
    } else {
        const startIndex =
            remainingMediumTests * (mediumTestsPerShard + 1) + (shard - remainingMediumTests - 1) * mediumTestsPerShard;
        mediumTestsAllocated = testCategories.medium.slice(startIndex, startIndex + mediumTestsPerShard);
    }

    // Allocate fast tests to shards
    let fastTestsAllocated: string[] = [];
    if (shard <= remainingFastTests) {
        const startIndex = (shard - 1) * (fastTestsPerShard + 1);
        fastTestsAllocated = testCategories.fast.slice(startIndex, startIndex + fastTestsPerShard + 1);
    } else {
        const startIndex =
            remainingFastTests * (fastTestsPerShard + 1) + (shard - remainingFastTests - 1) * fastTestsPerShard;
        fastTestsAllocated = testCategories.fast.slice(startIndex, startIndex + fastTestsPerShard);
    }

    // Combine allocated tests from all categories
    const testsAllocated = [...slowTestsAllocated, ...mediumTestsAllocated, ...fastTestsAllocated];

    // Return the test names with '|' delimiter
    return testsAllocated.join('|');
}

const shard = parseInt(process.argv[2], 10);
const testNames = smartOrchestrationGitHub(shard);
console.log(testNames);
