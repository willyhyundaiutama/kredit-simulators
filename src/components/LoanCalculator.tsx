
import React, { useState, useEffect } from "react";
import { Calculator, DollarSign, Percent, Calendar, Shield } from "lucide-react";
import FormInput from "./FormInput";
import { formatRupiah } from "@/lib/calculations";
import { fees, getInterestRateFromTable, getInsuranceRateFromTable, getAdminFee } from "@/data/rateData";
import ResultsTable from "./ResultsTable";
import CreditComparisonTable from "./CreditComparisonTable";
import { useSettings } from "@/context/SettingsContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  defaultOtr,
  defaultDpPercent = 20,
  defaultTenor = 4
}) => {
  const { provisionRate, additionalAdminFee } = useSettings();
  const [otrPrice, setOtrPrice] = useState<number>(defaultOtr || 0);
  const [dpPercent, setDpPercent] = useState<number>(defaultDpPercent);
  const [tenor, setTenor] = useState<number>(defaultTenor);
  const [insuranceType, setInsuranceType] = useState<'kombinasi' | 'allrisk' | 'allriskPerluasan'>('kombinasi');
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [otrInputValue, setOtrInputValue] = useState<string>(defaultOtr ? defaultOtr.toLocaleString('id-ID') : "");

  const handleOtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setOtrInputValue(value === "" ? "" : parseInt(value, 10).toLocaleString('id-ID'));
    setOtrPrice(value === "" ? 0 : parseInt(value, 10));
  };

  const handleDpPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setDpPercent(0);
    } else {
      setDpPercent(Math.min(Math.max(value, 0), 90)); // Clamp between 0 and 90%
    }
  };

  const handleTenorChange = (value: string) => {
    setTenor(parseInt(value, 10));
  };

  const calculateLoan = () => {
    if (otrPrice <= 0) {
      setResults(null);
      return;
    }
    
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

  useEffect(() => {
    // Set initial value if defaultOtr is provided
    if (defaultOtr) {
      setOtrInputValue(defaultOtr.toLocaleString('id-ID'));
    }
  }, [defaultOtr]);

  return (
    <div className="w-full animate-fade-in">
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
            value={otrInputValue}
            onChange={handleOtrChange}
            placeholder="Masukkan harga OTR"
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
          
          <div className="space-y-1.5">
            <label className="input-label block">Tenor</label>
            <Select 
              value={tenor.toString()} 
              onValueChange={handleTenorChange}
            >
              <SelectTrigger className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md">
                <SelectValue placeholder="Pilih tenor" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                <SelectItem value="1">1 tahun</SelectItem>
                <SelectItem value="2">2 tahun</SelectItem>
                <SelectItem value="3">3 tahun</SelectItem>
                <SelectItem value="4">4 tahun</SelectItem>
                <SelectItem value="5">5 tahun</SelectItem>
                <SelectItem value="6">6 tahun</SelectItem>
                <SelectItem value="7">7 tahun</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400">Jangka waktu kredit (1-7 tahun)</p>
          </div>
          
          <div className="space-y-1.5">
            <label className="input-label block">Jenis Asuransi</label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <button
                type="button"
                onClick={() => setInsuranceType('kombinasi')}
                className={`relative py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${
                  insuranceType === 'kombinasi'
                    ? 'bg-primary text-white shadow-lg scale-[1.02]'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className={`relative z-10 ${
                  insuranceType === 'kombinasi'
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Kombinasi
                </span>
                {insuranceType === 'kombinasi' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 rounded-lg" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setInsuranceType('allrisk')}
                className={`relative py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${
                  insuranceType === 'allrisk'
                    ? 'bg-primary text-white shadow-lg scale-[1.02]'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className={`relative z-10 ${
                  insuranceType === 'allrisk'
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  All Risk
                </span>
                {insuranceType === 'allrisk' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 rounded-lg" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setInsuranceType('allriskPerluasan')}
                className={`relative py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${
                  insuranceType === 'allriskPerluasan'
                    ? 'bg-primary text-white shadow-lg scale-[1.02]'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className={`relative z-10 ${
                  insuranceType === 'allriskPerluasan'
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  AR Perluasan
                </span>
                {insuranceType === 'allriskPerluasan' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 rounded-lg" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pilih jenis asuransi kendaraan</p>
          </div>
          
          {otrPrice > 0 && (
            <div className="pt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nilai DP Murni: <span className="font-medium text-gray-700 dark:text-gray-300">{formatRupiah(otrPrice * (dpPercent / 100))}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Pokok Hutang: <span className="font-medium text-gray-700 dark:text-gray-300">{formatRupiah(otrPrice - (otrPrice * (dpPercent / 100)))}</span>
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Hasil Simulasi */}
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
      
      {/* Tabel Perbandingan Tenor */}
      {otrPrice > 0 && (
        <div className="mt-8 results-appear">
          <CreditComparisonTable 
            otrPrice={otrPrice}
            dpPercent={dpPercent}
            insuranceType={insuranceType}
            provisionRate={provisionRate}
            additionalAdminFee={additionalAdminFee}
          />
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
