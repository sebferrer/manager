import { PCI_FEATURES } from '../projects.constant';

export const ACTIONS = [
  {
    translation: 'pci_projects_project_create_an_instance',
    state: 'pci.projects.project.instances.add',
    feature: PCI_FEATURES.PRODUCTS.INSTANCE,
  },
  {
    translation: 'pci_projects_project_create_a_volume',
    state: 'pci.projects.project.storages.blocks.add',
    feature: PCI_FEATURES.PRODUCTS.BLOCK_STORAGE,
  },
  {
    translation: 'pci_projects_project_create_a_container',
    state: 'pci.projects.project.storages.object-storage.add',
    feature: PCI_FEATURES.PRODUCTS.OBJECT_STORAGE,
  },
  {
    translation: 'pci_projects_project_activate_private_networks',
    state: 'pci.projects.project.privateNetwork',
    feature: PCI_FEATURES.PRODUCTS.PRIVATE_NETWORK,
  },
  {
    translation: 'pci_projects_project_create_cluster_kubernetes',
    state: 'pci.projects.project.kubernetes',
    feature: PCI_FEATURES.PRODUCTS.KUBERNETES,
  },
];

export const LINKS = [
  {
    translation:
      'pci_projects_project_documentation_create_user_access_to_horizon',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/configure_user_access_to_horizon/',
    feature: PCI_FEATURES.LINKS.CREATE_HORIZON_USER,
  },
  {
    translation:
      'pci_projects_project_documentation_boot_your_first_cloud_server_in_3_minutes',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/create_an_instance_in_your_ovh_customer_account',
    feature: PCI_FEATURES.LINKS.FIRST_CLOUD_SERVER,
  },
  {
    translation:
      'pci_projects_project_documentation_prepare_the_environment_for_using_the_open_stack_api',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/prepare_the_environment_for_using_the_openstack_api/',
    feature: PCI_FEATURES.LINKS.USING_OPEN_STACK_API,
  },
  {
    translation:
      'pci_projects_project_documentation_create_and_configure_and_additional_disk_on_an_instance',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/create-an-additional-volume-and-attach-it-to-an-instance/',
    feature: PCI_FEATURES.LINKS.SETUP_ADDITIONAL_DISK,
  },
  {
    translation:
      'pci_projects_project_documentation_see_all_public_cloud_guides',
    href: 'https://docs.ovh.com/gb/en/public-cloud',
    feature: PCI_FEATURES.LINKS.ALL_GUIDES,
  },
  {
    translation:
      'pci_projects_project_documentation_how_to_create_a_horizon_user',
    href: 'https://support.us.ovhcloud.com/hc/en-us/articles/360008644539',
    feature: PCI_FEATURES.LINKS.CREATE_HORIZON_USER,
  },
  {
    translation:
      'pci_projects_project_documentation_how_to_deploy_a_public_cloud_instance',
    href: 'https://support.us.ovhcloud.com/hc/en-us/articles/360002245164',
    feature: PCI_FEATURES.LINKS.DEPLOY_INSTANCE,
  },
  {
    translation:
      'pci_projects_project_documentation_getting_started_with_block_storage',
    href: 'https://support.us.ovhcloud.com/hc/en-us/articles/360002157044',
    feature: PCI_FEATURES.LINKS.START_WITH_BLOCK_STORAGE,
  },
  {
    translation:
      'pci_projects_project_documentation_see_all_public_cloud_guides',
    href: 'https://support.us.ovhcloud.com/hc/en-us/categories/115000515130',
    feature: PCI_FEATURES.LINKS.ALL_GUIDES,
  },
];

export const PCI_HDS_ADDON = {
  productName: 'cloud',
  family: 'certification-hds',
  parentPlanCode: 'project.2018',
  planCodeScope: 'certification.hds',
  certifiedProject: 'publiccloud-certification-hds',
  planCode: 'certification.hds.2018',
};

export const LEGACY_PLAN_CODES = ['project.legacy', 'project.2018'];

export default {
  ACTIONS,
  LINKS,
  PCI_HDS_ADDON,
  LEGACY_PLAN_CODES,
};
