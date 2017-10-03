#!/usr/bin/env node

'use strict';

const L = require('legion');
const delay = require('legion-io-delay');
const webdriver = require('../src/index');
const By = webdriver.By;
const Driver = webdriver.Driver;

const obstacle = require('legion-obstacle-course');
const port = 8500;
const host = 'http://localhost:' + port;
let server = null;

describe('The selenium webdriver module for legion', function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

  it('automates selenium tests with firefox', function(done) {
    L.create()

    // Set up the obstacle course server before the test.
    .withBeforeTestAction(() => {
      server = obstacle.listen(port);
    })

    // Take down the server after the test.
    .withAfterTestAction(() => {
      server.close();
      server = null;
    })

    .using(webdriver.init(new webdriver.Builder().forBrowser('firefox')))
    .withTestcase(L.of()
      .chain(delay(5,10))
      .chain(Driver.get(host + '/static'))
      .chain(delay(5,10))
      .chain(Driver.findElement(By.linkText('Meep')).click())
      .chain(delay(5,10))
      .chain(Driver.findElement(By.id('left')).click())
      .chain(Driver.findElement(By.id('left')).getText())
      .chain(text => expect(text).toEqual('meep!'))
      .chain(Driver.findElement(By.id('right')).getText())
      .chain(text => expect(text).toEqual('Right'))
      .chain(delay(5,10)))
    .run(1).assert()
    .then(done)
    .catch(done.fail);
  });
});
