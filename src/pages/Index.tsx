
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import LoanCalculator from "@/components/LoanCalculator";
import BudgetCalculator from "@/components/BudgetCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Shield, Info, Wallet, Car, CreditCard, CheckCircle } from "lucide-react";

const Index = () => {
  const [otrPrice, setOtrPrice] = useState<number | undefined>(undefined);
  const [dpPercent, setDpPercent] = useState<number>(20);
  const [tenor, setTenor] = useState<number>(5);

  return (
    <div className="min-h-screen bg-pattern dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 animate-fade-up">
            <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-3 sm:mb-4">
              Simulasi Kredit Terpercaya
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Simulasi Kredit Mobil
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
              Hitung simulasi kredit mobil Anda berdasarkan harga OTR, uang muka, dan tenor pinjaman. Dapatkan estimasi lengkap termasuk biaya asuransi.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="frosted-glass rounded-2xl p-4 hover-lift">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary mr-4">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Harga Flexibel</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Simulasi untuk berbagai harga OTR</p>
                </div>
              </div>
            </div>
            
            <div className="frosted-glass rounded-2xl p-4 hover-lift">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-accent/10 text-accent mr-4">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Tenor Beragam</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pilihan tenor 1-7 tahun</p>
                </div>
              </div>
            </div>
            
            <div className="frosted-glass rounded-2xl p-4 hover-lift">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500/10 text-green-500 mr-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Asuransi Lengkap</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Berbagai jenis asuransi tersedia</p>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="loan" className="w-full mb-8 sm:mb-10">
            <TabsList className="relative w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-1 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="absolute inset-0 w-1/2 h-full bg-primary rounded-lg shadow-lg transition-transform duration-300 ease-in-out" 
                style={{ transform: `translateX(${defaultValue === "budget" ? "100%" : "0%"})` }}>
              </div>
              <TabsTrigger 
                value="loan" 
                className="relative z-10 flex-1 flex items-center justify-center py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-300"
                style={{
                  color: `var(--tab-loan-color, var(--primary-foreground))`,
                  background: 'transparent'
                }}
              >
                <Calculator className="h-5 w-5 mr-2" />
                <span>Simulasi Kredit</span>
              </TabsTrigger>
              <TabsTrigger 
                value="budget" 
                className="relative z-10 flex-1 flex items-center justify-center py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-300"
                style={{
                  color: `var(--tab-budget-color, var(--foreground))`,
                  background: 'transparent'
                }}
              >
                <Wallet className="h-5 w-5 mr-2" />
                <span>Simulasi Budget</span>
              </TabsTrigger>
            </TabsList>
            
            <style jsx>{`
              [data-state="active"][value="loan"] {
                --tab-loan-color: var(--primary-foreground);
                font-weight: 600;
                animation: fadeIn 0.3s ease-in-out;
              }
              
              [data-state="active"][value="budget"] {
                --tab-budget-color: var(--primary-foreground);
                font-weight: 600;
                animation: fadeIn 0.3s ease-in-out;
              }
              
              [data-state="inactive"][value="loan"] {
                --tab-loan-color: var(--foreground);
              }
              
              [data-state="inactive"][value="budget"] {
                --tab-budget-color: var(--foreground);
              }
              
              @keyframes fadeIn {
                from { opacity: 0.7; }
                to { opacity: 1; }
              }
            `}</style>
            
            <TabsContent value="loan" className="mt-6 sm:mt-8">
              <div className="frosted-glass p-6 rounded-2xl shadow-md">
                <LoanCalculator 
                  defaultOtr={undefined} 
                  defaultDpPercent={dpPercent} 
                  defaultTenor={tenor} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="budget" className="mt-6 sm:mt-8">
              <div className="frosted-glass p-6 rounded-2xl shadow-md">
                <BudgetCalculator 
                  defaultOtr={undefined} 
                  defaultTenor={tenor}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="frosted-glass rounded-2xl p-6 sm:p-8 animate-fade-in mt-8 sm:mt-10">
            <div className="flex items-center mb-4 sm:mb-5">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold">Informasi Penting</h2>
            </div>
            
            <div className="space-y-4 sm:space-y-5 text-sm text-gray-600 dark:text-gray-400">
              <p className="leading-relaxed">
                Simulasi kredit ini hanya merupakan perkiraan. Biaya sesungguhnya dapat berbeda sesuai dengan ketentuan dari perusahaan pembiayaan dan dealer.
              </p>
              <p className="leading-relaxed">
                Komponen biaya dalam simulasi ini meliputi:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>DP Murni: Persentase dari harga OTR yang harus dibayarkan di awal</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Provisi Kredit: Biaya administrasi perusahaan pembiayaan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Asuransi: Biaya perlindungan kendaraan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Administrasi: Biaya tetap untuk proses kredit</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>TPI: Asuransi pihak ketiga</span>
                </li>
              </ul>
              <p className="leading-relaxed">
                Untuk informasi lebih lanjut, silakan hubungi dealer atau perusahaan pembiayaan terdekat.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 sm:py-10 mt-10 sm:mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold text-primary mb-2">Kredit Simulators</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                Alat bantu simulasi kredit dan asuransi mobil terpercaya untuk membantu Anda merencanakan pembelian kendaraan.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Layanan</h3>
                <ul className="text-gray-500 dark:text-gray-400 text-sm space-y-2">
                  <li><a href="#" className="hover:text-primary">Simulasi Kredit</a></li>
                  <li><a href="#" className="hover:text-primary">Simulasi Budget</a></li>
                  <li><a href="#" className="hover:text-primary">Simulasi Asuransi</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Bantuan</h3>
                <ul className="text-gray-500 dark:text-gray-400 text-sm space-y-2">
                  <li><a href="#" className="hover:text-primary">FAQ</a></li>
                  <li><a href="#" className="hover:text-primary">Kontak</a></li>
                  <li><a href="#" className="hover:text-primary">Dukungan</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <hr className="my-6 border-gray-200 dark:border-gray-700" />
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; 2024 Kredit Simulators. All rights reserved.</p>
            <p className="mt-2 text-xs">
              Developed by Willy Arsal from Hyundai Fatmawati for the Sales Team
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
