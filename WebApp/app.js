
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
.controller('formController', function($scope) {
    
    $scope.formData = {
        "customer_details": {},
        "aws_services": {
            "Compute": {"ELB": {"score": 1, "longdesc": "Elastic Load Balancer"}, "EC2": {"score": 2, "longdesc": "Elastic Compute Cloud"}, "ECS": {"score": 3, "longdesc": "Elastic Container Service"}},
            "Storage": {"S3": {"score": 1, "longdesc": "Simple Storage Service"}, "EFS": {"score": 2, "longdesc": "Elastic File System"}},
            "Database": {"RDS": {"score": 1, "longdesc": "Relational Database Service"}}

        }
    }

    $scope.processForm = function() {
        alert('Submitted!!');
        // TODO: Add submission handling here  
    };
    
});

