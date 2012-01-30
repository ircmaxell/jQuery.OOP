
(function($) {
    $.OOP = $.OOP || {};

    var Class = new $.OOP.Type('Class', function(object) {
        if ($.OOP.instanceOf(object, Function)) object = {
            initialize: object
        };

        var newClass = $.extend(function() {
            reset(this);
            if (newClass.$prototyping) return this;
            this.$caller = null;
            var value = (this.initialize) ? this.initialize.apply(this, arguments): this;
            this.$caller = this.caller = null;
            return value;
        }, this).implement(object);

        $.extend(newClass.prototype, object);

        newClass.$constructor = this;
        newClass.prototype.$constructor = newClass;
        newClass.prototype.parent = parent;

        return newClass;
    });

    var getInstance = function(className) {
        className.$prototyping = true;
        var proto = new className;
        delete className.$prototyping;
        return proto;
    }

    var parent = function() {
        if (!this.$caller) throw new Error('The method "parent" cannot be called.');
        var name = this.$caller.$name,
            parent = this.$caller.$owner.parent,
            previous = (parent) ? parent.prototype[name] : null;
        if (!previous) throw new Error('The method "' + name + '" has no parent.');
        return previous.apply(this, arguments);
    }

    var reset = function(object) {
        for (var key in object) {
            var value = object[key];
            switch($.OOP.typeOf(value)) {
                case 'object':
                    var F = function(){};
                    F.prototype = value;
                    object[key] = reset(new F);
                    break;
                case 'array':
                    object[key] = value.clone();
                    break;
            }
        }
        return object;
    }

    var wrap = function(self, key, method) {
        if (method.$origin) method = method.$origin;
        var wrapper = $.extend(function() {
            if (method.$protected && this.$caller === null) throw new Error('The method "' + key + '" cannot be called.');
            var caller = this.caller,
                current = this.$caller;
            this.caller = current;
            this.$caller = wrapper;

            var result = method.apply(this, arguments);
            this.$caller = current;
            this.caller = caller;
            return result;
        }, {$owner: self, $origin: method, $name: key});
        return wrapper;
    }

    var implement = function(key, value, retain) {
        if (Class.Mutators.hasOwnProperty(key)) {
            value = Class.Mutators[key].call(this, value);
            if (value === null) return this;
        }
        if ($.OOP.typeOf(value) == 'function') {
            if (value.$hidden) return this;
            this.prototype[key] = (retain) ? value : wrap(this, key, value);
        } else {
            var temp = {};
            temp[key] = value;
            $.extend(this.prototype, temp);
        }
        return this;
    }

    Class.implement('implement', $.OOP.overloadSetter(implement));

    var fromArray = function(item) {
        if (item === null) return [];
        return ($.OOP.Type.isEnumerable(item) && typeof item !== 'string') ? item : Array.prototype.slice.call(item);
    }

    var each = function(items, fn, bind) {
        items = fromArray(items);
        if (typeof items === 'array') {
            return items.each(fn, bind);
        }
        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                fn.call(bind, items[key], key, items);
            }
        }
        return items;
    }

    Class.Mutators = {
        Extends: function(parent) {
            this.parent = parent;
            this.prototype = getInstance(parent);
        },
        Implements: function(items) {
            each(items, function(item) {
                var instance = new item;
                for (var key in instance) implement.call(this, key, instance[key], true);
            }, this)
        }
    }

    $.extend($.OOP, {
        'Class': Class
    });


})(jQuery);