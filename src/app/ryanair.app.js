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
    'cheap-flights/index'    // include the main index.js file as a dependency
], function (ng) {
    'use strict';
    
    /**
     * Main module, a wrapper for the whole application sections. For the purpose of the demo, 
     * we include just one module which is the selected web app: "cheap-flights-demo"
     */
    return ng.module('ryanair', ['ryanair.cheapFlights'])
    /**
     * The main controller of the application, containing common logics
     */ 
    .controller('RyanairCtrl', function(){
          
    });
});