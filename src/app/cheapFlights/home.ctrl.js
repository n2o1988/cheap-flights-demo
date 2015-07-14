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
   
    return module.controller('RyanairCheapFlightsMainCtrl', ['$scope', function($scope){
        // the model
        $scope.search = {
            from: null,
            to: null
        };
        
        // on filters change
        $scope.onFiltersChanged = function() {
              console.log("filters changed");
        };
    }]);
});
    
