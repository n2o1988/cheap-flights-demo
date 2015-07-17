/*
Copyright (c) Thu Jul 16 2015 Lamberto Fichera

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
   'use-strict';
    
    module.directive('ryrDatesRange', [function(){
        return {
            restrict: 'E',
            replace: true,
            scope: {
                start: '=startModel',
                end: '=endModel'
            },
            template: '<div class="ryr-dates-range">'+
                      '<a class="btn btn-primary" ng-click="toggle($event)" >'+
                        '<i class="glyphicon glyphicon-calendar"></i>'+
                      '</a>'+
                      '<div class="dates-range ng-hide" ng-class="{\'ng-hide\':!open}" ng-click="$event.preventDefault();$event.stopPropagation()">'+
                        '<div date-range start="start" end="end"></div>'+
                      '</div>'+
                    '</div>',
            link: function(scope, element, attrs) {
                scope.open = false;
                scope.toggle = function($evt) {
                    scope.open = !scope.open;   
                    $evt.preventDefault();
                    $evt.stopImmediatePropagation();
                };
                
                // Keep reference to click handler to unbind it.
                var dismissClickHandler = function (evt) {
                    if(scope.open) {
                        scope.open = false;
                        if(!scope.$$phase) {
                            scope.$digest();
                        }
                    }
                };
                
                document.addEventListener('click', dismissClickHandler);
                
                scope.$on('$destroy', function(){
                    document.removeEventListener('click', dismissClickHandler);
                });
            }
        };
    }]);
});

