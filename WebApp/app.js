
angular.module('formApp', ['ngAnimate', 'ui.router'])

// == Routes == //
.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('form', {
            url: '/form',
            templateUrl: 'form.html',
            controller: 'formController'
        })

        // /form/customer
        .state('form.customer', {
            url: '/customer',
            templateUrl: 'form-customer.html'
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
    $urlRouterProvider.otherwise('/form/customer');
})

// == Controller  == //
.controller('formController', function($scope, $http) {

    $scope.formData = {
        "customer_details": {},
        "aws_services": {
            "EC2 Services": {"Elastic Load Balancer": false, "Application Load Balancer": false, "EC2 Instances": false, "Elastic Container Service": false},
            "RDS Services": {"MySQL": false, "Oracle": false},
            "Storage Services": {"S3": false, "EFS": false}
        }
    }

    $scope.sendData = function(formData) {
        alert('Submitted!!');
        $http({
            url: 'https://19cfe913og.execute-api.eu-west-1.amazonaws.com/test/pets', // Endpoint may have changed as its still in dev
            headers: {
              'X-Api-Key': '', // Auth needs to be addressed
              'Content-Type': 'application/json'
            },
            method: "GET",
            data: { 'message' : formData }
        })
        .then(function(response) {
          alert(response.status);
        },
        function(response) { // optional
          alert(response.status);
        })
    }


    $scope.processForm = function() {
        $scope.sendData($scope.formData);
    };

});
