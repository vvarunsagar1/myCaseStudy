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

  $rootScope.JSONToCSVConvertor = function (JSONData, ReportTitle, ShowLabel) {
      //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
      var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

      var CSV = '';
      //Set Report title in first row or line

      CSV += ReportTitle + '\r\n\n';

      //This condition will generate the Label/Header
      if (ShowLabel) {
          var row = "";

          //This loop will extract the label from 1st index of on array
          for (var index in arrData[0]) {

              //Now convert each value to string and comma-seprated
              row += index + ',';
          }

          row = row.slice(0, -1);

          //append Label row with line break
          CSV += row + '\r\n';
      }

      //1st loop is to extract each row
      for (var i = 0; i < arrData.length; i++) {
          var row = "";

          //2nd loop will extract each column and convert it in string comma-seprated
          for (var index in arrData[i]) {
              row += '"' + arrData[i][index] + '",';
          }

          row.slice(0, row.length - 1);

          //add a line break after each row
          CSV += row + '\r\n';
      }

      if (CSV == '') {
          alert("Invalid data");
          return;
      }

      //Generate a file name
      var fileName = "MyReport_";
      //this will remove the blank-spaces from the title and replace it with an underscore
      fileName += ReportTitle.replace(/ /g,"_");

      //Initialize file format you want csv or xls
      var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

      // Now the little tricky part.
      // you can use either>> window.open(uri);
      // but this will not work in some browsers
      // or you will not get the correct file extension

      //this trick will generate a temp <a /> tag
      var link = document.createElement("a");
      link.href = uri;

      //set the visibility hidden so it will not effect on your web-layout
      link.style = "visibility:hidden";
      link.download = fileName + ".csv";

      //this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
        if ($rootScope.profile.status == 'IC'){
          console.log('message', $rootScope.profile);
          alert('Invalid Username or Password');
        }
        if ($rootScope.profile[0].DEL_FLG == 'N'){
          console.log('profile', $rootScope.profile);
          if ($rootScope.profile[0].user_type == 'U'){
              alert('You are Not an Admin, you will be redirected to the user Login Page');
              window.location.href="../login.html";
          } else if($rootScope.profile[0].user_type == 'A') {
            window.localStorage['profile'] = JSON.stringify($rootScope.profile[0]);
            window.location.href = 'index.html';
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
          window.location.href='login.html';
        } else {
          alert('Some Error Occured, Please try Again');
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
