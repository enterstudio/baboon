'use strict';

var path = require('path');

module.exports = function () {
    var logging = function (msg) {
        console.log(msg);
    };

    var syslog = {
        debug: logging,
        info: logging,
        warn: logging,
        error: logging
        // fatal: logging,
        // isLevelEnabled: function () {
        //     return true;
        // }
    };

    var trimConsole = function (msg) {
        return msg.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
    };

    var captureStream = function (stream) {
        var oldWrite = stream.write;
        var buf = '';
        stream.write = function (chunk) {
            buf += chunk.toString(); // chunk is a String or Buffer
            oldWrite.apply(stream, arguments);
        };

        return {
            unhook: function unhook() {
                stream.write = oldWrite;
            },
            captured: function () {
                return buf.split('\n');
            }
        };
    };

    // result mock object
    var res = {
        statusCode: 200,
        header: '',
        data: {},
        setHeader: function (header) {
            res.header = header;
        },
        end: function (value) {
            res.data = value;
        },
        send: function (status, data) {
            return {
                status: status,
                data: data
            };
        },
        json: function (status, value) {
            res.statusCode = status;

            res.data = new Object({});

            Object.keys(value).forEach(function (keyname) {
                res.data[keyname] = value[keyname];
            });
        },
        status: function (status) {
            res.statusCode = status;

            return {
                json: function (value) {
                    res.data = new Object({});

                    Object.keys(value).forEach(function (keyname) {
                        res.data[keyname] = value[keyname];
                    });
                }
            };
        }
    };

    // request mock object
    var req = {
        body: {
            current: 'main',
            top: 'main'
        },
        session: {}
    };

    // socket
    var socket = {
        events: {},
        on: function (event, func) {
            socket.events[event] = func;
        },
        handshake: {
            headers: {
                cookie: 'baboon.sid=s%3AyhADldmaayce2fUGBWReoA99.zeZdfybnDY0iJwKEbuhZdtfJ2PlwcXI97QxtqY4y428'
            },
            session: {}
        }
    };

    // baboon object
    var baboon = {
        config: {
            node_env: 'development',
            app_name: 'Baboon',
            rights: {
                enabled: false,
                database: 'localhost:27017/baboon_rights'
            },
            path: {
                modules: path.join(path.resolve('./test/mocks'), 'server', 'modules'),
                lib_controller: path.join(path.resolve('./test/mocks'), 'lib', 'controller')
            },
            session: {
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
            }
        },
        session: {
            getSession: function (cookie, callback) {
                if (cookie === '12345' && callback) {
                    callback(null, { user: { acl: [] } });
                } else if (callback) {
                    callback(null, {});
                }
            },
            setSession: function (session, callback) {
                if (callback) {
                    callback(null, {});
                }
            },
            checkActivitySession: function (session, callback) {
                session = null;
                callback(null, true);
            }
        },
        loggers: {
            syslog: syslog
        },
        rights: {
            enabled: true,
            masterLoginPage: false,
            database: 'localhost:27017/baboon_rights',
            getUser: function (id, callback) {
                callback(null, { id: id, name: 'guest' });
            },
            userHasAccessTo: function (user, route) {
                if (route === '/userHasNoAccessToFunction') {
                    return false;
                }
            },
            userHasAccessToController: function () {
                return true;
            }
        }
    };

    var sessionstore = {
        createSessionStore: function (activeStore) {
            return activeStore;
        }
    };

    return {
        logging: {
            syslog: syslog,
            audit: syslog,
            express: syslog
        },
        trimConsole: trimConsole,
        captureStream: captureStream,
        res: res,
        req: req,
        socket: socket,
        baboon: baboon,
        sessionstore: sessionstore
    };
};
