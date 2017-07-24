//! utils.js
//! version : 2.9.0
//! authors : Michael A.P. Domingues contributors
//! license : MIT

const finalReport = '../../../final-report/report.json';

function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', finalReport, true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
};

// Parses testing browsers from JSON
// 
function finalReportBrowsers(cb) {
  loadJSON(function(response) {
    // Parse JSON string into object
    var finalReport = JSON.parse(response);
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
  loadJSON(function(response) {
    // Parse JSON string into object
    var finalReport = JSON.parse(response);
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

// Parses tests coverage by state
// 
function finalReportTestsByState(cb) {
  loadJSON(function(response) {
    // Parse JSON string into object
    var finalReport = JSON.parse(response);
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
  loadJSON(function(response) {
    // Parse JSON string into object
    var finalReport = JSON.parse(response);
    cb(finalReport.testsWeatherState);
  });
}

// Parses total tests
//
function finalReportTotalTests(cb) {
  loadJSON(function(response) {
    // Parse JSON string into object
    var finalReport = JSON.parse(response);
    cb(finalReport.totalTests);
  });
}

// Parses total tests and total duration
// Provides average time
//
function finalReportAverageTime(cb) {
  loadJSON(function(response) {
    // Parse JSON string into object
    var finalReport = JSON.parse(response);
    var averageTime = Math.round(finalReport.totalDuration / finalReport.totalTests, 1);
    cb(averageTime);
  });
}
