import { snakeCase, startsWith } from 'lodash-es';

import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/js/utils';
import moment from 'moment';

export default /* @ngInject */ function(
  $timeout,
  $anchorScroll,
  ovhContact,
  CONTACT_EDITION,
) {
  const self = this;

  let alwaysVisibleFieldsByCountry = false;

  self.loading = {
    init: false,
  };

  self.datepicker = {
    open: false,
    format: 'shortDate',
    options: {
      showWeeks: false,
      maxDate: moment(),
    },
  };

  self.creationRules = null;
  self.sortedFieldsByCountry = null;
  self.saveError = null;

  self.cancelEdition = function cancelEdition() {
    if (!self.ovhContactCtrl.contact.id) {
      self.ovhContactCtrl.stopContactCreation();
    } else {
      self.ovhContactCtrl.contact.stopEdition(true);
    }
    $anchorScroll();
  };

  self.saveContact = function saveContact() {
    self.ovhContactCtrl.loading.load = true;

    const savePromise = self.ovhContactCtrl.contact.id
      ? self.ovhContactCtrl.contact.save()
      : self.ovhContactCtrl.contact
          .create()
          .then(() => ovhContact.addContact(self.ovhContactCtrl.contact));

    return savePromise
      .then(
        () => {
          self.ovhContactCtrl.contact.stopEdition();
        },
        (error) => {
          self.saveError = error;
          $anchorScroll();
        },
      )
      .finally(() => {
        self.ovhContactCtrl.loading.load = false;
      });
  };

  function clear() {
    self.saveError = null;

    self.sortedFieldsByCountry =
      CONTACT_EDITION[`SORTED_FIELDS_${self.ovhContactCtrl.contact.country}`] ||
      CONTACT_EDITION.SORTED_FIELDS_DEFAULT;
    alwaysVisibleFieldsByCountry =
      CONTACT_EDITION[
        `ALWAYS_VISIBLE_FIELDS_${self.ovhContactCtrl.contact.country}`
      ] || CONTACT_EDITION.ALWAYS_VISIBLE_FIELDS_DEFAULT;
  }

  function formatPhoneNumbers(phoneNumber) {
    return phoneNumber ? phoneNumber.replace('.', '') : phoneNumber;
  }

  self.isVisibleField = function isVisibleField(field) {
    let isVisible = !!(
      self.creationRules &&
      self.creationRules[field] &&
      self.creationRules[field].canBeNull === 0
    );

    if (!isVisible && alwaysVisibleFieldsByCountry.indexOf(field) !== -1) {
      isVisible = true;
    }

    if (!isVisible) {
      self.ovhContactCtrl.contact[field] = null;
    }

    return isVisible;
  };

  self.getFieldType = function getFieldType(field) {
    if (/mail/i.test(field)) {
      return 'email';
    }
    if (/phone|fax/i.test(field)) {
      return 'tel';
    }
    if (field === 'birthDay') {
      return 'date';
    }
    return 'text';
  };

  self.getFieldTranslationKey = function getFieldTranslationKey(field) {
    return `ovh_contact_edit_label_${snakeCase(field)}`;
  };

  self.formatedPhone = function formatedPhone(phoneValue) {
    if (arguments.length > 0) {
      self.ovhContactCtrl.contact.phone = phoneValue;
      return self.ovhContactCtrl.contact.phone;
    }
    return formatPhoneNumbers(self.ovhContactCtrl.contact.phone);
  };

  self.formatedCellPhone = function formatedCellPhone(phoneValue) {
    if (arguments.length > 0) {
      self.ovhContactCtrl.contact.cellPhone = phoneValue;
      return self.ovhContactCtrl.contact.cellPhone;
    }
    return formatPhoneNumbers(self.ovhContactCtrl.contact.cellPhone);
  };

  self.forcePhoneFormat = function forcePhoneFormat(field, fieldId) {
    // use timeout to force phone number to be undefined if only country dial code or to be
    // prefixed by "+"(international format) if phone number value starts with country dialcode
    $timeout(() => {
      const countryData = field.getSelectedCountryData();
      if (
        self.ovhContactCtrl.contact[fieldId] === countryData.dialCode ||
        !self.ovhContactCtrl.contact[fieldId]
      ) {
        self.ovhContactCtrl.contact[fieldId] = undefined;
      } else if (
        startsWith(self.ovhContactCtrl.contact[fieldId], countryData.dialCode)
      ) {
        self.ovhContactCtrl.contact[
          fieldId
        ] = `+${self.ovhContactCtrl.contact[fieldId]}`;
      }
    });
  };

  self.initializeTelInput = function initializeTelInput(
    inputId,
    initialValue = '',
    options = {},
  ) {
    const inputToInitialize = document.querySelector(inputId);
    const telInput = intlTelInput(inputToInitialize, {
      initialCountry: self.ovhContactCtrl.contact.address.country,
      formatOnDisplay: true,
      nationalMode: false,
      preferredCountries: [''],
      utilsScript: 'build/js/utils.js',
      ...options,
    });

    inputToInitialize.addEventListener(
      'blur',
      (() =>
        function forcePhoneFormat() {
          $timeout(() => {
            self.forcePhoneFormat(telInput, inputToInitialize.id);
          }, 1); // Need to have smallest timeout delay to force formatting on blur event
        })(),
    );

    const getSetValidityFunction = () =>
      function setValidity() {
        $timeout(() => {
          self.ovhContactEdit[inputToInitialize.id].$setValidity(
            'internationalPhoneNumber',
            telInput.isValidNumber(),
          );
        }, 100); // Setting validity on blur, right after the forcePhoneFormat has been done
      };

    inputToInitialize.addEventListener('blur', getSetValidityFunction());
    inputToInitialize.addEventListener('keydown', getSetValidityFunction());
    inputToInitialize.addEventListener('keypress', function blockNonNumericKeys(
      event,
    ) {
      if (event.charCode < 48 || event.charCode > 57) {
        event.preventDefault();
        event.stopPropagation();
      }
    });

    telInput.setNumber(initialValue.replace(/\D/g, ''));
    return telInput;
  };

  self.$onInit = function $onInit() {
    self.loading.init = true;
    self.ovhContactCtrl.loading.load = true;

    clear();

    return ovhContact
      .getCreationRules()
      .then((rules) => {
        self.creationRules = rules;
        self.ovhContactCtrl.manageOnInit();
      })
      .finally(() => {
        self.loading.init = false;
        self.ovhContactCtrl.loading.load = false;

        self.itiPhone = self.initializeTelInput(
          '#phone',
          self.formatedPhone(),
          {
            placeholderNumberType: 'FIXED_LINE',
          },
        );
        self.itiCellPhone = self.initializeTelInput(
          '#cellphone',
          self.formatedCellPhone(),
        );
      });
  };

  self.$onDestroy = function $onDestroy() {
    self.itiPhone.destroy();
    self.itiCellPhone.destroy();
  };
}
