export const getCountryCode = (countryName) => {
  const countryMap = {
    'India': 'IN',
    'United States': 'US',
    'Canada': 'CA',
    // Add more mappings as needed
  };

  return countryMap[countryName] || 'IN'; // Default to IN if country not found
}; 