
import React, { useState, useEffect } from "react";
import { Calculator } from "lucide-react";
import FormInput from "./FormInput";
import ResultsTable from "./ResultsTable";
import CreditComparisonTable from "./CreditComparisonTable";
import { fees, getInterestRateFromTable, getInsuranceRateFromTable, getAdminFee } from "@/data/rateData";
import { useSettings } from "@/context/SettingsContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LoanCalculatorProps {
  defaultOtr?: number;
  defaultDpPercent?: number;
  defaultTenor?: number;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({
  defaultOtr = 300000000,
  defaultDpPercent = 30,
  defaultTenor = 4
}) => {
  const { provisionRate, additionalAdminFee } = useSettings();
  const [otrPrice, setOtrPrice] = useState<number>(defaultOtr);
  const [dpPercent, setDpPercent] = useState<number>(defaultDpPercent);
  const [dpAmount, setDpAmount] = useState<number>(Math.round(defaultOtr * (defaultDpPercent / 100)));
  const [tenor, setTenor] = useState<number>(defaultTenor);
  const [insuranceType, setInsuranceType] = useState<'kombinasi' | 'allrisk' | 'allriskPerluasan'>('kombinasi');
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  
  // Sync dp amount and percentage
  useEffect(() => {
    const calculatedDpAmount = Math.round(otrPrice * (dpPercent / 100));
    setDpAmount(calculatedDpAmount);
  }, [otrPrice, dpPercent]);

  useEffect(() => {
    // Only update dpPercent if otrPrice is valid
    if (otrPrice > 0) {
      const calculatedDpPercent = (dpAmount / otrPrice) * 100;
      setDpPercent(Number(calculatedDpPercent.toFixed(2)));
    }
  }, [dpAmount, otrPrice]);

  // Handle otr price input
  const handleOtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setOtrPrice(0);
    } else {
      setOtrPrice(parseInt(value, 10));
    }
  };

  // Handle down payment percentage input
  const handleDpPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d.]/g, "");
    
    if (value === "" || parseFloat(value) < 0) {
      setDpPercent(0);
    } else if (parseFloat(value) > 100) {
      setDpPercent(100);
    } else {
      setDpPercent(parseFloat(value));
    }
  };

  // Handle down payment amount input
  const handleDpAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    
    if (value === "") {
      setDpAmount(0);
    } else {
      const amount = parseInt(value, 10);
      // Cap the DP amount to OTR price
      setDpAmount(Math.min(amount, otrPrice));
    }
  };

  // Handle tenor change
  const handleTenorChange = (value: string) => {
    setTenor(parseInt(value, 10));
  };

  // Perform calculations
  const calculateLoan = () => {
    // Set calculating state
    setIsCalculating(true);
    
    // Simulate a short delay to show loading state
    setTimeout(() => {
      try {
        // Calculate DP amount from percentage if needed
        const dpAmount = Math.round(otrPrice * (dpPercent / 100));
        
        // Calculate loan principal (OTR - DP)
        const loanPrincipal = otrPrice - dpAmount;
        
        // Calculate provision fee
        const provisionFee = loanPrincipal * (provisionRate / 100);
        
        // Add provision to loan principal
        const loanWithProvision = loanPrincipal + provisionFee;
        
        // Get interest rate from table based on tenor
        const interestRate = getInterestRateFromTable(tenor);
        
        // Calculate total interest for the loan term
        const interestAmount = loanWithProvision * (interestRate / 100) * tenor;
        
        // Calculate total loan amount including interest
        const totalLoanAmount = loanWithProvision + interestAmount;
        
        // Calculate monthly installment
        const monthlyInstallment = Math.round(totalLoanAmount / (tenor * 12));
        
        // Get insurance rate from table
        const insuranceRate = getInsuranceRateFromTable(otrPrice, insuranceType, tenor);
        
        // Calculate insurance amount
        const insuranceAmount = otrPrice * (insuranceRate / 100);
        
        // Get admin fee from table based on tenor
        const adminFee = getAdminFee(tenor);
        
        // Add additional admin fee from settings
        const totalAdminFee = adminFee + additionalAdminFee;
        
        // Calculate total down payment (DP amount + first installment + insurance + admin + TPI)
        const totalDp = Math.round(dpAmount + monthlyInstallment + insuranceAmount + totalAdminFee + fees.tpiFee);
        
        // Set results state with all calculated values
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
          insuranceType: getInsuranceTypeLabel(insuranceType),
          provisionRate
        });
      } catch (error) {
        console.error("Calculation error:", error);
        setResults(null);
      }
      
      // Reset calculating state
      setIsCalculating(false);
    }, 500);
  };

  // Helper function to get insurance type label
  const getInsuranceTypeLabel = (type: string): string => {
    switch (type) {
      case 'kombinasi':
        return 'Kombinasi';
      case 'allrisk':
        return 'All Risk';
      case 'allriskPerluasan':
        return 'All Risk Perluasan';
      default:
        return 'Kombinasi';
    }
  };

  return (
    <div className="glass-card dark:glass-card-dark p-4 sm:p-6 rounded-2xl animate-fade-in">
      <div className="flex items-center mb-4 sm:mb-5">
        <Calculator className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
        <h2 className="text-lg sm:text-xl font-semibold">Simulasi Kredit</h2>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <FormInput
          label="Harga OTR"
          type="text"
          prefix="Rp"
          value={otrPrice.toLocaleString('id-ID')}
          onChange={handleOtrChange}
          placeholder="0"
          description="Harga On The Road kendaraan"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="DP (%)"
            type="text"
            suffix="%"
            value={dpPercent.toString()}
            onChange={handleDpPercentChange}
            placeholder="0"
            description="Persentase down payment"
          />

          <FormInput
            label="DP (Rp)"
            type="text"
            prefix="Rp"
            value={dpAmount.toLocaleString('id-ID')}
            onChange={handleDpAmountChange}
            placeholder="0"
            description="Jumlah down payment"
          />
        </div>

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
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setInsuranceType('kombinasi')}
              className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
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
              className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
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
              className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
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

        <button
          type="button"
          onClick={calculateLoan}
          className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-md font-medium flex items-center justify-center transition-colors"
          disabled={isCalculating}
        >
          <Calculator className="h-5 w-5 mr-2" />
          <span>
            {isCalculating ? "Sedang Menghitung..." : "Hitung Simulasi"}
          </span>
        </button>

        {isCalculating ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Menghitung simulasi kredit...</p>
          </div>
        ) : results ? (
          <>
            <div className="mt-6">
              <ResultsTable 
                results={results} 
                otrPrice={otrPrice} 
                dpPercent={dpPercent} 
                tenor={tenor} 
              />
            </div>
            
            <div className="mt-6">
              <CreditComparisonTable tenor={tenor} monthlyInstallment={results.monthlyInstallment} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default LoanCalculator;
