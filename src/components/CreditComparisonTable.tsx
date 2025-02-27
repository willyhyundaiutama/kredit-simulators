
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
      monthlyInstallment
    });
  }
  
  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Perbandingan Tenor</h3>
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium px-6 py-4 text-left rounded-tl-xl border-b border-gray-200 dark:border-gray-700">
                TIPE
              </th>
              <th className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                TENOR
              </th>
              <th className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
                TOTAL DP
              </th>
              <th className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium px-6 py-4 text-center rounded-tr-xl border-b border-gray-200 dark:border-gray-700">
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
                {index === 0 && (
                  <td rowSpan={7} className="px-6 py-5 text-center font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/80 align-middle">
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Harga OTR</span>
                      <span className="text-primary">{formatRupiah(otrPrice)}</span>
                    </div>
                  </td>
                )}
                <td className={`px-6 py-4 text-center border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/80 ${index === 6 && 'rounded-bl-xl'}`}>
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium">
                    {data.tenor * 12} bulan
                  </span>
                </td>
                <td className="px-6 py-4 text-center border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/80">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{formatRupiah(data.totalDp)}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {dpPercent}% + biaya lainnya
                  </span>
                </td>
                <td className={`px-6 py-4 text-center border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/80 ${index === 6 && 'rounded-br-xl'}`}>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-semibold">{formatRupiah(data.monthlyInstallment)}</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                      per bulan
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-3 italic">* Perhitungan di atas merupakan estimasi. Silahkan hubungi dealer untuk informasi lebih lanjut.</p>
    </div>
  );
};

export default CreditComparisonTable;
