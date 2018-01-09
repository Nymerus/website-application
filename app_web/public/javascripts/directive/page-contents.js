/**
 * Created by Benoit on 01/11/2017.
 */

/**
 * Angular Directive : Nymerus Page Contents
 *
 * This directive allow us to fake the sensation of using multiples pages (called 'section').
 * This directive manage the 'contents' (part of the user page) by switching 'display' and 'hidden' state of each part.
 * This directive is updated by the 'Nymerus Page Manager' and will only 'display' the current 'content' (related to the 'section').
 */
Nymerus.directive('nymeruspagecontents', ['$compile', 'Parser', 'msgBus', 'HTMLProvider',
  function ($compile, Parser, msgBus, HTMLProvider) {
    return {
      restrict: 'E',
      link: function (scope, element, attr) {

        const elem = angular.element(element);
        const pageBlockClass = ['content-page-file', 'content-page-contact', 'content-page-group',
          'content-page-profile', 'content-page-administration',
        ];
        const stateBlockClass = ['content-state-error', 'content-state-loading'];
        let currentIndex;

        /**
         * Initialization function.
         * Predefined the 'content' to be print.
         * Triggered when 'NymerusPageContents' is defined.
         */
        scope.initContents = function () {
          currentIndex = -1;
          transitionPageIndex(-2);
        };

        /**
         * Event function.
         * Will react by trigger transition form the previous content with the current one.
         */
        msgBus.onMsg('updateContents', function (event, data) {
          // console.log('Directive PC : Event updateContents received.');
          transitionPageIndex(data.index);
        }, scope);

        /**
         * Math function : Absolute value
         * Take a number and get the same if >= 0 or its opposite when < 0.
         *
         * @param x
         * @return number
         */
        const abs = function (x) {
          if (x < 0)
            return (x * -1);
          return x;
        };

        /**
         * UI function
         * Display the current content when hiding the previous one.
         * Triggered by msgBus.onMsg('updateContents', function).
         *
         * @param new_index
         */
        const transitionPageIndex = function (newIndex) {
          if (currentIndex !== newIndex) {
            updateBlockDisplay(currentIndex, 'none');
            updateBlockDisplay(newIndex, 'block');
            currentIndex = newIndex;
          }
        };

        /**
         * UI function.
         * Modify the state of 'display' of the defined (index) content.
         * Triggered by transitionPageIndex().
         *
         * @param index
         * @param state
         */
        const updateBlockDisplay = function (index, state) {
          if (index < 0)
            elem.find('.' + stateBlockClass[abs(index) - 1]).css('display', state);
          else
            elem.find('.' + pageBlockClass[index]).css('display', state);
        };

        scope.initContents();
      },
    };
  },
]);
