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
    './module',
    'noUiSlider'
], function(ng, module, noUiSlider) {
   'use-strict';
    
    module.directive('ryrSlider',['$log', '$parse', function($log, $parse){
        return {
            link: function(scope, element, attrs) {
                
                if((!attrs.fromModel || !attrs.toModel) && !attrs.model) {
                    $log.error('ryrSlider: required attributes ("from-model" and "to-model") or ("model") are missing');
                    return;
                }
                if(!attrs.range) {
                    $log.error('ryrSlider: required attribute "range" is missing');
                    return;
                }
                
                var fromModelAccessor = attrs.fromModel ? $parse(attrs.fromModel) : null;
                var toModelAccessor = attrs.toModel ? $parse(attrs.toModel) : null;
                var modelAccessor = attrs.model ? $parse(attrs.model) : null;
                var rangeAccessor = attrs.range ? $parse(attrs.range) : null;
                var step = attrs.step ? parseInt(attrs.step) : null;
                var onChangeCallback = attrs.onChange && typeof(scope[attrs.onChange]) == "function" ? attrs.onChange : null;
                
                var isSingleHandleMode = modelAccessor !== null;
                var isDatesMode = attrs.type == 'date';
                var isIntegerMode = step !== null;
                var doNotRecreate = false;
                
                // add the class 
                element[0].className = element[0].className + ' ryr-slider ' + (isDatesMode ? 'ryr-slider-dates' : 'ryr-slider-numbers');
                
                // watches
                // single callback: we skip the value returned and just use the $parse accessors. This allows us to 
                // create a single callback for all of the watchers
                // we use "val" just to check if we can "try" to retrieve the other values 
                // (if val is undefined or null, then there will be at least one required parameter unset, then
                // we cannot create the slider)
                var singleWatchCallback = function(val) {
                    if(doNotRecreate) {
                        // the update is coming from the slider. 
                        doNotRecreate = false;
                        return;
                    }
                      // destroy 
                    destroySlider();
                    
                    if(val) {
                        
                        
                        var range = rangeAccessor(scope);
                        
                        
                        if(range && range.min !== undefined && range.max !== undefined) {
                            
                            var start;
                            if(isSingleHandleMode) {
                                start = [modelAccessor(scope)];
                            } else {
                                start = [
                                    fromModelAccessor(scope),
                                    toModelAccessor(scope)
                                ];

                            }
                            
                            createSlider(start, range);
                        }
                    }
                };
                // range {min: #, max: #} 
                var rangeWatch = scope.$watch(attrs.range, singleWatchCallback);
                
                // models
                var modelWatch, fromWatch, toWatch;
                if(isSingleHandleMode){
                    // watch single model attr      
                    modelWatch = scope.$watch(attrs.model, singleWatchCallback);    
                } else {
                    fromWatch = scope.$watch(attrs.fromModel, singleWatchCallback);
                    toWatch = scope.$watch(attrs.toModel, singleWatchCallback);
                }
                
                
                
                // destroy a previous slider
                function destroySlider(){
                    if(element[0].noUiSlider) {
                        element[0].noUiSlider.off('set');
                        element[0].noUiSlider.off('update');
                        element[0].noUiSlider.destroy();
                    }
                }
                // creates a new slider
                function createSlider(start, range){
                    var opts = {
                        start: getStartValue(start),
                        range: getRangeValue(range),
                        connect: isSingleHandleMode ? "lower" : true
                    };
                    if(step) {
                        opts.step = step;   
                    }
                    
                    if(!Array.isArray(opts.start) || opts.start[0]===undefined) {
                        $log.debug("invalid  start array");
                        return;   
                    }
                    
                    noUiSlider.create(element[0], opts);
                    // bind for value changes 
                    element[0].noUiSlider.on('set', valueSet);
                    createTooltips();
                }
                
                // Dates section
                // Wrapper for the correct value: model value to slider value (which is always number)
                function getSliderValue(val){
                    if(isDatesMode && val instanceof Date){
                       return val.getTime();
                    }
                    return val;
                }
                // the opposite, slider value to model value
                function getModelValue(val) {
                   if(isDatesMode) {
                       // revert to date
                       return new Date(parseInt(val));
                   }
                    return isIntegerMode ? parseInt(val) : val;
                }
                
                function getStartValue(start) {
                    if(Array.isArray(start)) {
                        var arr = [];
                        start.forEach(function(el){
                            arr.push(getSliderValue(el)); 
                        });
                        return arr;
                    }
                    return getSliderValue(start);
                }
                function getRangeValue(range) {
                   return {
                        min: getSliderValue(range.min),
                       max: getSliderValue(range.max)
                   };
                }
                
                // listen for plug-in changes
                // on set
                function valueSet(values, handle){
                    var newValue = getModelValue(values[handle]); // handle = 0 -> left(from), handle = 1 -> right(to). values is an array
                    // back to the model
                    if(isSingleHandleMode) {
                        modelAccessor.assign(scope, newValue);
                    } else {
                        if(handle === 0) {
                            fromModelAccessor.assign(scope, newValue);   
                        } else {
                            toModelAccessor.assign(scope, newValue);   
                        }
                    }
                    if(!scope.$$phase) {
                        doNotRecreate = true;
                        
                        // callback
                        if(onChangeCallback) {
                            scope[onChangeCallback](handle, newValue);
                        }
                        scope.$digest();   
                    }
                }
                // create tooltips (to use "on update")
                function createTooltips(){
                    var tipHandles = element[0].getElementsByClassName('noUi-handle'),
                        tooltips = [];

                    // Add divs to the slider handles.
                    for ( var i = 0; i < tipHandles.length; i++ ){
                        tooltips[i] = document.createElement('div');
                        tooltips[i].className += 'ryr-slider-tooltip';
                        tipHandles[i].appendChild(tooltips[i]);
                    }

                    // Add a class for styling

                    // When the slider changes, write the value to the tooltips.
                    element[0].noUiSlider.on('update', function( values, handle ){
                        var val = getModelValue(values[handle]);
                        if(isDatesMode){
                            val = val.toDateString();   
                        } 
                        tooltips[handle].innerHTML = val;
                    });   
                }
                
                scope.$on('$destroy', function(){
                    rangeWatch();
                    
                });
            }
        };
    }]);
});

