'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface FAQItem {
  question: string
  answer: string
  category?: string
}

interface FAQSectionProps {
  className?: string
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Saya telah mendaftar online, namun belum mendapatkan kode QR, bagaimana langkah selanjutnya?",
    answer: "Untuk yang telah melakukan pendaftaran online dan belum mendapat kode QR silahkan menghubungi hotline.",
    category: "Pendaftaran"
  },
  {
    question: "Saya telah melakukan pendaftaran online, apakah saya mendapatkan kuota pendaftaran ulang?",
    answer: "Untuk peserta yang telah melakukan pendaftaran online, sudah dipastikan mendapatkan kuota Wisuda dan dapat melakukan pendaftaran ulang pada tanggal 17-19 September 2025.",
    category: "Pendaftaran"
  },
  {
    question: "Apakah harus membawa ketiga berkas yang disebutkan?",
    answer: "Untuk persyaratan berkas, boleh hanya membawa salah satu saja dari ketiga berkas yang disebutkan di persyaratan pendaftaran.",
    category: "Persyaratan"
  },
  {
    question: "Saya tidak mendapatkan kuota pendaftaran online, apakah saya bisa melakukan pendaftaran ulang pada tanggal 17-19 September di Aula Wisma Nusantara?",
    answer: "Pendaftaran Ulang yang akan dilaksanakan di Aula Wisma Nusantara, hanya untuk peserta yang telah mendaftar online dan memiliki bukti pendaftaran berupa identitas diri serta kode QR.",
    category: "Pendaftaran"
  },
  {
    question: "Saya ingin membeli atribut saja, apakah pendaftaran atribut akan dibuka kembali?",
    answer: "Pendaftaran atribut tidak dibuka kembali setelah penutupan pendaftaran online.",
    category: "Atribut"
  },
  {
    question: "Saya pendaftar tasfiyah dan belum mendapatkan nilai akhir tasfiyah, persyaratan apa yang harus saya bawa?",
    answer: "Untuk pendaftar tasfiyah cukup dengan membawa berkas nilai tingkat 4 pada saat pendaftaran ulang.",
    category: "Persyaratan"
  },
  {
    question: "Saya sudah melakukan pendaftaran online, namun data yang saya isi ada yang salah, bagaimana langkah selanjutnya?",
    answer: "Untuk yang telah melakukan pendaftaran online dan memiliki kesalahan dalam data yang diisi bisa melakukan konfirmasi kembali pada waktu yang kami tentukan, informasi selanjutnya akan segera kami kabarkan. Stay tuned!",
    category: "Pendaftaran"
  },
  {
    question: "Saya belum mendapatkan kuota wisuda ustadz, apakah pendaftaran akan dibuka kembali?",
    answer: "Pendaftaran peserta Wisuda PPMI Mesir 2024 telah resmi ditutup, untuk info selanjutnya akan kami kabarkan kembali setelah Pendaftaran Ulang Peserta Wisuda PPMI Mesir 2024, yang akan dilaksanakan pada tanggal 17–19 September 2025.",
    category: "Pendaftaran"
  },
  {
    question: "Orang tua saya akan hadir pada saat prosesi wisuda, apakah saya bisa melakukan pengajuan undangan kepada panitia untuk pengajuan visa?",
    answer: "Bisa, untuk pendaftaran pengajuan akan kami informasikan kembali pada tanggal 7 Oktober 2025.",
    category: "Tamu Prioritas"
  },
  {
    question: "Tahun ini orang tua atau keluarga boleh menghadiri kegiatan wisuda gk kak?",
    answer: "Tentu boleh yaa, yang penting tamu prioritas tersebut telah didaftarkan terlebih dahulu secara online dan offline.",
    category: "Tamu Prioritas"
  },
  {
    question: "Apa saja syarat yang dibutuhkan untuk mendaftarkan tamu prioritas?",
    answer: "Mengisi formulir, melunasi biaya administrasi, dan melampirkan beberapa dokumen yang diminta seperti fotocopy paspor, fotocopy visa entry, dan dokumen kenegaraan yang membuktikan adanya ikatan keluarga (seperti scan kartu keluarga, buku nikah, dsb).",
    category: "Tamu Prioritas"
  },
  {
    question: "Apakah tamu yang tidak didaftarkan sebagai tamu prioritas apakah boleh masuk ke dalam venue?",
    answer: "Mohon maaf ya kak, tamu yang tidak didaftarkan sebagai tamu prioritas tidak diperkenankan masuk ke dalam venue maupun halaman venue.",
    category: "Tamu Prioritas"
  },
  {
    question: "Apakah saya dapat mendaftarkan teman saya sebagai tamu prioritas?",
    answer: "Tamu di luar kriteria tamu prioritas yang sudah disebutkan sebelumnya tidak dapat didaftarkan sebagai tamu prioritas yaa.",
    category: "Tamu Prioritas"
  },
  {
    question: "Apakah pendaftaran tamu prioritas ada biayanya? Dan kalau ada berapa?",
    answer: "Pendaftaran tamu prioritas dikenakan biaya yaa kak, untuk jumlah pastinya akan diinformasikan lebih lanjut.",
    category: "Tamu Prioritas"
  },
  {
    question: "Bagaimana cara mendaftarkan tamu prioritas?",
    answer: "Pendaftaran tamu prioritas terdiri dari 2 tahap, yaitu pendaftaran online yang diisi oleh wisudawan/ti dan kemudian pendaftaran offline yang diwakili oleh wisudawan/ti.",
    category: "Tamu Prioritas"
  },
  {
    question: "Siapa saja sih kak yang boleh didaftarkan sebagai tamu prioritas?",
    answer: "Yang dapat didaftarkan sebagai tamu prioritas adalah orang tua (kandung, asuh, dan angkat), saudara kandung, pasangan sah, dan wali selain orang tua.",
    category: "Tamu Prioritas"
  }
]

const FAQCard: React.FC<{
  item: FAQItem
  value: string
}> = ({ item, value }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      whileHover={{ 
        scale: 1.02,
        transition: {
          duration: 0.2,
          type: "spring",
          stiffness: 400,
          damping: 25
        }
      }}
      className="group"
    >
      <Card className="bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.01] border-white/12 hover:border-white/25 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] overflow-hidden backdrop-blur-sm hover:shadow-[#E07C45]/10">
        <AccordionItem value={value} className="border-none">
          <AccordionTrigger className={cn(
            "group relative rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:no-underline",
            "transition-all duration-300",
            "data-[state=open]:bg-gradient-to-br data-[state=open]:from-white/[0.12] data-[state=open]:via-white/[0.08] data-[state=open]:to-white/[0.04] data-[state=open]:shadow-lg",
            "no-underline hover:no-underline [&[data-state=open]>svg]:rotate-180"
          )}>
            <div className="flex items-start gap-2 pr-8">
              <div className="flex-1">
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-white/95 leading-tight group-hover:text-white transition-colors">
                  {item.question}
                </h3>
              </div>
              {item.category && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className="border-white/20 bg-white/5 text-white/70 text-[10px] px-2 py-1 rounded-full shrink-0 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/30 transition-all duration-300 cursor-help"
                      style={{
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      {item.category}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white/10 border-white/20 text-white">
                    <p>Kategori: {item.category}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <motion.div 
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-white/10"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Plus className="h-3 w-3 text-white/70 group-hover:text-white transition-colors" />
            </motion.div>
          </AccordionTrigger>
          <AccordionContent className="mt-1.5">
            <CardContent className="pt-0">
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.4, 0, 0.2, 1],
                  height: {
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                  }
                }}
                className="text-xs sm:text-sm leading-relaxed text-white/85 bg-gradient-to-r from-transparent via-white/5 to-transparent p-3 sm:p-4 rounded-lg -mx-1"
              >
                {item.answer}
              </motion.div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Card>
    </motion.div>
  )
}

const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <Card key={index} className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4 bg-white/10" />
              <Skeleton className="h-4 w-1/2 bg-white/10" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export const FAQSection: React.FC<FAQSectionProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  // Group FAQs by category
  const faqsByCategory = FAQ_DATA.reduce((acc, faq) => {
    const category = faq.category || 'Umum'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(faq)
    return acc
  }, {} as Record<string, FAQItem[]>)

  const categories = Object.keys(faqsByCategory)
  
  // Filter FAQs based on search and category
  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSearch = (value: string) => {
    setIsLoading(true)
    setSearchQuery(value)
    // Simulate loading
    setTimeout(() => setIsLoading(false), 300)
  }

  const handleCategorySelect = (value: string) => {
    setIsLoading(true)
    setSelectedCategory(value === "all" ? null : value)
    // Simulate loading
    setTimeout(() => setIsLoading(false), 300)
  }

  return (
    <TooltipProvider>
      <section className={cn('relative py-16 md:py-24 lg:py-32', className)}>
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(224,124,69,0.12),transparent_70%)]"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(20,10,8,0.4)_100%)]" />
        
        {/* Decorative pattern */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{ 
            x: [0, -20, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </motion.div>
        
        {/* Floating orbs */}
        <motion.div 
          className="absolute top-16 left-8 w-40 h-40 bg-gradient-to-br from-[#E07C45]/25 via-[#E07C45]/15 to-transparent rounded-full blur-3xl"
          animate={{ 
            x: [0, 40, 0],
            y: [0, -25, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-16 right-8 w-48 h-48 bg-gradient-to-br from-[#B8451A]/20 via-[#E07C45]/10 to-transparent rounded-full blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 25, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-[#FFE8DE]/15 to-transparent rounded-full blur-2xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, -15, 0],
            scale: [1, 1.4, 1]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-3 sm:px-4 md:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <motion.div 
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-white/10 to-white/5 px-4 py-2 text-xs font-medium tracking-wide ring-1 ring-white/20 backdrop-blur-sm border border-white/15 mb-6 shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div 
              className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A] animate-pulse shadow-sm shadow-[#E07C45]/20"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            Informasi Penting
          </motion.div>

          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-br from-[#FFE8DE] via-white to-[#F5C5B2] bg-clip-text text-transparent mb-4 md:mb-6"
            whileInView={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: "200% 200%"
            }}
          >
            Frequently Asked Questions
          </motion.h2>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-6 md:mb-8">
            Temukan jawaban untuk pertanyaan yang sering diajukan tentang Wisuda PPMI Mesir 2025
          </p>

          {/* Search Bar */}
          <motion.div 
            className="max-w-lg mx-auto mb-4 sm:mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.2,
              type: "spring",
              stiffness: 250,
              damping: 20
            }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                type="text"
                placeholder="Cari pertanyaan..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-[#E07C45]/40 focus:border-[#E07C45]/50 transition-all duration-300 backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  paddingLeft: '2.5rem',
                  paddingRight: '0.75rem',
                  paddingTop: '0.625rem',
                  paddingBottom: '0.625rem',
                  borderRadius: '0.5rem'
                }}
              />
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.3,
              type: "spring",
              stiffness: 250,
              damping: 20
            }}
          >
            <ToggleGroup
              type="single"
              value={selectedCategory || "all"}
              onValueChange={handleCategorySelect}
              className="bg-gradient-to-b from-white/8 to-white/3 p-1.5 rounded-lg border border-white/15 backdrop-blur-sm shadow-lg"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ToggleGroupItem
                  value="all"
                  className="px-2.5 py-1 rounded-sm text-xs sm:text-sm font-medium text-white/80 data-[state=on]:bg-gradient-to-r data-[state=on]:from-[#E07C45] data-[state=on]:to-[#B8451A] data-[state=on]:text-white data-[state=on]:shadow-lg hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  Semua ({FAQ_DATA.length})
                </ToggleGroupItem>
              </motion.div>
              {categories.map((category, index) => (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  <ToggleGroupItem
                    value={category}
                    className="px-2.5 py-1 rounded-sm text-xs sm:text-sm font-medium text-white/80 data-[state=on]:bg-gradient-to-r data-[state=on]:from-[#E07C45] data-[state=on]:to-[#B8451A] data-[state=on]:text-white data-[state=on]:shadow-lg hover:bg-white/10 hover:text-white transition-all duration-200"
                  >
                    {category} ({faqsByCategory[category].length})
                  </ToggleGroupItem>
                </motion.div>
              ))}
            </ToggleGroup>
          </motion.div>

          {/* Results indicator */}
          <div className="text-xs sm:text-sm text-white/60 mb-6 sm:mb-8">
            Menampilkan {filteredFAQs.length} dari {FAQ_DATA.length} pertanyaan
            {searchQuery && ` untuk "${searchQuery}"`}
            {selectedCategory && ` di kategori "${selectedCategory}"`}
          </div>
        </motion.div>

        {/* FAQ Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.8, 
            delay: 0.4,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
        >
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredFAQs.length > 0 ? (
            <Accordion
              type="single"
              collapsible
              className="space-y-3"
            >
              <AnimatePresence mode="wait">
                {filteredFAQs.map((item, index) => (
                  <motion.div
                    key={`${item.question}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.08,
                      type: "spring",
                      stiffness: 250,
                      damping: 18
                    }}
                    layout
                  >
                    <FAQCard
                      item={item}
                      value={`item-${index}`}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </Accordion>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <Card className="bg-white/5 border-white/10 max-w-sm mx-auto">
                <CardContent className="p-8">
                  <motion.div 
                    className="text-white/50 mb-4"
                    animate={{ 
                      opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Tidak ada pertanyaan yang ditemukan
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedCategory(null)
                      }}
                      className="border-white/20 text-white hover:bg-white/10 hover:scale-105 transition-all duration-200"
                    >
                      Reset Filter
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <motion.div
            whileHover={{ 
              scale: 1.02,
              y: -5
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 15 
            }}
          >
            <Card className="bg-gradient-to-r from-white/10 to-white/5 border-white/10 backdrop-blur-sm hover:shadow-xl hover:border-white/20 transition-all duration-300">
              <CardContent className="p-8">
                <motion.p 
                  className="text-[15px] text-white/70 mb-4"
                  animate={{ 
                    opacity: [0.7, 0.9, 0.7],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Masih memiliki pertanyaan yang belum terjawab?
                </motion.p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a 
                    href="https://wa.me/6282313763282" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button className="bg-gradient-to-r from-[#E07C45] to-[#B8451A] text-white hover:shadow-lg hover:shadow-[#E07C45]/20 transition-all duration-300 hover:scale-105">
                      Hubungi Panitia
                    </Button>
                  </a>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
    </TooltipProvider>
  )
}

export default FAQSection