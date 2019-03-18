$(function () {
    var viewModel = new window.suppliez.ViewModels.LoginViewModel();
    ko.applyBindings(viewModel);
    document.onkeydown = viewModel.keyDownHandler;
});
