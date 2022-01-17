export default function() {
  const self = this;
  let baseUrlTicketsPromise = null;

  self.setBaseUrlTickets = (urlOrPromise) => {
    if (urlOrPromise) {
      baseUrlTicketsPromise = Promise.resolve(urlOrPromise);
    } else {
      throw new Error('An URL must be specified.');
    }
  };

  self.$get = () => ({
    getBaseUrlTickets() {
      return baseUrlTicketsPromise;
    },
  });
}
