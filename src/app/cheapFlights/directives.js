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
    
    module.directive('ryrAirportPicker', ['$log', function($log){
        
        return {
            restrict: 'E',
            replace: true,
            scope: {
                from: '=fromModel',
                to: '=toModel',
                onChange: '='
            },
            template: '<div class="ryr-airport-picker">'+
                        '<input type="text" class="form-control" ng-model="from" placeholder="From"/>'+
                        '<input type="text" class="form-control" ng-model="to" placeholder="To"/>'+
                        '<i class="glyphicon glyphicon-sort" ng-click="reverse()"></i>'+
                      '</div>',
            link: function(scope, element, attrs){
                // check required attributes
                if(!attrs.fromModel || !attrs.toModel) {
                    $log.error('ryrAirportPicker: required attributes "from-model" or "to-model" are missing');
                    return;
                }
                
                
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
            }
        };
    }]);
});
