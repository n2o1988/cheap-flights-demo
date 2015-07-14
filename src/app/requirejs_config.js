/*
Copyright (c) Tue Jul 14 2015 Lamberto Fichera

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORTOR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
require.config({

    // optimizer configuration
    'generateSourceMaps': true,
    'preserveLicenseComments': false,
    'useSourceUrl': true,

    // runtime paths and shims
    paths: {
        angular: '../vendor/angular/angular.min',
        angularRoute: '../vendor/angular-route/angular-route.min',
        angularTranslate: '../vendor/angular-translate/angular-translate.min',
        domReady: '../vendor/requirejs-domready/domReady',
        text: '../vendor/requirejs-text/text'
    },
    shim: {
        "angular": {
            exports: "angular"
        },
        "angularRoute": {
            deps: ["angular"]
        },
        "angularTranslate": {
            deps: ["angular"]
        }
    },

    priority: [
		"angular"
	],

    // kick start application
    deps: ["./bootstrap"]

});
