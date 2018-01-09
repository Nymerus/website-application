/**
 * Created by Benoit on 01/11/2017.
 */

// vertical center element on parent element
Nymerus.directive('centerVerticallyParent', ['$window', function ($window) {
  return {
    restrict: 'C',
    link: function (scope, element, attrs) {
      scope.parentwindow = attrs.parentwindow || 'false';
      let pixels; let p;

      if (scope.parentwindow === 'true') p = angular.element($window);
      else p = angular.element(element.parent());

      function setPixels() {
        setTimeout(function () {
          const ph = p.height();
          const eh = element.height();

          // console.log('ph = ' + ph + ', eh = ' + eh);
          pixels = (ph / 2) - (eh / 2);

          // console.log('pixels = ' + pixels);
          element.css('top', pixels);
        }, 1);
      }

      p.bind('resize', function () { setPixels(); });

      setPixels();
    },
  };
},
]);
