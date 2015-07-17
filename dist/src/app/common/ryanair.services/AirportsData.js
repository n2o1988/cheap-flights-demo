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
    
    module.factory('AirportsData', ['$http','$log','$q', 'RyanairConfig', function($http, $log, $q, RyanairConfig) {
        var API = RyanairConfig.API;
        
        var data = {
            airports: {},
            countries: {}
        };
        var fetched = false;
        var fetching = false;
        var fetchError = null;
        // register deferred requests here
        var promises = [];
        
        function fetch(resolveValue){
            var deferred = $q.defer();
            
            if(!fetching){
                // fetch one time only
                fetching = true;
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
                                var element = {
                                    iataCode: code,
                                    name: airport.name,
                                    latitude: airport.latitude,
                                    longitude: airport.longitude,
                                    countryCode: countryCode,
                                    routes: result.data.routes && result.data.routes[code] ? result.data.routes[code] : [], // cache here the routes from this airport
                                    countryRoutes: [] // for easy of use, store also the countries connected by each airport. See below
                                };
                                data.airports[code] = element;
                            } else {
                                // just change the name as the user might have changed the language
                                data.airports[code].name = airport.name;
                            }
                            
                            
                            // add an entry to the country
                            if(countryCode) {
                                if(!data.countries[countryCode]){
                                    var countryElement = {
                                        code: countryCode,
                                        name: airport.country.name
                                    };
                                    data.countries[countryCode] = countryElement;
                                } else {
                                    // just change the name as the user might have changed the language
                                    data.countries[countryCode].name = airport.country.name;
                                }
                            }
                        });
                        
                        // for easy of use, store also the countries connected by each airport
                        // and we store the inverse routing 
                        for(var airportCode in data.airports) {
                            var airport = data.airports[airportCode];
                            
                            var airportRoutesLength = airport.routes ? airport.routes.length : 0;
                            if(airportRoutesLength) {
                                
                                for(var i = 0; i< airportRoutesLength; i++) {
                                    var destinationAirport = data.airports[airport.routes[i]];
                                    
                                    // country
                                    var destinationAirportCountry = destinationAirport.countryCode;
                                    if(airport.countryRoutes.indexOf(destinationAirportCountry) == -1){
                                        airport.countryRoutes.push(destinationAirportCountry);
                                    }
                                    
                                }
                            }
                        }
                    }
                    $log.debug(data);
                    
                    // resolve every deferred promise
                    promises.forEach(function(p) {
                        p.deferred.resolve(angular.copy(p.resolveValue));  // make a copy 
                    });
                    
                    // clean all
                    
                })
                .catch(function(e) {
                    //TODO: Handle the error
                    $log.error('Cannot retrieve the IATA data:', e);
                    // reject every deferred promise
                     promises.forEach(function(p) {
                        p.deferred.rekect(p.resolveValue);   
                    });
                    // store the exception
                    fetchError = e;
                })
                .finally(function(){
                    fetched = true;
                    // clean up the promises list
                    promises = [];
                });
                
                promises.push({ deferred: deferred, resolveValue: resolveValue });
            } else if (!fetched) {
                // still waiting
                // register the deferred
                promises.push({ deferred: deferred, resolveValue: resolveValue });
            } else { 
                // already fetched, resolve immediately from the cache
                // if an error occurred, reject 
                if(fetchError) {
                    deferred.reject(fetchError);   
                } else {
                    deferred.resolve(resolveValue);
                }
            }
            
            return deferred.promise;
        }
        
        
        var AirportsData = {
            
            getAirports: function(){
                return fetch(data.airports);
            },
            
            getCountries: function(){
                return fetch(data.countries);
            },
            
            getAll: function(){
                return fetch(data);   
            }
        };
        
        return AirportsData;
    }]);
});