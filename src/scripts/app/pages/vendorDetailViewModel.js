(function (suppliez) {
    suppliez.ViewModels = suppliez.ViewModels || {};
    suppliez.ViewModels.VendorDetailViewModel = function () {
        var self = this;
        self.materials = ko.observableArray([]);
        var defaultData = {
            ID_: "",
            VND_ID_: "",
            VND_NAME1_: "",
            VND_NAME2_: "",
            VND_SCODE_: "",
            VND_CREDIT_: "",
            VND_PAYMENT_: "",
            VND_TYPE_: "",
            VND_STATUS_: "",
            VND_ADDRESS1_: "",
            VND_ADDRESS2_: "",
            VND_CONTACT_: "",
            VND_PU_GROUP_: "",
            VND_SC_CODE_: "",
            CREATED_AT_: "",
            CREATED_BY_: "",
            UPDATED_AT_: "",
            UPDATED_BY_: "",
        };

        for (var i in defaultData) {
            self[i] = ko.observable(defaultData[i]);
        }
        self.init = function () {
            var self = this;
            self.materials([]);
            var showError = function (result) {
                self.show({
                    title: "获取供应商列表",
                    //subTitle: "",
                    //code: "E03",
                    message: "获取供应商列表失败" + " " + (result && result.errorMessage || "")
                });
                self.loading(false);
            }
            self.loading();
            return suppliez.service.getMetabaseData(suppliez.config.vendorDetailUrl, {
                VND_ID_: self.VND_ID_()
            }).then(function (result) {
                var item = result && result[0] || {};
                for (var i in item) {
                    var field = self[i];
                    if (field) {
                        field(item[i]);
                    }
                }
                return suppliez.service.getMetabaseData(suppliez.config.vendorMaterialListUrl, {
                    VND_ID_: self.VND_ID_()
                });
            }, showError).then(function (result) {
                self.loading(false);
                self.materials(result);
            }, function () {

            }, showError);

        };
    };

    suppliez.ViewModels.VendorDetailViewModel.extend(suppliez.ViewModels.BaseViewModel);
})(window.suppliez = window.suppliez || {});