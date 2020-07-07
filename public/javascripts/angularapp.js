angular.module('app', ['ngRoute','ngResource'])

//---------------
    // Services
    //---------------
    
// .factory('Todos', function($http){
//     return $http.get('/todo/list');
//   })
  .factory('Todos',['$resource', function($resource){
    return $resource('/list/:id',null,{
      'update':{method: 'PUT'}
    });
  }])

  //---------------
  // Controllers
  //---------------

  .controller('TodoController', ['$scope', 'Todos', function ($scope, Todos) {
    Todos.success(function(data){
      $scope.todos = data
    }).error(function(data,status){
      console.log(data,status);
      $scope.todos =[];
    });
  }])
  .controller('TodoController', ['$scope', 'Todos', function ($scope, Todos) {
    $scope.editing = [];
    $scope.todos = Todos.query();
    $scope.save = function(){
      if(!$scope.newTodo || $scope.newTodo.length < 1) return;
      var todo = new Todos({ name: $scope.newTodo, completed: false });
  
      todo.$save(function(){
        $scope.todos.push(todo);
        $scope.newTodo = ''; // clear textbox
      });
    }
    $scope.update = function(index){
      var todo = $scope.todos[index];
      Todos.update({id: todo._id}, todo);
      $scope.editing[index] = false;
    }
  
    $scope.edit = function(index){
      $scope.editing[index] = angular.copy($scope.todos[index]);
    }
  
    $scope.cancel = function(index){
      $scope.todos[index] = angular.copy($scope.editing[index]);
      $scope.editing[index] = false;
    }
    $scope.remove = function(index){
      var todo = $scope.todos[index];
      Todos.remove({id: todo._id}, function(){
        $scope.todos.splice(index, 1);
      });
    }
  }])
  .controller('TodoDetailCtrl', ['$scope', '$routeParams','$location','Todos', function ($scope, $routeParams,$location, Todos) {
    $scope.todo = Todos.get({id: $routeParams.id });

    $scope.update = function(){
      console.log($routeParams.id)
      Todos.update({id: $routeParams.id}, $scope.todo, function(){
        $location.url('/');
      });
    }
    $scope.remove = function(){
      Todos.remove({id: $scope.todo._id}, function(){
        $location.url('/');
      });
    }
  }])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/todos.html',
        controller: 'TodoController'
     })

        .when('/:id', {
          templateUrl: '/todoDetails.html',
          controller: 'TodoDetailCtrl'
       });
    }]);