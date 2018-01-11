/**
 * Created by Benoit on 01/11/2017.
 */

/**
 *
 */
Nymerus.directive('isFolder', ['msgBus', function (msgBus) {
  return {
    restrict: 'C',
    link: function (scope, element, attr) {
      element.bind('mousedown', function (event) {
        event.preventDefault();
        event.stopPropagation();

        // switch (event.which) {
        //     case 1:
        //         console.log('Left Mouse button pressed.');
        //         break;
        //     case 2:
        //         console.log('Middle Mouse button pressed.');
        //         break;
        //     case 3:
        //         console.log('Right Mouse button pressed.');
        //         break;
        //     default:
        //         console.log('You have a strange Mouse!');
        // }

        let rowElem = element.find('.item-wrapper');
        let infoItemWrapElem = rowElem.find('.info-item-wrapper');
        let name = infoItemWrapElem.html();
        if (name !== undefined)
          msgBus.emitMsg('moveNext', name);
      });
    },
  };
},
]);
