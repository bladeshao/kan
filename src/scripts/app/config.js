(function (suppliez) {
    suppliez.config = {
        //供应商页面
        vendorListUrl: "https://metabase.eorionsolution.com/public/question/4f5a3c78-f931-480d-a934-ab8c82195870.json",
        vendorDetailUrl: "https://metabase.eorionsolution.com/public/question/025e7e63-aa80-475b-bbb4-0d19027a3d85.json",
        vendorMaterialListUrl: "https://metabase.eorionsolution.com/public/question/71374e47-e2dc-4afe-93a4-bbeaa4f25ffb.json",

        //物料页面
        materialListUrl: "https://metabase.eorionsolution.com/public/question/8fc7c0f6-3c93-41a2-a380-402ff3ee8a62.json",
        materialDetailUrl: "https://metabase.eorionsolution.com/public/question/b8d05278-25d9-4185-baa7-322cc2c3fc04.json",
        materialPriceListUrl: "https://metabase.eorionsolution.com/public/question/d727e241-7c19-4ab2-92fb-cf5935bc3ae4.json",
        materialVendorListUrl: "https://metabase.eorionsolution.com/public/question/7d9366b2-fce7-4d59-8eb7-ca0a3f156469.json",

        //供应商物料页面
        vmListUrl: "https://metabase.eorionsolution.com/public/question/f6f4209c-ed89-4b86-9aa3-8d37acbdc416.json",
        vmDetailUrl: "https://metabase.eorionsolution.com/public/question/6526ceaa-2646-4420-a85f-675decfb46a7.json",
        vmPriceListUrl: "https://metabase.eorionsolution.com/public/question/efe85e62-8863-4e6e-8432-118f115b9db4.json",
        oAuth2Keys: [
            "rssmvGW23R7vFsmASOgXRJQMk3Ea",//user name for base64 encoding
            "QWWRNdHNo3uK1ABWRQ_w9sXcBg0a"//password for base64 encoding
        ],
        oAuth2Url: "https://is.eorionsolution.com/oauth2/",
        serviceUrl: "https://bpmswx.eorionsolution.com/bpms-rest/service/",
        pageSize: 15
    };
})(window.suppliez = window.suppliez || {});