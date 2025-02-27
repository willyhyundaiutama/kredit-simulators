
import React, { useState, useEffect } from "react";
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
  const [targetTotalDp, setTargetTotalDp] = useState<string>("");
  const [closestMatch, setClosestMatch] = useState<number | null>(null);
  const [tenorData, setTenorData] = useState<TenorData[]>([]);

  // Calculate data for each tenor
  useEffect(() => {
    const newTenorData: TenorData[] = [];
    
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
      newTenorData.push({
        tenor,
        totalDp,
        monthlyInstallment,
        interestRate,
        insuranceRate,
        adminFee: totalAdminFee
      });
    }
    
    setTenorData(newTenorData);
  }, [otrPrice, dpPercent, insuranceType, provisionRate, additionalAdminFee]);

  // Find the closest tenor to target total DP
  useEffect(() => {
    if (!targetTotalDp || targetTotalDp === "") {
      setClosestMatch(null);
      return;
    }

    try {
      const targetValue = parseFloat(targetTotalDp.replace(/[^\d]/g, ''));
      
      if (isNaN(targetValue) || targetValue <= 0) {
        setClosestMatch(null);
        return;
      }

      let closestTenor = 0;
      let smallestDiff = Number.MAX_VALUE;

      tenorData.forEach((data, index) => {
        const diff = Math.abs(data.totalDp - targetValue);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestTenor = index;
        }
      });

      setClosestMatch(closestTenor);
    } catch (error) {
      console.error("Error finding closest match:", error);
      setClosestMatch(null);
    }
  }, [targetTotalDp, tenorData]);

  // Format input value as rupiah
  const handleTotalDpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^\d]/g, '');
    
    if (numericValue === '') {
      setTargetTotalDp('');
      return;
    }
    
    // Convert to number and format as Rupiah
    const formattedValue = formatRupiah(parseInt(numericValue, 10));
    setTargetTotalDp(formattedValue);
  };

  // Transform insurance type for display
  const insuranceTypeDisplay = {
    'kombinasi': 'Kombinasi',
    'allrisk': 'All Risk',
    'allriskPerluasan': 'All Risk Perluasan'
  }[insuranceType];
  
  return (
    <div className="my-6">
      <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Perbandingan Tenor</h3>
      
      {/* Info cards di atas tabel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Harga OTR Card */}
        <div className="bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 rounded-lg p-3">
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Harga OTR</div>
            <div className="text-base font-bold text-primary">{formatRupiah(otrPrice)}</div>
          </div>
        </div>
        
        {/* Asuransi Card */}
        <div className="bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 rounded-lg p-3">
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Jenis Asuransi</div>
            <div className="text-base font-bold text-blue-600 dark:text-blue-400">{insuranceTypeDisplay}</div>
          </div>
        </div>
        
        {/* DP Percentage Card */}
        <div className="bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 rounded-lg p-3">
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">DP Calculated</div>
            <div className="text-base font-bold text-green-600 dark:text-green-400">{dpPercent}%</div>
          </div>
        </div>
      </div>
      
      {/* Search by Total DP */}
      <div className="mb-4 bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 rounded-lg p-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <label htmlFor="totalDpSearch" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Cari berdasarkan Total DP:
          </label>
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              Rp
            </span>
            <input
              id="totalDpSearch"
              type="text"
              value={targetTotalDp}
              onChange={handleTotalDpChange}
              placeholder="Contoh: 100.000.000"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/80"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-xl -mx-4 sm:mx-0">
        <div className="min-w-[640px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-gray-600 dark:text-gray-300 font-medium px-4 py-3 text-left text-xs">
                  TENOR
                </th>
                <th className="text-gray-600 dark:text-gray-300 font-medium px-4 py-3 text-center text-xs">
                  TOTAL DP
                </th>
                <th className="text-gray-600 dark:text-gray-300 font-medium px-4 py-3 text-right text-xs">
                  ANGSURAN
                </th>
              </tr>
            </thead>
            <tbody>
              {tenorData.map((data, index) => (
                <tr 
                  key={data.tenor}
                  className={`border-b border-gray-100 dark:border-gray-800 transition-all duration-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 ${
                    closestMatch === index ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  }`}
                >
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                      {data.tenor * 12} bulan
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                      {formatRupiah(data.totalDp)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-green-600 dark:text-green-400 font-medium text-sm">
                      {formatRupiah(data.monthlyInstallment)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-[10px] text-gray-500 mt-2 italic px-4 sm:px-0">* Perhitungan di atas merupakan estimasi. Silahkan hubungi dealer untuk informasi lebih lanjut.</p>
    </div>
  );
};

export default CreditComparisonTable;
