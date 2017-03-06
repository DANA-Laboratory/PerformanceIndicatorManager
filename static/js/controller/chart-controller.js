angular.module('PIR').controller("LineCtrl", ['$scope', '$timeout', function ($scope, $timeout) {
  $scope.labels = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر"];
  $scope.series = ['واقعی', 'پیشبینی'];
  $scope.data = [
    [3, 3, 2, 3, 4, 5, 1],
    [3, 2, 3, 2, 3, 2, 3]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.options = {
    legend: {
      display: true,
      position: 'right',
      labels: {
        fontFamily: 'b yekan', fontSize: 8, usePointStyle:true
      }
    },
    title: {
      fontSize: 18,
      display: true,
      text: 'توقف تولید (روز)',
      fontFamily: 'koodak',
    },
    scales: {
      xAxes: [{
          ticks: {
              fontSize: 12,
              fontFamily: 'koodak'
          }
      }]
    }
  };
  // Simulate async data update
  $timeout(function () {
    $scope.data = [
      [3, 3, 2, 3, 4, 5, 1],
      [3, 2, 3, 2, 3, 2, 3]
    ];
  }, 3000);
}]);
