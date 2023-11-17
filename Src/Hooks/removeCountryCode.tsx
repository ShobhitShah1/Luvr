const removeCountryCode = (phoneNumber: string): string => {
  const countryCodeRegex = /^\+(\d{1,4})/;
  const matches = countryCodeRegex.exec(phoneNumber);

  if (matches && matches[1]) {
    const countryCode = matches[1];
    return phoneNumber.replace(`+${countryCode}`, '');
  }

  return phoneNumber;
};

export default removeCountryCode;
