(function (suppliez, $) {
    suppliez.ViewModels = suppliez.ViewModels || {};
    //登录页面viewmodel
    suppliez.ViewModels.VendorViewModel = function () {
        window.vm = this;
        this.detail = new suppliez.ViewModels.VendorDetailViewModel();
    };
    suppliez.ViewModels.VendorViewModel.extend(suppliez.ViewModels.VendorListViewModel);

    // suppliez.ViewModels.VendorViewModel.prototype.refresh = function () {
    //     var root = this;
    //     this.getData().then(function () {
    //         if (root.detail.VND_ID_()) {
    //             root.detail.VND_ID_();
    //         }
    //     });
    // };

    suppliez.ViewModels.VendorViewModel.prototype.getData = function () {
        var root = this;
        var request = this.constructor.prototype.getData.apply(this, arguments);
        request.then(function () {
            if (!root.detail.VND_ID_() && root.all.items().length) {
                root.selectItem(root.all.items()[0]);
            }
        });
    };

    suppliez.ViewModels.VendorViewModel.prototype.selectItem = function ($data) {
        this.detail.VND_ID_($data && $data.VND_ID_);

        if (this.detail.VND_ID_()) {
            this.detail.init();
        }
    };


})(window.suppliez = window.suppliez || {}, jQuery);

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    var viewModel = new window.suppliez.ViewModels.VendorViewModel();
    ko.applyBindings(viewModel);
    viewModel.init();
});