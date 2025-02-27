
import React from "react";
import { formatRupiah } from "@/lib/calculations";
import { fees, getInterestRateFromTable, getInsuranceRateFromTable, getAdminFee } from "@/data/rateData";

interface CreditComparisonTableProps {
  otrPrice: number;
  dpPercent: number;
  insuranceType: 'kombinasi' | 'allrisk' | 'allriskPerluasan';
  provisionRate: number;
  additionalAdminFee: number;
}

interface TenorData {
  tenor: number;
  totalDp: number;
  monthlyInstallment: number;
  interestRate: number;
  insuranceRate: number;
  adminFee: number;
}

const CreditComparisonTable: React.FC<CreditComparisonTableProps> = ({
  otrPrice,
  dpPercent,
  insuranceType,
  provisionRate,
  additionalAdminFee
}) => {
  // Calculate data for each tenor
  const tenorData: TenorData[] = [];
  
  // Generate data for tenors 1-7 years
  for (let tenor = 1; tenor <= 7; tenor++) {
    // Basic calculations
    const dpAmount = otrPrice * (dpPercent / 100);
    const loanPrincipal = otrPrice - dpAmount;
    const provisionFee = loanPrincipal * (provisionRate / 100);
    const loanWithProvision = loanPrincipal + provisionFee;
    
    const interestRate = getInterestRateFromTable(tenor);
    const interestAmount = loanWithProvision * (interestRate / 100) * tenor;
    
    const totalLoanAmount = loanWithProvision + interestAmount;
    const tenorMonths = tenor * 12;
    const monthlyInstallment = totalLoanAmount / tenorMonths;
    
    const insuranceRate = getInsuranceRateFromTable(otrPrice, insuranceType, tenor);
    const insuranceAmount = otrPrice * (insuranceRate / 100);
    
    const adminFee = getAdminFee(tenor);
    const totalAdminFee = adminFee + additionalAdminFee;
    
    const creditProtection = loanPrincipal * (fees.creditProtectionRate / 100);
    
    // Total DP calculation
    const totalDp = dpAmount + monthlyInstallment + insuranceAmount + totalAdminFee + fees.tpiFee + creditProtection;
    
    // Add to data array
    tenorData.push({
      tenor,
      totalDp,
      monthlyInstallment,
      interestRate,
      insuranceRate,
      adminFee: totalAdminFee
    });
  }

  // Transform insurance type for display
  const insuranceTypeDisplay = {
    'kombinasi': 'Kombinasi',
    'allrisk': 'All Risk',
    'allriskPerluasan': 'All Risk Perluasan'
  }[insuranceType];
  
  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Perbandingan Tenor</h3>
      
      {/* Info cards di atas tabel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Harga OTR Card */}
        <div className="bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 rounded-lg p-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Harga OTR</div>
            <div className="text-lg font-bold text-primary">{formatRupiah(otrPrice)}</div>
          </div>
        </div>
        
        {/* Asuransi Card */}
        <div className="bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 rounded-lg p-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Jenis Asuransi</div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{insuranceTypeDisplay}</div>
          </div>
        </div>
        
        {/* DP Percentage Card */}
        <div className="bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 rounded-lg p-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">DP Minimum</div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">{dpPercent}%</div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-xl -mx-4 sm:mx-0">
        <div className="min-w-[640px] pb-4 sm:pb-0">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium px-4 sm:px-6 py-4 text-center rounded-tl-xl border-b border-gray-200 dark:border-gray-700">
                  TENOR
                </th>
                <th className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium px-4 sm:px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                  TOTAL DP
                </th>
                <th className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium px-4 sm:px-6 py-4 text-center rounded-tr-xl border-b border-gray-200 dark:border-gray-700">
                  ANGSURAN
                </th>
              </tr>
            </thead>
            <tbody>
              {tenorData.map((data, index) => (
                <tr 
                  key={data.tenor}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors`}
                >
                  <td className={`px-4 sm:px-6 py-4 text-center border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/80 ${index === 6 && 'rounded-bl-xl'}`}>
                    <span className="inline-flex items-center justify-center px-2 sm:px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-medium">
                      {data.tenor * 12} bulan
                    </span>
                    <span className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Bunga: {data.interestRate.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-center border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/80">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm sm:text-base">{formatRupiah(data.totalDp)}</span>
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        DP Murni: {dpPercent}% ({formatRupiah(otrPrice * dpPercent / 100)})
                      </span>
                      <span className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        Asuransi: {data.insuranceRate.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className={`px-4 sm:px-6 py-4 text-center border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/80 ${index === 6 && 'rounded-br-xl'}`}>
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 font-semibold text-sm sm:text-base">{formatRupiah(data.monthlyInstallment)}</span>
                      <div className="flex flex-col gap-1 mt-2">
                        <span className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          Admin: {formatRupiah(data.adminFee)}
                        </span>
                        <span className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          Provisi: {provisionRate}%
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-[10px] sm:text-xs text-gray-500 mt-3 italic px-4 sm:px-0">* Perhitungan di atas merupakan estimasi. Silahkan hubungi dealer untuk informasi lebih lanjut.</p>
    </div>
  );
};

export default CreditComparisonTable;
