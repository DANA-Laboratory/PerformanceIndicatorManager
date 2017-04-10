var app = angular.module('PIR', ['ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ngRoute', 'chart.js', 'ui.bootstrap', 'ngResource']);
app.directive("searchresult", function() {
    return {
        link: function(scope, el, attrs) {
          if(scope.results === undefined) {
            scope.results = {};
          }
          scope.results[attrs.searchQuery] = [
            {
              text: attrs.searchQuery
            },
            {
              text: attrs.searchQuery
            }
          ]
        }
    };
});

['user', 'reportClass', 'variableCat_1', 'variableCat_2', 'variableCat_3', 'variableCat_1', 'variableDef', 'report', 'variable', 'reportVariable', 'attachement', 'value', 'target', 'message']
.forEach((urlobject)=>{
  app.factory(urlobject, ['$resource',
    function($resource) {
      return $resource(`/restful/${urlobject}`, {}, {
        get: {method: 'GET', cache: false, isArray: false},
        save: {method: 'POST', cache: false, isArray: false},
        update: {method: 'PUT', cache: false, isArray: false},
        delete: {method: 'DELETE', cache: false, isArray: false}
      });
    }]
  );
});

['log']
.forEach((urlobject)=>{
  app.factory(urlobject, ['$resource',
    function($resource) {
      return $resource(`/restful/${urlobject}`, {}, {
          'get':    {method:'GET'},
          'save':   {method:'POST'},
          'query':  {method:'GET', isArray:true},
          'remove': {method:'DELETE'},
          'delete': {method:'DELETE'}
      });
    }]
  );
});

['log']
.forEach((urlobject)=>{
  app.controller(urlobject + 'Controller',['$scope', urlobject, function ($scope, urlobject) {
      $scope.test = function () {
          var res = urlobject.get({}, function() {
            console.log(res);
          });
      }
  }]);
});

app.controller('scopeUpdater', function ($scope) {
    $scope.setVar = function (varName, x) {
        $scope[varName] = x;
    }
});
