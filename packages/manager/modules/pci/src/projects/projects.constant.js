export const DEFAULT_PROJECT_KEY = 'PUBLIC_CLOUD_DEFAULT_PROJECT';
export const QUOTA_THRESHOLD = 80;

export const PCI_FEATURES = {
  PRODUCTS: {
    INSTANCE: 'instance',
    BAREMETAL: 'baremetal',
    BLOCK_STORAGE: 'block-storage',
    OBJECT_STORAGE: 'object-storage',
    DATABASES: 'databases',
    SNAPSHOT: 'snapshot',
    CLOUD_ARCHIVE: 'archive',
    INSTANCE_BACKUP: 'instance-backup',
    LOAD_BALANCER: 'load-balancer',
    PRIVATE_NETWORK: 'private-network',
    FAILOVER_IP: 'failover-ip',
    KUBERNETES: 'kubernetes',
    PRIVATE_REGISTRY: 'private-registry',
    WORKFLOW_MANAGEMENT: 'workflow-management',
    NOTEBOOKS: 'notebooks',
    TRAINING: 'training',
    SERVING: 'serving',
    ANALYTICS_DATA_PLATFORM: 'analytics-data-platform',
    DATA_PROCESSING: 'data-processing',
    LOGS_DATA_PLATFORM: 'logs-data-platform',
    HORIZON: 'horizon',
  },
  INSTANCE_FLAVORS_CATEGORY: {
    GENERAL: 'instance:flavors-category-general',
    CPU: 'instance:flavors-category-cpu',
    RAM: 'instance:flavors-category-ram',
    GPU: 'instance:flavors-category-gpu',
    SANDBOX: 'instance:flavors-category-sandbox',
    DISCOVERY: 'instance:flavors-category-discovery',
    IOPS: 'instance:flavors-category-iops',
  },
  SETTINGS: {
    USERS: 'public-cloud:users',
    QUOTA: 'public-cloud:quota',
    REGION: 'public-cloud:region',
    SSH_KEYS: 'public-cloud:ssh-keys',
    BILLING: 'public-cloud:billing',
    VOUCHERS: 'public-cloud:vouchers',
    CONTACTS: 'public-cloud:contacts',
    PROJECT: 'public-cloud:project',
    PROJECT_SETTINGS: 'public-cloud:project-settings',
  },
  LINKS: {
    FIRST_CLOUD_SERVER: 'public-cloud:link-first-cloud-server',
    USING_OPEN_STACK_API: 'public-cloud:link-using-open-stack-api',
    SETUP_ADDITIONAL_DISK: 'public-cloud:link-setup-additional-disk',
    ALL_GUIDES: 'public-cloud:link-all-guides',
    CREATE_HORIZON_USER: 'public-cloud:link-create-horizon-user',
    DEPLOY_INSTANCE: 'public-cloud:link-deploy-instance',
    START_WITH_BLOCK_STORAGE: 'public-cloud:link-start-with-block-storage',
  },
  OTHERS: {
    PUBLIC_CLOUD: 'public-cloud',
    CREATE_PROJECT: 'public-cloud:create-project',
    HDS: 'public-cloud:hds',
    TRUSTED_ZONE: 'public-cloud:trusted-zone',
  },
};

export const ORDER_FOLLOW_UP_POLLING_INTERVAL = 7000;

export const ORDER_FOLLOW_UP_STATUS_ENUM = {
  DOING: 'DOING',
  DONE: 'DONE',
  ERROR: 'ERROR',
  TODO: 'TODO',
};

export const ORDER_FOLLOW_UP_STEP_ENUM = {
  AVAILABLE: 'AVAILABLE',
  DELIVERING: 'DELIVERING',
  VALIDATED: 'VALIDATED',
  VALIDATING: 'VALIDATING',
};

export const ORDER_FOLLOW_UP_HISTORY_STATUS_ENUM = {
  FRAUD_DOCS_REQUESTED: 'FRAUD_DOCS_REQUESTED',
  FRAUD_MANUAL_REVIEW: 'FRAUD_MANUAL_REVIEW',
};

export default {
  PCI_FEATURES,
  DEFAULT_PROJECT_KEY,
  QUOTA_THRESHOLD,
  ORDER_FOLLOW_UP_POLLING_INTERVAL,
  ORDER_FOLLOW_UP_STATUS_ENUM,
  ORDER_FOLLOW_UP_STEP_ENUM,
  ORDER_FOLLOW_UP_HISTORY_STATUS_ENUM,
};
