'use client'

import React from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useMessages } from 'next-intl'

interface FeeDetailProps {
  className?: string
}

const FeeDetail: React.FC<FeeDetailProps> = ({ className }) => {
  const messages = useMessages()
  const feeMsg = messages.FeeDetail

  const wisudaFees = [
    { item: feeMsg.wisudaFees.SewaGedung, amount: 'EGP 600' },
    { item: feeMsg.wisudaFees.Prasarana, amount: 'EGP 650' },
    { item: feeMsg.wisudaFees.Selempang, amount: 'EGP 240' },
    { item: feeMsg.wisudaFees.MedaliPin, amount: 'EGP 160' },
    { item: feeMsg.wisudaFees.Plakat, amount: 'EGP 250' },
    { item: feeMsg.wisudaFees.PaperBagMap, amount: 'EGP 230' },
    { item: feeMsg.wisudaFees.Konsumsi, amount: 'EGP 170' },
    { item: feeMsg.wisudaFees.Dokumentasi, amount: 'EGP 150' },
    { item: feeMsg.wisudaFees.Administrasi, amount: 'EGP 200' },
  ]

  const atributPackages = [
    {
      name: feeMsg.atributPackages.AtributLengkap.name,
      price: 'EGP 750',
      description: feeMsg.atributPackages.AtributLengkap.description,
      popular: true,
    },
    {
      name: feeMsg.atributPackages.AtributPaketA.name,
      price: 'EGP 500',
      description: feeMsg.atributPackages.AtributPaketA.description,
      popular: false,
    },
    {
      name: feeMsg.atributPackages.AtributPaketB.name,
      price: 'EGP 350',
      description: feeMsg.atributPackages.AtributPaketB.description,
      popular: false,
    },
  ]

  const totalWisudaFees = wisudaFees.reduce((total, fee) => {
    return total + parseInt(fee.amount.replace('EGP ', ''))
  }, 0)

  return (
    <section className={cn('relative py-16 md:py-24', className)}>
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(224,124,69,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(20,10,8,0.4)_100%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 text-gray-400"
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-white/10 to-white/5 px-4 py-2 text-xs font-medium tracking-wide ring-1 ring-white/20 backdrop-blur-sm border border-white/15 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A] animate-pulse text-white" />
            {feeMsg.sectionBadge}
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-br from-[#FFE8DE] via-white to-[#F5C5B2] bg-clip-text text-transparent mb-4">
            {feeMsg.sectionHeading}
          </h2>

          <p className="text-lg text-white/80 max-w-2xl mx-auto">{feeMsg.sectionDescription}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Wisuda Fees */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.01] border-white/12 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A] flex items-center justify-center">
                    <span className="text-xs text-white font-bold">1</span>
                  </div>
                  {feeMsg.wisudaFeesTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {wisudaFees.map((fee, index) => (
                  <motion.div
                    key={fee.item}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex justify-between items-center py-2"
                  >
                    <span className="text-white/80">{fee.item}</span>
                    <Badge variant="outline" className="border-white/20 bg-white/5 text-white/90">
                      {fee.amount}
                    </Badge>
                  </motion.div>
                ))}
                <Separator className="my-4 bg-white/10" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="flex justify-between items-center py-2 bg-gradient-to-r from-white/10 to-transparent px-4 rounded-lg"
                >
                  <span className="text-white font-semibold">{feeMsg.total}</span>
                  <Badge className="bg-gradient-to-r from-[#E07C45] to-[#B8451A] text-white border-0">
                    EGP {totalWisudaFees}
                  </Badge>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Atribut Packages */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.01] border-white/12 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A] flex items-center justify-center">
                    <span className="text-xs text-white font-bold">2</span>
                  </div>
                  {feeMsg.atributFeesTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {atributPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className={`relative p-4 rounded-lg border transition-all duration-300 ${
                      pkg.popular
                        ? 'border-[#E07C45]/50 bg-gradient-to-r from-[#E07C45]/10 to-transparent shadow-lg shadow-[#E07C45]/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/8'
                    }`}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-[#E07C45] to-[#B8451A] text-white text-xs">
                        {feeMsg.popularBadge}
                      </Badge>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-semibold">{pkg.name}</h3>
                      <Badge
                        variant={pkg.popular ? 'default' : 'outline'}
                        className={cn(
                          'text-white',
                          pkg.popular
                            ? 'bg-gradient-to-r from-[#E07C45] to-[#B8451A] border-0'
                            : 'border-white/20 bg-white/5',
                        )}
                      >
                        {pkg.price}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/70">{pkg.description}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quota Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-[#E07C45]/20 via-[#E07C45]/10 to-transparent border-[#E07C45]/30 backdrop-blur-sm max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A] flex items-center justify-center">
                  <span className="text-white font-bold">!</span>
                </div>
                <h3 className="text-xl font-bold text-white">{feeMsg.quotaTitle}</h3>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {feeMsg.quotaAmount}
              </div>
              <p className="text-white/80">{feeMsg.quotaDescription}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

export default FeeDetail
