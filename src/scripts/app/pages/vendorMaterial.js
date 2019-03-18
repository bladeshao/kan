(function (suppliez, $) {
    suppliez.ViewModels = suppliez.ViewModels || {};
    //登录页面viewmodel
    suppliez.ViewModels.VendorMaterialViewModel = function () {
        window.vm = this;
        this.detail = new suppliez.ViewModels.VendorMaterialDetailViewModel();
    };
    suppliez.ViewModels.VendorMaterialViewModel.extend(suppliez.ViewModels.VendorMaterialListViewModel);

    // suppliez.ViewModels.VendorMaterialViewModel.prototype.refresh = function () {
    //     var root = this;
    //     this.getData().then(function () {
    //         if (root.detail.VND_ID_() && root.detail.MAT_ID_()) {
    //             root.detail.VND_ID_();
    //             root.detail.MAT_ID_();
    //         }
    //     });
    // };

    suppliez.ViewModels.VendorMaterialViewModel.prototype.getData = function () {
        var root = this;
        var request = this.constructor.prototype.getData.apply(this, arguments);
        request.then(function () {
            if (!root.detail.VND_ID_() && root.all.items().length) {
                root.selectItem(root.all.items()[0]);
            }
        });
    };

    suppliez.ViewModels.VendorMaterialViewModel.prototype.selectItem = function ($data) {
        this.detail.VND_ID_($data && $data.VND_ID_);
        this.detail.MAT_ID_($data && $data.MAT_ID_);

        if (this.detail.VND_ID_() && this.detail.MAT_ID_()) {
            this.detail.init();
        }
    };


})(window.suppliez = window.suppliez || {}, jQuery);

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    var viewModel = new window.suppliez.ViewModels.VendorMaterialViewModel();
    ko.applyBindings(viewModel);
    viewModel.init();
});