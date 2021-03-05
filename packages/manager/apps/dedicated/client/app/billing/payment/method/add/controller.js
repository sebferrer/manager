import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import set from 'lodash/set';

import { CREDITCARD_FOOTPRINT_AMOUNT } from './constants';

export default class BillingPaymentMethodAddCtrl {
  /* @ngInject */
  constructor(
    $timeout,
    $translate,
    Alerter,
    coreConfig,
    ovhContacts,
    ovhPaymentMethod,
    ovhPaymentMethodHelper,
    OVH_PAYMENT_METHOD_TYPE,
    OVH_PAYMENT_METHOD_INTEGRATION_TYPE,
  ) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.coreConfig = coreConfig;
    this.ovhContacts = ovhContacts;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.ovhPaymentMethodHelper = ovhPaymentMethodHelper;
    this.OVH_PAYMENT_METHOD_TYPE = OVH_PAYMENT_METHOD_TYPE;
    this.OVH_PAYMENT_METHOD_INTEGRATION_TYPE = OVH_PAYMENT_METHOD_INTEGRATION_TYPE;

    // other attributes used in view
    this.creditCardFootprintAmount = CREDITCARD_FOOTPRINT_AMOUNT;
    this.integrationSubmitFunction = null;

    this.loading = {
      redirecting: false,
    };

    this.hostname = window.location.hostname;
  }

  initializeStepper() {
    this.integrationInitialParams = null;
  }

  initializeIntegrationInitialParams() {
    this.integrationInitialParams = {
      companyNationalIdentificationNumber:
        this.coreConfig.getUser().companyNationalIdentificationNumber ||
        21130007400013,
      handleResponseObject: {
        requiredFields: ['customer_service_code'],
      },
    };
  }

  /* ================================
  =            Callbacks            =
  ================================= */

  /* ----------  Integration callbacks  ---------- */

  onPaymentMethodIntegrationInitialized(submitFn, initialParams = {}) {
    // set integration submit function to give the possibility to submit
    // some integration types (e.g.: redirect, vantivIframe).
    this.integrationSubmitFunction = submitFn;

    // return specific options for integration rendering
    // depending on the payment method type integration value.
    return initialParams;
  }

  onPaymentMethodIntegrationSubmit(integrationAdditionalParams = {}) {
    const postParams = {
      default: this.model.selectedPaymentMethodType.type.isAdministrativeMandate()
        ? false
        : this.model.setAsDefault,
      ...integrationAdditionalParams,
    };

    if (this.model.selectedPaymentMethodType.isRequiringContactId()) {
      const { billingContact } = this.model;

      // if no id to contact, we need to create it first before adding payment method
      if (!get(billingContact, 'id')) {
        // force non needed value for contact creation
        // this should be done in component
        if (!billingContact.legalForm) {
          billingContact.legalForm = 'individual';
        }
        if (!billingContact.language) {
          billingContact.language = this.currentUser.language;
        }

        // create a new contact
        return this.ovhContacts
          .createContact(billingContact)
          .then((contact) => {
            set(postParams, 'billingContactId', contact.id);
            return postParams;
          });
      }

      set(postParams, 'billingContactId', billingContact.id);
    }

    return postParams;
  }

  onHandleResponse(handleResponseObject) {
    this.integrationInitialParams.handleResponseObject = {
      ...this.integrationInitialParams.handleResponseObject,
      ...handleResponseObject,
    };

    this.currentIndex = this.addSteps.paymentMethodIntegration.getPosition();
  }

  onPaymentMethodIntegrationSubmitError(error) {
    const handleResponseObject = this.ovhPaymentMethodHelper.constructor.handleResponse(
      this.model.selectedPaymentMethodType,
      error,
    );

    if (handleResponseObject) {
      this.onHandleResponse(handleResponseObject);
    }

    this.Alerter.error(
      this.$translate.instant('billing_payment_method_add_error', {
        errorMessage: get(error, 'data.message'),
      }),
      'billing_payment_method_add_alert',
    );

    this.$timeout(() => {
      document.getElementById('errorMessage').scrollIntoView();
    });
  }

  onPaymentMethodIntegrationSuccess(paymentMethod) {
    this.loading.redirecting = true;
    this.onPaymentMethodAdded(paymentMethod);
  }

  /* ----------  OuiStepper callbacks  ---------- */

  onPaymentMethodAddStepperFinish() {
    if (this.model.selectedPaymentMethodType.isHandleByComponent()) {
      this.integrationInitialParams = this.onPaymentMethodIntegrationInitialized(
        null,
        {
          paymentMethod: this.model.selectedPaymentMethodType,
          setAsDefault: this.model.setAsDefault,
        },
      );
    }

    // call integrationSubmitFunction if provided
    if (isFunction(this.integrationSubmitFunction)) {
      return this.integrationSubmitFunction();
    }

    if (this.addSteps.legacyBankAccount.isVisible()) {
      return this.ovhPaymentMethod
        .addPaymentMethod(this.model.selectedPaymentMethodType, {
          bic: this.model.bankAccount.bic,
          iban: this.model.bankAccount.iban,
          ownerAddress: this.model.billingAddress.ownerAddress,
          ownerName: this.model.billingAddress.ownerName,
          default: this.model.setAsDefault,
        })
        .then((paymentMethod) =>
          this.onPaymentMethodIntegrationSuccess(paymentMethod),
        )
        .catch((error) => this.onPaymentMethodIntegrationSubmitError(error));
    }

    return true;
  }

  /* -----  End of Callbacks  ------ */
}
