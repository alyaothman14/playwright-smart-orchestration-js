# Playwright Smart Orchestration

This repository contains an implementation of Playwright Smart Orchestration, which addresses the issue of uneven load distribution and optimizes test execution in Playwright.

## Problem

By default, Playwright runs all tests in alphabetical order, leading to an uneven distribution of load across GitHub workers. This can result in longer test execution times, slower build durations, and resource wastage.

## Solution

To tackle this problem, I have implemented a smart orchestration mechanism that ensures even distribution of the workload and improves test execution efficiency ensuring that we parallelize on test level and not spec level. The implementation involves two key components:

1. Measure Execution: Introduced a measure execution mechanism that collects the runtime data for each test when changes occur in the test folder. This data provides insights into the performance characteristics of the test suite.

2. Smart Orchestration: Implemented a smart orchestration algorithm that distributes slow tests (taking more than 30 seconds) across multiple workers. This helps balance the workload and allocate tests strategically, resulting in optimized test execution.

3. In Github action workflow, run measure execution if any changes are detected in the /tests folder and update the test_execuction_results.json

## Repo Details

The use of smart orchestration could be found in the github workflow
- Improved load balancing and even distribution of test execution time.
- Implemented measure execution to collect runtime data for each test.
- Added smart orchestration to allocate slow tests efficiently across workers.


## Test Results
To compare between using orchestration and letting PW run I have done the following
- Used the testcases from todo and created a copy of them with different name
- Added random wait in testcases to simulate slow running test
- In github run run both method
## See in action

To utilize this implementation of Playwright Smart Orchestration, follow these steps:

1. Clone the repository: `git clone https://github.com/alyaothman14/playwright-smart-orchestration-js.git`
2. Install dependencies: `npm install`
3. Create a PR that adds more test, you can add page.waitForTimeout to change the speed of the each test execution
4. Watch the github run and compare between the smart-orchestration job and no-orchestration to see the difference in the time

## Contribution

Contributions to this project are welcome! If you have any suggestions, bug reports, or feature requests, please create an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

