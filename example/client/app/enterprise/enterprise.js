/*global angular*/
angular.module('enterprise', ['enterprise.services'])
    .config(function ($routeProvider) {
        $routeProvider.when('/enterprise', {templateUrl: 'enterprise/enterprise.html', controller: 'enterpriseCtrl'});
        $routeProvider.when('/enterprise/new', {templateUrl: 'enterprise/edit.html', controller: 'enterpriseNewCtrl'});
        $routeProvider.when('/enterprise/edit/:id', {templateUrl: 'enterprise/edit.html', controller: 'enterpriseEditCtrl'});
    })
    .constant('enterprise.modulePath', 'example/enterprise/')
    .controller('enterpriseCtrl', ['$scope', 'enterpriseCrew', 'lxModal',
        function ( $scope, enterpriseCrew, lxModal) {

            // alert helper var
            var lxAlert = $scope.lxAlert;

//            // modal helper var
//            var lxModal = $scope.lxModal;
            //

            $scope.headline = 'Üerschrift';
            $scope.message = 'Hallo Herr/Frau User(in), was soll ich nun machen?';
            $scope.type = 'Error';

            // getAll members from service
            var getAllMembers = function () {
                enterpriseCrew.getAll({}, function (result) {
                    $scope.crew = result.data;

                    // watch the crew and show or hide
                    $scope.$watch('crew', function (value) {
                        if (value.length === 0) {
                            $scope.visible.reset = false;
                            $scope.visible.create = true;
                        }
                        else {
                            $scope.visible.reset = true;
                            $scope.visible.create = false;
                        }
                    });
                });
            };

            // visible vars for controller
            $scope.visible = {
                reset: false,
                create: false
            };

            // init get all members and register watch for crew
            getAllMembers();

            // create test members for crew collection
            $scope.createTestMembers = function (reset) {
                reset = reset || null;
                if ($scope.crew.length === 0) {

                    enterpriseCrew.createTestMembers(function (result) {
                        if (result.message) {
                            lxAlert.error(result.message);
                            getAllMembers();
                        }
                        else if (result.data) {
                            if (reset) {
                                lxAlert.success('db reset.');
                            }
                            else {
                                lxAlert.success('crew created.');
                            }

                            $scope.crew = result.data;
                        }
                    });
                }
                else {
                    lxAlert.error('can\'t create test crew, already exists.');
                }
            };

            // delete crew collection and create test members
            $scope.resetDb = function () {
                if ($scope.crew.length > 0) {
                    enterpriseCrew.deleteAllMembers(function (result) {
                        if (result.message) {
                            lxAlert.error(result.message);
                        }
                        else if (result.success) {
                            $scope.crew = [];
                            $scope.createTestMembers(true);
                        }
                    });
                }
                else {
                    lxAlert.error('can\'t reset db, find no data.');
                }
            };

            // delete crew member by id
            $scope.deleteMember = function (id, name) {
                lxModal.msgBox('enterpriseDeleteMember'+name,false,'Crew-Member löschen?', 'Wollen Sie ' + name + ' wirklich löschen?', 'Warning', {
                    cbYes: function () {
                        enterpriseCrew.delete(id, function (result) {
                            if (result.success) {
                                lxAlert.success('crew member ' + name + ' deleted.');
                                getAllMembers();
                            }
                            else if (result.message) {
                                lxAlert.error(result.message);
                            }
                        });
                    },
                    cbNo: function () {}
                },'standard');

                setTimeout(function(){
                    lxModal.updateMsg('enterpriseDeleteMember'+name,'Diese neue Meldung wird dir vom Sven präsentiert. Du kannst aber gern trotzdem crew member '+ name +' löschen!');
                },2000);


            };
        }])
    .controller('enterpriseEditCtrl', ['$scope', '$location', '$routeParams', 'enterpriseCrew', 'lxForm',
        function ($scope, $location, $routeParams, enterpriseCrew, lxForm) {

            $scope.lxForm = lxForm('enterpriseEdit', '_id');

            enterpriseCrew.getById($routeParams.id, function (result) {
                $scope.person = result.data;
            });

            $scope.save = function () {
                enterpriseCrew.update($scope.person, function (result) {
                    if (result.success) {
                        $location.path('/enterprise');
                    }
                    else if (result.errors) {
                        $scope.lxForm.populateValidation($scope.form, result.errors);
                    }
                    else if (result.message) {
                        $scope.lxAlert.error(result.message);
                    }
                });
            };
        }])
    .controller('enterpriseNewCtrl', ['$scope', '$location', 'enterpriseCrew', 'lxForm',
        function ($scope, $location, enterpriseCrew, lxForm) {

            $scope.lxForm = lxForm('enterpriseNew', '_id');

            // empty person
            $scope.person = {name: '', description: ''};

            $scope.save = function () {
                enterpriseCrew.create($scope.person, function (result) {
                    if (result.data) {
                        $location.path('/enterprise');
                    }
                    else if (result.errors) {
                        $scope.lxForm.populateValidation($scope.form, result.errors);
                    }
                    else if (result.message) {
                        $scope.lxAlert.error(result.message);
                    }
                });
            };
        }]);