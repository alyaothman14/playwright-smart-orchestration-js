import * as fs from 'fs';

interface TestResult {
    test: string;
    execution_time: number;
}

interface TestCategories {
    slow: string[];
    medium: string[];
    fast: string[];
}

function smartOrchestrationGitHub(shard: number): string {
    // Read the JSON file with test results
    const results = JSON.parse(fs.readFileSync('test_results.json', 'utf-8')) as TestResult[];

    // Sort the results based on execution time in descending order
    const sortedResults = results.sort((a, b) => b.execution_time - a.execution_time);

    // Group tests into categories (fast, medium, slow)
    const testCategories: TestCategories = {
        slow: [],
        medium: [],
        fast: [],
    };
    for (const result of sortedResults) {
        const { test, execution_time } = result;
        if (execution_time >= 30) {
            testCategories.slow.push(test);
        } else {
            testCategories.medium.push(test);
        }
    }

    const numShards = parseInt(process.env.TOTAL_SHARDS || '2', 10); // Assuming 2 shards for this example
    const totalTests = sortedResults.length;
    const testsPerShard = Math.ceil(totalTests / numShards);
    const testsPerCategory = Math.ceil(testsPerShard / 3);

    // Allocate the slow tests
    const slowTests = testCategories.slow;
    const startSlowIndex = (shard - 1) * testsPerCategory;
    const endSlowIndex = Math.min(startSlowIndex + testsPerCategory, slowTests.length);
    const slowTestsAllocated = slowTests.slice(startSlowIndex, endSlowIndex);

    // Calculate the remaining tests needed per shard
    const remainingTestsPerShard = testsPerShard - slowTestsAllocated.length;

    // Allocate additional tests from medium category if needed
    const mediumTests = testCategories.medium;
    const startMediumIndex = (shard - 1) * testsPerCategory;
    const endMediumIndex = Math.min(startMediumIndex + remainingTestsPerShard, mediumTests.length);
    const additionalMediumTests = mediumTests.slice(startMediumIndex, endMediumIndex);
    slowTestsAllocated.push(...additionalMediumTests);

    // Return the test names as a space-separated string
    return slowTestsAllocated.join(' or ');
}

const shard = parseInt(process.argv[2], 10);
const testNames = smartOrchestrationGitHub(shard);
console.log(testNames);