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
    
    
    module.factory('RyanairData', ['$http','$log', function($http, $log) {
        var API = 'http://www.ryanair.com/en/api/2/';
        var data = {
            fetched: false,
            airports: {},
            countries: {}
        };
        
        function fetch(callback){
            if(!data.fetched){
                data.fetched = true;
                $http.jsonp(API + 'forms/flight-booking-selector/?callback=JSON_CALLBACK')
                .then(function(result){
                    // parse and manipulate the results here to speed up operations during the search
                    // process the airports
                    if(result.data && result.data.airports) {
                        result.data.airports.forEach(function(airport){
                            var code = airport.iataCode;
                            var countryCode = airport.country ? airport.country.code : null; // this should not happen...
                            // add an entry to the airport
                            if(!data.airports[code]){
                                data.airports[code] = {
                                    iataCode: code,
                                    name: airport.name,
                                    latitude: airport.latitude,
                                    longitude: airport.longitude,
                                    countryCode: countryCode,
                                    routes: result.data.routes && result.data.routes[code] ? result.data.routes[code] : [] // cache here the routes from this airport
                                };
                            } else {
                                // just change the name as the user might have changed the language
                                data.airports[code].name = airport.name;
                            }
                            
                            
                            // add an entry to the country
                            if(countryCode) {
                                if(!data.countries[countryCode]){
                                    data.countries[countryCode] = {
                                        code: countryCode,
                                        name: airport.country.name
                                    };
                                } else {
                                    // just change the name as the user might have changed the language
                                    data.countries[countryCode].name = airport.country.name;
                                }
                            }
                        });
                    }
                    $log.debug(data);
                })
                .catch(function(e) {
                    //TODO: Handle the error
                    $log.error('Cannot retrieve the IATA data:', e);
                })
                .finally(callback);
            } else if(typeof callback == "function") {
                callback();
            }
        }
        
        
        var RyanairData = {
            
            getAirports: function(callback){
                fetch(callback);
                return data.airports;
            },
            
            getCountries: function(callback){
                fetch(callback);
               return data.countries;
            }
        };
        
        return RyanairData;
    }]);
});