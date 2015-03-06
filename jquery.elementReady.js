/**
 * jquery.elementReady.js
 * jQuery plugin which fires a callback when an element is added to the DOM
 * Jan Míšek <jan.misek@rclick.cz>
 * License: MIT
 *
 *     Usage:
 *
 *     ```
 *         $(element).elementReady('.class', function() {
 *              console.log('element of given selector .class is added or already existed in the DOM');
 *         });
 *     ```
 *
 */

/* global JQuery */

(function ($) {

    $.fn.elementReady = function (selector, callback, options) {
        $.extend(
            {
                exception: true
            },
            options || {});

        // are elements in DOM already
        var elements = $(selector);
        if (elements.length) {
            callback(elements);
            return this;
        }

        // not, try to use mutation observer, first check for browser availability
        if (typeof MutationObserver === undefined || !MutationObserver) {
            if (options.exception) {
                throw new Error('browser does not support mutation observers');
            } else {
                return this;
            }
        }

        // Compatibile, lets use mutation observer
        var observer = new MutationObserver(function (mutations) {
            mutations.some(function (mutation) {
                if (mutation.addedNodes) {
                    var elements = $(mutation.addedNodes).filter(selector);
                    if (elements.length) {
                        observer.disconnect();
                        callback(elements);
                        return true;
                    }
                }
            }.bind(this));
        }.bind(this));

        // do observation
        observer.observe(element, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        return this;
    };

}(jQuery));
