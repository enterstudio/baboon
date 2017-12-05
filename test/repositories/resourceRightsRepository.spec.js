/*global describe, it, expect, beforeEach */
'use strict';

var path = require('path'),
    rootPath = path.resolve(__dirname, '../', '../'),
    appMock = require(path.resolve(rootPath, 'lib', 'config'))(path.resolve(rootPath, 'test', 'mocks'), {config: 'unitTest'}),
    repo = require(path.resolve(rootPath, 'lib', 'repositories'))(appMock.rights.database),
    sut = repo.resourceRights,
    data = null;

beforeEach(function () {
    // test data
    data = {
        resource: 'projectA',
        group_id: '5204cf825dd46a6c15000001',
        role_id: '5204cf825dd46a6c15000001'
    };
});

describe('Repositories/ResourceRightsRepositiory', function () {
    it('should be initialized correctly', function () {
        expect(typeof sut.validate).toBe('function');
    });

    describe('.validate()', function () {
        it('should validate the data', function (done) {
            sut.validate(data, {}, function (err, res) {
                expect(res.valid).toBeTruthy();
                expect(res.errors.length).toBe(0);
                expect(data.resource).toBe('projectA');
                expect(data.group_id.equals(sut.convertId('5204cf825dd46a6c15000001'))).toBeTruthy();
                expect(data.role_id.equals(sut.convertId('5204cf825dd46a6c15000001'))).toBeTruthy();

                done();
            });
        });

        it('should validate the data when no options are specified', function (done) {
            sut.validate(data, function (err, res) {
                expect(res.valid).toBeTruthy();
                expect(res.errors.length).toBe(0);
                expect(data.resource).toBe('projectA');
                expect(data.group_id.equals(sut.convertId('5204cf825dd46a6c15000001'))).toBeTruthy();
                expect(data.role_id.equals(sut.convertId('5204cf825dd46a6c15000001'))).toBeTruthy();

                done();
            });
        });

        it('should valid to true when no data is given', function (done) {
            sut.validate(null, null, function (err, res) {
                expect(res.valid).toBeTruthy();
                expect(res.errors.length).toBe(0);

                done();
            });
        });

        it('should valid to true when the data is not valid', function (done) {
            sut.validate({}, null, function (err, res) {
                expect(res.valid).toBeTruthy();
                expect(res.errors.length).toBe(0);

                done();
            });
        });
    });
});