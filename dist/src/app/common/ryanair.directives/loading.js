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
    
    
    module.directive('ryrLoading', ['$log', function($log){
        return {
            link: function(scope, element, attrs) {
                if(!attrs.ryrLoading){
                    $log.error('ryrLoading: required "ryr-loading" is not valorized');
                    return;
                }
                

                // container
                var baseClass = 'loading-container';
                var div = document.createElement('div'); 
                div.className = baseClass;
                div.innerHTML = '<div class="loading custom1 loading-rotate loading-anim"></div><div class="loading custom1 loading-static"></div>';
                element[0].appendChild(div);

                // watch the model
                var unwatch = scope.$watch(attrs.ryrLoading, function (val) {
                    if(val === true) {
                        div.className = baseClass +' loading-in-progress';
                    } else {
                       div.className = baseClass;
                    }
                });

                scope.$on("$destroy", function () {
                    unwatch();
                });
            }
        };
    }]);
});

