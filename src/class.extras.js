

(function($) {
    $.OOP = $.OOP || {};

    var removeOn = function(string) {
        return string.replace(/^on([A-Z])/, function(full, first) {
            return first.toLowerCase();
        })
    }

    var Events = new $.OOP.Class({
        initEvents: function(events) {
            for (var event in events) {
                this[events[event]] = (function(event) {
                    return function(callback) {
                        this.bind(event, callback);
                        return this;
                    };
                })(events[event]);
            }
        },
        bind: function (name, callback) {
            $(this).bind(name, callback);
            return this;
        },
        fireEvent: function(type, args) {
            $(this).trigger(type, args);
        },
        unbind: function(name, callback) {
            $(this).unbind(name, callback);
        }
    });

    var Options = new $.OOP.Class({
        options: {},
        setOptions: function(options) {
            $.extend(this.options, options)
            if (this.bind) {
                for (var option in this.options) {
                    var test = $.OOP.typeOf(this.options[option]);
                    if (test === 'function' && (/^on[A-Z]/).test(option)){
                        this.bind(removeOn(option), this.options[option]);
                        delete this.options[option];
                    }
                }
            }
            return this;
        }
    });

    $.extend($.OOP, {
        'Events': Events,
        'Options': Options
    });
})(jQuery);