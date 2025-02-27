
import React, { useState, useEffect } from "react";
import { Calculator, DollarSign, Percent, Calendar, Shield } from "lucide-react";
import FormInput from "./FormInput";
import { formatRupiah } from "@/lib/calculations";
import { fees, getInterestRateFromTable, getInsuranceRateFromTable, getAdminFee } from "@/data/rateData";
import ResultsTable from "./ResultsTable";

interface LoanCalculatorProps {
  defaultOtr?: number;
  defaultDpPercent?: number;
  defaultTenor?: number;
}

interface CalculationResults {
  dpAmount: number;
  loanPrincipal: number;
  provisionFee: number;
  loanWithProvision: number;
  interestRate: number;
  interestAmount: number;
  totalLoanAmount: number;
  monthlyInstallment: number;
  insuranceAmount: number;
  insuranceRate: number;
  totalDp: number;
  adminFee: number;
  additionalAdminFee: number;
  totalAdminFee: number;
  tpiFee: number;
  insuranceType: string;
  provisionRate: number;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({
  defaultOtr = 300000000,
  defaultDpPercent = 20,
  defaultTenor = 4
}) => {
  const [otrPrice, setOtrPrice] = useState<number>(defaultOtr);
  const [dpPercent, setDpPercent] = useState<number>(defaultDpPercent);
  const [tenor, setTenor] = useState<number>(defaultTenor);
  const [provisionRate, setProvisionRate] = useState<number>(fees.provisionRate);
  const [additionalAdminFee, setAdditionalAdminFee] = useState<number>(0);
  const [insuranceType, setInsuranceType] = useState<'kombinasi' | 'allrisk' | 'allriskPerluasan'>('kombinasi');
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const handleOtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setOtrPrice(0);
    } else {
      setOtrPrice(parseInt(value, 10));
    }
  };

  const handleDpPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setDpPercent(0);
    } else {
      setDpPercent(Math.min(Math.max(value, 0), 90)); // Clamp between 0 and 90%
    }
  };

  const handleTenorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setTenor(1);
    } else {
      setTenor(Math.min(Math.max(value, 1), 7)); // Clamp between 1 and 7 years
    }
  };

  const handleProvisionRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setProvisionRate(0);
    } else {
      setProvisionRate(Math.min(Math.max(value, 0), 10)); // Clamp between 0 and 10%
    }
  };
  
  const handleAdditionalAdminFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setAdditionalAdminFee(0);
    } else {
      setAdditionalAdminFee(parseInt(value, 10));
    }
  };

  const calculateLoan = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      try {
        const dpAmount = otrPrice * (dpPercent / 100);
        const loanPrincipal = otrPrice - dpAmount;
        const provisionFee = loanPrincipal * (provisionRate / 100);
        const loanWithProvision = loanPrincipal + provisionFee;
        
        const interestRate = getInterestRateFromTable(tenor);
        
        // Calculate interest based on loan principal plus provision
        const interestAmount = loanWithProvision * (interestRate / 100) * tenor;
        
        const totalLoanAmount = loanWithProvision + interestAmount;
        
        const tenorMonths = tenor * 12;
        const monthlyInstallment = totalLoanAmount / tenorMonths;
        
        // Get insurance rate from table based on OTR price, tenor, and insurance type
        const insuranceRate = getInsuranceRateFromTable(otrPrice, insuranceType, tenor);
        const insuranceAmount = otrPrice * (insuranceRate / 100);
        
        // Get admin fee based on tenor
        const adminFee = getAdminFee(tenor);
        const totalAdminFee = adminFee + additionalAdminFee;
        
        const creditProtection = loanPrincipal * (fees.creditProtectionRate / 100);
        
        // Total DP includes: DP + First Installment + Insurance + Admin Fee + TPI Fee + Credit Protection
        const totalDp = dpAmount + monthlyInstallment + insuranceAmount + totalAdminFee + fees.tpiFee + creditProtection;
        
        setResults({
          dpAmount,
          loanPrincipal,
          provisionFee,
          loanWithProvision,
          interestRate,
          interestAmount,
          totalLoanAmount,
          monthlyInstallment,
          insuranceAmount,
          insuranceRate,
          totalDp,
          adminFee,
          additionalAdminFee,
          totalAdminFee,
          tpiFee: fees.tpiFee,
          provisionRate,
          insuranceType: insuranceType === 'kombinasi' 
            ? 'Kombinasi' 
            : insuranceType === 'allrisk' 
              ? 'All Risk' 
              : 'All Risk Perluasan'
        });
        
        setIsCalculating(false);
      } catch (error) {
        console.error("Calculation error:", error);
        setIsCalculating(false);
      }
    }, 600); // Add a slight delay for better UX
  };

  // Calculate on initial render and when inputs change
  useEffect(() => {
    calculateLoan();
  }, [otrPrice, dpPercent, tenor, insuranceType, provisionRate, additionalAdminFee]);

  return (
    <div className="w-full animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card dark:glass-card-dark p-6 rounded-2xl">
          <div className="flex items-center mb-5">
            <Calculator className="h-5 w-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Simulasi Kredit</h2>
          </div>
          
          <div className="space-y-6">
            <FormInput
              label="Harga OTR"
              type="text"
              prefix="Rp"
              value={otrPrice.toLocaleString('id-ID')}
              onChange={handleOtrChange}
              placeholder="0"
              description="Harga On The Road kendaraan"
            />
            
            <FormInput
              label="Uang Muka (%)"
              type="number"
              min={0}
              max={90}
              value={dpPercent}
              onChange={handleDpPercentChange}
              suffix="%"
              description="Minimal 20% dari harga OTR"
            />
            
            <FormInput
              label="Tenor"
              type="number"
              min={1}
              max={7}
              value={tenor}
              onChange={handleTenorChange}
              suffix="tahun"
              description="Jangka waktu kredit (1-7 tahun)"
            />

            <FormInput
              label="Provisi"
              type="number"
              min={0}
              max={10}
              value={provisionRate}
              onChange={handleProvisionRateChange}
              suffix="%"
              description="Biaya provisi dari pokok hutang"
            />
            
            <FormInput
              label="Biaya Admin Tambahan"
              type="text"
              prefix="Rp"
              value={additionalAdminFee.toLocaleString('id-ID')}
              onChange={handleAdditionalAdminFeeChange}
              placeholder="0"
              description="Biaya admin tambahan di luar biaya admin default"
            />
            
            <div className="space-y-1.5">
              <label className="input-label block">Jenis Asuransi</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setInsuranceType('kombinasi')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    insuranceType === 'kombinasi'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Kombinasi
                </button>
                <button
                  type="button"
                  onClick={() => setInsuranceType('allrisk')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    insuranceType === 'allrisk'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  All Risk
                </button>
                <button
                  type="button"
                  onClick={() => setInsuranceType('allriskPerluasan')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    insuranceType === 'allriskPerluasan'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  AR Perluasan
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pilih jenis asuransi kendaraan</p>
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nilai DP Murni: <span className="font-medium text-gray-700 dark:text-gray-300">{formatRupiah(otrPrice * (dpPercent / 100))}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Pokok Hutang: <span className="font-medium text-gray-700 dark:text-gray-300">{formatRupiah(otrPrice - (otrPrice * (dpPercent / 100)))}</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="glass-card dark:glass-card-dark p-6 rounded-2xl">
          <div className="flex items-center mb-5">
            <DollarSign className="h-5 w-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Biaya Tambahan</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="input-label">Biaya Provisi</p>
              <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50 dark:bg-gray-800/50">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {provisionRate}% dari Pokok Hutang
                </span>
                <span className="font-medium">
                  {formatRupiah(results?.provisionFee || 0)}
                </span>
              </div>
            </div>
            
            <div>
              <p className="input-label">Biaya Administrasi</p>
              <div className="flex flex-col p-3 border rounded-md bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Admin Dasar (Tenor {tenor} tahun)
                  </span>
                  <span className="font-medium">
                    {formatRupiah(getAdminFee(tenor))}
                  </span>
                </div>
                {additionalAdminFee > 0 && (
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Admin Tambahan
                    </span>
                    <span className="font-medium">
                      {formatRupiah(additionalAdminFee)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Admin
                  </span>
                  <span className="font-medium">
                    {formatRupiah((results?.totalAdminFee || 0))}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="input-label">
                <span className="flex items-center">
                  <Shield className="h-4 w-4 text-primary mr-1" />
                  <span>Asuransi Mobil {tenor} Tahun</span>
                </span>
              </p>
              <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50 dark:bg-gray-800/50">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {results?.insuranceRate.toFixed(2)}% dari Harga OTR ({results?.insuranceType})
                </span>
                <span className="font-medium">
                  {formatRupiah(results?.insuranceAmount || 0)}
                </span>
              </div>
            </div>
            
            <div>
              <p className="input-label">TPI III</p>
              <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50 dark:bg-gray-800/50">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Tetap
                </span>
                <span className="font-medium">
                  {formatRupiah(fees.tpiFee)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {results && (
        <div className="mt-8 results-appear">
          <ResultsTable 
            results={results} 
            otrPrice={otrPrice} 
            dpPercent={dpPercent} 
            tenor={tenor} 
          />
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
