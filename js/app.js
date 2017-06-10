var app = angular.module('myCaseStudy',[]);

app.run(function ($rootScope,$http) {
  console.log('App Starts');
  $rootScope.server="http://localhost/myCaseStudy/admin/api/";
  $rootScope.getIpURL = $rootScope.server + 'get_ip.php';
  $rootScope.activateServiceItemView = function (view) {
    $rootScope.serviceItemView = view;
  }
  $http.get($rootScope.getIpURL).then(function(res) {
    $rootScope.ip = res.data.ip;
    console.log('ip',$rootScope.ip);
    $rootScope.monitorVisitorsURL = $rootScope.server + 'monitor_visitors.php?ip=' + $rootScope.ip;
    $http.get($rootScope.monitorVisitorsURL).then(function(res){
      $rootScope.monitorStats = res;
      console.log('monitorStats', $rootScope.monitorStats);
    })
  })
});

app.controller('HomeController', function($scope,$rootScope,$http) {
  console.log('HomeController');

  $scope.addNewEnquiry = function (formData) {
    $http.get($rootScope.getIpURL).then(function(res) {
      $rootScope.ip = res.data.ip;
      console.log('ip',$rootScope.ip);
      $scope.addNewEnquiryURL = $rootScope.server + 'insert_enquiry.php?ip=' + $rootScope.ip +'&name=' + formData.name +'&email=' + formData.email +'&message=' + formData.message ;
      console.log($scope.addNewEnquiryURL);
      $http.get($scope.addNewEnquiryURL).then(function(res){
        $scope.enquiryResponse = res;
        console.log('enquiryResponse', $scope.enquiryResponse);
      })
    })

  }
});
