/**
 * Created by Benoit on 01/11/2017.
 */

// Catch drop of file over bind element
Nymerus.directive('draganddrop', ['msgBus', function (msgBus) {
  return {
    restrict: 'E',
    link: function (scope, element, attrs) {

      element.on('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
      });

      element.on('dragenter', function (e) {
        e.preventDefault();
        e.stopPropagation();
      });

      element.on('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (e.originalEvent.dataTransfer) {
          if (e.originalEvent.dataTransfer.files.length > 0) {
            upload(e.originalEvent.dataTransfer.files);
          }
        }

        return false;
      });

      const upload = function (files) {
        let i; let f;
        for (i = 0; f = files[i]; ++i) {
          msgBus.emitMsg('newFileDropped', f);
        }
      };
    },
  };
},
]);
