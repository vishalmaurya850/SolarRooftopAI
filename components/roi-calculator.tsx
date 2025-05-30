"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, DollarSign, TrendingUp, Leaf } from "lucide-react"

interface ROICalculatorProps {
  data: {
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
}

export function ROICalculator({ data }: ROICalculatorProps) {
  const [electricityRate, setElectricityRate] = useState(0.15) // $/kWh
  const [annualIncrease, setAnnualIncrease] = useState(3) // %
  const [systemCost, setSystemCost] = useState(data.estimatedCost)

  // Calculate adjusted values based on user inputs
  const annualProduction = 18200 // kWh, from analysis
  const adjustedAnnualSavings = annualProduction * electricityRate
  const adjustedPaybackPeriod = data.netCost / adjustedAnnualSavings

  // Calculate cumulative savings over 25 years with rate increases
  let cumulativeSavings = 0
  let currentRate = electricityRate
  for (let year = 1; year <= 25; year++) {
    cumulativeSavings += annualProduction * currentRate
    currentRate *= 1 + annualIncrease / 100
  }

  const adjustedROI = ((cumulativeSavings - data.netCost) / data.netCost) * 100

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
          <CardDescription>Cost breakdown and financial benefits of your solar investment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                Cost Breakdown
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">System Cost</span>
                  <span>₹{data.estimatedCost.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Federal Tax Credit (30%)</span>
                  <span>-₹{data.federalTaxCredit.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>State Incentives</span>
                  <span>-₹{data.stateTaxCredit.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Utility Rebates</span>
                  <span>-₹{data.utilityRebate.toLocaleString()}</span>
                </div>

                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Net System Cost</span>
                  <span>₹{data.netCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
                Financial Benefits
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Annual Electricity Savings</span>
                    <span className="font-medium">₹{adjustedAnnualSavings.toFixed(0).toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Based on {annualProduction.toLocaleString()} kWh annual production
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payback Period</span>
                    <span className="font-medium">{adjustedPaybackPeriod.toFixed(1)} years</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">25-Year ROI</span>
                    <span className="font-medium">{adjustedROI.toFixed(0)}%</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">25-Year Savings</span>
                    <span className="font-medium">${cumulativeSavings.toFixed(0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-md">
                  <Leaf className="h-4 w-4" />
                  <span className="text-sm">CO₂ Reduction: {data.co2Reduction} tons/year</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-yellow-600" />
            <CardTitle>Customize Your ROI Calculation</CardTitle>
          </div>
          <CardDescription>Adjust parameters to see how they affect your solar investment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="electricity-rate">Electricity Rate ($/kWh)</Label>
                    <span className="font-medium">${electricityRate.toFixed(2)}</span>
                  </div>
                  <Slider
                    id="electricity-rate"
                    min={0.08}
                    max={0.4}
                    step={0.01}
                    value={[electricityRate]}
                    onValueChange={(value) => setElectricityRate(value[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$0.08</span>
                    <span>$0.40</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="annual-increase">Annual Electricity Price Increase (%)</Label>
                    <span className="font-medium">{annualIncrease}%</span>
                  </div>
                  <Slider
                    id="annual-increase"
                    min={0}
                    max={10}
                    step={0.5}
                    value={[annualIncrease]}
                    onValueChange={(value) => setAnnualIncrease(value[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>10%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="system-cost">System Cost ($)</Label>
                  <Input
                    id="system-cost"
                    type="number"
                    value={systemCost}
                    onChange={(e) => setSystemCost(Number(e.target.value))}
                    min={5000}
                    max={100000}
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <h4 className="font-medium mb-2">Updated Financial Projection</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Annual Savings</span>
                      <span className="font-medium">${adjustedAnnualSavings.toFixed(0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payback Period</span>
                      <span className="font-medium">{adjustedPaybackPeriod.toFixed(1)} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>25-Year ROI</span>
                      <span className="font-medium">{adjustedROI.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="monthly">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="monthly">Monthly Savings</TabsTrigger>
                <TabsTrigger value="annual">Annual Savings</TabsTrigger>
                <TabsTrigger value="cumulative">Cumulative Savings</TabsTrigger>
              </TabsList>

              <TabsContent value="monthly">
                <Card>
                  <CardContent className="pt-6">
                    <div className="h-64 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-md flex items-center justify-center">
                      <p className="text-gray-500">Monthly savings chart would be displayed here</p>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        Monthly savings vary throughout the year based on seasonal solar production. Summer months
                        typically generate more electricity and savings, while winter months produce less.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="annual">
                <Card>
                  <CardContent className="pt-6">
                    <div className="h-64 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-md flex items-center justify-center">
                      <p className="text-gray-500">Annual savings chart would be displayed here</p>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        Annual savings increase over time as electricity prices rise. This chart shows your projected
                        yearly savings over the 25-year lifespan of your solar system.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cumulative">
                <Card>
                  <CardContent className="pt-6">
                    <div className="h-64 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-md flex items-center justify-center">
                      <p className="text-gray-500">Cumulative savings chart would be displayed here</p>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        This chart shows your total accumulated savings over time. The point where the line crosses the
                        system cost represents your payback period.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
