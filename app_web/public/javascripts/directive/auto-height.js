/**
 * Created by Benoit on 01/11/2017.
 */

// adapt height item depending of the window height
Nymerus.directive('autoheight', ['$window', function ($window) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      function setPixels() {
        const ph = $window.innerHeight;
        const pixels = ph - attrs.substractvalue;
        element.css('height', pixels);
      }

      angular.element($window).bind('resize', function () {
        setPixels();
        scope.$apply();
      });

      setPixels();
    },
  };
},
]);
