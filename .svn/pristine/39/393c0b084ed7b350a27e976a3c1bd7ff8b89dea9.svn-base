!function (a, b) {
    a.module("ngValidate", []).directive("ngValidate", function () {
        return {
            require: "form",
            restrict: "A",
            scope: {ngValidate: "="},
            link: function (a, c, d, e) {
                var f = c.validate(a.ngValidate);
                e.validate = function (a) {
                    var l = Ladda.create(document.querySelector('.ladda-button'));
                    l.start();
                    var c = f.settings;
                    f.settings = b.extend(!0, {}, f.settings, a);
                    var d = f.form();
                    if (d == false)
                        toastr.error("There are " + f.numberOfInvalids() + " invalid fields.", e.$name + ' Form');
                    if (d == true)
                        toastr.success("There are " + f.numberOfInvalids() + " invalid fields.", e.$name + ' Form');
                    l.stop();
                    return f.settings = c, d
                }, e.numberOfInvalids = function () {
                    return f.numberOfInvalids()
                }
            }
        }
    }).provider("$validator", function () {
        return b.validator.setDefaults({onsubmit: !1}), {
            setDefaults: b.validator.setDefaults,
            addMethod: b.validator.addMethod,
            setDefaultMessages: function (c) {
                a.extend(b.validator.messages, c)
            },
            format: b.validator.format,
            $get: function () {
                return {}
            }
        }
    })
}(angular, jQuery);