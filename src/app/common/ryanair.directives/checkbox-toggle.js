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
    
    
    module.directive('ryrCheckboxToggle', ['$log','$compile', function($log,$compile){
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                // wrap
                var ngClass = '', ngChange = '';
                if (attrs.ngRequired) {
                    ngClass = 'ng-class="{\'ng-invalid\': ' + attrs.ngRequired + ' && ' + attrs.ngModel + '!==false && ' + attrs.ngModel + '!==true}"';
                } else if (attrs.required) {
                    ngClass = 'ng-class="{\'ng-invalid\': ' + attrs.ngModel + '!==false && ' + attrs.ngModel + '!==true}"';
                }
                
                if(attrs.ngChange) {
                    ngChange = attrs.ngChange+'()';   
                }
                var wrapper = document.createElement('div');
                wrapper.className = 'btn-group ' + ngClass;
                wrapper.innerHTML =  '<label class="btn btn-sm" ng-click="'+attrs.ngModel+'=true;'+ngChange+'" ng-class="{\'btn-default\':' + attrs.ngModel + '!==true,\'btn-primary\':' + attrs.ngModel + '===true}" ng-model="' + attrs.ngModel + '" btn-radio="true" translate="yes">Si</label>' +
                                '<label class="btn btn-sm" ng-click="'+attrs.ngModel+'=false;'+ngChange+'" ng-class="{\'btn-default\':' + attrs.ngModel + '!==false,\'btn-danger\':' + attrs.ngModel + '===false}" ng-model="' + attrs.ngModel + '" btn-radio="false" translate="no">No</label>';
                element[0].parentNode.insertBefore(wrapper, element[0].nextSibling);
                element[0].style.display = "none";
                $compile(angular.element(wrapper))(scope);
            }
        };
    }]);
});

