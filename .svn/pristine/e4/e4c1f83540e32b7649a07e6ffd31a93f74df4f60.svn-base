var rootscope = '';
app.run(['$rootScope', '$state', 'setting', function ($rootScope) {
    rootscope =  $rootScope;

    /** Loading
     **************************************************************** **/
    $rootScope.loading_start = function () {
        $('body').waitMe({
            effect: 'rotation',
            text: 'Please wait',
            bg: 'rgba(0, 0, 0, 0.5)',
            color: '#FFFFFF',
        });
    };

    $rootScope.loading_stop = function () {
        $('body').waitMe('hide');
    };
    /** End Loading
     **************************************************************** **/

    /** Sweet Alert
     **************************************************************** **/
    //$rootScope.sweal = function (title,text,type,cancel_but,confirm_but,call_back) {
    $rootScope.sweal = function (title, text, type, other) {
        title = typeof(title) == "undefined" ? "Confirmation" : title;
        text = typeof(text) == "undefined" ? "Are you Sure" : text;
        type = typeof(type) == "undefined" ? "warning" : type;
        other = typeof(other) == "undefined" ? {} : other;
        other.cancel_but = typeof(other.cancel_but) == "undefined" ? false : other.cancel_but;
        other.confirm_but = typeof(other.confirm_but) == "undefined" ? "Ok" : other.confirm_but;
        $rootScope.sweet.show({
            title: title,
            text: text,
            type: type,
            showCancelButton: other.cancel_but,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: other.confirm_but,
            closeOnConfirm: false,
            closeOnCancel: false
        }, function (isConfirm) {
            if (other.call_back != "" && typeof(other.call_back) != "undefined") {
                console.log("if");
                $rootScope.alertRet[other.call_back](isConfirm);
            }
            else {
                console.log("else");
                $rootScope.sweet.close();
            }
        });
    };
    /** End Sweet Alert
     **************************************************************** **/

    /** Date Picker
     **************************************************************** **/
    $rootScope.date = function (date, elem) {
        /*date = typeof(date) == "undefined" ? {} : date;
         date.start = typeof(date.start) == "undefined" ? false : date.start;
         date.end = typeof(date.end) == "undefined" ? false : date.end;*/
        $(elem).datepicker({
            format: "dd/mm/yyyy",
            todayHighlight: !0,
            autoclose: !0,
            todayBtn: true,
            todayBtn: "linked",
            startDate: date.start, //false
            endDate: date.end //false
        }).on('changeDate', function (dObj) {
            put_date_for_db(dObj);
        });
    };
    function put_date_for_db(dObj) {
        if (typeof(date_pick_callback) != "undefined") date_pick_callback(dObj);

        if ($(dObj.currentTarget).prop('nodeName').toLowerCase() == "input")
            $(dObj.currentTarget).trigger("blur");
        else
        //$(dObj.currentTarget).find(".validate_date").trigger("blur");
            var par = $(dObj.currentTarget).parent('div');
        var obj = dObj.date;

        if (par.find(".date_to_db").length == 1) {
            var DBdate = obj.getFullYear() + "-" + (parseInt(obj.getMonth()) + 1) + "-" + obj.getDate();
            par.find(".date_to_db").val(DBdate);
        }

        if (par.find(".date_to_us").length == 1) {
            var DBdate = (parseInt(obj.getMonth()) + 1) + "/" + obj.getDate() + "/" + obj.getFullYear();
            par.find(".date_to_us").val(DBdate);
        }
    }

    /** End Date Picker
     **************************************************************** **/

    /** Time Picker
     **************************************************************** **/
    $rootScope.time = function (time, elem) {
        $(elem).datetimepicker({
            startDate: time.start,
            endDate: time.end,
            minuteStep: time.step,
            startView: 1, // 2 or 1
            autoclose: 1,
            minView: 0,
            maxView: 1,
            showMeridian: true,
            //format: 'hh:ii',
            //format: 'hh:ii',
        });
    };
    /** End Time Picker
     **************************************************************** **/

    /** Toast
     **************************************************************** **/
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000", // How long the toast will display without user interaction
        "extendedTimeOut": "1000", // How long the toast will display after a user hovers over it
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "slideDown",
        "hideMethod": "slideUp"
    };
    /** End Toast
     **************************************************************** **/

    /** Modal
     **************************************************************** **/
    $rootScope.modal = function (modal) {
        modal = typeof(modal) == "undefined" ? {} : modal;
        modal.id = typeof(modal.id) == "undefined" ? '' : modal.id;
        modal.width = typeof(modal.width) == "undefined" ? '900' : modal.width;
        modal.effect = typeof(modal.effect) == "undefined" ? 'rotate' : modal.effect;
        modal.esckey = typeof(modal.esckey) == "undefined" ? true : modal.esckey;

        Custombox.open({
            target: '#' + modal.id,
            width: modal.width, //'900',
            effect: modal.effect, //'sign',
            overlayClose: modal.esckey,
            escKey: modal.esckey,
            open: function () {
                if (modal.open_callback != "" && typeof(modal.open_callback) != "undefined") {
                    $rootScope.modalcall[modal.open_callback]();
                }
            },
            complete: function () {
                if (modal.complete_callback != "" && typeof(modal.complete_callback) != "undefined") {
                    $rootScope.modalcall[modal.complete_callback]();
                }
            },
            close: function () {
                if (modal.close_callback != "" && typeof(modal.close_callback) != "undefined") {
                    $rootScope.modalcall[modal.close_callback]();
                }
            }
        });
    };
    /** End Modal
     **************************************************************** **/

    /** Validation
     **************************************************************** **/

    $.validator.addClassRules('validate_name', {
        lettersonly: true
    });

    $.validator.addClassRules('validate_number', {
        number: true
    });

    $.validator.addClassRules('validate_email', {
        email: true
    });

    $.validator.addClassRules('validate_date', {
        ist_date: true
    });

    $.validator.addClassRules('validate_mobile', {
        mobile: true
    });

    $.validator.addClassRules('validate_file', {
        accept: "audio/*" //seperated by ,
    });

    $.validator.addClassRules('validate_password', {
        equalTo: '.check_password'
    });

    $.validator.addClassRules('validate_notEqual', {
        notEqual: '.notEqual'
    });

    $.validator.addClassRules('validate_time', {
        time: true
    });

    $.validator.addClassRules('validate_cus_email', {
        cus_email: true
    });
    /** End Validation
     **************************************************************** **/

    /** start Cookies
     **************************************************************** **/
    Cookies.defaults = {
        expires: 365
    };
    /** End Cookies
     **************************************************************** **/

    /** Start Swapper
     **************************************************************** **/
    $rootScope.change = function (div1, div2, other, eve) {
        $rootScope.service.swapper(div1, div2, other, eve);
        if (other != "" && typeof(other) != "undefined") {
            other(eve);
        }
    };
    /** End Swapper
     **************************************************************** **/
}]);

app.run(function($http, $cacheFactory){
    $http.defaults.cache = $cacheFactory();
});

$(function () {
    $('body').on('click','[databack]',function () {
        var t = $('[databack]').attr('data-prev');
        rootscope.$state.go(t);
    });
});