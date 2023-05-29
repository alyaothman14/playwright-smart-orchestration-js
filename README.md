# Playwright Smart Orchestration

This repository contains an implementation of Playwright Smart Orchestration, which addresses the issue of uneven load distribution and optimizes test execution in Playwright.

## Problem

By default, Playwright runs all tests in alphabetical order, leading to an uneven distribution of load across GitHub workers. This can result in longer test execution times, slower build durations, and resource wastage.

## Solution

To tackle this problem, I have implemented a smart orchestration mechanism that ensures even distribution of the workload and improves test execution efficiency ensuring that we parallelize on test level and not spec level. The implementation involves two key components:

1. Measure Execution: Introduced a measure execution mechanism that collects the runtime data for each test when changes occur in the test folder. This data provides insights into the performance characteristics of the test suite.

2. Smart Orchestration: Implemented a smart orchestration algorithm that distributes slow tests (taking more than 40 seconds), medium test (taking more than 20 sec) and fast test across multiple workers. This helps balance the workload and allocate tests strategically, resulting in optimized test execution.

3. In Github action workflow, run measure execution if any changes are detected in the /tests folder and update the test_execution_results.json. In the workflow you will see the test run with smart orchestration vs letting playwright run the testcases


## Test Results
To provide a comprehensive comparison, I designed a set of test cases using Playwright's default initialization for the Todo MVC application. These test cases were duplicated with different spec names to demonstrate Playwright's alphabetical test execution behavior. To further emulate real-world scenarios, I incorporated wait times ranging from 5 to 60 seconds in select tests, representing various levels of test case speed.

In addition, I configured two distinct jobs: one utilizing the smart orchestration feature and another running the tests using PW default behaviour. This setup allows for a clear examination of the benefits and differences between the two execution approaches.

Using 4 shards we have saved 1 min and 2 seconds with equal distribution across the shards, all shards running at around 4 mins while for pw there is one shard that takes 1m 45sec and another than takes 5m 22s

Using 3 shards
The test cases were evenly distributed in the smart_orchestration job compared to the default job where Playwright determined the execution order. Furthermore, a total of 1 minute and 36 seconds were saved in the overall build time.

##GOTCHA
Each testcases MUST have a unique title otherwise -grep option will grep all matching testcases

## See in action

To utilize this implementation of Playwright Smart Orchestration, follow these steps:

1. Clone the repository: `git clone https://github.com/alyaothman14/playwright-smart-orchestration-js.git`
2. Install dependencies: `npm install`
3. Create a PR that adds more test, you can add page.waitForTimeout to change the speed of each test execution
4. Watch the github run and compare between the smart-orchestration job and no-orchestration to see the difference in the time

## Contribution

Contributions to this project are welcome! If you have any suggestions, bug reports, or feature requests, please create an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

