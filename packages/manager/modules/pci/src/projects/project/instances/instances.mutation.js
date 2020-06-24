import gql from 'graphql-tag';

export const DELETE_INSTANCE = gql`
  mutation deleteInstance($projectId: String, $instanceId: String) {
    deleteInstance(projectId: $projectId, instanceId: $instanceId) {
      id,
    }
  }
`;

export default {
  DELETE_INSTANCE,
};
