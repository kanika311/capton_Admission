// Standard comprehensive location data for CaptonAdmission (States & Countries)

export const indianStatesList = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const countriesList = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'Ireland',
  'Singapore',
  'United Arab Emirates',
  'New Zealand',
  'France',
  'Russia',
  'Philippines',
];

export const internationalRegions = {
  'United States': ['California', 'Massachusetts', 'New York', 'Texas', 'Washington', 'Illinois', 'Pennsylvania', 'Georgia', 'Michigan'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland', 'London', 'Oxfordshire', 'Cambridgeshire'],
  'Canada': ['Ontario', 'British Columbia', 'Quebec', 'Alberta', 'Nova Scotia'],
  'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia'],
  'Germany': ['Bavaria', 'Baden-Württemberg', 'Berlin', 'North Rhine-Westphalia', 'Saxony'],
  'Singapore': ['Central Singapore', 'Jurong', 'Queenstown'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'],
  'Ireland': ['Dublin', 'Cork', 'Galway', 'Limerick'],
};

export const getStatesForCountry = (country) => {
  if (!country || country === 'All' || country === 'All Countries' || country === 'India') {
    return indianStatesList;
  }
  return internationalRegions[country] || [];
};
