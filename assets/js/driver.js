function DriverService($http) {
  const BASE_URL = 'http://ergast.com/api/f1/driverStandings/1.json?limit=11&offset=55';
  this.list = function() {
      const request = {
      url: BASE_URL,
      method: 'GET'
    }
    return $http(request);
  }
}

function DriverController(DriverService) { 
  var vm = this;
  ((DriverService) => {
    vm.drivers = [];
    DriverService
    .list()
    .success(function(data){
      vm.drivers = data.MRData.StandingsTable.StandingsLists;
    })
    .error(function(err){
      console.log('Erro: ', err);
    });
  })(DriverService);
  DriverController.$inject = ['$http'];
}

function DriverRoundsService($http,$routeParams) { //Service receiving the year and makes the request via Get. Encapsulates in the List and pass to the controller DriverRounds
  var routeParams = $routeParams;
  this.driverId = $routeParams.id; //Here the service also receives the parameter to test if the round champion is the champion of the year
  const BASE_URL = 'http://ergast.com/api/f1/'+ routeParams.season +'/results/1.json';
  this.list = function() {
      const request = {
      url: BASE_URL,
      method: 'GET'
    }
    return $http(request);
  }
}

function DriverRoundsController(DriverRoundsService,$routeParams) {
  var vm = this; //Trying to fix the bug, so you do not need to click F5 every time you load a new Season
  vm.driverId = DriverRoundsService.driverId;
  vm.test = function (driverId) {
 return (driverId === vm.driverId);
 };
  ((DriverRoundsService) => {
    vm.rounds = [];
    DriverRoundsService
    .list()
    .success(function(data){ //Through my controller promises to return the data brought via json. It adds to the list, and adds to the array rounds. If something goes wrong, the error is printed on the console.
      vm.rounds = data.MRData.RaceTable.Races; //Here I take the first part, to the array. And in the view use the rest of the way to go to the field you want to display
    })
    .error(function(err){
      console.log('Erro: ', err);
    });
  })(DriverRoundsService);
  DriverRoundsController.$inject = ['$routeParams','$http'];
}

angular.module('Driver', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/drivers', {
        templateUrl: 'views/drivers-list.html',
        controller: 'DriverController',
        controllerAs: 'Driver'
      })
      .when('/drivers/:season/:id', { //Using the parameters, first to bring the winners of each round, and then to make the comparison by id, if he was the champion of the year and also of each round
        templateUrl: 'views/rounds-list.html',
        controller: 'DriverRoundsController',
        controllerAs: 'DriverRounds'
      })
      .otherwise({
        redirectTo: '/index' //If something goes wrong ...
      });
  }])
  .service('DriverService', DriverService)
  .controller('DriverController', ['DriverService', DriverController])
  .service('DriverRoundsService', DriverRoundsService)
  .controller('DriverRoundsController', ['DriverRoundsService', DriverRoundsController])