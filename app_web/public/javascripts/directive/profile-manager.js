/**
 * Created by Benoit on 01/11/2017.
 */

/**
 * Angular Directive : Nymerus Profile Manager
 *
 * This directive allow us to modify the content of the current 'My Profile' section.
 * It will display, update, clear block related to the active tab, selected by user click.
 */
Nymerus.directive('nymerusprofilemanager', [
  function () {
    return {
      restrict: 'E',
      link: function (scope, element, attr) {

        const elem = angular.element(element);
        const ul = element.find('.profile-manager-navbar');
        let lastSubElement = elem.find('.profile-manager-content-profile');

        /**
         * Event and UI function
         * Update tab state when clicked and update content with the related tab.
         *
         * @param itemClass
         */
        scope.goTo = function (itemClass) {
          const lastSelected = ul.find('.active');
          const newSelected = ul.find('.' + itemClass + '-nav-tab');
          const newSubElement = elem.find('.profile-manager-content-' + itemClass);

          lastSelected.removeClass('active');
          newSelected.addClass('active');

          newSubElement.css('display', 'block');
          lastSubElement.css('display', 'none');

          lastSubElement = newSubElement;
        };
      },
    };
  },
]);
