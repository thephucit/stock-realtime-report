let app = angular.module('app', []);

app.config(['$compileProvider', function($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);

app.controller('index', function($scope, $http, $timeout) {

    $scope.list_code        = [];
    $scope.loading          = false;
    $scope.open_drop_down   = false;
    $scope.selected         = localStorage.selected ? JSON.parse(localStorage.selected) : {};
    $scope.display_selected = ($scope.selected.symbol) ? $scope.selected.symbol + ' - ' + $scope.selected.companyName : 'Chọn mã chứng khoán';

    let renderChart = function(symbols) {
        $scope.loading = true;
        new FireAnt.QuoteWidget({
            "container_id": "fan-quote-170",
            "symbols": symbols,
            "locale": "vi",
            "price_line_color": "green",
            "grid_color": "#999999",
            "label_color": "#999999",
            "width": "600px",
            "height": "300px"
        });
        $timeout( function(){
            $scope.loading = false;
        }, 1000 );
    };

    $scope.selected.symbol && renderChart($scope.selected.symbol);

    $scope.search = function() {
        $scope.list_code = [];
        $http({
            method: 'POST',
            url: 'https://www.vndirect.com.vn/portal/ajax/common/SymbolAutoSuggestionForSearch.shtml',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function(obj) {
                let str = [];
                for(let p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {
                limit: 10,
                q: $scope.keyword
            }
        }).then(function successCallback(response) {
            angular.forEach(response.data.model.stockExchanges, function(value, key) {
                $scope.list_code.push(value);
            });
        });
    };

    $scope.selectCode = function(item) {
        renderChart(item.symbol);
        $scope.selected         = item;
        $scope.open_drop_down   = false;
        $scope.display_selected = item.symbol + ' - ' + item.companyName;
        localStorage.setItem("selected", JSON.stringify(item));
    };

    $scope.openDropdown = function() {
        $scope.open_drop_down = !$scope.open_drop_down;
    }
});
