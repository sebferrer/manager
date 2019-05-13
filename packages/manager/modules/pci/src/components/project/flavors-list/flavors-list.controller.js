import filter from 'lodash/filter';
import find from 'lodash/find';
import first from 'lodash/first';
import get from 'lodash/get';
import forEach from 'lodash/forEach';

export default class FlavorsListController {
  /* @ngInject */
  constructor(
    PciProjectFlavors,
  ) {
    this.PciProjectFlavors = PciProjectFlavors;
  }

  $onInit() {
    this.isLoading = true;

    return this.getFlavors()
      .finally(() => {
        this.isLoading = false;
      });
  }

  getFlavors() {
    return this.PciProjectFlavors.getFlavors(this.serviceName)
      .then((flavors) => {
        const flavorGroups = this.PciProjectFlavors.constructor.mapByFlavorType(
          filter(flavors, flavor => flavor.isAvailable()
            && !flavor.isLegacy()
            && flavor.hasSsdDisk()
            && !flavor.isFlex()),
        );
        this.flavors = this.PciProjectFlavors.constructor.groupByCategory(flavorGroups);
        this.selectedCategory = get(first(this.flavors), 'category');
        this.findFlavor();

        return flavors;
      });
  }

  findFlavor() {
    if (this.defaultFlavorId) {
      forEach(this.flavors, (flavorCategory) => {
        const flavorGroup = find(
          flavorCategory.flavors,
          group => group.getFlavor(this.defaultFlavorId),
        );

        if (flavorGroup) {
          this.selectedCategory = get(flavorCategory, 'category');
          this.flavor = flavorGroup;
          this.onFlavorChange(flavorGroup);
        }
      });
    }
  }

  onFlavorChange(flavor) {
    this.selectedFlavor = flavor;
    if (this.onChange) {
      this.onChange({ flavor: this.selectedFlavor });
    }
  }
}
