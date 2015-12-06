var recordApp = angular.module('recordApp', []);

recordApp.controller('RecordListCtrl', ['$scope', '$http', function ($scope, $http) {

  $scope.successRate = 0.7;

  $scope.offline = false;

  $scope.records = [];

  $scope.orderProp = 'at';

  $scope.newRecord = "";

  $scope.numRetries = 0;

  $scope.saveNameRecord = function (record) {
    if($scope.offline || Math.random() >= $scope.successRate) {
      $scope._failure(record);
      if ($scope.numRetries < 5) {
        $scope.retrySaveRecord(record, 'name');
      }
      return false;
    } else {
      $scope._success(record);
      return true;
    }
  };

  $scope.saveAddressRecord = function (newStreet, newCity, newState, newZip) {
    var newAddress = [];
    
    for (var i in arguments) {
      newAddress.push(arguments[i]);
    }

    newAddress = newAddress.join(', ');

    if($scope.offline || Math.random() >= $scope.successRate) {
      $scope._failure(newAddress);
      $scope.retrySaveRecord(newAddress, 'address');
      return false;
    } else {
      $scope._success(newAddress);
      return true;
    }
  };

  $scope.retrySaveRecord = function (record, type) {
    setTimeout(function() {
      if (type === "name" && $scope.numRetries < 5) {
        $scope.saveNameRecord(record);
      } else if (type === "address" && $scope.numRetries < 5) {
        $scope.saveAddressRecord(record);
      } else {
        console.log("ERROR: Unresolved Network Error");
        if (!$scope.offline) {
          $scope.toggleOffline();
        }
      }
      $scope.numRetries += 1;
      $http.get('/').success(function(data) {
        $scope.records = data;
      });
    }, 5000);

  };

  $scope._failure = function (record) {
    $scope.records.push({saved: "false", details: record, at: Date()});
  };

  $scope._success = function (record) {
    $scope.records.push({saved: "true", details: record, at: Date()});
  };

  $scope.toggleOffline = function () {
    $scope.offline = !$scope.offline;
    document.getElementById('status').innerText = $scope.offline ? 'Offline' : 'Online';
    $scope.offline ? $scope.records = [] : null;
  };
  
}]);