(function (kan) {
    kan.util = {
        getAuthToken: function (username, password) {
            base64Encode = function (str) {
                var c1, c2, c3;
                var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                var i = 0,
                    len = str.length,
                    string = '';

                while (i < len) {
                    c1 = str.charCodeAt(i++) & 0xff;
                    if (i == len) {
                        string += base64EncodeChars.charAt(c1 >> 2);
                        string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                        string += "==";
                        break;
                    }
                    c2 = str.charCodeAt(i++);
                    if (i == len) {
                        string += base64EncodeChars.charAt(c1 >> 2);
                        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                        string += "=";
                        break;
                    }
                    c3 = str.charCodeAt(i++);
                    string += base64EncodeChars.charAt(c1 >> 2);
                    string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                    string += base64EncodeChars.charAt(c3 & 0x3F);
                }
                return string;
            };
            var rawStr = username + ':' + password;
            var encodeStr = base64Encode(rawStr);
            var token = "Basic " + encodeStr;
            return token;
        },
        request: function (url, data, settings) {
            settings = settings || {};
            settings.headers = settings.headers || {};
            var defaultSettings = {
                dataType: "json",
                url: url,
                crossDomain: true,
                headers: {}
                //beforeSend: function (xhr) {
                //   xhr.setRequestHeader("authorization", token);
                //}
            };
            $.extend(defaultSettings, settings);
            var serviceUrl = kan.config.serviceUrl;
            var token = (settings && settings.token);
            if (!token)
                token = sessionStorage.getItem("bpms_token");
            defaultSettings.headers.Authorization = token;

            if (url.indexOf("http") < 0)
                url = serviceUrl + url;

            var httpsServers = kan.config.httpsServers || [];
            var useHttps = false;
            for (var i in httpsServers) {
                if (url.toLowerCase().indexOf(httpsServers[i]) > 0) {
                    useHttps = true;
                }
            }

            if (useHttps) {
                url = url.replace("http:", "https:");
            }
            defaultSettings.url = url;
            defaultSettings.type = (settings && settings.type) || "GET";


            defaultSettings.data = data;
            var requestType = defaultSettings.type.toUpperCase();

            if (requestType == "POST" || requestType == "PUT") {
                defaultSettings.headers["Content-Type"] = "application/json";
                defaultSettings.data = defaultSettings.data || {};
                defaultSettings.data = JSON.stringify(defaultSettings.data);
            }
            $.extend(defaultSettings.headers, settings.headers);

            return $.ajax(defaultSettings);
        },
        isWeChat: function () {
            var userAgent = window.navigator.userAgent.toLowerCase();
            var matched = userAgent.match(/MicroMessenger/i);
            return matched && matched.toString() === "micromessenger";
        },
        getUser: function () {
            var user = sessionStorage.getItem("bpms_user");
            if (!user) {
                var isInWeChat = this.isWeChat();
                var url = isInWeChat ? "login_bridge.html" : "login.html";
                url += "?target=" + encodeURIComponent(location.href);
                window.location.href = url;
                return;
            }
            user = JSON.parse(user);
            if (user && user.Roles) {
                var roles = user.Roles.trim().split(",");
                roles = roles.filter(function (role) {
                    return role && role.indexOf("Application/") != 0 &&
                        role.indexOf("Internal/") != 0;
                });
                user.Roles = roles.join(",");
            }
            return user;
        },
        getUrlParams: function (url) {
            var vars = {},
                hash;
            //var url = decodeURIComponent(url);
            url = url.trim();
            var tempIndex = url.indexOf('?');
            if (tempIndex < 0) {
                return vars;
            }
            var hashes = url.slice(tempIndex + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                //vars.push(hash[0]);
                vars[hash[0]] = decodeURIComponent(hash[1]);
            }
            return vars;
        },
        getUrlParam: function (url, key) {
            return this.getUrlParams(url)[key];
        },
        CreateTypeData: function () {
            this.items = ko.observableArray();
            this.pageIndex = ko.observable(1);
            this.pageCount = ko.observable(0);
            this.hasPrev = ko.computed(function () {
                return this.pageIndex() > 1;
            }, this);
            this.hasNext = ko.computed(function () {
                return this.pageIndex() < this.pageCount();
            }, this);
        },
        formatDateTime: function (value, type) {
            if (!value) {
                return "";
            }
            var format;
            type = type || "t5";
            if (type === "t3") {
                format = "YYYY-MM-DD";
            }
            else if (type === "t4") {
                format = "HH:mm";
            }
            else if (type === "t5") {
                format = "YYYY-MM-DD HH:mm";
            }

            var stamp = typeof (value) === "number" ? value : Number(value);
            if (isNaN(stamp)) {
                stamp = value;
            }
            var formattedValue = moment(stamp).format(format);
            return formattedValue;
        },
        formatMoney: function (number) {
            var outputdollars = function (number) {
                if (number.length <= 3)
                    return (number == '' ? '0' : number);
                else {
                    var mod = number.length % 3;
                    var output = (mod == 0 ? '' : (number.substring(0, mod)));
                    for (i = 0; i < Math.floor(number.length / 3); i++) {
                        if ((mod == 0) && (i == 0))
                            output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                        else
                            output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
                    }
                    return (output);
                }
            };
            var outputcents = function (amount) {
                amount = Math.round(((amount) - Math.floor(amount)) * 100);
                return (amount < 10 ? '.0' + amount : '.' + amount);
            };
            if (typeof (number) == "undefined" || number === null)
                return "";
            if (typeof (number) == "number")
                number = number + "";
            number = number.replace(/\,/g, "");
            if (isNaN(number) || number == "") return "";
            number = Math.round(number * 100) / 100;
            if (number < 0)
                return '-' + outputdollars(Math.floor(Math.abs(number) - 0) + '') + outputcents(Math.abs(number) - 0);
            else
                return outputdollars(Math.floor(number - 0) + '') + outputcents(number - 0);
        },
        formatCell: function (value, headers, index) {
            value = ko.unwrap(value);
            if (typeof (value) === "string" && value.indexOf("\n") >= 0) {
                //var fullValue = value.trim().replace(/\r/g, "").replace(/\n/, "<br/>");
                value = value.trim().split("\n")[0].trim() + "...";
                return value;
            }

            if (!headers) {
                return value;
            }

            var allHeaders = ko.unwrap(headers);
            var indexValue = ko.unwrap(index);
            var type = allHeaders[indexValue].controlType;
            type = type || "";

            if (type == "t3" || type == "t4" || type == "t5") {
                if (typeof (value) == "number" && !isNaN(value)) {
                    value = this.formatDateTime(value, type);
                    return value;
                }
                if (typeof (value) == "string" && value) {
                    value = this(Number(value), type);
                    return value;
                }
            }
            // if (type == "t6") {
            //     if (typeof(value) == "string" && value.length > 0) {
            //         value = Number(value).toString();
            //         return value;
            //     }
            // }
            if (type == "t11") {
                if (typeof (value) == "string" && value || typeof (value) == "number") {
                    value = this.formatMoney(value);
                    return value;
                } else {
                    value = "";
                    return value;
                }
            }
            return value;
        },
        isMultiText: function (value) {
            value = ko.unwrap(value);
            var type = typeof (value);
            return (type == "string" && value.indexOf("\n") >= 0);
        },
        showFullText: function (data, e) {
            var t = e.target;
            var link = (t.tagName.toLowerCase() !== "a") ? $(t).closest("a") : $(t);
            data = data.trim().replace(/\r/g, "").replace(/\n/g, "<br/>");
            var root = ko.contextFor(t).$root;
            root.fullText(data);
            $("#fullText").popup({
                positionTo: "#" + link.attr("id")
            }).popup("open");
        },
        buildTableData: function (id, fields) {
            var table = {
                "tableName": name,
                "headers": [],
                "rows": ko.observableArray([]),
                //["123", "1", "1", "1", "1", null]
                "editable": false
            };
            fields.forEach(function (field, index) {
                var fieldId = id + "_" + field.name + "_" + field.id + "_" + (index + 1) + "_" + "string" + "_" + field.controlType;
                var tableField = {
                    "id": fieldId,
                    "name": field.name,
                    "type": "string",
                    "readable": true,
                    "writable": true,
                    "required": false,
                    "datePattern": null,
                    "enumValues": [],
                    "seq": (index + 1),
                    "fieldType": "string",
                    "controlType": field.controlType
                };
                table.headers.push(tableField);
            });
            table.formatCell = this.formatCell;
            table.isMultiText = this.isMultiText;
            table.showFullText = this.showFullText;
            table.formatMoney = this.formatMoney;
            return table;
        }

    };
})(window.kan = window.kan || {});