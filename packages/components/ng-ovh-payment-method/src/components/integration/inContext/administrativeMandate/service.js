import { REASONS, REQUIRED_FIELDS } from './constants';

export default {
  getRequiredField: (response) => {
    const [requiredFieldMessage] = response.message.split(
      ` - ${REASONS.MUST_BE_PROVIDED}`,
    );

    if (requiredFieldMessage) {
      const requiredField = Object.values(REQUIRED_FIELDS).find(
        (value) => value === requiredFieldMessage,
      );

      return { requiredFields: [requiredField] };
    }

    return null;
  },
};
