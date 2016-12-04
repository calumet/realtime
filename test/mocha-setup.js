const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiHttp = require('chai-http');

global.chai = chai;
global.expect = chai.expect;

chai.use(sinonChai);
chai.use(chaiHttp);
