var app = angular.module('myCaseStudyAdmin',[]);

function signOut() {
   var auth2 = gapi.auth2.getAuthInstance();
   auth2.signOut().then(function () {
     console.log('User signed out.');
   });
   window.localStorage['profile'] = '';
 }

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  // console.log('ID: ' + profile.getId());
  // console.log('Name: ' + profile.getName());
  // console.log('Given Name: ' + profile.getGivenName());
  // console.log('Family Name: ' + profile.getFamilyName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail());
  var profileUser = { 'id': profile.getId(), 'name': profile.getName(), 'imageurl': profile.getImageUrl(), 'email': profile.getEmail() };
  // console.log('profileUser', profileUser);
  window.localStorage['profile'] = JSON.stringify(profileUser);
  // console.log(window.localStorage['profileUser'],'profile');
  console.log('Extracted Profile', JSON.parse(window.localStorage['profile']));
  window.location.href = 'index.html';
}

app.run(function($rootScope, $http) {
  console.log('Admin App');
  $rootScope.server="http://localhost/myCaseStudy/admin/api/";
  $rootScope.getIpURL = 'http://54.169.84.179/api/get_ip.php'
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

app.controller('loginController', function ($rootScope, $scope, $http) {
  console.log('loginController');
});

app.controller('AdminController', function ($rootScope, $scope, $http) {
  console.log('AdminController');
  console.log(window.localStorage['profile']);
  if (window.localStorage['profile'] == '' || window.localStorage['profile'] == null || window.localStorage['profile'] == undefined ) {
    window.location.href = 'login.html';
    console.log('redirection');
  }
  $rootScope.profile = JSON.parse(window.localStorage['profile']);
  console.log('profile', $rootScope.profile);

  $scope.fetchVisitors = function () {
    $http.get($rootScope.getIpURL).then(function(res) {
      $rootScope.ip = res.data.ip;
      console.log('ip',$rootScope.ip);
      $scope.fetchVisitorsURL = $rootScope.server + "fetch_visitors.php?ip="+ $rootScope.ip;
      console.log($scope.fetchVisitorsURL);
      $http.get($scope.fetchVisitorsURL).then(function(response) {
        $scope.visitors = response.data;
        console.log('visitorsResponse', $scope.visitors);
      });
    })
  }
  $scope.fetchVisitors();

  $scope.fetchEnquiries = function () {
    $http.get($rootScope.getIpURL).then(function(res) {
      $rootScope.ip = res.data.ip;
      console.log('ip',$rootScope.ip);
      $scope.fetchEnquiryURL = $rootScope.server + "fetch_enquiries.php?ip="+ $rootScope.ip;
      console.log($scope.fetchEnquiryURL);
      $http.get($scope.fetchEnquiryURL).then(function(response) {
        $scope.enquiries = response.data;
        console.log('enquiriesResponse', $scope.enquiries);
      });
    })
  }
  $scope.fetchEnquiries();
});
