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
    './module',
    'text!./airports-picker.tpl.html'
], function(ng, module, airportsPickerTpl) {
    'use strict';
    
    // register cache
    module.run(['$templateCache', function($templateCache) {
        $templateCache.put('./airports-picker.tpl.html', airportsPickerTpl);
    }]);
    
    /**
     * This directive is responsible for showing the user the "airport picker", from which he can select a destination and a source
     * airport. 
     * @param fromModel: the model where to store the source airport
     * @param toModel: the model where to store the destination airport
     * @param [onChange]: the callback to call when the user updates its airports
     */ 
    module.directive('ryrAirportsPicker', ['$log', '$rootScope', '$timeout', 'AirportsData', function($log,$rootScope,$timeout, AirportsData){
        
        return {
            restrict: 'E',
            replace: true,
            scope: {
                from: '=fromModel',
                to: '=toModel',
                onChange: '='
            },
            templateUrl: './airports-picker.tpl.html', // registered from cache (see above)
            link: function(scope, element, attrs){
                // Vars
                var HOT_KEYS = [
                    13, // ENTER
                    27, // ESC
                    9,  // TAB
                    16, // SHIFT (for back-tab)
                    17, // CTRL
                    38, // UP ARROW    
                    40  // DOWN ARROW
                ];
                var lastSearch = null; // to avoid unnecessary "matching" cycles
                var inputDirty = false; // to keep track of the user action
                // this is one-directional bound to the <ul> list of airports results, for improving searches using getElementById
                scope.resultsListId = "ryr-airports-picker-results_"+(Math.random().toString().substring(2,8)); 
                
                
                // check required attributes
                if(!attrs.fromModel || !attrs.toModel) {
                    $log.error('ryrAirportsPicker: required attributes "from-model" or "to-model" are missing');
                    return;
                }
                
                
                // picker status: open or closed
                scope.pickerOpened = false;
                // search model
                // bound with the string the user is typing. This value is updated by the onKeydownHandler 
                // for performance reasons it is only updated once the user has stopped typing for 200 ms 
                // It refers to both the from and the to models, basing on which field has the focus
                scope.currentModelName = null; 
                scope.currentModelValue = ""; 
                scope.fromSearch ="";
                scope.toSearch = "";
                scope.activeAirportIndex = -1;
                // Get data
                scope.loadingData = true;
                // RyanairData will retrieve the airports and valorize the "airports" array. 
                // The callback is useful to visually update the "loading" icon status
                //var countries = AirportsData.getCountries();
                var airports = {};
                var countries = {};
                
                // get both countries and airports
                AirportsData.getAll().then(function(data) {
                    scope.loadingData = false;
                    airports = data.airports;
                    countries = data.countries;
                    // if the user has focused the field prior to this initialization, we should process the data
                    if(scope.pickerOpened){
                        match(); // populates the visibleCountries and visibleAirports
                    }
                });

                
                /**
                 * A wrapper for the onChange callback that checks if the function is defined or not.
                 */
                function onChangeWrapper() {
                    if(scope.onChange && typeof scope.onChange == "function") {
                        $timeout(function(){
                            scope.onChange();
                        });
                    }
                }
                
                /**
                 * returns the first element that matches
                 */
                function firstMatch(){
                    // if the active element index is set, use that
                    if(scope.visibleAirports.length) {
                        if(scope.activeAirportIndex >= 0 && scope.activeAirportIndex < scope.visibleAirports.length){
                            return scope.visibleAirports[scope.activeAirportIndex];
                        }
                        return scope.visibleAirports[0];
                    }   
                    return null;
                }
                
                /**
                 * select the airports and the related countries that match the current conditions (keyword and routes)
                 * This solution is preferred to the standard collection filter because it is triggered only one time, 
                 * at the moment of binding (which is delayed by 200 ms)
                 */
                function match(selectedCountry){
                    var search = scope.currentModelValue;
                    var searchKey = scope.currentModelName+search;
                    
                    // if this is a "country" search, skip the search and update the searchkey
                    if(selectedCountry) {
                        search = null;   
                        searchKey += selectedCountry.code;
                    }
                    
                    if(scope.loadingData || searchKey == lastSearch) {
                        return;   
                    }
                    lastSearch = searchKey;
                    
                    var visibleCountries = [], visibleAirports = [], visibleAirportCountriesMap = {}, highlightAirportCountriesMap = {};
                    var searchRegExp = search ? new RegExp(search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"),'i') : null;
                    var isToModel = scope.currentModelName == 'to';
                    
                    
                    
                    // airports
                    for(var airportCode in airports) {
                        var airport = airports[airportCode];
                        // we add this result if 
                        // * search is null 
                        // * match occurres
                        // * route is available
                        // * user has clicked on a country, then we only show what's in that country
                        
                        // first thing first, see if this airport is connected by the dual
                        var isReachable = true; 
                        
                        
                        // if this is "to" and "from" is set, check connection from the other side
                        if(isToModel && scope.from){
                            isReachable = scope.from.routes.indexOf(airportCode) >= 0;
                        } else if(!isToModel && scope.to) {
                            // vice-versa, we set the "to" model. We could show 
                            isReachable = scope.to.routes.indexOf(airportCode) >= 0;
                        }
                        
                        if(isReachable) {
                            var isMatching = !search || searchRegExp.test(airport.name);
                            
                            // check of country
                            if(selectedCountry) {
                                isMatching = isMatching && (selectedCountry.code == airport.countryCode);   
                            }
                            
                            if(isMatching) {
                                visibleAirports.push(airport);   
                                // store the country as "highlight"
                                highlightAirportCountriesMap[airport.countryCode] = true;
                                
                            }
                            // store the country for this airport
                            visibleAirportCountriesMap[airport.countryCode] = true;
                        }
                    
                    }
                    
                    // countries
                    
                    for(var c in countries) {
                        // add this entry if 
                        // * no "counterpart" (from or to) is set -> always visible
                        // * counterpart is set and there are matched airports of that country (see visibleAirportCountriesMap)
                        if(visibleAirportCountriesMap[c]){
                            var country = countries[c];
                            visibleCountries.push(country);   
                            
                            // "selected" status
                            country._selected = selectedCountry && country.code == selectedCountry.code;
                            country._highlight = search && highlightAirportCountriesMap[country.code] === true;
                        }
                    }
                        
                    scope.visibleCountries = visibleCountries;
                    scope.visibleAirports = visibleAirports;
                    
                    // first entry of visible airports becomes active
                    if(visibleAirports.length) {
                        scope.activeAirportIndex = 0;
                    }
                }
                
                
                /**
                 * Checks for special keys like the arrows 
                 */
                 scope.onKeydown = function($evt) {
                     var airportsLength = scope.visibleAirports.length;
                     if(airportsLength > 0){
                        var which = $evt.which || $evt.keyCode;
                        var currentIndex = scope.activeAirportIndex;
                        var newIndex;

                        switch(which) {
                            case 38:
                                // UP ARROW  
                                // set an upper airport as active 
                                newIndex = (currentIndex -1)%airportsLength;
                                if(newIndex < 0){
                                    newIndex = airportsLength-1;
                                }
                                break;
                            case 40:
                                // DOWN ARROW   
                                // set a lower airport as active
                                newIndex = (currentIndex +1)%airportsLength;
                                break;
                            case 13:
                                // ENTER
                                // trigger a selection of the current entry
                                scope.selectAirport(firstMatch(),$evt);
                                // lose focus
                                var ind = scope.currentModelName == "from" ? 0 : 1;
                                element[0].getElementsByTagName('input')[ind].blur();
                                break;
                        }
                         
                        if(newIndex !== undefined) {
                            // move the cursor to the desired position
                            $evt.preventDefault();
                            scope.activeAirportIndex = newIndex;
                            // ui update: scroll to the correct element if it's hidden
                            //1) get the real element 
                            var lis = document.getElementById(scope.resultsListId).children;
                            if(lis.length > newIndex){
                                var listItem = lis[newIndex];
                                // scrollIntoView(false) will make it scroll to "bottom". This is an awesome functionality and should in all major browsers
                                if(listItem.scrollIntoView) {
                                    listItem.scrollIntoView(false); 
                                }

                            }
                        }
                     }
                };
                
                
                /**
                 * Triggered whenever the user types something to handle the functions of the component
                 */
                scope.onKeyup = function($evt) {
                    // use a timer to handle the $digest
                    var which = $evt.which || $evt.keyCode;
                    scope.currentModelValue = $evt.target.value;
                    // trigger the search only if a char key is typed
                    if(HOT_KEYS.indexOf(which) == -1) {
                        inputDirty = true;
                        match();
                    }
                };
                
                /**
                 * Triggered whenever the user focus on one of the inputs
                 */
                scope.onFocus = function(modelName, modelValue){
                    scope.pickerOpened = true;
                    // evaluate the model
                    scope.currentModelName = modelName;
                    scope.currentModelValue = modelValue;
                    inputDirty = false;
                    match();
                };
                
                /**
                 * Triggered when the user leave an input field
                 */
                scope.onBlur = function(){                    
                    scope.pickerOpened = false;
                    if(inputDirty) {
                        
                        // if the user has actively played by typing in the input
                        if(!scope.currentModelValue){
                            scope[scope.currentModelName] = null;
                        } else {
                            scope.selectAirport(firstMatch());
                        }
                    }
                };
                
                
                /**
                 * Reverts the "from" input with the "to" input to swap destination and departure
                 */
                scope.reverse = function(){
                    // Switch models
                    var temp = scope.from;
                    scope.from = scope.to;
                    scope.to = temp;
                    // Switch searches
                    temp = scope.fromSearch;
                    scope.fromSearch = scope.toSearch;
                    scope.toSearch = temp;
                    onChangeWrapper();
                };
                
                /**
                 * Select the airport (by click or by code)
                 */
                scope.selectAirport = function(airport, $evt) {
                    if($evt && ($evt.type == "mousedown" || $evt.type == "keydown")){
                        
                        // to avoid double calling this method, set the input status to not dirty
                        inputDirty = false;
                    }
                    
                    scope[scope.currentModelName] = airport;
                    if(airport){
                        scope[scope.currentModelName+'Search'] = airport.name;
                    } else  {
                        scope[scope.currentModelName+'Search'] = null;
                    }
                    onChangeWrapper();
                };
                
                /**
                 * Filter the possible airports by country
                 */
                scope.setCountry = function(country, $evt) {
                    $evt.preventDefault();
                    $evt.stopImmediatePropagation();
                    match(country);
                };
                
                
                // INit position
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position){
                        //TODO: deal with it. Find the closest airport (maybe euclidean distance?)
                    });
                }
            }
        };
    }]);
});
