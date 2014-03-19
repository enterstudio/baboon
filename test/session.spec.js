'use strict';

describe('Session', function () {

    var path = require('path');

    var rootPath = path.resolve(path.join(__dirname, '../'));
    var SessionError = require(path.resolve(path.join(rootPath, 'lib', 'errors'))).SessionError;
    var appMock = require(path.resolve(path.join(rootPath, 'test', 'mocks', 'appMock')));
    var session = require(path.resolve(path.join(rootPath, 'lib', 'session')));
    var config, sut, mock;

    describe('Test errors in lib', function () {

        beforeEach(function () {

            config = {
                stores: {
                    inMemory: {
                        type: 'inMemory'
                    }
                },
                activeStore: 'inMemory',
                key: 'baboon.sid',
                secret: 'a7f4eb39-744e-43e3-a30b-3ffea846030f'
            };
            mock = appMock();
        });

        it('should throw an Error when not given params', function () {
            var func = function () {
                return session();
            };
            expect(func).toThrow(new SessionError('Parameter config is required and must be a object type!'));
        });

        it('should throw an Error when not given syslog', function () {
            var func = function () {
                return session(config);
            };
            expect(func).toThrow(new SessionError('Parameter syslog is required and must be a object type!'));
        });

        it('should throw an Error when syslog wrong type', function () {
            var func = function () {
                return session(config, 'string');
            };
            expect(func).toThrow(new SessionError('Parameter syslog is required and must be a object type!'));
        });

        it('should throw an Error when config wrong type', function () {
            var func = function () {
                return session('string');
            };
            expect(func).toThrow(new SessionError('Parameter config is required and must be a object type!'));
        });

        it('should throw an Error when not given config.stores', function () {
            delete config.stores;
            var func = function () {
                return session(config, mock.logging.syslog);
            };
            expect(func).toThrow(new SessionError('Parameter config.stores is required and must be a object type!'));
        });

        it('should throw an Error when config.stores wrong type', function () {
            config.stores = 'string';
            var func = function () {
                return session(config, mock.logging.syslog);
            };
            expect(func).toThrow(new SessionError('Parameter config.stores is required and must be a object type!'));
        });

        it('should throw an Error when not given config.activeStore', function () {
            delete config.activeStore;
            var func = function () {
                return session(config, mock.logging.syslog);
            };
            expect(func).toThrow(new SessionError('Parameter config.activeStore is required and must be a object type!'));
        });

        it('should throw an Error when config.stores wrong type', function () {
            config.activeStore = {};
            var func = function () {
                return session(config, mock.logging.syslog);
            };
            expect(func).toThrow(new SessionError('Parameter config.activeStore is required and must be a object type!'));
        });

        it('should throw an Error when not given config.secret', function () {
            delete config.secret;
            var func = function () {
                return session(config, mock.logging.syslog);
            };
            expect(func).toThrow(new SessionError('Parameter config.secret is required and must be a object type!'));
        });

        it('should throw an Error when config.secret wrong type', function () {
            config.secret = {};
            var func = function () {
                return session(config, mock.logging.syslog);
            };
            expect(func).toThrow(new SessionError('Parameter config.secret is required and must be a object type!'));
        });

        it('should throw an Error when not given config.key', function () {
            delete config.key;
            var func = function () {
                return session(config, mock.logging.syslog);
            };
            expect(func).toThrow(new SessionError('Parameter config.key is required and must be a object type!'));
        });

        it('should throw an Error when config.key wrong type', function () {
            config.key = {};
            var func = function () {
                return session(config, mock.logging.syslog);
            };
            expect(func).toThrow(new SessionError('Parameter config.key is required and must be a object type!'));
        });
    });

    describe('Test functions in lib', function () {
        beforeEach(function () {

            config = {
                stores: {
                    inMemory: {
                        type: 'inMemory'
                    },
                    mongoDb: {
                        type: 'mongoDb',
                        host: 'localhost',
                        port: 27017,
                        dbName: 'test_baboon_sessions',
                        collectionName: 'sessions'
                    },
                    tingoDb: {
                        type: 'tingoDb',
                        dbPath: './.tmp',
                        collectionName: 'sessions'
                    }
                },
                activeStore: 'inMemory',
                key: 'baboon.sid',
                secret: 'a7f4eb39-744e-43e3-a30b-3ffea846030f'
            };
            mock = appMock();
            sut = session(config, mock.logging.syslog);
        });

        it('should be correct defined lib', function () {

            expect(sut).toBeDefined();
            expect(sut.getSessionStore).toBeDefined();
            expect(sut.getSessionId).toBeDefined();
            expect(sut.getSession).toBeDefined();
            expect(sut.setSession).toBeDefined();
            expect(sut.checkActivitySession).toBeDefined();
        });

        it('should be return inMemory sessionstore', function () {

            expect(typeof sut.getSessionStore()).toBe('object');
            expect(typeof sut.getSessionStore().sessions).toBe('object');
        });

        describe('Test getSessionID', function() {

            it('should throw an Error when not given parameter cookie', function () {
                var func = function () {
                    return sut.getSessionId();
                };
                expect(func).toThrow(new SessionError('Parameter cookie is required and must be a string type!'));
            });

            it('should throw an Error when parameter cookie is wrong type', function () {
                var func = function () {
                    return sut.getSessionId({});
                };
                expect(func).toThrow(new SessionError('Parameter cookie is required and must be a string type!'));
            });

            it('should be return correct sessionId', function () {

                // create test cookie
                var expectId = 'kuXMThISDw9LA7mkEQ0pnOZt';
                var cookie = 'baboon.sid=s%3AkuXMThISDw9LA7mkEQ0pnOZt.rtGhLaq%2FeZqAeRk39PFWSaqDKDOnK4ncrst%2BmNOQZ%2F8';

                expect(sut.getSessionId(cookie)).toBe(expectId);
            });
        });

        describe('Test getSession', function () {

            beforeEach(function () {

                config = {
                    stores: {
                        inMemory: {
                            type: 'inMemory'
                        },
                        mongoDb: {
                            type: 'mongoDb',
                            host: 'localhost',
                            port: 27017,
                            dbName: 'test_baboon_sessions',
                            collectionName: 'sessions'
                        },
                        tingoDb: {
                            type: 'tingoDb',
                            dbPath: './.tmp',
                            collectionName: 'sessions'
                        }
                    },
                    activeStore: 'inMemory',
                    key: 'baboon.sid',
                    secret: 'a7f4eb39-744e-43e3-a30b-3ffea846030f'
                };
                mock = appMock();
                sut = session(config, mock.logging.syslog);
            });

            it('should throw an Error when not given parameter cookie', function () {
                var func = function () {
                    return sut.getSession();
                };
                expect(func).toThrow(new SessionError('Parameter cookie is required and must be a string type!'));
            });

            it('should throw an Error when parameter cookie is wrong type', function () {
                var func = function () {
                    return sut.getSession({});
                };
                expect(func).toThrow(new SessionError('Parameter cookie is required and must be a string type!'));
            });

            it('should throw an Error when not given parameter callback', function () {
                var func = function () {
                    return sut.getSession('string');
                };
                expect(func).toThrow(new SessionError('Parameter callback is required and must be a object type!'));
            });

            it('should throw an Error when parameter callback is wrong type', function () {
                var func = function () {
                    return sut.getSession('string', 'string');
                };
                expect(func).toThrow(new SessionError('Parameter callback is required and must be a object type!'));
            });

            it('should be return correct session', function (done) {

                // overwrite sessionStore
                var sessionStore = sut.getSessionStore();
                sessionStore.sessions = { kuXMThISDw9LA7mkEQ0pnOZt: '{"cookie":{"originalMaxAge":false,"expires":false,"httpOnly":true,"path":"/"},"activity":"2014-03-18T09:35:52.768Z","start":"2014-03-18T09:35:52.767Z","data":{},"user":{"id":-1,"name":"guest"}}' };
                var cookie = 'baboon.sid=s%3AkuXMThISDw9LA7mkEQ0pnOZt.rtGhLaq%2FeZqAeRk39PFWSaqDKDOnK4ncrst%2BmNOQZ%2F8';

                sut.getSession(cookie, function(error, session) {

                    expect(error).toBeNull();
                    expect(session._sessionid).toBe('kuXMThISDw9LA7mkEQ0pnOZt');
                    expect(session.user.name).toBe('guest');
                    done();
                });
            });

            it('should be return correct session when session has _sessionid', function (done) {

                // overwrite sessionStore
                var sessionStore = sut.getSessionStore();
                sessionStore.sessions = { kuXMThISDw9LA7mkEQ0pnOZt: '{"cookie":{"originalMaxAge":false,"expires":false,"httpOnly":true,"path":"/"},"_sessionid":"kuXMThISDw9LA7mkEQ0pnOZt","activity":"2014-03-18T09:35:52.768Z","start":"2014-03-18T09:35:52.767Z","data":{},"user":{"id":-1,"name":"guest"}}' };
                var cookie = 'baboon.sid=s%3AkuXMThISDw9LA7mkEQ0pnOZt.rtGhLaq%2FeZqAeRk39PFWSaqDKDOnK4ncrst%2BmNOQZ%2F8';

                sut.getSession(cookie, function(error, session) {

                    expect(error).toBeNull();
                    expect(session._sessionid).toBe('kuXMThISDw9LA7mkEQ0pnOZt');
                    expect(session.user.name).toBe('guest');
                    done();
                });
            });

            it('should be return error when session not found in store ', function (done) {

                // overwrite sessionStore
                var sessionStore = sut.getSessionStore();
                sessionStore.sessions = { puXMThISDw9LA7mkEQ0pnOZt: '{"cookie":{"originalMaxAge":false,"expires":false,"httpOnly":true,"path":"/"},"activity":"2014-03-18T09:35:52.768Z","start":"2014-03-18T09:35:52.767Z","data":{},"user":{"id":-1,"name":"guest"}}' };
                var cookie = 'baboon.sid=s%3AkuXMThISDw9LA7mkEQ0pnOZt.rtGhLaq%2FeZqAeRk39PFWSaqDKDOnK4ncrst%2BmNOQZ%2F8';

                sut.getSession(cookie, function(error, session) {

                    expect(session).toBeUndefined();
                    expect(error.message).toBe('session kuXMThISDw9LA7mkEQ0pnOZt: not found');
                    done();
                });
            });
        });

        describe('Test setSession', function () {

            beforeEach(function () {

                config = {
                    stores: {
                        inMemory: {
                            type: 'inMemory'
                        },
                        mongoDb: {
                            type: 'mongoDb',
                            host: 'localhost',
                            port: 27017,
                            dbName: 'test_baboon_sessions',
                            collectionName: 'sessions'
                        },
                        tingoDb: {
                            type: 'tingoDb',
                            dbPath: './.tmp',
                            collectionName: 'sessions'
                        }
                    },
                    activeStore: 'inMemory',
                    key: 'baboon.sid',
                    secret: 'a7f4eb39-744e-43e3-a30b-3ffea846030f'
                };
                mock = appMock();
                sut = session(config, mock.logging.syslog);
            });

            it('should throw an Error when not given parameter session', function () {
                var func = function () {
                    return sut.setSession();
                };
                expect(func).toThrow(new SessionError('Parameter session is required and must be a object type!'));
            });

            it('should throw an Error when parameter session is wrong type', function () {
                var func = function () {
                    return sut.setSession('string');
                };
                expect(func).toThrow(new SessionError('Parameter session is required and must be a object type!'));
            });

            it('should throw an Error when not given parameter callback', function () {
                var func = function () {
                    return sut.setSession({});
                };
                expect(func).toThrow(new SessionError('Parameter callback is required and must be a object type!'));
            });

            it('should throw an Error when parameter callback is wrong type', function () {
                var func = function () {
                    return sut.setSession({}, 'string');
                };
                expect(func).toThrow(new SessionError('Parameter callback is required and must be a object type!'));
            });

            it('should be set params in session', function (done) {

                // overwrite sessionStore
                var sessionStore = sut.getSessionStore();
                sessionStore.sessions = { kuXMThISDw9LA7mkEQ0pnOZt: '{"cookie":{"originalMaxAge":false,"expires":false,"httpOnly":true,"path":"/"},"_sessionid":"kuXMThISDw9LA7mkEQ0pnOZt","activity":"2014-03-18T09:35:52.768Z","start":"2014-03-18T09:35:52.767Z","data":{},"user":{"id":-1,"name":"guest"}}' };
                var cookie = 'baboon.sid=s%3AkuXMThISDw9LA7mkEQ0pnOZt.rtGhLaq%2FeZqAeRk39PFWSaqDKDOnK4ncrst%2BmNOQZ%2F8';

                // get session for new params
                sut.getSession(cookie, function(error, session) {

                    expect(error).toBeNull();
                    expect(session._sessionid).toBe('kuXMThISDw9LA7mkEQ0pnOZt');
                    expect(session.user.name).toBe('guest');

                    session.user.name = 'test';

                    // set session
                    sut.setSession(session, function(error, result) {

                        expect(error).toBeNull();
                        expect(result).toBe(true);

                        // get session with new params
                        sut.getSession(cookie, function(error, session) {
                            expect(error).toBeNull();
                            expect(session._sessionid).toBe('kuXMThISDw9LA7mkEQ0pnOZt');
                            expect(session.user.name).toBe('test');

                            done();
                        });
                    });
                });
            });

            it('should be return error from setSession', function (done) {
                // overwrite sessionStore
                var sessionStore = sut.getSessionStore();

                // overwrite set
                sessionStore.set = function(id, sess, callback) {
                    id = null;
                    sess = null;
                    callback(new SessionError('test error'));
                    done();
                };

                sut.setSession({}, function(error) {
                    expect(error.message.message).toBe('test error');
                    done();
                });
            });

        });

        describe('Test checkActivitySession', function () {

            beforeEach(function () {

                config = {
                    stores: {
                        inMemory: {
                            type: 'inMemory'
                        },
                        mongoDb: {
                            type: 'mongoDb',
                            host: 'localhost',
                            port: 27017,
                            dbName: 'test_baboon_sessions',
                            collectionName: 'sessions'
                        },
                        tingoDb: {
                            type: 'tingoDb',
                            dbPath: './.tmp',
                            collectionName: 'sessions'
                        }
                    },
                    activeStore: 'inMemory',
                    key: 'baboon.sid',
                    secret: 'a7f4eb39-744e-43e3-a30b-3ffea846030f',
                    maxLife: 36000,
                    inactiveTime: 3600

                };
                mock = appMock();
                sut = session(config, mock.logging.syslog);
            });

            it('should throw an Error when not given parameter session', function () {
                var func = function () {
                    return sut.checkActivitySession();
                };
                expect(func).toThrow(new SessionError('Parameter session is required and must be a object type!'));
            });

            it('should throw an Error when parameter session is wrong type', function () {
                var func = function () {
                    return sut.checkActivitySession('string');
                };
                expect(func).toThrow(new SessionError('Parameter session is required and must be a object type!'));
            });

            it('should throw an Error when not given parameter callback', function () {
                var func = function () {
                    return sut.checkActivitySession({});
                };
                expect(func).toThrow(new SessionError('Parameter callback is required and must be a object type!'));
            });

            it('should throw an Error when parameter callback is wrong type', function () {
                var func = function () {
                    return sut.checkActivitySession({}, 'string');
                };
                expect(func).toThrow(new SessionError('Parameter callback is required and must be a object type!'));
            });

            it('should be successfully when correct time', function (done) {

                // overwrite sessionStore
                var sessionStore = sut.getSessionStore();
                var aktDate = new Date();
                var start = aktDate;
                start.setMinutes(start.getMinutes()- 10);
                var lastActivity = aktDate;
                lastActivity.setMinutes(lastActivity.getMinutes()- 5);

                sessionStore.sessions = { kuXMThISDw9LA7mkEQ0pnOZt: '{"cookie":{"originalMaxAge":false,"expires":false,"httpOnly":true,"path":"/"},"_sessionid":"kuXMThISDw9LA7mkEQ0pnOZt","activity":"' + lastActivity.toISOString() + '","start":"' + start.toISOString() + '","data":{},"user":{"id":-1,"name":"guest"}}' };
                var cookie = 'baboon.sid=s%3AkuXMThISDw9LA7mkEQ0pnOZt.rtGhLaq%2FeZqAeRk39PFWSaqDKDOnK4ncrst%2BmNOQZ%2F8';

                // get session
                sut.getSession(cookie, function(error, session) {

                    expect(error).toBeNull();
                    expect(session._sessionid).toBe('kuXMThISDw9LA7mkEQ0pnOZt');
                    expect(session.user.name).toBe('guest');

                    // check session activity
                    sut.checkActivitySession(session, function(error, result) {

                        expect(error).toBeNull();
                        expect(result).toBe(true);

                        done();
                    });
                });
            });

            it('should be not successfully when max time exceeded', function (done) {

                // overwrite sessionStore
                var sessionStore = sut.getSessionStore();
                var aktDate = new Date();
                var start = aktDate;
                start.setHours(start.getHours()- 12);
                var lastActivity = aktDate;
                lastActivity.setMinutes(lastActivity.getMinutes()- 5);

                sessionStore.sessions = { kuXMThISDw9LA7mkEQ0pnOZt: '{"cookie":{"originalMaxAge":false,"expires":false,"httpOnly":true,"path":"/"},"_sessionid":"kuXMThISDw9LA7mkEQ0pnOZt","activity":"' + lastActivity.toISOString() + '","start":"' + start.toISOString() + '","data":{},"user":{"id":-1,"name":"guest"}}' };
                var cookie = 'baboon.sid=s%3AkuXMThISDw9LA7mkEQ0pnOZt.rtGhLaq%2FeZqAeRk39PFWSaqDKDOnK4ncrst%2BmNOQZ%2F8';

                spyOn(mock.logging.syslog, 'warn');

                // get session
                sut.getSession(cookie, function(error, session) {

                    expect(error).toBeNull();
                    expect(session._sessionid).toBe('kuXMThISDw9LA7mkEQ0pnOZt');
                    expect(session.user.name).toBe('guest');

                    // overwrite session regenerate
                    session.regenerate = function(callback) {
                        callback(null, false);
                    };

                    // check session activity
                    sut.checkActivitySession(session, function(error, result) {

                        expect(error).toBeNull();
                        expect(result).toBe(false);
                        expect(mock.logging.syslog.warn).toHaveBeenCalledWith('session too long inactive or session expired, regenerate session.');

                        done();
                    });
                });
            });

            it('should be not successfully when active time exceeded', function (done) {

                // overwrite sessionStore
                var sessionStore = sut.getSessionStore();
                var aktDate = new Date();
                var start = aktDate;
                start.setHours(start.getHours()- 3);
                var lastActivity = aktDate;
                lastActivity.setHours(lastActivity.getHours()- 2);

                sessionStore.sessions = { kuXMThISDw9LA7mkEQ0pnOZt: '{"cookie":{"originalMaxAge":false,"expires":false,"httpOnly":true,"path":"/"},"_sessionid":"kuXMThISDw9LA7mkEQ0pnOZt","activity":"' + lastActivity.toISOString() + '","start":"' + start.toISOString() + '","data":{},"user":{"id":-1,"name":"guest"}}' };
                var cookie = 'baboon.sid=s%3AkuXMThISDw9LA7mkEQ0pnOZt.rtGhLaq%2FeZqAeRk39PFWSaqDKDOnK4ncrst%2BmNOQZ%2F8';

                spyOn(mock.logging.syslog, 'warn');

                // get session
                sut.getSession(cookie, function(error, session) {

                    expect(error).toBeNull();
                    expect(session._sessionid).toBe('kuXMThISDw9LA7mkEQ0pnOZt');
                    expect(session.user.name).toBe('guest');

                    // overwrite session regenerate
                    session.regenerate = function(callback) {
                        callback(null, false);
                    };

                    // check session activity
                    sut.checkActivitySession(session, function(error, result) {

                        expect(error).toBeNull();
                        expect(result).toBe(false);
                        expect(mock.logging.syslog.warn).toHaveBeenCalledWith('session too long inactive or session expired, regenerate session.');

                        done();
                    });
                });
            });
        });
    });
});
