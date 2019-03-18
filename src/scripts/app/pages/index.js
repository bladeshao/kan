

$(function () {
    // $('[data-toggle="tooltip"]').tooltip();
    var viewModel = new window.suppliez.ViewModels.IndexViewModel();
    window.vm = viewModel;
    ko.applyBindings(viewModel);
    viewModel.init();
});