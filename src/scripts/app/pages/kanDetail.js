

$(function () {
    var viewModel = new kan.ViewModels.KanDetailViewModel();
    window.vm = viewModel;
    ko.applyBindings(viewModel);
    viewModel.init();
});