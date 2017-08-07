const _ = require('lodash');
const fs = require('fs');
const setdefault = require('setdefault')
const jsonfile = require('jsonfile')
var Enum = require('enum');
require('console2')();

class Metriquer {
  constructor() {
    this._reports = './report-results';
    this._finalReport = './final-report/report.json';
    this._numberOfTestSuites = 0;
    this._numberOfTests = 0;
    this._numberOfPassedTests = 0;
    this._numberOfSkippedTests = 0;
    this._numberOfFailedTests = 0;
    this._totalDuration = 0;
    this._browsers = [];
    this._testsPerBrowser = {};
    this._testsCountPerBrowserPerState = {};
    this._testsCountPerSuitePerState = {};

    // Restricted to Skycons compatibility 
    this._testWeatherState = new Enum({
      'SUNNY': 'SUN',
      'CLOUDY': 'CLOUDY',
      'RAIN': 'RAIN',
      'SNOW': 'SNOW'
    });
  }

  // Maps test state conditions to a standard one
  //
  standardTestState(state) {
    const stateLC = state.toLowerCase();
    var result;
    switch (stateLC) {
      case 'pass':
      case 'passed':
        result = 'Passed';
        break;
      case 'fail':
      case 'failed':
        result = 'Failed';
        break;
      case '':
      case 'skip':
      case 'skipped':
        result = 'Skipped';
        break;
      default:
        result = undefined;
        break;
    };
    return result;
  }

  // Loops through all files in path dir
  //
  parseReports(path) {
    fs.readdir(this._reports, (err, items) => {
      for (var i = 0; i < items.length; i++) {
        const fileContent = JSON.parse(fs.readFileSync(this._reports + '/' + items[i], 'utf8'));
        this.parseJSON(fileContent);
      };
      this.generateFinalReport();
    });
  }

  // Parse each report JSON into the Metriquer report manager
  //
  parseJSON(fileContent) {
    //  Capabilities 
    var browserName = fileContent.capabilities.browserName;

    // Save browser
    this.pushUsedBrowsers(browserName);

    var suites = fileContent.suites;
    if (suites.length !== 0) {
      // Increment number of test suites
      this.incTestSuites(browserName);
    }

    _.each(suites, (suite) => {
      const suiteName = suite.name;
      const suiteDuration = suite.duration;
      const testCases = suite.tests;

      _.each(testCases, (testCase) => {
        const testCaseName = testCase.name;
        const testCaseDuration = testCase.duration;
        const testCaseState = testCase.state;

        // Increment number of tests by browser and by test state
        this.incTestsByBrowserByState(testCaseState, browserName, suiteName);

        // Increment number of tests per browser per state 
        this.incTestsByBrowserByState(testCaseState, browserName, suiteName);

        // Increment global execution duration
        this.incExecutionDuration(testCaseDuration);

        const testCaseDescription = {
          testSuite: suiteName,
          testCase: testCaseName,
          duration: testCaseDuration,
          state: this.standardTestState(testCaseState)
        };
        // Set test case description
        this.pushTestByBrowser(browserName, testCaseDescription);
      });
    });
  }

  // Increments the number of tests per browser and per type of test.
  // 
  incTestsByBrowserByState(state, browser, suite) {
    state = this.standardTestState(state);
    setdefault(this._testsCountPerBrowserPerState, browser, {});
    setdefault(this._testsCountPerBrowserPerState[browser], state, 0);
    setdefault(this._testsCountPerSuitePerState, suite, {});
    setdefault(this._testsCountPerSuitePerState[suite], state, 0);
    switch (state) {
      case "Passed":
        this._numberOfPassedTests += 1;
        this._numberOfTests += 1;
        this._testsCountPerBrowserPerState[browser][state] += 1;
        this._testsCountPerSuitePerState[suite][state] += 1;
        break;
      case "Failed":
        this._numberOfFailedTests += 1;
        this._numberOfTests += 1;
        this._testsCountPerBrowserPerState[browser][state] += 1;
        this._testsCountPerSuitePerState[suite][state] += 1;
        break;
      case "Skipped":
        this._numberOfSkippedTests += 1;
        this._numberOfTests += 1;
        this._testsCountPerBrowserPerState[browser][state] += 1;
        this._testsCountPerSuitePerState[suite][state] += 1;
        break;
      default:
        this._numberOfSkippedTests += 1;
        this._numberOfTests += 1;
        this._testsCountPerBrowserPerState[browser]['Skipped'] += 1;
        this._testsCountPerSuitePerState[suite]['Skipped'] += 1;
    };
  }

  // Parse reports
  // 
  incTestSuites() {
    this._numberOfTestSuites += 1;
  }

  // Increments total duration
  // 
  incExecutionDuration(testDuration) {

    this._totalDuration += testDuration;
  }

  // Sets used _browsers.
  // 
  pushUsedBrowsers(browser) {
    setdefault(this._browsers, browser, []).push(browser);
  }

  // Increments the number of test suites
  // 
  pushTestByBrowser(browser, testDescription) {
    setdefault(this._testsPerBrowser, browser, []).push(testDescription);
  }

  // Get browsers for running suite
  // 
  get browsers() {
    return _.keys(this._testsPerBrowser);
  }

  // Get current tests weather state
  // 
  get weatherState() {
    if (this._numberOfPassedTests === 0) {
      return this._testWeatherState.STORM.value;
    } else if (this._numberOfPassedTests > 0 && this._numberOfFailedTests > 0) {
      return this._testWeatherState.RAIN.value;
    } else if (this._numberOfPassedTests > 0 && this._numberOfSkippedTests > 0) {
      return this._testWeatherState.CLOUDY.value;
    } else {
      return this._testWeatherState.SUNNY.value;
    };
  }

  // Generate report to JSON
  //
  generateFinalReport() {
    const obj = {
      environment: "Dev",
      numberOfTestSuites: this._numberOfTestSuites,
      totalTests: this._numberOfTests,
      browsers: this.browsers,
      testsState: [{
        state: this.standardTestState('Passed'),
        total: this._numberOfPassedTests
      }, {
        state: this.standardTestState('Failed'),
        total: this._numberOfFailedTests
      }, {
        state: this.standardTestState('Skipped'),
        total: this._numberOfSkippedTests

      }],
      testsPerBrowserPerState: this._testsCountPerBrowserPerState,
      testsPerSuitePerState: this._testsCountPerSuitePerState,
      testsWeatherState: this.weatherState,
      totalDuration: this._totalDuration,
      testsPerBrowser: this._testsPerBrowser
    };

    jsonfile.writeFile(this._finalReport, obj, {
      spaces: 2
    }, function(err) {
      if (err !== null) {
        console.error('Error saving JSON to file:', err)
      }
    });
  }
}

//  Sets the Metriquer object to module.exports
// 
module.exports = Metriquer;
