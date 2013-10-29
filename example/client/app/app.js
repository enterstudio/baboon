/*global angular*/
angular.module('app', [
        'ui.bootstrap',
        'app.includes',
        'blog',
        'enterprise',
        'home',
        'session',
        'translation',
        'modalExample',
        'diagrams',
        'hljs'
    ])
    .config(['$routeProvider', '$locationProvider', '$translateProvider', function ($routeProvider, $locationProvider, $translateProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.otherwise({redirectTo: '/'});

        $translateProvider.useStaticFilesLoader({
            prefix: '/locale/locale-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.fallbackLanguage('en');
    }])
    .run(['$rootScope', 'lxSession', '$log', '$translate', '$window', 'lxModal', 'lxAlert',
        function ($rootScope, lxSession, $log, $translate, $window, lxModal, lxAlert) {

            // config
            $rootScope.config = {
                transport: {
                    socket: {
                        enable: true,
                        transports: ['websocket']
                    }
                }
            };

            // bind lxAlert service to $rootScope
            $rootScope.lxAlert = lxAlert;
            $rootScope.lxModal = lxModal;

            $rootScope.$on('$routeChangeStart', function () {
                lxSession.setActivity(function (err) {
                    if (err) {
                        lxModal.msgBox('sessionExpired', true ,'','Session is expired! Please log in.', 'Warning',function(){
                            window.location.assign('/');
                        });
                    }
                });

            });

            // get users preferred language from session
            lxSession.getData('language', function (error, result) {
                if (error) {
                    $log.error(error);
                }

                // use language
                if (result && result.language) {
                    $translate.uses(result.language);
                } else {
                    // detect language of browser
                    var browserLanguage = $window.navigator.language || $window.navigator.userLanguage;
                    $translate.uses(browserLanguage.substring(0, 2));
                }
            });

            $rootScope.modal = lxModal.modal;

            $rootScope.changeLanguage = function (langKey) {
                // tell angular-translate to use the new language
                $translate.uses(langKey);

                // save selected language in session
                lxSession.setData('language', langKey, function (err) {
                    if (err) {
                        $log.error(err);
                    }
                });
            };
        }]);