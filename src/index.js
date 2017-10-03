'use strict';

const webdriver = require('selenium-webdriver');
const Io = require('legion-io');
const proxify = require('legion-io-proxy');

for( const name in webdriver ) {
  module.exports[name] = webdriver[name];
}

function getBuilder() {
  return Io.get().chain(services => services.getService('selenium-webdriver.Builder'));
}
module.exports.getBuilder = getBuilder;

function getDriver() {
  return Io.get().chain(services => services.getService('selenium-webdriver.Driver'));
}
module.exports.getDriver = getDriver;

module.exports.Driver = proxify(getDriver(), { apiname: 'selenium-webdriver.Driver' });

module.exports.init = function(builder) {
  return {
    _legion_hooks : {
      globalService : services => services.withService('selenium-webdriver.Builder', builder),
      addUserService: services => services.withService('selenium-webdriver.Driver', services.getService('selenium-webdriver.Builder').build()),
      destroyUserService: services => services.getService('selenium-webdriver.Driver').quit()
    }
  };
};
