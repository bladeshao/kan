

$(function () {
    var viewModel = new kan.ViewModels.KanDetailViewModel();
    window.vm = viewModel;
    ko.applyBindings(viewModel);
    viewModel.init();
    var interval = (kan.config.interval || 0) * 1000;
    if (interval) {
        setInterval(viewModel.init, interval);
    }

});