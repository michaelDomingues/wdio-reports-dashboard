# Automation Reporter  

Automation reporter proposes a central way to display end to end results from automation frameworks.
It uses the core reports to produce an unique one with several *KPIs* that are shown in the dashboard.

For the dashboard itself it's used the Gentella template (developed by [Colorlib](https://colorlib.com/ "Colorlib - Make Your First Blog")), customized for the goals of the *Automation Reporter* project. This template uses the default Bootstrap 3 styles along with a variety of powerful jQuery plugins and tools to create a powerful framework for creating admin panels or back-end dashboards.

Theme uses several libraries for charts, calendar, form validation, wizard style interface, off-canvas navigation menu, text forms, date range, upload area, form autocomplete, range slider, progress bars, notifications and much more.


## Gentella

The source code is available at **[Github](https://github.com/puikinsh/gentelella)**.

## Automation frameworks reports support

Right now this is the list of framework reports supported:

* [Webdriver.io](http://webdriver.io) 

More to be added in the future.

## Requirements

In order to use this project and integrate the report data into the dashboard, it's important to:

* Generate the automation frameworks reports to **JSON** output.
* Place those into `report-results`.


The aggregated report is pushed into the `final-report` directory, which the dashboard will read from.


## Installation

Before running the installation setup in the **Makefile** is necessary to have installed `bower`, `npm` and `gulp` globally.

After you have done that just run: `make install`.

### Specs

##### Data report update

The resulting report from the aggregation is parsed by the server side and cached in the session storage, upon the first read.
This means that on a new session it will load the data again on the first visit. 

In case of the report file is replaced with a new one it's enough to open a new browser session to load the updated information.


##### Supported browsers and test states

In order to support the correct parse and rendering of all browsers and test states, it is necessary to define those values and the UI colors for each in the [configuration file](https://github.com/michaelDomingues/wdio-reports-dashboard/blob/master/confs.js)

If not mentioned, it can cause the test states to not be rendered or using the default colors provided by the libraries.

```
    passed: "#04af65",
    failed: "red",
    skipped: "#cccc00",
    skycon: "#73879C",
    chrome: "red",
    safari: "blue",
    firefox: "orange"
```

## How to contribute
To contribute, please ensure that you have stable [Node.js](https://nodejs.org/) and [npm](https://npmjs.com) installed.

Test if Gulp CLI is installed by running `gulp --version`.  If the command isn't found, run `npm install -g gulp`.  For more information about installing Gulp, see the Gulp's [Getting Started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md).

If `gulp` is installed, follow the steps below.

1. Fork and clone the repo.
2. Run `make`, this will install all dependencies and open the dashboard on your default browser
3. Now changes can be made to the project!
4. Submit a pull request


## License information
Automation Reporter is licensed under The MIT License (MIT). Which means that you can use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software. But you always need to state that Colorlib is the original author of this template.

Project is developed and maintained by [Michael Domingues](https://github.com/michaelDomingues).
