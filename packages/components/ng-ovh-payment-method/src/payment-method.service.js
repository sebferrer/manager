import { filter, find, has, map, remove, some } from 'lodash-es';

import {
  DEFAULT_OPTIONS,
  DEFAULT_TYPE_OPTIONS,
} from './payment-method.constants';

import OvhPaymentMethod from './payment-method.class';
import OvhAvailablePaymentMethod from './available-payment-method.class';

import OvhPaymentMethodLegacy from './legacy/payment-method-legacy';

export default class OvhPaymentMethodService {
  /* @ngInject */
  constructor(
    $http,
    $log,
    $q,
    $translate,
    $window,
    coreConfig,
    OvhApiMe,
    paymentMethodPageUrl,
    userLocale,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.coreConfig = coreConfig;
    this.OvhApiMe = OvhApiMe;

    this.ovhPaymentMethodLegacy = new OvhPaymentMethodLegacy(
      $log,
      $q,
      $translate,
      $window,
      OvhApiMe,
      coreConfig.getRegion(),
    );

    this.paymentMethodPageUrl = paymentMethodPageUrl;
    this.userLocale = userLocale;
  }

  getUserLocale() {
    return this.userLocale;
  }

  /**
   *  Check if connected user has a default payment method
   *  @return {Boolean}
   */
  hasDefaultPaymentMethod() {
    return this.getDefaultPaymentMethod().then((method) => !!method);
  }

  /**
   *  Get the default payment method of the user.
   *  @return {Object} The default payment method of the connected user.
   */
  getDefaultPaymentMethod() {
    return this.getAllPaymentMethods({
      onlyValid: true,
      transform: true,
    }).then(
      (paymentMethods) =>
        find(
          paymentMethods,
          (method) => method.default || method.defaultPaymentMean,
        ) || null,
    );
  }

  /* ----------  Payment types  ---------- */

  getAvailablePaymentMethodTypes() {
    return this.OvhApiMe.Payment()
      .Method()
      .v6()
      .availableMethods()
      .$promise.then((paymentTypes) => {
        const registerablePaymentTypes = filter(paymentTypes, {
          registerable: true,
        });

        // TODO: remove mandate mock

        registerablePaymentTypes.push({
          formSessionId: null,
          icon: {
            data:
              'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSIzNCIgdmlld0JveD0iMCAwIDUwIDM0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0iI0ZGRiIgZmlsbC1vcGFjaXR5PSIwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0wIDBoNTB2MzRIMHoiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjMjUzQjgwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0xNS4xNjUgMjMuMDNoLTIuMDA3YS4yNzcuMjc3IDAgMCAwLS4yNzYuMjMxbC0uODEyIDUuMDRjLS4wMTYuMS4wNjMuMTkuMTY2LjE5aC45NThhLjI3Ny4yNzcgMCAwIDAgLjI3Ni0uMjMybC4yMTktMS4zNmEuMjc3LjI3NyAwIDAgMSAuMjc1LS4yM2guNjM1YzEuMzIzIDAgMi4wODYtLjYyNiAyLjI4NS0xLjg2OC4wOS0uNTQzLjAwNC0uOTctLjI1NS0xLjI2OS0uMjg2LS4zMjgtLjc5Mi0uNTAxLTEuNDY0LS41MDF6bS4yMzIgMS44NDFjLS4xMS43MDUtLjY2LjcwNS0xLjE5My43MDVoLS4zMDNsLjIxMy0xLjMxN2EuMTY2LjE2NiAwIDAgMSAuMTY1LS4xMzhoLjE0Yy4zNjIgMCAuNzA0IDAgLjg4LjIwMi4xMDYuMTIxLjEzOC4zLjA5OC41NDh6TTIxLjE2NiAyNC44NDloLS45NjFhLjE2Ni4xNjYgMCAwIDAtLjE2NS4xMzhsLS4wNDMuMjYzLS4wNjctLjA5NWMtLjIwOC0uMjk2LS42NzItLjM5NS0xLjEzNi0uMzk1LTEuMDYyIDAtMS45Ny43ODgtMi4xNDYgMS44OTMtLjA5Mi41NTEuMDM5IDEuMDc4LjM1OCAxLjQ0Ni4yOTMuMzM4LjcxMi40NzggMS4yMS40NzguODU3IDAgMS4zMzItLjUzOCAxLjMzMi0uNTM4bC0uMDQzLjI2MWMtLjAxNi4xLjA2Mi4xOS4xNjUuMTloLjg2NmEuMjc3LjI3NyAwIDAgMCAuMjc1LS4yMzFsLjUyLTMuMjIxYS4xNjQuMTY0IDAgMCAwLS4xNjUtLjE5em0tMS4zNCAxLjgzMWMtLjA5My41MzgtLjUyOS44OTktMS4wODUuODk5LS4yNzkgMC0uNTAyLS4wODgtLjY0NS0uMjU0LS4xNDItLjE2NS0uMTk2LS40LS4xNS0uNjYxYTEuMDcgMS4wNyAwIDAgMSAxLjA3Ni0uOTA2Yy4yNzMgMCAuNDk1LjA4OS42NDIuMjU2LjE0Ni4xNy4yMDQuNDA2LjE2Mi42NjZ6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iIzI1M0I4MCIgZD0iTTI2LjI4NiAyNC44NDloLS45NjZhLjI4Mi4yODIgMCAwIDAtLjIzLjEybC0xLjMzMyAxLjkyLS41NjUtMS44NDZhLjI4LjI4IDAgMCAwLS4yNjgtLjE5NGgtLjk1YS4xNjQuMTY0IDAgMCAwLS4xNTguMjE2bDEuMDY0IDMuMDU3LTEgMS4zODNhLjE2NC4xNjQgMCAwIDAgLjEzNi4yNTloLjk2NWEuMjguMjggMCAwIDAgLjIzLS4xMTdsMy4yMTMtNC41NDFhLjE2NC4xNjQgMCAwIDAtLjEzOC0uMjU3eiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiMxNzlCRDciIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTI5LjQ4NSAyMy4wM2gtMi4wMDhhLjI3Ny4yNzcgMCAwIDAtLjI3NS4yMzFsLS44MTIgNS4wNGMtLjAxNy4xLjA2Mi4xOS4xNjUuMTloMS4wM2EuMTk0LjE5NCAwIDAgMCAuMTkyLS4xNjJsLjIzLTEuNDNhLjI3Ny4yNzcgMCAwIDEgLjI3Ni0uMjNoLjYzNWMxLjMyMyAwIDIuMDg2LS42MjYgMi4yODYtMS44NjguMDktLjU0My4wMDMtLjk3LS4yNTctMS4yNjktLjI4NS0uMzI4LS43OS0uNTAxLTEuNDYyLS41MDF6bS4yMzEgMS44NDFjLS4xMS43MDUtLjY2LjcwNS0xLjE5Mi43MDVoLS4zMDNsLjIxMy0xLjMxN2EuMTY2LjE2NiAwIDAgMSAuMTY1LS4xMzhoLjEzOWMuMzYyIDAgLjcwNCAwIC44ODEuMjAyLjEwNi4xMjEuMTM4LjMuMDk3LjU0OHpNMzUuNDg1IDI0Ljg0OWgtLjk2YS4xNjUuMTY1IDAgMCAwLS4xNjUuMTM4bC0uMDQzLjI2My0uMDY3LS4wOTVjLS4yMDktLjI5Ni0uNjcyLS4zOTUtMS4xMzYtLjM5NS0xLjA2MiAwLTEuOTY5Ljc4OC0yLjE0NiAxLjg5My0uMDkxLjU1MS4wMzkgMS4wNzguMzU4IDEuNDQ2LjI5NC4zMzguNzEyLjQ3OCAxLjIxMS40NzguODU2IDAgMS4zMy0uNTM4IDEuMzMtLjUzOGwtLjA0Mi4yNjFjLS4wMTYuMS4wNjIuMTkuMTY1LjE5aC44NjZhLjI3Ny4yNzcgMCAwIDAgLjI3NS0uMjMxbC41Mi0zLjIyMWEuMTY1LjE2NSAwIDAgMC0uMTY2LS4xOXptLTEuMzQgMS44MzFjLS4wOTIuNTM4LS41MjguODk5LTEuMDg0Ljg5OS0uMjc5IDAtLjUwMy0uMDg4LS42NDYtLjI1NC0uMTQyLS4xNjUtLjE5NS0uNC0uMTUtLjY2MWExLjA3IDEuMDcgMCAwIDEgMS4wNzctLjkwNmMuMjczIDAgLjQ5NS4wODkuNjQuMjU2LjE0OC4xNy4yMDYuNDA2LjE2My42NjZ6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iIzE3OUJENyIgZD0iTTM2LjYxOSAyMy4xNjlsLS44MjQgNS4xMzJjLS4wMTYuMS4wNjIuMTkuMTY1LjE5aC44MjhhLjI3Ny4yNzcgMCAwIDAgLjI3Ni0uMjMybC44MTItNS4wNGEuMTY1LjE2NSAwIDAgMC0uMTY1LS4xODloLS45MjdhLjE2Ny4xNjcgMCAwIDAtLjE2NS4xMzl6Ii8+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGZpbGw9IiMyNTNCODAiIGQ9Ik0yMi44MjggMTkuOTg4bC4yNzYtMS44MjItLjYxNC0uMDE1SDE5LjU2TDIxLjU5NiA0LjcxYS4xOC4xOCAwIDAgMSAuMDU3LS4xMDYuMTYzLjE2MyAwIDAgMSAuMTA4LS4wNDFoNC45NDNjMS42NCAwIDIuNzczLjM1NSAzLjM2NCAxLjA1Ni4yNzcuMzMuNDUzLjY3My41MzkgMS4wNTIuMDkuMzk3LjA5Ljg3LjAwMyAxLjQ1bC0uMDA2LjA0MnYuMzdsLjI3Ny4xNjRjLjIzNC4xMjkuNDIuMjc2LjU2MS40NDUuMjM3LjI4MS4zOS42MzkuNDU2IDEuMDYzLjA2Ni40MzYuMDQ0Ljk1NS0uMDY1IDEuNTQyLS4xMjcuNjc2LS4zMzEgMS4yNjQtLjYwNyAxLjc0NWEzLjU0MiAzLjU0MiAwIDAgMS0uOTYyIDEuMDk3IDMuODMgMy44MyAwIDAgMS0xLjI5NS42MDggNi4yMTggNi4yMTggMCAwIDEtMS42MTguMTk1aC0uMzg1YTEuMTQgMS4xNCAwIDAgMC0uNzUyLjI4OGMtLjIxLjE4OS0uMzUuNDQ2LS4zOTIuNzI4bC0uMDI5LjE2NC0uNDg3IDMuMjExLS4wMjIuMTE4Yy0uMDA2LjAzNy0uMDE2LjA1Ni0uMDMuMDY4YS4wOC4wOCAwIDAgMS0uMDUxLjAyaC0yLjM3NXoiLz4KICAgICAgICAgICAgPHBhdGggZmlsbD0iIzE3OUJENyIgZD0iTTMxLjE0NCA4LjIwNGE5LjMzMSA5LjMzMSAwIDAgMS0uMDUxLjMwMmMtLjY1MiAzLjQ4My0yLjg4MiA0LjY4Ni01LjczIDQuNjg2aC0xLjQ1YS43MTMuNzEzIDAgMCAwLS42OTUuNjJsLS43NDMgNC45MDEtLjIxIDEuMzlhLjM4Mi4zODIgMCAwIDAgLjM2Ni40NDZoMi41NzJjLjMwNSAwIC41NjMtLjIzLjYxMS0uNTQzbC4wMjUtLjEzNi40ODUtMy4xOTguMDMtLjE3NmEuNjI3LjYyNyAwIDAgMSAuNjEyLS41NDRoLjM4NWMyLjQ5MSAwIDQuNDQyLTEuMDUzIDUuMDEyLTQuMS4yMzgtMS4yNzIuMTE1LTIuMzM1LS41MTYtMy4wODNhMi40NzQgMi40NzQgMCAwIDAtLjcwMy0uNTY1eiIvPgogICAgICAgICAgICA8cGF0aCBmaWxsPSIjMjIyRDY1IiBkPSJNMzAuNDYyIDcuOTIyYTQuOTc3IDQuOTc3IDAgMCAwLS42MzQtLjE0NyA3Ljc0MyA3Ljc0MyAwIDAgMC0xLjI3OC0uMDk3aC0zLjg3NGEuNTk1LjU5NSAwIDAgMC0uMjY3LjA2My42NC42NCAwIDAgMC0uMzQ0LjQ4MWwtLjgyNCA1LjQzMi0uMDIzLjE1OWEuNzEzLjcxMyAwIDAgMSAuNjk2LS42MmgxLjQ1YzIuODQ3IDAgNS4wNzctMS4yMDUgNS43MjktNC42ODcuMDItLjEwMy4wMzYtLjIwMy4wNS0uMzAyYTMuNDAyIDMuNDAyIDAgMCAwLS42ODEtLjI4MnoiLz4KICAgICAgICAgICAgPHBhdGggZmlsbD0iIzI1M0I4MCIgZD0iTTI0LjA2NSA4LjIyMmEuNjM5LjYzOSAwIDAgMSAuMzQ0LS40OC41OTcuNTk3IDAgMCAxIC4yNjctLjA2M2gzLjg3NGMuNDU5IDAgLjg4Ny4wMyAxLjI3OC4wOTdhNC45NzcgNC45NzcgMCAwIDEgLjc4LjE5NGMuMTkzLjA2Ni4zNzEuMTQ0LjUzNi4yMzQuMTk0LTEuMjg3LS4wMDEtMi4xNjMtLjY3LTIuOTU2QzI5LjczNyA0LjM3NCAyOC40MDYgNCAyNi43MDQgNGgtNC45NDJhLjcxNi43MTYgMCAwIDAtLjY5OC42MjFsLTIuMDU5IDEzLjU4MWEuNDM3LjQzNyAwIDAgMCAuNDIuNTExaDMuMDVsLjc2Ni01LjA1OS44MjQtNS40MzJ6Ii8+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K',
            name: 'PAYPAL',
            url: null,
          },
          integration: 'IN_CONTEXT',
          merchantId: null,
          oneshot: true,
          organizationId: null,
          paymentSubType: 'CHORUS',
          paymentType: 'ADMINISTRATIVE_MANDATE',
          registerable: true,
          registerableWithTransaction: false,
        });

        return map(
          registerablePaymentTypes,
          (paymentTypeOptions) =>
            new OvhAvailablePaymentMethod(paymentTypeOptions),
        );
      })
      .catch((error) => (error.status === 404 ? [] : this.$q.reject(error)));
  }

  /**
   *  Get all the available payment method types
   *  @return {Promise} That returns a list of available payment method types
   */
  getAllAvailablePaymentMethodTypes(options = DEFAULT_TYPE_OPTIONS) {
    return this.$q
      .all({
        legacyTypes: this.ovhPaymentMethodLegacy.getAvailablePaymentMethodTypes(
          options,
        ),
        paymentMethodTypes: this.getAvailablePaymentMethodTypes(),
      })
      .then(({ legacyTypes, paymentMethodTypes }) => {
        remove(legacyTypes, ({ paymentType }) => {
          const hasIdentical = some(paymentMethodTypes, (paymentMethodType) => {
            const isSameValue = paymentMethodType.paymentType === paymentType;
            return isSameValue;
          });
          return hasIdentical;
        });

        return [].concat(legacyTypes, paymentMethodTypes);
      });
  }

  /* ----------  Action on paymentMethod  ---------- */

  /**
   *  Add an new payment method
   */
  addPaymentMethod(paymentMethodType, params = {}) {
    if (paymentMethodType.isLegacy()) {
      return this.ovhPaymentMethodLegacy.addPaymentMean(
        paymentMethodType.original,
        params,
      );
    }

    const addParams = params;
    addParams.paymentType = paymentMethodType.paymentType;
    return this.OvhApiMe.Payment()
      .Method()
      .v6()
      .save({}, addParams)
      .$promise.then((response) => {
        if (has(params, 'orderId') && has(response, 'paymentMethodId')) {
          return this.OvhApiMe.Order()
            .v6()
            .pay(
              {
                orderId: params.orderId,
              },
              {
                paymentMethod: {
                  id: response.paymentMethodId,
                },
              },
            )
            .$promise.then(() => response);
        }

        return this.$q.when(response);
      });
  }

  /**
   *  Edit given payment method
   *  @param  {Object} paymentMethod The payment method to edit
   *  @param  {Object} params        The attributes of payment method to edit
   *  @return {Promise}
   */
  editPaymentMethod(paymentMethod, params) {
    // if original attribute is present, it means that it's an legacy payment method
    if (paymentMethod.isLegacy()) {
      return this.ovhPaymentMethodLegacy.editPaymentMean(
        paymentMethod.original,
        params,
      );
    }

    return this.OvhApiMe.Payment()
      .Method()
      .v6()
      .edit(
        {
          paymentMethodId: paymentMethod.paymentMethodId,
        },
        params,
      ).$promise;
  }

  /**
   *  Set given payment method as default
   *  @param  {Object} paymentMethod The payment method to set as default
   *  @return {Promise}
   */
  setPaymentMethodAsDefault(paymentMethod) {
    // if original attribute is present, it means that it's an legacy payment method
    if (paymentMethod.isLegacy()) {
      return this.ovhPaymentMethodLegacy.setPaymentMeanAsDefault(
        paymentMethod.original,
      );
    }

    return this.editPaymentMethod(paymentMethod, {
      default: true,
    });
  }

  /**
   *  Challenge given payment method
   *  @param  {Object} paymentMethod The payment method to edit
   *  @param  {Object} challenge     The challenge value
   *  @return {Promise}
   */
  challengePaymentMethod(paymentMethod, challenge) {
    // if original attribute is present, it means that it's an legacy payment method
    if (paymentMethod.original) {
      return this.ovhPaymentMethodLegacy.challengePaymentMethod(
        paymentMethod.original,
        challenge,
      );
    }

    return this.OvhApiMe.Payment()
      .Method()
      .v6()
      .challenge(
        {
          paymentMethodId: paymentMethod.paymentMethodId,
        },
        { challenge },
      ).$promise;
  }

  addPaymentDetails(paymentMethodId, details) {
    return this.$http.post(
      `/me/payment/method/${paymentMethodId}/details`,
      details,
    );
  }

  /**
   *  Finalize given payment method registration
   *  @param  {Object} paymentMethod The payment method to finalize
   *  @param  {Object} finalizeData  The data needed for finalizing the payment method registration
   *  @return {Promise}
   */
  finalizePaymentMethod(paymentValidation, finalizeData = {}) {
    return this.OvhApiMe.Payment()
      .Method()
      .v6()
      .finalize(
        {
          paymentMethodId: paymentValidation.paymentMethodId,
        },
        finalizeData,
      )
      .$promise.then((paymentMethod) => new OvhPaymentMethod(paymentMethod));
  }

  /**
   *  Delete given payment method
   *  @param  {Object} paymentMethod The paymentMethod to delete
   *  @return {Promise}
   */
  deletePaymentMethod(paymentMethod) {
    // if original attribute is present, it means that it's an legacy payment method
    if (paymentMethod.original) {
      return this.ovhPaymentMethodLegacy.deletePaymentMean(
        paymentMethod.original,
      );
    }

    return this.OvhApiMe.Payment()
      .Method()
      .v6()
      .delete({
        paymentMethodId: paymentMethod.paymentMethodId,
      }).$promise;
  }

  /* ----------  New payment methods  ---------- */

  getPaymentMethod(paymentMethodId) {
    return this.OvhApiMe.Payment()
      .Method()
      .v6()
      .get({
        paymentMethodId,
      })
      .$promise.then(
        (paymentMethodOptions) => new OvhPaymentMethod(paymentMethodOptions),
      );
  }

  /**
   *  Get the payment methods returned by /me/payment/method APIs
   *  @param  {Obejct}  options           Options to get the payment methods
   *  @return {Promise}                   That returns an Array of OvhPaymentMethod
   */
  getPaymentMethods(options = DEFAULT_OPTIONS) {
    return this.OvhApiMe.Payment()
      .Method()
      .v6()
      .query(
        options.onlyValid
          ? {
              status: 'VALID',
            }
          : {},
      )
      .$promise.then((paymentMethodIds) =>
        this.$q.all(
          map(paymentMethodIds, (paymentMethodId) =>
            this.getPaymentMethod(paymentMethodId),
          ),
        ),
      )
      .catch((error) => (error.status === 404 ? [] : this.$q.reject(error)));
  }

  /**
   *  Get all payment methods, even the legacy one returned by /me/paymentMean/*
   *  and /me/paymentMethod APIs routes.
   *  @param  {Obejct}  options           Options to get the payment methods
   *  @param  {Boolean} options.onlyValid Gets only valid payment methods
   *  @param  {Boolean} options.transform Flag telling if legacy payment methods needs to be
   *                                      transformed to new payment method object
   *  @return {Promise}                   That returns an Array of payment methods merged
   *                                      with legacy payment methods.
   */
  getAllPaymentMethods(options = DEFAULT_OPTIONS) {
    return this.$q
      .all({
        legacies: !this.coreConfig.isRegion('US')
          ? this.ovhPaymentMethodLegacy.getPaymentMeans(options)
          : this.$q.when([]),
        paymentMethods: this.getPaymentMethods(options),
      })
      .then(({ legacies, paymentMethods }) => {
        remove(legacies, ({ paymentMethodId }) =>
          some(paymentMethods, {
            paymentMeanId: paymentMethodId,
          }),
        );

        const methods = [...legacies, ...paymentMethods];
        if (options.onlyValid) {
          return methods.filter((method) => method.isValid());
        }

        return methods;
      });
  }
}
