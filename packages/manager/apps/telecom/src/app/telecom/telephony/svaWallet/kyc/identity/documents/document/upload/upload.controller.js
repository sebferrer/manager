import { extensions, accept, extensionRegExp } from './upload.constants';

export default class KycIdentityDocumentsDocumentUploadController {
  /* @ngInject */
  constructor($scope, $uibModalInstance, $translate, document, uploadDocument) {
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;
    this.$translate = $translate;
    this.document = document;
    this.uploadDocument = uploadDocument;
    this.isLoading = false;
    this.extensions = extensions.join(' ');
    this.accept = accept;
  }

  $onInit() {
    const unwatchForm = this.$scope.$watch('$ctrl.form', () => {
      if (!this.form) return;
      unwatchForm();
      this.form.file.$validators.extension = (file) =>
        !!file && extensionRegExp.test(file[0].name);
    });
    // Deep watch file model to trigger validation
    this.$scope.$watch('$ctrl.file[0].name', () => {
      this.form.file.$validate();
    });
  }

  confirm() {
    this.errorMessage = undefined;
    if (!this.form.$invalid) {
      this.isLoading = true;
      this.uploadDocument(this.document, this.file[0])
        .then((documentUpdated) => {
          this.$uibModalInstance.close(documentUpdated);
        })
        .catch((error) => {
          // display error
          this.errorMessage = error.message;
          this.isLoading = false;
        });
    }
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }
}
