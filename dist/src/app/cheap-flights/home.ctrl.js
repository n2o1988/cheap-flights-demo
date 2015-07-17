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
    
    return module.controller('RyanairCheapFlightsMainCtrl', ['$scope', 'RyanairConfig','CheapFlights','$log', function($scope, RyanairConfig, CheapFlights, $log){
        // constants
        var DEFAULT_PERMANENCE = RyanairConfig.DEFAULT_PERMANENCE || 30;
        var MAX_PERMANENCE =RyanairConfig.MAX_PERMANENCE || 30;
        var MAX_RESERVATION_DATE = RyanairConfig.MAX_RESERVATION_DATE || 365;
        var DEFAULT_MAX_PRICE = RyanairConfig.DEFAULT_MAX_PRICE || 500;
        var TODAY = new Date();
        
        var defaultEndDate = new Date();
        defaultEndDate.setDate(defaultEndDate.getDate() + DEFAULT_PERMANENCE); 
        var maxEndDate = new Date();
        maxEndDate.setDate(maxEndDate.getDate() + MAX_RESERVATION_DATE);
        
        
        // the models
        $scope.expandedFlight = null;
        $scope.inbound = false; // shows or hide options for setting inbound parameters
        $scope.search = {
            from: null,
            to: null,
            outStartDate: new Date(),
            outEndDate: defaultEndDate,
            maxPrice: 250
        };
        $scope.result = {
           currencySymbol: '€'
        };
        // sliders models
        // dates (from today to today+1 year
        $scope.outboundDatesSliderRange = {
            min: TODAY,
            max: maxEndDate
        };
        $scope.inboundDatesSliderRange = {
            min: TODAY,
            max: maxEndDate
        };
        $scope.priceSlidersRange = {
            min:0,
            max: DEFAULT_MAX_PRICE
        };
        $scope.tripSlidersRange = {
            min: 1,
            max: MAX_PERMANENCE
        };
        
        
        $scope.onAirportsChanged = function() {
            // in this case, we also reset the current max price
            $scope.onFiltersChanged(true);
        };
        
        $scope.onOutboundDatesChanged = function(handle, date){
            // update the inbound min range, if date is greater than inbound start date
            if(handle === 0 && date > $scope.inboundDatesSliderRange.min){
               updateInboundDates(date);
            }
            $scope.onFiltersChanged();  
        };
        
        // on filters change
        $scope.onFiltersChanged = function(resetMaxPrice) {
            $scope.searchInProgress = true;
            $scope.expandedFlight = null;
            
            CheapFlights($scope.search)
            .then(function(result) {
                // parse results
                $scope.result.flights = result.flights;
                $scope.result.currencySymbol = result.currencySymbol;
                $scope.result.totalCount = result.totalCount;
                $scope.result.count = result.count;
                
                // update min/max values for price
                $scope.priceSlidersRange = {
                    min: 0,
                    max: result.currency ? result.currency.maxPrice : DEFAULT_MAX_PRICE
                };
                
                // reset max price, if requested
                if(resetMaxPrice) {
                    $scope.search.maxPrice = result.currency ? result.currency.defaultPrice : DEFAULT_MAX_PRICE;
                }
            })
            .catch(function(e) {
                $log.error('Error during cheapflights search: ',e);
                //TODO: handle errors for the user
                $log.debug($scope.search);
            })
            .finally(function(e) {
                $scope.searchInProgress = false;
            });
        };
        
        
        $scope.inboundChanged = function(){
            if($scope.inbound) {
                // assign default dates for inbound trip
                
                // min date = dep start date
                // max date = min date + DEFAULT_PERMANENCE
                updateInboundDates($scope.search.outStartDate);
                // set default values for trip permanence
                updateTripValues();
            } else {
                $scope.search.inStartDate = $scope.search.inEndDate = $scope.search.tripMin = $scope.search.tripMax = null;
            }
            // trigger the search
            $scope.onFiltersChanged();
        };
        
        $scope.setExpandedFlight = function($index){
            $scope.expandedFlight = $index;  
        };
        
        $scope.duration = function(flight) {
            var date1 = new Date(flight.dateFrom);
            var date2 = new Date(flight.dateTo);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            return (timeDiff / (1000 * 3600 )).toFixed(1);   
        };
        
        // updates inbound values of range and model based on the outbound values
        function updateInboundDates(date) {
            $scope.search.inStartDate = new Date(date.getTime());
            $scope.search.inEndDate = increaseDate($scope.search.inStartDate, DEFAULT_PERMANENCE);
            // update the range
            $scope.inboundDatesSliderRange = {
                min: date,
                max: maxEndDate
            };
        }
        // set default values for trip permanence
        function updateTripValues(){
            $scope.search.tripMin = 3;
            $scope.search.tripMax = 7;
        }
        
        
        // helper method that returns a date + a quantity
        function increaseDate(date, qnt) {
           var d = new Date(date.getTime());
            d.setDate(d.getDate() + qnt);
            return d;
        }
        
    }]);
});
    
