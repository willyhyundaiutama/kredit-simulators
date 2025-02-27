
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import LoanCalculator from "@/components/LoanCalculator";
import BudgetCalculator from "@/components/BudgetCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Shield, Info, Wallet } from "lucide-react";

const Index = () => {
  const [otrPrice, setOtrPrice] = useState<number>(300000000);
  const [dpPercent, setDpPercent] = useState<number>(20);
  const [tenor, setTenor] = useState<number>(4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 animate-fade-up">
            <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">
              Simulasi Pinjaman
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Simulasi Kredit Mobil
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hitung simulasi kredit mobil Anda berdasarkan harga OTR, uang muka, dan tenor pinjaman. Dapatkan estimasi lengkap termasuk biaya asuransi.
            </p>
          </div>
          
          <Tabs defaultValue="loan" className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="loan" className="flex items-center justify-center">
                <Calculator className="h-4 w-4 mr-2" />
                Simulasi Kredit
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex items-center justify-center">
                <Wallet className="h-4 w-4 mr-2" />
                Simulasi Budget
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="loan" className="mt-6">
              <LoanCalculator 
                defaultOtr={otrPrice} 
                defaultDpPercent={dpPercent} 
                defaultTenor={tenor} 
              />
            </TabsContent>
            
            <TabsContent value="budget" className="mt-6">
              <BudgetCalculator 
                defaultOtr={otrPrice} 
                defaultTenor={tenor}
              />
            </TabsContent>
          </Tabs>
          
          <div className="glass-card dark:glass-card-dark p-6 rounded-2xl animate-fade-in mt-8">
            <div className="flex items-center mb-4">
              <Info className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Informasi</h2>
            </div>
            
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <p>
                Simulasi kredit ini hanya merupakan perkiraan. Biaya sesungguhnya dapat berbeda sesuai dengan ketentuan dari perusahaan pembiayaan dan dealer.
              </p>
              <p>
                Komponen biaya dalam simulasi ini meliputi:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>DP Murni: Persentase dari harga OTR yang harus dibayarkan di awal</li>
                <li>Provisi Kredit: Biaya administrasi yang dibebankan oleh perusahaan pembiayaan (biasanya 5% dari pokok hutang)</li>
                <li>Asuransi: Biaya perlindungan kendaraan, terdiri dari beberapa jenis (Kombinasi, All Risk, dan All Risk Perluasan)</li>
                <li>Administrasi: Biaya tetap yang dikenakan untuk proses kredit</li>
                <li>TPI (Third Party Insurance): Asuransi pihak ketiga</li>
              </ul>
              <p>
                Untuk informasi lebih lanjut, silakan hubungi dealer atau perusahaan pembiayaan terdekat.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; 2024 Kredit Simulators. All rights reserved.</p>
            <p className="mt-1">
              Dibuat sebagai alat bantu perhitungan simulasi kredit dan asuransi mobil.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
