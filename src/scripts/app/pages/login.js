$(function () {
    var viewModel = new kan.ViewModels.LoginViewModel();
    ko.applyBindings(viewModel);
    document.onkeydown = viewModel.keyDownHandler;
});
