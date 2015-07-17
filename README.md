# cheap-flights-demo
This is a demo project for a front-end development challenge at Ryanair Labs. 
It consists of a small AngularJS web app using the live Ryanair API for cheap flight information. The web app is made of the following components:

- A form which allows a user to choose an origin, a destination, and a date period. 
- When a button is pressed, a component which shows all the information relating to the cheapest flight between those points, for the chosen date period

Airport Picker
The for allows the user to fill in both origin and destination but also just one of them: in case the user fills the origin, 
the search will show cheapest flights departing from that airport. Vice-versa, if the user only fills the destination, then the flights reaching that destination will be shown.

Autocomplete
The airport picker comes with an autocomplete component, which is visually based on the "Fare Finder" component at ryanair.com
(http://www.ryanair.com/en/cheap-flights/?from=STN).
The provided component also includes the following:
* while typing, he can press UP and DOWN keys to move the cursor of the "Airports" column. This allows him to simply select the desired entry as like as a normal dropdown. 
* Visual enhancements (animation, showing context information about the search - i.e. the "Airports reaching London Luton" string or "Airports reached by London Luton" instead of the normal "Airports", in some cases. 
The component has been implemented as a standalone directive, re-usable in different parts of the application (such as the Booking page).
A further enhancement is the possibility to pre-select the nearest airport to the user. The functionality was about to be implemented (the web app asks for location permissions) but it's incomplete due to time restrictions.

Dates Slider
The user can select the date range with the use of a slider, which is responsive and mobile-friendly (touch enabled). This component is again a generic directive build on top of a vanilla JS lightweigh library called noUiSlider. It can be used for both numeric and dates ranges (by converting dates in integer using the "getTime()" function. 
The component can be configured with one or two handle. 

Return Flight
Even though it was not required for the purpose of the demo, the form shows an option to add a return flight, so that the user can see what cheap flights are available in case of roundtrip journey. 
As a plus, the component syncronizes with the Departure Date range, so that when the start of Departure date becomes greater than the start of Return date, the latter is resetted. 

Results box
The results box contains all information about the cheapest flights, coming from the live web api at 
http://www.ryanair.com/en/api/2/flights/
The relevant offers are highlighted. If the user clicks a result, it will expand to show more informations (currently just the date/time details of outbound and inbound and the durations). 
In my mockup there should have been a map displaying the connection between the airports. In the demo a map "image" is showed instead, because of time restrictions. 

Responsive
The template is responsive and quite usable on mobile. Of course enhancement are definately possible, for example collapsing the filter panel on mobile, after the search is triggered again. 

Cross-browser 
The app have been successfully tested on Chrome/Firefox/Opera (latest versions) and IE 9+. 
IE 8 support is challenging but not impossible to achieve, thanks to the many shims and polyfill available. 
The template loads the polyfills in the index.html file, with the help of Modernizr for checking. 
Currently only one polyfill is given, but the reasoning is the same for the missing ones. 

Tests
Unfortunately, I could not provide automated tests, because of the lack of time. As I have used Grunt as building system, it is easy to introduce some unit-tests using Karma (with the grunt contrib), to automate the process at build time. 

CORS problems
For the first call (the "live" airports list from the main ryanair.com domain) I've simply used the jsonp format. Instead for the live "cheap-flights" api, I used a .php proxy file which gets the url in querystring, make the call and returns back with results to the front-end (which is on the same domain, so no problems). 
Important notes: the proxy script is as simpliest as possible and potentially vulnerable (it does not check for a list of "authorized" domains).

Structure
The structure of the application is modular and it uses RequireJS for dependency management. 
We have a main AngularJS app, which is the "host" for different modules. Some of them are in the "src/app/common" folder and are common directives and services that every module could use. The "cheap-flights" module, which is the main application module by now, is making extensive use of the common modules.

Notes about JQuery
it is included by the build project because of the bootstrap bower dependancy, but it is not used in the project. I just used bootstrap for the css parts.
