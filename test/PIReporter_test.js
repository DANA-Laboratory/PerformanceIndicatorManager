const fs = require('fs');
const config = require('config');
const assert = require('assert');
const modelsSqlite3 = require('../lib/models-sqlite3');
const importer = require('../lib/models-sqlite3/importCSV');
const sqldelete = require('../lib/models-sqlite3/sql/delete');
const sqlselect= require('../lib/models-sqlite3/sql/select');
const app = require('../');
const validator = require('../lib/models-sqlite3/validate.js');
const supertest = require('supertest')(app);
var db = null;

describe('DataBase', function() {
  describe('Configuration', function() {
    it('should exists: dbPath', function(done) {
      assert(config.get('dbPath'));
      done();
    });
  });
  describe('Db Create', function() {
    before(function () {
        if (fs.existsSync(config.get('dbPath'))) {
            fs.unlinkSync(config.get('dbPath'));
        }
    });
    it('should create database', function(done) {
      modelsSqlite3.createDB(modelsSqlite3.ddl).then((_db) => {
        db = _db;
        done();
      }).catch((err)=>console.log(err));
    });
  });
  describe('import data from csv', function() {
    it('should import users data', function(done) {
      importer.importFromCSV(db, __dirname + '/csv/users.csv', (csvData) => validator.fvalidateInsert('addUser', csvData)).then(() => done()).catch((err) => console.log(err));
    });
    it('should import report class data', function(done) {
      importer.importFromCSV(db, __dirname + '/csv/reportclass.csv', (csvData) => validator.fvalidateInsert('addReportClass', csvData)).then(() => done()).catch((err) => console.log(err));
    });
    it('should select users', function(done) {
      let data = {_verb : 'selectUser'};
      validator.validateSelect(data).then((data)=>sqlselect[data._verb](db, data)).then((data)=>{
        assert(data.length===8);
        done();
      });
    });
    it('should select reportclasses', function(done) {
      let data = {_verb : 'selectReportClass'};
      validator.validateSelect(data).then((data)=>sqlselect[data._verb](db, data)).then((data)=>{
        console.log(data);
        assert(data.duration==='3m');
        done();
      });
    });
  });
  describe('remove users data', function() {
    it('should remove all users data', function(done) {
      let data = {_verb : 'deleteAllUsers'};
      validator.validateDelete(data).then((data) => {
        sqldelete.deleteAllUsers(db, data).then(() => done());
      });
    });
  });
});
describe('Api test', function() {
  it('get home', function(done) {
      supertest
          .get('/')
          .expect(200)
          .end(done);
  });
  it('redirect to login when wrong', function(done) {
    let data = {username : 'rafzalan', password : 'wrong'};
    supertest
      .post('/auth/login')
      .type('json')
      .send(data)
      .expect(302)
      .expect('Location', '/auth/login')
      .end(done);
  });
  it('redirect to / after login', function(done) {
    let data = {username : 'rafzalan', password : 'master'};
    supertest
      .post('/auth/login')
      .type('json')
      .send(data)
      .expect(302)
      .expect('Location', '/')
      .end(done);
  });
  it('redirect when login with github', function(done) {
    supertest
      .get('/auth/github')
      .expect(302)
      .end(done);
  });
  it('redirect when login with telegram', function(done) {
    supertest
      .get('/auth/telegram')
      .expect(302)
      .end(done);
  });
  it('addUser', function(done) {
      let data  = '{"verb":"addUser", "data":{"workunit":"un1", "sysadmin":true, "pcode":"555555", "account":"rafzalan", "password":"vafa01", "fname":"رضا", "lname":"افضلان"}}';
      supertest
          .post('/insert')
          .type('json')
          .send(data)
          .expect(200)
          .end(done);
  });
});
