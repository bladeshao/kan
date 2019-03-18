(function (kan, $, ko) {
    kan.ViewModels = kan.ViewModels || {};
    kan.ViewModels.KanDetailViewModel = function () {
        var self = this;
        var reg = /[a-zA-Z0-9_]+.html/ig;
        var matches = reg.exec(location.href);
        self.mobilePage = (matches && matches[0] && matches[0].toLowerCase().indexOf("small") >= 0);
        self.defaultItem = {
            userId: "",
            totaloffline: "",
            PROC_INST_ID__2: "",
            ponumber_2: "",
            END_ACT_ID_: "",
            plannedqty: "",
            START_TIME__2: "",
            END_ACT_ID__2: "",
            product: "",
            ponumber: "",
            PROC_DEF_ID_: "",
            END_TIME__2: "",
            initiator: "",
            initiator_2: "",
            corevalue_t01: "",
            PROC_DEF_ID__2: "",
            from: "",
            to: "",
            product_2: "",
            PROC_INST_ID_: "",
            instance_bskey: "",
            START_TIME_: "",
            END_TIME_: "",
            DUE_DATE_: "",
            totalng: "",
            tbhdrsdet_item_std: null,
            tbhdrawdet_item_std: null,
            tbhdroutedet_item_std: null,
            attachment_t00: null
        };

        self.item = {
            tbhdroutedets: ko.observableArray(),
            tbhdrsdets: ko.observableArray(),
            tbhdrawdets: ko.observableArray(),
            attachments: ko.observableArray()
        };

        self.mapItem = function (data) {
            for (var i in data) {
                if (typeof (self.item[i]) === "undefined") {
                    self.item[i] = ko.observable();
                }
                self.item[i](data[i]);
            }
        };
        self.parseArray = function (source, target) {
            self.item[source].subscribe(function (newValue) {
                var items = JSON.parse(newValue || "[]");
                self.item[target](items);
            });
        }
        self.mapItem(self.defaultItem);
        var mappings = {
            "tbhdroutedet_item_std": "tbhdroutedets",//Route
            "tbhdrsdet_item_std": "tbhdrsdets",//Resource
            "tbhdrawdet_item_std": "tbhdrawdets",//Raw
            "attachment_t00": "attachments"//Doc
        };
        for (var i in mappings) {
            self.parseArray(i, mappings[i]);
        }
        self.item.userId(self.user.userId);

        self.formatDate = function (value) {
            if (!value) {
                return "";
            }
            var dateTime = new Date(value);
            return moment(dateTime).format("hh:mm A MM/DD");
        }
        self.formatDuration = function (value) {
            if (!value) {
                return "";
            }
            var duration = this.getDuration(value);
            return (duration.sign ? "" : "-") + duration.days + "D" + duration.hours + "H";
        };
        self.getDuration = function (value) {
            var result = {
                sign: true,
                days: 0,
                hours: 0
            };

            if (!value) {
                return result;
            }
            var now = moment();
            var then = moment(new Date(value));
            var span = then.diff(now);
            var d = moment.duration(span);
            result.days = Math.abs(parseInt(d.asDays(), 10));
            result.hours = Math.abs(d.hours());
            result.sign = span > 0;
            return result;
        }

        self.init = function () {
            kan.service.getMetabaseData(self.user.userId).then(function (result) {
                if (!result || !result.length) {
                    self.show({
                        title: "获取看板数据",
                        //subTitle: "",
                        //code: "E03",
                        message: "当前账号下没有数据"
                    });
                    return;
                }
                self.mapItem(result[0]);

                if ($("#userBarcode").length) {
                    JsBarcode("#userBarcode", self.item.userId(), {
                        format: "CODE128",
                        lineColor: "#000000",
                        width: 1,
                        height: self.mobilePage ? 14 : 12,
                        displayValue: false
                    });
                }

                if ($("#barcode").length) {

                    JsBarcode("#barcode", self.item.ponumber(), {
                        format: "CODE128",
                        lineColor: "#000000",
                        width: 2,
                        height: 30,
                        displayValue: false
                    });
                }

                var qrCode = $("#qrcode");
                if (qrCode.length) {
                    var param = {
                        processInstanceId: self.item.PROC_INST_ID_()
                    };
                    var size = self.mobilePage ? 120 : 140;
                    var textValue = kan.config.bpmsUrl + "/task.html?" + $.param(param);
                    qrCode.empty();
                    new QRCode(qrCode[0], {
                        text: textValue,
                        width: size,
                        height: size
                    });
                }

            });
        };
    };

    kan.ViewModels.KanDetailViewModel.extend(kan.ViewModels.BaseViewModel);
})(window.kan = window.kan || {}, jQuery, ko);