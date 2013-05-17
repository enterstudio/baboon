/*global describe, it, expect, beforeEach, inject, runs */
'use strict';

describe('admin modul', function () {
    beforeEach(module('blog'));
    beforeEach(module('mocks'));
    beforeEach(module('lx.services'));

    // blogCtrl tests
    describe('adminCtrl', function () {
        var ctrl, scope;

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            ctrl = $controller('adminCtrl', {$scope: scope});
        }));

        it('should be initialized correctly', function () {
            expect(scope.pager).toBeDefined();
            expect(scope.params).toBeDefined();
        });
    });

    // postCtrl tests
    describe('editPostCtrl', function () {
        var scope, ctrl;

        beforeEach(inject(function ($controller, $routeParams) {
            scope = {};
            $routeParams.id = 22;
            ctrl = $controller('editPostCtrl', {$scope: scope});
        }));

        it('should have initialized correctly', function () {
            expect(typeof scope.save).toBe('function');
            expect(typeof scope.reset).toBe('function');
            expect(typeof scope.isUnchanged).toBe('function');
            expect(Object.keys(scope.master).length).toBe(0);
            expect(Object.keys(scope.post).length).toBe(0);
        });

        it('should track changes of the post', function () {
            expect(scope.isUnchanged({})).toBeTruthy();
            expect(scope.isUnchanged({title: '1'})).toBeFalsy();
        });

        it('should have a reset() function', function () {
            scope.master = {
                title: 'p1',
                content: 'text'
            };

            scope.reset();

            expect(scope.post.title).toBe('p1');
            expect(scope.post.content).toBe('text');
        });

        it('should create a new blog post', function () {
            var value, flag, service;
            var post = {
                title: 'p1',
                content: 'text'
            };

            expect(Object.keys(scope.master).length).toBe(0);

            runs(function () {
                flag = false;
                inject(function ($injector) {
                    service = $injector.get('socket');
                    service.emit = function (eventName, data, callback) {
                        value = {success: true, data: data};
                        callback(value);
                        flag = true;
                    };

                    scope.save(post);
                });
            });

            runs(function () {
                expect(typeof value).toBe('object');
                expect(value.success).toBeTruthy();
                expect(value.data.title).toBe('p1');
                expect(scope.master.title).toBe('p1');
                expect(scope.master.content).toBe('text');
            });
        });

        it('should show validation errors', function () {
            var value, flag, service;
            var post = {
                title: 'p1',
                content: 'text'
            };

            expect(Object.keys(scope.master).length).toBe(0);

            runs(function () {
                flag = false;
                inject(function ($injector) {
                    service = $injector.get('socket');
                    service.emit = function (eventName, data, callback) {
                        value = {success: false, errors: []};
                        callback(value);
                        flag = true;
                    };

                    scope.save(post);
                });
            });

            runs(function () {
                expect(typeof value).toBe('object');
                expect(value.success).toBeFalsy();
                expect(value.errors.length).toBe(0);
                expect(Object.keys(scope.master).length).toBe(0);
            });
        });

        it('should show server errors', function () {
            var value, flag, service;
            var post = {
                title: 'p1',
                content: 'text'
            };

            expect(Object.keys(scope.master).length).toBe(0);

            runs(function () {
                flag = false;
                inject(function ($injector) {
                    service = $injector.get('socket');
                    service.emit = function (eventName, data, callback) {
                        value = {success: false, message: 'server error'};
                        callback(value);
                        flag = true;
                    };

                    scope.save(post);
                });
            });

            runs(function () {
                expect(typeof value).toBe('object');
                expect(value.success).toBeFalsy();
                expect(value.message).toBe('server error');
                expect(Object.keys(scope.master).length).toBe(0);
            });
        });

        it('should load post by id ', function () {
            var value, flag, service;
            var post = {
                title: 'p1',
                content: 'text'
            };

            expect(Object.keys(scope.master).length).toBe(0);

            runs(function () {
                flag = false;
                inject(function ($injector) {
                    service = $injector.get('socket');
                    service.emit = function (eventName, data, callback) {
                        value = {success: true, data: post};
                        callback(value);
                        flag = true;
                    };
                });

                inject(function ($controller, $routeParams) {
                    scope = {};
                    $routeParams.id = 22;
                    ctrl = $controller('editPostCtrl', {$scope: scope});
                });
            });

            runs(function () {
                expect(typeof value).toBe('object');
                expect(value.success).toBeTruthy();
                expect(scope.master.title).toBe('p1');
                expect(scope.post.title).toBe('p1');
            });
        });
    });
});