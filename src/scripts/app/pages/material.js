(function (suppliez, $) {
    suppliez.ViewModels = suppliez.ViewModels || {};
    //登录页面viewmodel
    suppliez.ViewModels.MaterialViewModel = function () {
        window.vm = this;
        this.detail = new suppliez.ViewModels.MaterialDetailViewModel();
    };
    suppliez.ViewModels.MaterialViewModel.extend(suppliez.ViewModels.MaterialListViewModel);

    // suppliez.ViewModels.MaterialViewModel.prototype.refresh = function () {
    //     var root = this;
    //     this.getData().then(function () {
    //         if (root.detail.MAT_ID_()) {
    //             root.detail.MAT_ID_();
    //         }
    //     });
    // };

    suppliez.ViewModels.MaterialViewModel.prototype.getData = function () {
        var root = this;
        var request = this.constructor.prototype.getData.apply(this, arguments);
        request.then(function () {
            if (!root.detail.MAT_ID_() && root.all.items().length) {
                root.selectItem(root.all.items()[0]);
            }
        });
    };

    suppliez.ViewModels.MaterialViewModel.prototype.selectItem = function ($data) {
        this.detail.MAT_ID_($data && $data.MAT_ID_);

        if (this.detail.MAT_ID_()) {
            this.detail.init();
        }
    };

})(window.suppliez = window.suppliez || {}, jQuery);

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    var viewModel = new window.suppliez.ViewModels.MaterialViewModel();
    ko.applyBindings(viewModel);
    viewModel.init();
});