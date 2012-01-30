
(function($) {
    $.OOP = $.OOP || {};

    var enumerables = true;
    for (var i in {toString: 1}) enumerables = null;
    if (enumerables) enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];

    var instanceOf = function(item, object) {
        if (item == null) return false;
        var constructor = item.$constructor || item.constructor;
        while (constructor) {
            if (constructor === object) return true;
            constructor = constructor.parent;
        }
        return item instanceof object;
    };

    var overloadSetter = function(obj, usePlural) {
        return function(a, b) {
            if (a === null || a === undefined) return this;
            if (usePlural || typeof a !== 'string') {
                for (var k in a) obj.call(this, k, a[k]);
                if (enumerables) for (var i = enumerables.length; i--;) {
                    k = enumerables[i];
                    if (a.hasOwnProperty(k)) obj.call(this, k, a[k]);
                }
            } else {
                obj.call(this, a, b);
            }
            return this;
        }
    };

    var typeOf = function(item) {
        if (item === null || item === undefined) return 'null';
        if (item.$family !== null && item.$family !== undefined) return item.$family;

        if (item.nodeName) {
            if (item.nodeType == 1) return 'element';
            if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
        } else if (typeof item.length == 'number') {
            if (item.callee) return arguments;
        }
        return typeof item;

    }

    $.extend($.OOP, {
        'instanceOf': instanceOf,
        'overloadSetter': overloadSetter,
        'typeOf': typeOf
    });
})(jQuery);
