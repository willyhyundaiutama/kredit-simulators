
import React, { useState, useEffect } from "react";
import { Calculator, Wallet, Car, CreditCard, Calendar, ArrowRight } from "lucide-react";
import FormInput from "./FormInput";
import { formatRupiah } from "@/lib/calculations";
import { fees, getInterestRateFromTable, getInsuranceRateFromTable, getAdminFee } from "@/data/rateData";
import { useSettings } from "@/context/SettingsContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BudgetCalculatorProps {
  defaultOtr?: number;
  defaultTenor?: number;
}

const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({
  defaultOtr = 300000000,
  defaultTenor = 4
}) => {
  const { provisionRate, additionalAdminFee } = useSettings();
  const [otrPrice, setOtrPrice] = useState<number>(defaultOtr);
  const [tenor, setTenor] = useState<number>(defaultTenor);
  const [insuranceType, setInsuranceType] = useState<'kombinasi' | 'allrisk' | 'allriskPerluasan'>('kombinasi');
  const [budgetType, setBudgetType] = useState<'tdp' | 'installment'>('tdp');
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [calculatedDpPercent, setCalculatedDpPercent] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const handleOtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setOtrPrice(0);
    } else {
      setOtrPrice(parseInt(value, 10));
    }
  };

  const handleTenorChange = (value: string) => {
    setTenor(parseInt(value, 10));
  };

  const handleBudgetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    
    if (value === '') {
      setBudgetAmount('');
      return;
    }
    
    const numericValue = parseInt(value, 10);
    setBudgetAmount(numericValue.toLocaleString('id-ID'));
  };

  const findClosestDpPercentage = (targetAmount: number, forInstallment: boolean): number => {
    let closestDp = 20; // Start from minimum DP
    let smallestDiff = Number.MAX_VALUE;
    
    for (let testDp = 20; testDp <= 90; testDp += 0.00001) { // Increment yang jauh lebih kecil
      const dpAmount = otrPrice * (testDp / 100);
      const loanPrincipal = otrPrice - dpAmount;
      const provisionFee = loanPrincipal * (provisionRate / 100);
      const loanWithProvision = loanPrincipal + provisionFee;
      
      const interestRate = getInterestRateFromTable(tenor);
      const interestAmount = loanWithProvision * (interestRate / 100) * tenor;
      const totalLoanAmount = loanWithProvision + interestAmount;
      const monthlyInstallment = Math.round(totalLoanAmount / (tenor * 12));
      
      const insuranceRate = getInsuranceRateFromTable(otrPrice, insuranceType, tenor);
      const insuranceAmount = otrPrice * (insuranceRate / 100);
      
      const adminFee = getAdminFee(tenor);
      const totalAdminFee = adminFee + additionalAdminFee;
      
      const creditProtection = loanPrincipal * (fees.creditProtectionRate / 100);
      
      const totalDp = Math.round(dpAmount + monthlyInstallment + insuranceAmount + totalAdminFee + fees.tpiFee + creditProtection);
      
      const currentAmount = forInstallment ? monthlyInstallment : totalDp;
      const diff = Math.abs(currentAmount - targetAmount);
      
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestDp = testDp;
        
        if (diff < 1) { // Lebih ketat untuk mendapatkan hasil yang lebih presisi
          break;
        }
      }
    }
    
    return Number(closestDp.toFixed(5)); // Mengembalikan dengan 5 angka di belakang koma
  };

  // Fungsi untuk menghitung simulasi ketika tombol Calculate diklik
  const handleCalculate = () => {
    if (!budgetAmount || budgetAmount === "") {
      setCalculatedDpPercent(null);
      return;
    }

    setIsCalculating(true);
    const numericBudget = parseInt(budgetAmount.replace(/[^\d]/g, ''), 10);

    if (isNaN(numericBudget) || numericBudget <= 0) {
      setCalculatedDpPercent(null);
      setIsCalculating(false);
      return;
    }

    setTimeout(() => {
      try {
        const dpPercentage = findClosestDpPercentage(
          numericBudget,
          budgetType === 'installment'
        );
        setCalculatedDpPercent(dpPercentage);
      } catch (error) {
        console.error("Calculation error:", error);
        setCalculatedDpPercent(null);
      }
      setIsCalculating(false);
    }, 100);
  };

  const calculateResults = () => {
    if (calculatedDpPercent === null) return null;

    const dpAmount = otrPrice * (calculatedDpPercent / 100);
    const loanPrincipal = otrPrice - dpAmount;
    const provisionFee = loanPrincipal * (provisionRate / 100);
    const loanWithProvision = loanPrincipal + provisionFee;
    
    const interestRate = getInterestRateFromTable(tenor);
    const interestAmount = loanWithProvision * (interestRate / 100) * tenor;
    const totalLoanAmount = loanWithProvision + interestAmount;
    const monthlyInstallment = Math.round(totalLoanAmount / (tenor * 12));
    
    const insuranceRate = getInsuranceRateFromTable(otrPrice, insuranceType, tenor);
    const insuranceAmount = otrPrice * (insuranceRate / 100);
    
    const adminFee = getAdminFee(tenor);
    const totalAdminFee = adminFee + additionalAdminFee;
    
    const creditProtection = loanPrincipal * (fees.creditProtectionRate / 100);
    
    const totalDp = Math.round(dpAmount + monthlyInstallment + insuranceAmount + totalAdminFee + fees.tpiFee + creditProtection);

    return {
      dpPercentage: calculatedDpPercent,
      dpAmount,
      totalDp,
      monthlyInstallment,
      loanPrincipal,
      totalLoanAmount,
      insuranceAmount
    };
  };

  const results = calculatedDpPercent !== null ? calculateResults() : null;

  const getInsuranceTypeDisplay = () => {
    switch(insuranceType) {
      case 'kombinasi': return 'Kombinasi';
      case 'allrisk': return 'All Risk';
      case 'allriskPerluasan': return 'All Risk Perluasan';
      default: return 'Kombinasi';
    }
  };

  return (
    <div className="glass-card dark:glass-card-dark p-4 sm:p-6 rounded-2xl animate-fade-in">
      <div className="flex items-center mb-4 sm:mb-5">
        <Wallet className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
        <h2 className="text-lg sm:text-xl font-semibold">Simulasi Budget</h2>
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

        <div className="space-y-1.5">
          <label className="input-label block">Jenis Budget</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setBudgetType('tdp')}
              className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                budgetType === 'tdp'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Budget Total DP
            </button>
            <button
              type="button"
              onClick={() => setBudgetType('installment')}
              className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                budgetType === 'installment'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Budget Angsuran
            </button>
          </div>
        </div>

        <FormInput
          label={budgetType === 'tdp' ? "Budget Total DP" : "Budget Angsuran"}
          type="text"
          prefix="Rp"
          value={budgetAmount}
          onChange={handleBudgetAmountChange}
          placeholder="0"
          description={`Masukkan budget ${budgetType === 'tdp' ? 'Total DP' : 'angsuran'} yang Anda inginkan`}
        />

        <button
          type="button"
          onClick={handleCalculate}
          className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 sm:py-3 rounded-md font-medium flex items-center justify-center transition-colors"
          disabled={!budgetAmount || isCalculating}
        >
          <Calculator className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          <span className="text-sm sm:text-base">
            {isCalculating ? "Sedang Menghitung..." : "Hitung Simulasi"}
          </span>
        </button>

        {isCalculating ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Menghitung simulasi...</p>
          </div>
        ) : results ? (
          <div className="space-y-4 mt-4 sm:mt-6">
            {/* Hasil Simulasi - Card Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1 - Harga OTR */}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                  <Car className="h-4 w-4 mr-2" />
                  <span className="text-xs">Harga OTR</span>
                </div>
                <p className="text-lg sm:text-xl font-semibold">Rp {formatRupiah(otrPrice, false)}</p>
              </div>
              
              {/* Card 2 - Total DP */}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                  <Wallet className="h-4 w-4 mr-2" />
                  <span className="text-xs">Total DP</span>
                </div>
                <p className="text-lg sm:text-xl font-semibold">Rp {formatRupiah(results.totalDp, false)}</p>
              </div>
              
              {/* Card 3 - Angsuran */}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span className="text-xs">Angsuran per Bulan</span>
                </div>
                <p className="text-lg sm:text-xl font-semibold text-blue-600">Rp {formatRupiah(results.monthlyInstallment, false)}</p>
              </div>
              
              {/* Card 4 - Tenor */}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-xs">Tenor</span>
                </div>
                <div className="flex items-end">
                  <p className="text-lg sm:text-xl font-semibold">{tenor} tahun</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-2 mb-1">({tenor * 12} bulan)</p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/5 rounded-lg p-3 sm:p-4 border border-primary/20">
              <h3 className="text-base sm:text-lg font-semibold text-primary mb-2">Detail Simulasi</h3>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">DP yang diperlukan:</span>
                  <span className="text-xs sm:text-sm font-medium">{results.dpPercentage.toFixed(5)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">DP Murni:</span>
                  <span className="text-xs sm:text-sm font-medium">{formatRupiah(results.dpAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total DP:</span>
                  <span className="text-xs sm:text-sm font-medium">{formatRupiah(results.totalDp)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Angsuran per bulan:</span>
                  <span className="text-xs sm:text-sm font-medium">{formatRupiah(results.monthlyInstallment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pokok Hutang:</span>
                  <span className="text-xs sm:text-sm font-medium">{formatRupiah(results.loanPrincipal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Pinjaman:</span>
                  <span className="text-xs sm:text-sm font-medium">{formatRupiah(results.totalLoanAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Biaya Asuransi:</span>
                  <span className="text-xs sm:text-sm font-medium">{formatRupiah(results.insuranceAmount)}</span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              * Hasil simulasi di atas merupakan perkiraan. Silakan hubungi dealer untuk informasi lebih akurat.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BudgetCalculator;
