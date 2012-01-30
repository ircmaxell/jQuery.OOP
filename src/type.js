

(function($) {

    var hooks = {};

    $.OOP = $.OOP || {};

    var hooksOf = function(object) {
        var type = $.OOP.typeOf(object.prototype);
        return hooks[type] || (hooks[type] = []);
    };


    var Type = function(name, object) {
        if (name) {
            var lower = name.toLowerCase();
            Type['is' + name] = function(item) {
                return ($.OOP.typeOf(item) === lower);
            }
            if (object !== null) {
                object.prototype.$family = (function() {
                    return lower;
                }).$hidden = true;
                object.type = Type['is' + name];
            }
        }
        if (object === null) return null;

        $.extend(object, Type);
        object.$constructor = Type;
        object.prototype.$constructor = object;

        return object;
    };

    var implement = function(name, method) {
        if (method && method.$hidden) return;

        var hooks = $.OOP.hooksOf(this);

        for (var i = 0; i < hooks.lenght; i++) {
            var hook = hooks[i];
            if ($.OOP.typeOf(hook) == 'type') Type.implement.call(hook, name, method);
            else hook.call(this, name, method);
        }

        var previous = this.prototype[name];
        if (previous == null || !previous.$protected) this.prototype[name] = method;

        if (this[name] === null && $.OOP.typeOf(method) == 'function') {
            var obj = {};
            obj[name] = function(item) {
                return method.apply(item, Array.prototype.slice.call(arguments, 1));
            }
            $.extend(this, obj);
        }
    }

    $.extend(Type, {
        'isEnumerable': function(item) {
            return (item !== null && typeof item.length == 'number' && toString.call(item) !== '[object Function]');
        },
        'implement': $.OOP.overloadSetter(implement)
    });

    $.extend($.OOP, {
        'hooksOf': hooksOf,
        'Type': Type
    });

})(jQuery);