/*
Copyright (c) Tue Jul 14 2015 Lamberto Fichera

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORTOR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define([
    'angular',
    './module'
], function(ng, module) {
    'use strict';
    
    module.directive('ryrAirportsPicker', ['$log', 'RyanairData','$timeout', function($log, RyanairData,$timeout){
        
        return {
            restrict: 'E',
            replace: true,
            scope: {
                from: '=fromModel',
                to: '=toModel',
                onChange: '='
            },
            template:'<div class="ryr-airport-picker-wrapper">'+
                      '<div class="ryr-airport-picker" ng-class="{\'loading-data\': loadingData}">'+
                        '<input type="text" class="form-control " ng-model="from" placeholder="From" ng-focus="onFocus(\'from\')" ng-blur="onBlur()" />'+
                        '<input type="text" class="form-control" ng-model="to" placeholder="To" ng-focus="onFocus(\'to\')" ng-blur="onBlur()"/>'+
                        '<i class="glyphicon glyphicon-sort ryr-reverse" ng-click="reverse()"></i>'+
                        '<i class="glyphicon glyphicon-refresh ryr-loader spin" ng-click="reverse()"></i>'+
                      '</div>' +
                        '<div class="ryr-airport-picker-results" ng-class="{\'open\':pickerOpened}">'+
                            '<div class="countries col-sm-8 hidden-xs nopadding">' +
                                '<div class="legend">Countries</div>' +
                                '<div class="data">' +
                                    //'<div ng-repeat="country in countries" ng-bind="::country.name"></div>'+
                                    '<div ryr-columns-list columns="3" it="country" source="countries">' +
                                        '{{country}}'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            '<div class="airports col-sm-4 nopadding">' +
                                '<div class="legend">Airports</div>' +
                                '<div class="data">' +
                                    '<div ng-repeat="airport in airports" ng-bind="::airport.name"></div>' +
                                '</div>' +
                            '</div>'+
                        '</div>'+
                    '</div>',
            link: function(scope, element, attrs){
                
                // check required attributes
                if(!attrs.fromModel || !attrs.toModel) {
                    $log.error('ryrAirportsPicker: required attributes "from-model" or "to-model" are missing');
                    return;
                }
                
                
                // Get data
                scope.pickerOpened = false;
                scope.loadingData = true;
                // RyanairData will retrieve the airports and valorize the "airports" array. 
                // The callback is useful to visually update the "loading" icon status
                scope.airports = RyanairData.getAirports(function(){
                    scope.loadingData = false;
                });
                scope.countries = RyanairData.getCountries();
                
                /**
                 * A wrapper for the onChange callback that checks if the function is defined or not.
                 */
                function onChangeWrapper() {
                    if(scope.onChange && typeof scope.onChange == "function") {
                        scope.onChange();
                    }
                }
                
                /**
                 * Reverts the "from" input with the "to" input to swap destination and departure
                 */
                scope.reverse = function(){
                    var temp = scope.from;
                    scope.from = scope.to;
                    scope.to = temp;
                    onChangeWrapper();
                };
                
                scope.onFocus = function(modelName){
                    scope.pickerOpened = true;
                };
                
                scope.onBlur = function(){
                    //scope.pickerOpened = false;
                };
            }
        };
    }]);

});
