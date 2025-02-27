
/**
 * Sample interest rates data by tenor
 */
export const interestRates = [
  { tenor: 1, rate: 3.5 },
  { tenor: 2, rate: 4.0 },
  { tenor: 3, rate: 4.5 },
  { tenor: 4, rate: 4.88 },
  { tenor: 5, rate: 5.2 },
  { tenor: 6, rate: 5.5 },
  { tenor: 7, rate: 5.8 },
  { tenor: 8, rate: 6.0 }
];

/**
 * Sample insurance rates data
 * Rates are in percentages
 */
export const insuranceRates = {
  kombinasi: [
    { minPrice: 0, maxPrice: 200000000, rate: 3.2 },
    { minPrice: 200000000, maxPrice: 300000000, rate: 3.4 },
    { minPrice: 300000000, maxPrice: 400000000, rate: 3.6 },
    { minPrice: 400000000, maxPrice: Infinity, rate: 3.8 }
  ],
  allrisk: [
    { minPrice: 0, maxPrice: 200000000, rate: 3.8 },
    { minPrice: 200000000, maxPrice: 300000000, rate: 4.0 },
    { minPrice: 300000000, maxPrice: 400000000, rate: 4.2 },
    { minPrice: 400000000, maxPrice: Infinity, rate: 4.4 }
  ],
  allriskPerluasan: [
    { minPrice: 0, maxPrice: 200000000, rate: 4.2 },
    { minPrice: 200000000, maxPrice: 300000000, rate: 4.4 },
    { minPrice: 300000000, maxPrice: 400000000, rate: 4.6 },
    { minPrice: 400000000, maxPrice: Infinity, rate: 4.8 }
  ]
};

/**
 * Sample additional fees
 */
export const fees = {
  provisionRate: 5.0, // Provision rate in percentage
  adminFee: 3500000, // Administration fee in Rupiah
  tpiFee: 500000, // TPI fee in Rupiah
  creditProtectionRate: 0.0 // Credit protection rate in percentage
};

/**
 * Get the proper insurance rate based on car price, tenor, and insurance type
 */
export const getInsuranceRateFromTable = (
  carPrice: number,
  insuranceType: keyof typeof insuranceRates
): number => {
  const rateTable = insuranceRates[insuranceType];
  
  for (const rateInfo of rateTable) {
    if (carPrice >= rateInfo.minPrice && carPrice < rateInfo.maxPrice) {
      return rateInfo.rate;
    }
  }
  
  // Default to the highest rate if no match
  return rateTable[rateTable.length - 1].rate;
};

/**
 * Get the interest rate based on tenor (in years)
 */
export const getInterestRateFromTable = (tenorYears: number): number => {
  const matchedRate = interestRates.find(item => item.tenor === tenorYears);
  return matchedRate ? matchedRate.rate : 4.88; // Default to 4.88% if no match
};
