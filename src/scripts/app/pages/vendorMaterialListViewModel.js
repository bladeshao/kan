(function (suppliez, $, ko, moment) {
    suppliez.ViewModels = suppliez.ViewModels || {};
    //登录页面viewmodel
    suppliez.ViewModels.VendorMaterialListViewModel = function () {
        var root = this;
        root.all = new suppliez.util.CreateTypeData(this.pageSize);
        root.getStatusColor = function ($data) {
            var mappings = {
                "正常": "#009688",
                "冻结": "#ff5722",
                "default": "#90a4ae"
            };
            var color = mappings[$data.VND_STATUS_];
            return color || mappings.default;
        };

        root.getPrev = function () {
            var root = this;
            var index = root.all.pageIndex();
            if (root.all.hasPrev()) {
                root.all.pageIndex(index - 1);
                root.getData();
            }
        };
        root.getNext = function () {
            var root = this;
            var index = root.all.pageIndex();
            if (root.all.hasNext()) {
                root.all.pageIndex(index + 1);
                root.getData();
            }
        };
    };

    suppliez.ViewModels.VendorMaterialListViewModel.extend(suppliez.ViewModels.BaseViewModel);
    suppliez.ViewModels.VendorMaterialListViewModel.prototype.pageSize = suppliez.config.pageSize;

    suppliez.ViewModels.VendorMaterialListViewModel.prototype.getData = function (index) {
        var root = this;
        root.loading();

        index = index || root.all.pageIndex();
        var offset = (index - 1) * root.pageSize;
        return suppliez.service.getMetabaseData(suppliez.config.vmListUrl, {
            offset: offset,
            rows: root.pageSize
        }).then(function (result) {
            root.all.items(result);
            var total = result.length ? result[0].TOTAL_ROWS : 0;
            var pageCount = Math.floor((total - 1) / root.pageSize) + 1;
            root.all.pageCount(pageCount);

            root.loading(false);
        }, function (result) {
            root.show({
                title: "获取供应商物料列表",
                //subTitle: "",
                //code: "E03",
                message: "获取供应商物料列表失败" + " " + (result && result.errorMessage || "")
            });
            root.loading(false);
        });
    };
    suppliez.ViewModels.VendorMaterialListViewModel.prototype.init = function () {
        var root = this;
        this.tab("all");
        this.getData();


    };
})(window.suppliez = window.suppliez || {}, jQuery, ko, moment);