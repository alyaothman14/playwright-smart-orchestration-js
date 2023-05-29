import * as fs from 'fs';

/**
 * Gets the execution time of a test and appends the result to a JSON file.
 * @param testInfo - Information about the test, including its title and duration.
 */

export function measureExecutionTime(testInfo): void {
    interface TestResult {
        test: string;
        executionTime: number;
    }
    // Check if the execution time measurement is enabled
    const isMeasureExecutionTime = process.env.MEASURE_EXECUTION_TIME === 'true';
    if (isMeasureExecutionTime) {
        const testResult = {
            test: testInfo.title,
            executionTime: testInfo.duration / 1000,
        };

        // Read the existing JSON file
        let jsonData: TestResult[] = [];
        let fileName = `test_execuction_results_${process.env.SHARD_INDEX}.json`

        if (fs.existsSync(fileName)) {
            const existingData = fs.readFileSync(fileName, 'utf8');
            jsonData = JSON.parse(existingData);
        }
        // Check if the test already exists in the JSON data
        const existingTestIndex = jsonData.findIndex(
            (entry) => entry.test === testResult.test
        );
        if (existingTestIndex !== -1) {
            // Update the execution time for the existing test
            jsonData[existingTestIndex].executionTime = testResult.executionTime;
        } else {
            // Add the new test result to the JSON array
            jsonData.push(testResult);
        }


        // Write the updated JSON data to the file
        fs.writeFileSync(fileName, JSON.stringify(jsonData, null, 2));

    }
}

