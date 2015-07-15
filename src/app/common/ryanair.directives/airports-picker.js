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
    './module',
    'text!./airports-picker.tpl.html'
], function(ng, module, airportsPickerTpl) {
    'use strict';
    
    // register cache
    module.run(['$templateCache', function($templateCache) {
        $templateCache.put('./airports-picker.tpl.html', airportsPickerTpl);
    }]);
    
    module.directive('ryrAirportsPicker', ['$log', 'AirportsData', function($log, AirportsData){
        
        return {
            restrict: 'E',
            replace: true,
            scope: {
                from: '=fromModel',
                to: '=toModel',
                onChange: '='
            },
            templateUrl: './airports-picker.tpl.html', // registered from cache (see above)
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
                scope.airports = AirportsData.getAirports(function(){
                    scope.loadingData = false;
                });
                scope.countries = AirportsData.getCountries();
                
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
                
                scope.onFocus = function(){
                    scope.pickerOpened = true;
                };
                
                scope.onBlur = function(){
                    //scope.pickerOpened = false;
                };
            }
        };
    }]);
});
