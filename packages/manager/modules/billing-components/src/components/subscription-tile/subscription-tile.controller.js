import { BillingService as ServiceInfos } from '@ovh-ux/manager-models';
import { AUTO_COMMITMENT_STRATEGY } from './subscription-tile.constants';

export default class ServicesActionsCtrl {
  /* @ngInject */
  constructor(
    $attrs,
    $q,
    $translate,
    $window,
    atInternet,
    coreConfig,
    coreURLBuilder,
    BillingService,
    ovhFeatureFlipping,
  ) {
    this.$attrs = $attrs;
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
    this.BillingService = BillingService;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  $onInit() {
    this.user = this.coreConfig.getUser();
    this.disableServiceActions = this.$attrs.disableServiceActions
      ? this.disableServiceActions
      : false;
    this.withEngagement =
      this.withEngagement || this.$attrs.withEngagement === '';
    this.withContactManagement = this.$attrs.withContactManagement
      ? this.withContactManagement
      : true;
    this.displayServiceActions =
      this.coreConfig.isRegion(['EU', 'CA']) && !this.disableServiceActions;
    this.isLoading = true;
    return this.ovhFeatureFlipping
      .checkFeatureAvailability([
        'billing:management',
        'contact',
        'contact:management',
      ])
      .then((featuresAvailability) => {
        this.featuresAvailability = featuresAvailability;
        return this.serviceInfos
          ? this.$q.when(new ServiceInfos(this.serviceInfos))
          : this.BillingService.getServiceInfos(this.servicePath);
      })
      .then((serviceInfos) => {
        this.contactManagementUrl = this.coreURLBuilder.buildURL(
          'dedicated',
          '#/contacts/services',
          {
            serviceName: serviceInfos.domain,
          },
        );
        return this.$q.all({
          serviceInfos,
          service: this.BillingService.getService(serviceInfos.serviceId),
          availableEngagements: this.BillingService.getAvailableEngagement(
            serviceInfos.serviceId,
          )
            .then((availableEngagements) => availableEngagements)
            .catch(() => []),
          hasPendingEngagement: this.withEngagement
            ? this.BillingService.getPendingEngagement(serviceInfos.serviceId)
                .then(() => true)
                .catch(() => false)
            : this.$q.when(false),
        });
      })
      .then(
        ({
          availableEngagements,
          service,
          serviceInfos,
          hasPendingEngagement,
        }) => {
          this.hasDiscountAvailable = this.BillingService.hasDiscountAvailable(
            availableEngagements,
          );
          this.service = service;
          this.serviceInfos = new ServiceInfos({
            ...serviceInfos,
            id: serviceInfos.serviceId,
            serviceId: serviceInfos.domain,
            canBeEngaged: this.withEngagement
              ? availableEngagements.length > 0 && serviceInfos.canCommit()
              : false,
            engagementDetails: service.billing.engagement,
            hasPendingEngagement,
          });
          this.commitmentLink =
            this.goToCommit() ||
            this.coreURLBuilder.buildURL(
              'dedicated',
              `#/billing/autorenew/${serviceInfos.serviceId}/commitment`,
            );
          this.isAutoCommitmentStrategy =
            this.serviceInfos.engagementDetails?.endRule?.strategy ===
            AUTO_COMMITMENT_STRATEGY;
          if (
            this.withEngagement &&
            ServicesActionsCtrl.showCommit(
              this.serviceInfos,
              this.service.isEngaged(),
              this.highlightEngagement,
            )
          ) {
            this.trackImpression();
          }
        },
      )
      .catch((error) =>
        this.onError({
          error: this.$translate.instant('manager_billing_subscription_error', {
            message: (error.data && error.data.message) || error.message,
          }),
        }),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  commit() {
    this.trackClick('commit');
    return this.goToCommit();
  }

  cancelCommit() {
    this.trackClick('cancel-commit');
    return this.goToCancelCommit();
  }

  trackClick(action) {
    if (this.withEngagement) {
      this.trackClickImpression();
    }
    return this.atInternet.trackClick({
      name: `${this.trackingPrefix}::${action}`,
      type: 'action',
    });
  }

  trackImpression() {
    if (this.commitImpressionData) {
      this.atInternet.trackImpression(this.commitImpressionData);
    }
  }

  trackClickImpression() {
    if (this.commitImpressionData) {
      this.atInternet.trackClickImpression({
        click: this.commitImpressionData,
      });
    }
  }

  static showCommit(serviceInfos, isEngaged, highlightEngagement) {
    return (
      serviceInfos.canBeEngaged &&
      !serviceInfos.hasPendingEngagement &&
      (!isEngaged || highlightEngagement)
    );
  }

  manageContacts() {
    this.trackClick('manage-contacts');
    this.$window.location.assign(this.contactManagementUrl);
  }
}
