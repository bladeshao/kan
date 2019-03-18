(function (suppliez) {
    suppliez.ViewModels = suppliez.ViewModels || {};
    suppliez.ViewModels.MaterialDetailViewModel = function () {
        var self = this;
        // self.priceTable = suppliez.util.buildTableData("price",[{
        //     "name": "供应商",
        //     "id": "VND_ID_",
        //     "controlType": "t1"
        // }, {
        //     "name": "单价",
        //     "id": "PRC_PRICE_",
        //     "controlType": "t11"
        // }, {
        //     "name": "货币",
        //     "id": "PRC_CURRENCY_",
        //     "controlType": "t1"
        // }, {
        //     "name": "价格单位",
        //     "id": "PRC_UNIT_",
        //     "controlType": "t1"
        // }, {
        //     "name": "阶梯",
        //     "id": "PRC_LEVEL_T_",
        //     "controlType": "t1"
        // }, {
        //     "name": "L/T",
        //     "id": "PRC_LT_",
        //     "controlType": "t1"
        // }, {
        //     "name": "MOQ",
        //     "id": "PRC_MOQ_",
        //     "controlType": "t6"
        // }, {
        //     "name": "MPQ",
        //     "id": "PRC_MPQ_",
        //     "controlType": "t6"
        // }, {
        //     "name": "价格有效期",
        //     "id": "PRC_VALDATE_T_",
        //     "controlType": "t3"
        // }, {
        //     "name": "备注",
        //     "id": "PRC_COMMENT_",
        //     "controlType": "t2"
        // }]);
        self.prices = ko.observableArray([]);
        self.vendors = ko.observableArray([]);
        var defaultData = {
            "MAT_NAME1_": "",
            "MAT_TYPE_": "",
            "CREATED_AT_": "",
            "MAT_QC_": "",
            "PTR_PDU_NAME_": null,
            "MAT_CHAR3_": "",
            "PTR_PDU_CODE_": null,
            "CREATED_BY_": "",
            "MAT_STATUS_": "",
            "UPDATED_BY_": "",
            "POJ_CODE_": null,
            "MAT_ID_": "",
            "MAT_NAME2_": "",
            "MAT_CHAR1_": "",
            "POJ_NAME_": null,
            "PTR_ID_": null,
            "UPDATED_AT_": "",
            "MAT_CHAR2_": "",
            "MAT_CHAR4_": ""
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
                    title: "获取物料列表",
                    //subTitle: "",
                    //code: "E03",
                    message: "获取物料列表失败" + " " + (result && result.errorMessage || "")
                });
                self.loading(false);
            }
            self.loading();
            return suppliez.service.getMetabaseData(suppliez.config.materialDetailUrl, {
                MAT_ID_: self.MAT_ID_()
            }).then(function (result) {
                var item = result && result[0] || {};
                for (var i in item) {
                    var field = self[i];
                    if (field) {
                        field(item[i]);
                    }
                }
                return suppliez.service.getMetabaseData(suppliez.config.materialPriceListUrl, {
                    MAT_ID_: self.MAT_ID_()
                });
            }, showError).then(function (result) {
                self.prices(result);
                return suppliez.service.getMetabaseData(suppliez.config.materialVendorListUrl, {
                    MAT_ID_: self.MAT_ID_()
                });
            }, showError).then(function (result) {
                self.vendors(result);
                self.loading(false);

            }, function () {

            }, showError);

        };
    };

    suppliez.ViewModels.MaterialDetailViewModel.extend(suppliez.ViewModels.BaseViewModel);
})(window.suppliez = window.suppliez || {});