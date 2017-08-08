const _ = require('lodash');
const fs = require('fs');
const Metriquer = require('./metriquer.js');

const metriquer = new Metriquer();

metriquer.parseReports();
