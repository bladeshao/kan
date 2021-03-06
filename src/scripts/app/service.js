(function (kan) {

    kan.service = {
        login: function (userName, password) {
            var getUserInfo = function (accessToken) {
                var url = kan.config.oAuth2Url + "userinfo";
                var settings = {
                    dataType: "json",
                    url: url,
                    crossDomain: true,
                    headers: {
                        "Authorization": "Bearer " + accessToken
                    }
                };

                settings.url = url;
                settings.type = "GET";
                settings.data = {
                    "schema": "openid"
                };

                return $.ajax(settings);
            };
            var requestOAuth2 = function (userName, password) {
                var token = kan.util.getAuthToken(kan.config.oAuth2Keys[0], kan.config.oAuth2Keys[1]);
                var url = kan.config.oAuth2Url + "token";
                var settings = {
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: url,
                    crossDomain: true,
                    headers: {
                        "Authorization": token,
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                    }
                };

                settings.url = url;
                settings.type = "POST";
                settings.data = {
                    "grant_type": "password",
                    "username": userName,
                    "password": password,
                    "scope": "openid email"
                };

                return $.ajax(settings);
            };
            kan.service.loginError = false;
            sessionStorage.removeItem("Bearer");
            sessionStorage.removeItem("bpms_user");
            return requestOAuth2(userName, password).then(
                function (response) {
                    if (response && response.access_token)
                        sessionStorage.setItem("Bearer", JSON.stringify(response));
                    return getUserInfo(response.access_token);

                },
                function (response) {
                    if (response && response.responseText &&
                        (response.responseText.indexOf("Authentication failed") >= 0 ||
                            response.responseText.indexOf("Missing parameters") >= 0)) {
                        kan.service.loginError = true;
                    }
                    sessionStorage.removeItem("Bearer");
                    sessionStorage.removeItem("bpms_user");
                }
            ).then(function (user) {
                user.lastLogin = +moment();
                var userNameType = kan.config.userNameType || 1;
                if (userNameType === 2) {
                    userName = userName.toLowerCase();
                } else if (userNameType === 3) {
                    userName = userName.toUpperCase();
                }
                user.userId = userName;
                if (user.Roles) {
                    var roles = user.Roles.split(",").map(function (role) {
                        return role.replace(/(.*)\//, "");
                    });
                    user.Roles = roles.join(",");
                }
                sessionStorage.setItem("bpms_user", JSON.stringify(user));

                // var token = kan.util.getAuthToken(userName, password);
                // return kan.util.request("history/historic-activity-instances", {}, {
                //     "token": token
                // });
                var dfd = $.Deferred();
                dfd.resolve();
                return dfd.promise();
            });

        },
        getMetabaseData: function (userId) {
            var filters = [{ "type": "category", "target": ["variable", ["template-tag", "param"]], "value": userId }];

            var param = { parameters: JSON.stringify(filters) }
            var settings = {
                type: "GET",
                data: {},
                dataType: "json",
                url: kan.config.detailUrl + "?" + $.param(param)
            };
            return $.ajax(settings);
        }

    };

})(window.kan = window.kan || {});

