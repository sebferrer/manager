export default class OvhPaymentMethodIntegrationInContextAdministrativeMandateCtrl {
  /* @ngInject */
  constructor(ovhPaymentMethodHelper) {
    this.isValidSiret = ovhPaymentMethodHelper.isValidSiret;
  }

  $onInit() {
    this.initialParams = this.inContextCtrl.integrationCtrl.initialParams;

    this.model = {
      companyNationalIdentificationNumber:
        this.initialParams &&
        this.initialParams.companyNationalIdentificationNumber,
    };

    this.inContextCtrl.integrationCtrl.onIntegrationInitialized(
      this.submit.bind(this),
    );
  }

  isFieldRequired(fieldName) {
    const isRequired =
      this.initialParams &&
      this.initialParams.handleResponseObject &&
      this.initialParams.handleResponseObject.requiredFields &&
      this.initialParams.handleResponseObject.requiredFields.includes(
        fieldName,
      );

    return isRequired;
  }

  submit() {
    this.isSubmitting = true;
    return this.inContextCtrl.integrationCtrl
      .onIntegrationSubmit({
        administrativeMandateParameters: {
          description: this.model.description,
          formData: JSON.stringify({
            siret: this.model.companyNationalIdentificationNumber,
            ...(this.model.serviceCode
              ? { service_code: this.model.serviceCode }
              : {}),
            ...(this.model.engagementNumber
              ? { engagement_number: this.model.engagementNumber }
              : {}),
          }),
        },
      })
      .catch(() => {})
      .finally(() => {
        this.isSubmitting = false;
      });
  }
}
