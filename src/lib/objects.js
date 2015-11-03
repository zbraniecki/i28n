
export const knownObjects = {
  datetime: {
    create: function (options) {
      const resolvedOptions = Object.assign({}, options);

      if (resolvedOptions.hour) {
        resolvedOptions.hour12 = navigator.mozHour12;
      }

      return Intl.DateTimeFormat(navigator.languages, resolvedOptions);
    },
    isAffected: function (reason, options) {
      if (reason === 'languagechange') {
        return true;
      }

      if (reason === 'timeformatchange') {
        return 'hour' in options;
      }

      return false;
    }
  }
};
