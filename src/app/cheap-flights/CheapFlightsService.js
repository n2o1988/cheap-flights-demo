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
    
    module.factory('CheapFlights', ['$http','$log','$q', 'RyanairConfig', function($http, $log, $q, RyanairConfig) {
        var API =RyanairConfig.API + 'flights/';
        
        function wrapUrl(url) {
            if(RyanairConfig.PROXY_URL) {
                return RyanairConfig.PROXY_URL  + encodeURIComponent(url);
            }
        }
        
        //TODO: move to "ryanair.utils" module
        function formatDate(d) {
            if(!d instanceof Date){    
                d = new Date(d);
            }
            
            var month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

            if (month.length < 2) { 
                month = '0' + month;
            }
            if (day.length < 2) { 
                day = '0' + day;
            }

            return [year, month, day].join('-');
        }
        
        var CheapFlights = function(query) {
            var d = $q.defer();
            
            if(!(query.from || query.to) || query.maxPrice === undefined) {
                // at least these three things must be set
                // return a fake promise with no results    
                d.reject('CheapFlights: at least one between "from" and "to" parameters must be set. The maxPrice is also mandatory');
                return d.promise;
            }
            // in order to execute the search at least the one of "from" or "to" must be set 
            // compose the url
            // e.g. from/DUB/to/STN/2014-12-02/2015-09-02/250/unique/?limit=15&offset-0
            // full request: http://www.ryanair.com/en/api/2/flights/from/STN/2015-07-16/2016-06-12/2015-07-16/2015-09-18/3/7/250/unique/?limit=15&offset=0
            var url = API;
            // airports
            if(query.from) {
                url += 'from/'+query.from.iataCode+'/';   
            }
            if(query.to){
                url += 'to/'+query.to.iataCode+'/';   
            }
            // dates
            if(query.outStartDate && query.outEndDate) {
                url += formatDate(query.outStartDate)+'/'+formatDate(query.outEndDate)+'/';
            }
            if(query.inStartDate && query.inEndDate) {
                url += formatDate(query.inStartDate)+'/'+formatDate(query.inEndDate)+'/';
            }
            if(query.tripMin && query.tripMax) {
                url += query.tripMin+'/'+query.tripMax+'/';   
            }
            // price
            url += query.maxPrice+'/unique/';
            
            // paging
            if(query.limit && query.offset) {
                url += '?limit='+query.limit+'&offset='+query.offset;
            }
            
            $log.debug("querying url: ", url);
            $http.get(wrapUrl(url))
            .then(function(result) {
                if(result.data){
                    d.resolve(result.data);
                }
                else {
                    d.reject(result);   
                }
            }).catch(function(e) {
                d.reject(e);  
            });
            
            return d.promise;
        };
        
        return CheapFlights;
    }]);
});