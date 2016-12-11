
angular.module('simpleBuildApp', ['ngAnimate', 'ui.router'])

// == Routes == //
.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('form', {
            url: '/form',
            templateUrl: 'form.html',
            controller: 'formController'
        })

        // /form/calculator
        .state('form.calculator', {
            url: '/calculator',
            templateUrl: 'form-calculator.html'
        })

        // /form/review
        .state('form.review', {
            url: '/review',
            templateUrl: 'form-review.html'
        });


    // catch all route
    $urlRouterProvider.otherwise('/form/calculator');
})

// == Controller  == //
.controller('formController', function($scope, $http) {

    $scope.formData = {
        "customer_details": {},
        "aws_services": {
            "Compute": {"ELB": {"score": 1, "longdesc": "Elastic Load Balancer"}, "EC2": {"score": 2, "longdesc": "Elastic Compute Cloud"}, "ECS": {"score": 3, "longdesc": "Elastic Container Service"}},
            "Storage": {"S3": {"score": 1, "longdesc": "Simple Storage Service"}, "EFS": {"score": 2, "longdesc": "Elastic File System"}},
            "Database": {"RDS": {"score": 1, "longdesc": "Relational Database Service"}}

        }
    }

    // == performs http action on form submission == //
    $scope.sendData = function(formData) {
        $http({
            method: "POST",
            url: 'https://9tekr9sgy7.execute-api.eu-west-1.amazonaws.com/SimpleBuid',
            headers: {
            //   'X-Api-Key': '', // Auth needs to be addressed
              'Content-Type': 'application/json'
            },
            data: { 'message' : formData }
        }).then(function(response) {    // successful response callback
          alert(response.status);
        }, function(response) {         // error response callback
          alert(response.status);
        });
    }

    // == processForm function to abstract send event == // 
    $scope.processForm = function() {
        $scope.sendData($scope.formData);
    }
    
});
