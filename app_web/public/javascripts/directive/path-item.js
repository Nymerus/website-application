/**
 * Created by Benoit on 01/11/2017.
 */

/**
 *
 */
Nymerus.directive('pathItem', ['msgBus', function (msgBus) {
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

        let pathItem = element.find('.path-item');
        let id = pathItem.attr('id') + '';
        let pos = id.split('-')[1];
        let name = pathItem.html();

        // console.log('Directive pI : Path '' + name + '' [POS n°' + pos + '] has been clicked');
        if (pos !== undefined)
          msgBus.emitMsg('moveBackTo', [name, pos]);
      });
    },
  };
},
]);

