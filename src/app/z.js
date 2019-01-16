vm.previewReport = function(reportParams, reportCode) {
  debugger;
  if (!reportParams) {
    vm.reportData = null;
    return false;
  }
  vm.isreportsViewLoaderOn = true;
  var formData = new FormData();
  formData.append("data", angular.toJson(reportParams));
  printUtils.getQuestionaireReportData(formData, reportCode).then(
    function(data) {
      vm.reportData = new Uint8Array(data);
      vm.isreportsViewLoaderOn = false;
    },
    function(response) {
      if (response.status === HTTP_STATUS.ACCESS_DENIED) {
        vm.isPrintPreviewAuthFailed = true;
      }
      vm.reportData = null;
      vm.isreportsViewLoaderOn = false;
    }
  );
};
