import type { User, Property, Analysis, Quote, Image, Recommendation, FinancialCalculation } from "@prisma/client";

export type UserWithProperties = User & {
  properties: Property[]
}

export type PropertyWithImages = Property & {
  images: Image[]
  analyses: Analysis[]
}

export type AnalysisWithDetails = Analysis & {
  property: Property
  image: Image
  recommendations: (Recommendation & { panelType: string })[]
  financialCalculations: FinancialCalculation[]
}

export type QuoteWithDetails = Quote & {
  analysis: Analysis & { property: Property }
  installer: User
  user: User
}

export interface InstallationRecommendation {
  panelType: string
  panelCount: number
  mountingSystem: string
  inverterType: string
  additionalNotes: string
}

export interface FinancialAnalysis {
  estimatedCost: number
  federalTaxCredit: number
  stateTaxCredit: number
  utilityRebate: number
  netCost: number
  annualSavings: number
  paybackPeriod: number
  roi25Year: number
  co2Reduction: number
}
