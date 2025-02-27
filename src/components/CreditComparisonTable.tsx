
import React, { useState } from "react";
import { formatRupiah } from "@/lib/calculations";
import { fees, getInterestRateFromTable, getInsuranceRateFromTable, getAdminFee } from "@/data/rateData";
import { DollarSign, Shield, Percent, Calendar, CreditCard } from "lucide-react";

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
  // State untuk menyimpan tenor yang dipilih
  const [selectedTenor, setSelectedTenor] = useState<number>(1);
  
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
  
  // Handler saat baris di tabel diklik
  const handleRowClick = (tenor: number) => {
    setSelectedTenor(tenor);
  };
  
  // Temukan data untuk tenor yang dipilih
  const selectedTenorData = tenorData.find(data => data.tenor === selectedTenor) || tenorData[0];
  
  return (
    <div className="my-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Perbandingan Tenor</h3>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabel Perbandingan - 50% width pada desktop */}
        <div className="lg:w-1/2 w-full">
          <div className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800/80">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-primary to-primary/90 text-white">
                <tr>
                  <th className="font-semibold py-3 text-left text-xs pl-4 w-[25%]">
                    TENOR
                  </th>
                  <th className="font-semibold py-3 text-center text-xs w-[37.5%]">
                    TOTAL DP
                  </th>
                  <th className="font-semibold py-3 text-right text-xs pr-4 w-[37.5%]">
                    ANGSURAN
                  </th>
                </tr>
              </thead>
              <tbody>
                {tenorData.map((data) => (
                  <tr 
                    key={data.tenor}
                    className={`border-b border-gray-100 dark:border-gray-700 transition-all duration-200 hover:bg-primary/5 cursor-pointer ${
                      selectedTenor === data.tenor ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => handleRowClick(data.tenor)}
                  >
                    <td className="py-3.5 pl-4">
                      <div className="font-medium text-sm">
                        {data.tenor} thn
                      </div>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="text-primary font-medium text-sm">
                        {formatRupiah(data.totalDp)}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-4">
                      <span className="text-accent font-medium text-sm">
                        {formatRupiah(data.monthlyInstallment)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info cards di sebelah kanan - 50% width pada desktop */}
        <div className="lg:w-1/2 w-full">
          <div className="space-y-4">
            {/* Harga OTR Card - PERTAMA */}
            <div className="bg-blue-600 rounded-xl p-4 flex justify-between items-center text-white shadow-xl">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium">Harga OTR</div>
              </div>
              <div className="text-lg font-bold">Rp {otrPrice.toLocaleString('id-ID')}</div>
            </div>
            
            {/* DP Calculated Card - KEDUA */}
            <div className="bg-emerald-500 rounded-xl p-4 flex justify-between items-center text-white shadow-xl">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <Percent className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium">DP Calculated</div>
              </div>
              <div className="text-lg font-bold">{dpPercent}%</div>
            </div>
            
            {/* Total DP Card - KETIGA */}
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-4 flex justify-between items-center text-white shadow-xl">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium">Total DP</div>
              </div>
              <div className="text-lg font-bold">
                {formatRupiah(selectedTenorData.totalDp)}
              </div>
            </div>
            
            {/* Angsuran Bulanan Card - KEEMPAT */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-4 flex justify-between items-center text-white shadow-xl">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium">Angsuran Bulanan</div>
              </div>
              <div className="text-lg font-bold">
                {formatRupiah(selectedTenorData.monthlyInstallment)}
              </div>
            </div>
            
            {/* Jenis Asuransi Card - KELIMA */}
            <div className="bg-purple-600 rounded-xl p-4 flex justify-between items-center text-white shadow-xl">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium">Jenis Asuransi</div>
              </div>
              <div className="text-lg font-bold">{insuranceTypeDisplay}</div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-3 italic">* Perhitungan di atas merupakan estimasi. Silakan hubungi dealer untuk informasi lebih lanjut.</p>
    </div>
  );
};

export default CreditComparisonTable;
