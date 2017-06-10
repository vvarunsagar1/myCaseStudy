var app = angular.module('myCaseStudyAdmin',[]);

function signOut() {
   var auth2 = gapi.auth2.getAuthInstance();
   auth2.signOut().then(function () {
     //console.log('User signed out.');
   });
   window.localStorage['profile'] = '';
 }

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  // //console.log('ID: ' + profile.getId());
  // //console.log('Name: ' + profile.getName());
  // //console.log('Given Name: ' + profile.getGivenName());
  // //console.log('Family Name: ' + profile.getFamilyName());
  // //console.log('Image URL: ' + profile.getImageUrl());
  // //console.log('Email: ' + profile.getEmail());
  var profileUser = { 'id': profile.getId(), 'name': profile.getName(), 'imageurl': profile.getImageUrl(), 'email': profile.getEmail() };
  // //console.log('profileUser', profileUser);
  window.localStorage['profile'] = JSON.stringify(profileUser);
  // //console.log(window.localStorage['profileUser'],'profile');
  //console.log('Extracted Profile', JSON.parse(window.localStorage['profile']));
  window.location.href = 'index.html';
}

app.run(function($rootScope, $http) {
  //console.log('Admin App');
  $rootScope.server="http://54.169.84.179/admin/api/";
  $rootScope.getIpURL = $rootScope.server+'get_ip.php';

  $http.get($rootScope.getIpURL).then(function(res) {
    $rootScope.ip = res.data.ip;
    //console.log('ip',$rootScope.ip);
    $rootScope.monitorVisitorsURL = $rootScope.server + 'monitor_visitors.php?ip=' + $rootScope.ip;
    $http.get($rootScope.monitorVisitorsURL).then(function(res){
      $rootScope.monitorStats = res;
      //console.log('monitorStats', $rootScope.monitorStats);
    })
  })

  $rootScope.logout = function () {
    window.localStorage['profile'] = '';
    window.location.href = 'index.html';
  }

});

app.controller('loginController', function ($rootScope, $scope, $http) {
  //console.log('loginController');
  $scope.login = function (loginProfile) {
    $scope.loginProfile = loginProfile;
    $http.get($rootScope.getIpURL).then(function(res) {
      $rootScope.ip = res.data.ip;
      //console.log('ip',$rootScope.ip);
      $rootScope.loginURL = $rootScope.server + 'login.php?ip=' + $rootScope.ip + '&email=' + $scope.loginProfile.email_id + '&password=' + $scope.loginProfile.password ;
      //console.log($rootScope.loginURL);
      $http.get($rootScope.loginURL).then(function(res){
        $rootScope.profile = res.data;
        console.log(res);
        if ($rootScope.profile.status == 'LS'){
          console.log('profile', $rootScope.profile);
          window.localStorage['profile'] = JSON.stringify($rootScope.profile);
          window.location.href = 'index.html';
        } else if ($rootScope.profile.status == 'IC'){
          console.log('message', $rootScope.profile);
          alert('Invalid Username or Password');
        }
      })
    })
  }

  $scope.register = function (registerProfile) {
    $scope.registerProfile = registerProfile;
    $http.get($rootScope.getIpURL).then(function(res) {
      $rootScope.ip = res.data.ip;
      //console.log('ip',$rootScope.ip);
      $rootScope.registerURL = $rootScope.server + 'register.php?ip=' + $rootScope.ip + '&email=' + $scope.registerProfile.email_id + '&password=' + $scope.registerProfile.password + '&email=' + $scope.registerProfile.name + '&password=' + $scope.registerProfile.mobile ;
      //console.log($rootScope.loginURL);
      $http.get($rootScope.registerURL).then(function(res){
        $rootScope.registerResponse = res.data;
        if ($rootScope.profile.status == 'RS'){
          alert('User Registered Successfully');
        } else {
          alert('Some Error Occured');
        }
      })
    })
  }

});

app.controller('AdminController', function ($rootScope, $scope, $http) {
  //console.log('AdminController');
  //console.log(window.localStorage['profile']);
  if (window.localStorage['profile'] == '' || window.localStorage['profile'] == null || window.localStorage['profile'] == undefined ) {
    window.location.href = 'login.html';
    //console.log('redirection');
  }
  $rootScope.profile = JSON.parse(window.localStorage['profile']);
  //console.log('profile', $rootScope.profile);

  $scope.fetchVisitors = function () {
    $http.get($rootScope.getIpURL).then(function(res) {
      $rootScope.ip = res.data.ip;
      //console.log('ip',$rootScope.ip);
      $scope.fetchVisitorsURL = $rootScope.server + "fetch_visitors.php?ip="+ $rootScope.ip;
      //console.log($scope.fetchVisitorsURL);
      $http.get($scope.fetchVisitorsURL).then(function(response) {
        $scope.visitors = response.data;
        //console.log('visitorsResponse', $scope.visitors);
      });
    })
  }
  $scope.fetchVisitors();

  $scope.fetchEnquiries = function () {
    $http.get($rootScope.getIpURL).then(function(res) {
      $rootScope.ip = res.data.ip;
      //console.log('ip',$rootScope.ip);
      $scope.fetchEnquiryURL = $rootScope.server + "fetch_enquiries.php?ip="+ $rootScope.ip;
      //console.log($scope.fetchEnquiryURL);
      $http.get($scope.fetchEnquiryURL).then(function(response) {
        $scope.enquiries = response.data;
        //console.log('enquiriesResponse', $scope.enquiries);
      });
    })
  }
  $scope.fetchEnquiries();
});
