(function (kan) {
    Function.prototype.extend = function (Base) {
        this.prototype = new Base();
        this.prototype.constructor = Base;
    };
    kan.ViewModels = kan.ViewModels || {};
    kan.ViewModels.BaseViewModel = function () {
        var loader = $.mobile.loading();
        this.user = kan.util.getUser();
        this.isCordova = typeof (cordova) !== "undefined";
        this.popupInfo = {
            title: ko.observable(""),
            subTitle: ko.observable(""),
            message: ko.observable(""),
            code: ko.observable("")
        };
        this.download = function (item) {
            var path;

            if (item.path.indexOf("http") === 0 || item.path.indexOf("\\") === 0) {
                path = item.path;
            } else {
                path = kan.config.attachmentUrl + "download" + (item.path.indexOf("/") === 0 ? "" : "/") + item.path;
            }

            var option = "location=no,enableViewportScale=yes";
            if (this.isCordova && cordova.InAppBrowser && cordova.InAppBrowser.open) {
                cordova.InAppBrowser.open(path, "_blank", option);
            } else {
                window.open(path, "_blank");
            }
        };


        this.fullText = ko.observable("");
        this.closePop = function () {
            if ($.mobile.popup && $.mobile.popup.active) {
                $.mobile.popup.active.close();
            }
        };
        this.tab = ko.observable("");
        this.tab.subscribe(function (newType) {
            if (!newType) {
                return;
            }
            var target = $("#" + newType + "-tab");
            if (target.closest("li").hasClass("active")) {
                return;
            }
            target.click();
        }, null, "change");
        this.switchTab = function (vm, e) {
            var a = $(e.target).closest("a");
            var tempType = a.attr("id").replace("-tab", "");
            vm.tab(tempType);
        };

        this.show = function (info, isSuccess) {
            this.popupInfo.title(info.title || "");
            this.popupInfo.subTitle(info.subTitle || "");
            this.popupInfo.message(info.message || "");
            this.popupInfo.code(info.code || "");
            var id = (isSuccess || info.isSuccess) ? "popupSuccess" : "popupError";
            $("#" + id).popup("open");
        };
        this.showSuccess = function (info) {
            this.show(info, true);
        }

        this.logout = function () {
            sessionStorage.removeItem("Bearer");
            sessionStorage.removeItem("srm_user");
            location.href = "login.html";
        };
        this.loading = function (isLoading) {
            if (isLoading === false) {
                loader.hide();
            } else {
                loader.show();
            }
        };
        this.go = function (url) {
            location.href = url;
        };


    };
})(window.kan = window.kan || {});