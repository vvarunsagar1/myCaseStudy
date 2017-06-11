var app = angular.module('myCaseStudy',[]);

app.run(function ($rootScope,$http) {
  //console.log('App Starts');
  $rootScope.server="http://54.169.84.179/admin/api/";
  $rootScope.getIpURL = $rootScope.server+'get_ip.php';
  $rootScope.mobileMenu = 'hide';
  $http.get($rootScope.getIpURL).then(function(res) {
    $rootScope.ip = res.data.ip;
    //console.log('ip',$rootScope.ip);
    $rootScope.monitorVisitorsURL = $rootScope.server + 'monitor_visitors.php?ip=' + $rootScope.ip;
    $http.get($rootScope.monitorVisitorsURL).then(function(res){
      $rootScope.monitorStats = res;
      //console.log('monitorStats', $rootScope.monitorStats);
    })
  })

  $rootScope.activateServiceItemView = function (view) {
    $rootScope.serviceItemView = view;
  }
  $rootScope.toggleMobileMenu = function () {
    //console.log('toggle');
    if ($rootScope.mobileMenu == 'hide') {
      $rootScope.mobileMenu = 'active';
    } else if ($rootScope.mobileMenu == 'active') {
      $rootScope.mobileMenu = 'hide';
    }
  }
  $rootScope.logout = function () {
    window.localStorage['profile'] = '';
    window.location.href = 'index.html';
  }
});

app.controller('HomeController', function($scope,$rootScope,$http) {
  //console.log('HomeController');

  $scope.addNewEnquiry = function (formData) {
    $http.get($rootScope.getIpURL).then(function(res) {
      $rootScope.ip = res.data.ip;
      //console.log('ip',$rootScope.ip);
      $scope.addNewEnquiryURL = $rootScope.server + 'insert_enquiry.php?ip=' + $rootScope.ip +'&name=' + formData.name +'&email=' + formData.email +'&message=' + formData.message ;
      //console.log($scope.addNewEnquiryURL);
      $http.get($scope.addNewEnquiryURL).then(function(res){
        $scope.enquiryResponse = res;
        //console.log('enquiryResponse', $scope.enquiryResponse);
      })
    })

  }

  $scope.fetchVisitors = function () {
    $http.get($rootScope.getIpURL).then(function(res) {
      $rootScope.ip = res.data.ip;
      //console.log('ip',$rootScope.ip);
      $scope.fetchVisitorsURL = $rootScope.server + "fetch_visitors.php?ip="+ $rootScope.ip;
      //console.log($scope.fetchVisitorsURL);
      $http.get($scope.fetchVisitorsURL).then(function(response) {
        $scope.visitors = response.data;
        //console.log('visitorsResponse', $scope.visitors);
        //console.log('length',$scope.visitors.length);
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

  $scope.fetchViews = function () {
    $http.get($rootScope.getIpURL).then(function(res) {
      $rootScope.ip = res.data.ip;
      //console.log('ip',$rootScope.ip);
      $scope.fetchViewsURL = $rootScope.server + "fetch_views.php?ip="+ $rootScope.ip;
      //console.log($scope.fetchViewsURL);
      $http.get($scope.fetchViewsURL).then(function(response) {
        $scope.views = response.data[0].views;
        //console.log('viewsResponse', $scope.views);
      });
    })
  }
  $scope.fetchViews();

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
        if ($rootScope.profile.status == 'IC'){
          console.log('message', $rootScope.profile);
          alert('Invalid Username or Password');
        }
        if ($rootScope.profile[0].DEL_FLG == 'N'){
          console.log('profile', $rootScope.profile);
          if ($rootScope.profile[0].user_type == 'U'){
            window.localStorage['profile'] = JSON.stringify($rootScope.profile[0]);
            window.location.href = 'index.html';
          } else if($rootScope.profile[0].user_type == 'A') {
            alert('You are Admin, you will be redirected to the Admin Page');
            window.localStorage['profile'] = JSON.stringify($rootScope.profile[0]);
            window.location.href = 'admin/index.html';
          }
        }
      })
    })
  }

  $scope.register = function (registerProfile) {
    $scope.registerProfile = registerProfile;
    $http.get($rootScope.getIpURL).then(function(res) {
      $rootScope.ip = res.data.ip;
      //console.log('ip',$rootScope.ip);
      $rootScope.registerURL = $rootScope.server + 'register.php?ip=' + $rootScope.ip + '&email=' + $scope.registerProfile.email_id + '&password=' + $scope.registerProfile.password + '&name=' + $scope.registerProfile.name + '&mobile=' + $scope.registerProfile.mobile ;
      //console.log($rootScope.loginURL);
      $http.get($rootScope.registerURL).then(function(res){
        $rootScope.registerResponse = res.data;
        if ($rootScope.registerResponse.status == 'RS'){
          alert('User Registered Successfully');
        } else {
          alert('Some Error Occured');
        }
      })
    })
  }

});
