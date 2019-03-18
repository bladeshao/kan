(function (suppliez) {
    suppliez.ViewModels = suppliez.ViewModels || {};
    suppliez.ViewModels.VendorMaterialDetailViewModel = function () {
        var self = this;
        self.prices = ko.observableArray([]);
        self.vendors = ko.observableArray([]);
        var defaultData = {
            "VND_NAME2_": "",
            "VM_STATUS_": "",
            "MAT_NAME1_": "",
            "VM_QL_": "",
            "CREATED_AT_": "",
            "VND_NAME1_": "",
            "VM_VALDATE_T_": "",
            "PTR_PDU_NAME_": null,
            "PTR_PDU_CODE_": null,
            "CREATED_BY_": "",
            "UPDATED_BY_": "",
            "POJ_CODE_": null,
            "VM_LT_": "",
            "VND_SCODE_": "",
            "VND_ID_": "",
            "MAT_ID_": "",
            "MAT_NAME2_": "",
            "VM_PRIORITY_": "",
            "VM_MOQ_": null,
            "POJ_NAME_": null,
            "PTR_ID_": null,
            "UPDATED_AT_": ""
        };

        for (var i in defaultData) {
            self[i] = ko.observable(defaultData[i]);
        }
        self.init = function () {
            var self = this;
            self.prices([]);
            self.vendors([]);
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
            return suppliez.service.getMetabaseData(suppliez.config.vmDetailUrl, {
                VND_ID_: self.VND_ID_(),
                MAT_ID_: self.MAT_ID_()
            }).then(function (result) {
                var item = result && result[0] || {};
                for (var i in item) {
                    var field = self[i];
                    if (field) {
                        field(item[i]);
                    }
                }
                return suppliez.service.getMetabaseData(suppliez.config.vmPriceListUrl, {
                    VND_ID_: self.VND_ID_(),
                    MAT_ID_: self.MAT_ID_()
                });
            }, showError).then(function (result) {

                self.prices(result);
                return suppliez.service.getMetabaseData(suppliez.config.materialVendorListUrl, {
                    MAT_ID_: self.MAT_ID_()
                });
            }, showError).then(function (result) {
                self.loading(false);
                self.vendors(result);
            }, showError);

        };
    };

    suppliez.ViewModels.VendorMaterialDetailViewModel.extend(suppliez.ViewModels.BaseViewModel);
})(window.suppliez = window.suppliez || {});