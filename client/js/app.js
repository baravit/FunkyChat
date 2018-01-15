// App
const app = angular.module('app', []);

// Service to fetch some data..
app.factory('dataServ', [ '$http', ($http) => {
	return {
		get : () => $http.get('/data'),
		postQuestion : (questData) => $http.post('/askquestion', questData),
		postAnswer : (ansData) => $http.post('/addanswer', ansData)
	}
} ]);

// App controller
app.controller('appController', [ '$scope', 'dataServ', ($scope, Data) => {
	Data.get().success(resp => {
		$scope.questions = resp;
	});
	$scope.userName = "Nameless";

} ]);

// Questions Controller
app.controller('questionsController', [ '$scope', 'dataServ', '$http', function($scope, Data, $http) {
	
	$scope.newQuestion = "What's on your mind son";
	
	$scope.addQuestion = function() {
		$scope.questData = {
			userName : $scope.userName,
			text : $scope.newQuestion,
			answers : []
		};
		//sending the data to the server to get possible answers
		Data.postQuestion($scope.questData).success(resp => {
			$scope.questions = resp;
		});
	}

} ]);

// Answers Controller
app.controller('answersController',  [ '$scope', 'dataServ', function($scope, Data, $http) {
	$scope.addAnswer = function(index) {
		$scope.ansData = {
				userName: $scope.userName,
				text : $scope.newAnswer,
				index : index
		}
		//sending the answer to the server to add it to the question's answers
		Data.postAnswer($scope.ansData).success(resp => {
			$scope.questions = resp;
		});
	}
}]);