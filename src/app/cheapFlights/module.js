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
    'angularRoute',
    'text!./home.tpl.html'
], function (ng, ngRoute, homeTpl) {
    'use strict';
    
    
    return ng.module('ryanair.cheapFlights',['ngRoute'])
    /** 
     * configuration for the cheap flights module
     */ 
    .config(['$routeProvider', function($routeProvider){
        // NOTE: for the purpose of this demo we can just use the standard $routeProvider provided by ngRoute
        // instead of the powerful (but heavier "ui-router")
        $routeProvider
            .when('/', { templateUrl: 'cheapFlights.home.tpl.html', controller: 'RyanairCheapFlightsMainCtrl' })
            .otherwise({ redirectTo: '/' });
        
        
    }])
    /**
     * Register here the templates
     */ 
    .run(['$templateCache', function($templateCache){
          $templateCache.put('cheapFlights.home.tpl.html', homeTpl);
    }]);
});