
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
        <div className="lg:w-1/2 w-full flex">
          <div className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800/80 w-full h-full flex flex-col">
            <table className="w-full border-collapse flex-grow">
              <thead className="bg-[#002c5f] text-white">
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
              <tbody className="flex-grow">
                {tenorData.map((data) => (
                  <tr 
                    key={data.tenor}
                    className={`border-b border-gray-100 dark:border-gray-700 transition-all duration-200 hover:bg-gray-50 cursor-pointer ${
                      selectedTenor === data.tenor ? 'bg-gray-100 dark:bg-gray-700/20' : ''
                    }`}
                    onClick={() => handleRowClick(data.tenor)}
                  >
                    <td className="py-3.5 pl-4">
                      <div className="font-medium text-sm">
                        {data.tenor} thn
                      </div>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="text-[#002c5f] font-medium text-sm">
                        {formatRupiah(data.totalDp)}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-4">
                      <span className="text-[#00aad2] font-medium text-sm">
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
        <div className="lg:w-1/2 w-full flex">
          <div className="flex flex-col space-y-4 w-full h-full justify-between">
            {/* Harga OTR Card - PERTAMA */}
            <div className="bg-[#002c5f] rounded-xl p-4 flex justify-between items-center text-white shadow-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium">Harga OTR</div>
              </div>
              <div className="text-lg font-bold">Rp {otrPrice.toLocaleString('id-ID')}</div>
            </div>
            
            {/* Total DP Card - KEDUA */}
            <div className="bg-[#00aad2] rounded-xl p-4 flex justify-between items-center text-white shadow-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
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
            
            {/* Angsuran Bulanan Card - KETIGA */}
            <div className="bg-[#002c5f] rounded-xl p-4 flex justify-between items-center text-white shadow-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
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
            
            {/* Tenor Card - KEEMPAT */}
            <div className="bg-gray-500 rounded-xl p-4 flex justify-between items-center text-white shadow-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium">Tenor</div>
              </div>
              <div className="text-lg font-bold">{selectedTenorData.tenor} tahun</div>
            </div>
            
            {/* Jenis Asuransi Card - KELIMA */}
            <div className="bg-gray-100 rounded-xl p-4 flex justify-between items-center shadow-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              <div className="flex items-center">
                <div className="bg-[#002c5f] rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm font-medium text-[#002c5f]">Jenis Asuransi</div>
              </div>
              <div className="text-lg font-bold text-[#002c5f]">{insuranceTypeDisplay}</div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-3 italic">* Perhitungan di atas merupakan estimasi. Silakan hubungi dealer untuk informasi lebih lanjut.</p>
    </div>
  );
};

export default CreditComparisonTable;
