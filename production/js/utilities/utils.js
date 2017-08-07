//! utils.js
//! version : 2.9.0
//! authors : Michael A.P. Domingues contributors
//! license : MIT

const finalReport = '../../../final-report/report.json';
const storageKey = 'reportData';

function storageReportDataAvailable() {
  return sessionStorage.getItem(storageKey) !== null;
}

function getStorageReportData() {
  return JSON.parse(sessionStorage.getItem(storageKey));
}

function loadReportData(cb) {
  getReportData(function(finalReport) {
    cb(true);
  });
};

function getReportData(callback) {
  if (!storageReportDataAvailable()) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', finalReport, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function() {
      if (xobj.readyState == 4 && xobj.status == "200") {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        var result = xobj.responseText;
        sessionStorage.setItem(storageKey, xobj.responseText);
        callback(JSON.parse(result));
      }
    };
    xobj.send(null);
  } else {
    var data = getStorageReportData();
    callback(data);
  };
};

// Parses testing browsers from JSON
// 
function finalReportBrowsers(cb) {
  getReportData(function(finalReport) {
    var result = {
      chartData: [],
      dataColors: []
    };
    const browsers = finalReport.browsers;
    for (var i = 0; i < browsers.length; i++) {
      result.chartData.push([browsers[i], 1]);
      result.dataColors.push(confs.colors[browsers[i]]);
    };
    cb(result);
  });
};

// Parses tests duration from JSON
// 
function finalReportTestsDuration(cb) {
  getReportData(function(finalReport) {
    var result = [];
    const testsPerBrowser = finalReport.testsPerBrowser;
    for (var browser in testsPerBrowser) {
      var browserData = {
        name: browser,
        color: confs.colors[browser],
        data: []
      };
      for (var j = 0; j < testsPerBrowser[browser].length; j++) {
        browserData.data.push([testsPerBrowser[browser][j].duration, j]);
      };
      result.push(browserData);
    };
    cb(result);
  });
};

// Parses suites coverage by state
// 
function finalReportSuitesByState(cb) {
  getReportData(function(finalReport) {
    var result = {
      categories: [],
      chartData: [],
      totalTests: 0
    };

    const testsPerSuitePerState = finalReport.testsPerSuitePerState;
    const testsStateCount = finalReport.testsState;
    var testsCountDispersion = {};
    for (var i = 0; i < testsStateCount.length; i++) {
      testsCountDispersion[testsStateCount[i].state] = {
        name: testsStateCount[i].state,
        data: []
      };
    };
    const suites = Object.keys(testsPerSuitePerState);
    result.categories = suites;
    for (var i = 0; i < suites.length; i++) {
      const testStates = Object.keys(testsPerSuitePerState[suites[i]]);
      for (var j = 0; j < testStates.length; j++) {
        const testState = testStates[j];
        testsCountDispersion[testState].name = testState;
        testsCountDispersion[testState].data.push(testsPerSuitePerState[suites[i]][testState]);
      }
    };
    for (var testState in testsCountDispersion) {
      result.chartData.push(testsCountDispersion[testState]);
    };
    cb(result);
  });
};

// Parses tests coverage by state
// 
function finalReportTestsByState(cb) {
  getReportData(function(finalReport) {
    var result = {
      chartData: [],
      totalTests: 0
    };
    const testsByState = finalReport.testsState;
    for (var i = 0; i < testsByState.length; i++) {
      const testSate = testsByState[i];
      var elem = {
        name: testSate.state,
        data: [testSate.total],
        color: confs.colors[testSate.state.toLowerCase()]
      };
      result.chartData.push(elem);
      result.totalTests += testSate.total;
    };
    cb(result);
  });
};

// Parses weather condition
//
function finalReportWeatherState(cb) {
  getReportData(function(finalReport) {
    cb(finalReport.testsWeatherState);
  });
};

// Parses testing environment
//
function finalReportTestingEnvironment(cb) {
  getReportData(function(finalReport) {
    cb(finalReport.environment);
  });
};

// Parses total suites
//
function finalReportTotalSuites(cb) {
  getReportData(function(finalReport) {
    cb(finalReport.numberOfTestSuites);
  });
};


// Parses total tests
//
function finalReportTotalTests(cb) {
  getReportData(function(finalReport) {
    cb(finalReport.totalTests);
  });
};

// Parses total tests and total duration
// Provides average time
//
function finalReportAverageTime(cb) {
  getReportData(function(finalReport) {
    var averageTime = Math.round(finalReport.totalDuration / finalReport.totalTests, 1);
    cb(averageTime);
  });
};

// Parses tests suites and total duration
//
function finalReportTableSuitesDeffects(cb, browser) {
  getReportData(function(finalReport) {
    var reportData = {
      columns: [{
        title: 'Test suite'
      }, {
        title: 'Duration'
      }, {
        title: 'State'
      }],
      tableData: []
    };
    if (browser in finalReport.testsPerBrowser) {
      const testSuites = finalReport.testsPerBrowser[browser];
      for (var i = 0; i < testSuites.length; i++) {
        const state = testSuites[i].state;
        const data = [testSuites[i].testSuite, testSuites[i].duration, testSuites[i].state];
        if (state !== 'Passed') {
          reportData.tableData.push(data);
        };
      };
    };
    cb(reportData);
  });
};


// Parses total tests cases and total duration
//
function finalReportTableCasesDeffects(cb, browser) {
  getReportData(function(finalReport) {
    var reportData = {
      columns: [{
        title: 'Test suite'
      }, {
        title: 'Test case'
      }, {
        title: 'Duration'
      }, {
        title: 'State'
      }],
      tableData: []
    };
    if (browser in finalReport.testsPerBrowser) {
      const testCases = finalReport.testsPerBrowser[browser];
      for (var i = 0; i < testCases.length; i++) {
        const state = testCases[i].state;
        const data = [testCases[i].testSuite, testCases[i].testCase, testCases[i].duration, testCases[i].state];
        if (state !== 'Passed') {
          reportData.tableData.push(data);
        };
      };
    };
    cb(reportData);
  });
};

// Parses test details per browser
// 
function finalReportTestDetailsPerBrowser(cb, colors) {
  getReportData(function(finalReport) {
    var reportData = {
      categories: [],
      chartData: []
    };
    reportData.categories = finalReport.browsers;
    var testsPerBrowserPerState = finalReport.testsPerBrowserPerState;

    for (var browser in testsPerBrowserPerState) {
      const browserTestStats = testsPerBrowserPerState[browser];
      const testStates = Object.keys(browserTestStats);
      var testStateCounts = [];
      var total = 0;
      for (var i = 0; i < testStates.length; i++) {
        const testCount = browserTestStats[testStates[i]];
        testStateCounts.push({
          y: testCount,
          color: colors[testStates[i].toLowerCase()]
        });
        total += testCount;
      };
      var elem = {
        y: total,
        color: colors[browser],
        drilldown: {
          name: browser,
          categories: testStates,
          data: testStateCounts
        }
      };
      reportData.chartData.push(elem);
    };
    cb(reportData);
  });
};
