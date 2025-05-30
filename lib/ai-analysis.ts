import { z } from "zod"

const roofAnalysisSchema = z.object({
  roofArea: z.number().describe("Total roof area in square meters"),
  usableArea: z.number().describe("Usable area for solar panels in square meters"),
  orientation: z.string().describe("Primary roof orientation (North, South, East, West, etc.)"),
  tilt: z.number().describe("Roof tilt angle in degrees"),
  shading: z.enum(["Minimal", "Moderate", "Significant"]).describe("Level of shading on the roof"),
  annualSunHours: z.number().describe("Estimated annual sun hours for this location"),
  potentialCapacity: z.number().describe("Potential solar system capacity in kW"),
  annualProduction: z.number().describe("Estimated annual energy production in kWh"),
  confidenceScore: z.number().min(0).max(1).describe("Confidence score of the analysis (0-1)"),
  suitabilityScore: z.number().min(0).max(100).describe("Overall suitability score (0-100)"),
  obstacles: z.array(z.string()).describe("List of obstacles or challenges identified"),
  recommendations: z.array(z.string()).describe("List of recommendations for optimization"),
})

function sanitizeAnalysisResult(raw: any) {
  return {
    ...raw,
    roofArea: typeof raw.roofArea === "number" ? raw.roofArea : 0,
    usableArea: typeof raw.usableArea === "number" ? raw.usableArea : 0,
    tilt: typeof raw.tilt === "number" ? raw.tilt : Number(raw.tilt) || 0,
    shading: ["Minimal", "Moderate", "Significant"].includes(raw.shading)
      ? raw.shading
      : "Minimal",
    annualSunHours: typeof raw.annualSunHours === "number" ? raw.annualSunHours : 0,
    potentialCapacity: typeof raw.potentialCapacity === "number" ? raw.potentialCapacity : 0,
    annualProduction: typeof raw.annualProduction === "number" ? raw.annualProduction : 0,
    confidenceScore: typeof raw.confidenceScore === "number" ? raw.confidenceScore : 0,
    suitabilityScore: typeof raw.suitabilityScore === "number" ? raw.suitabilityScore : 0,
    obstacles: Array.isArray(raw.obstacles) ? raw.obstacles : [],
    recommendations: Array.isArray(raw.recommendations) ? raw.recommendations : [],
  }
}

export async function analyzeRooftopImage(imageUrl: string, propertyData: any) {
  try {
    // Download the image as a base64 string
    const imageRes = await fetch(imageUrl)
    const imageBuffer = await imageRes.arrayBuffer()
    const imageBase64 = Buffer.from(imageBuffer).toString("base64")

    const API_KEY_REF = process.env.OPENROUTER_API_KEY // Set this in your .env

    const prompt = `
You are an expert solar energy analyst. Analyze the provided rooftop satellite image and provide a detailed solar potential assessment. Consider:
- Roof area and usable space for solar panels
- Roof orientation and tilt
- Shading from trees, buildings, or other obstacles
- Roof condition and suitability for solar installation
- Local solar irradiance and weather patterns

IMPORTANT:
- All fields must be present and never null. If a value is unknown, use 0 for numbers, "" for strings, and [] for arrays.
- For "shading", only use one of these exact values: "Minimal", "Moderate", "Significant".
- For "tilt", "roofArea", "usableArea", "potentialCapacity", "annualProduction", "annualSunHours", "confidenceScore", "suitabilityScore": always return a number, never a string or null.
- Do not add explanations or extra text, only return the JSON object.

Property details: ${JSON.stringify(propertyData)}

Return a JSON object with the following fields:
roofArea, usableArea, orientation, tilt, shading (Minimal/Moderate/Significant), annualSunHours, potentialCapacity, annualProduction, confidenceScore (0-1), suitabilityScore (0-100), obstacles (array), recommendations (array).
`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY_REF}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    // The model's reply is in data.choices[0].message.content
    const text = data?.choices?.[0]?.message?.content ?? "";

    if (typeof text !== "string") {
      throw new Error("Model response text is undefined or not a string");
    }

    // Parse the JSON from the model's response
    const jsonStart = text.indexOf("{")
    const jsonEnd = text.lastIndexOf("}")
    const jsonString = text.substring(jsonStart, jsonEnd + 1)
    const object = roofAnalysisSchema.parse(
      sanitizeAnalysisResult(JSON.parse(jsonString))
    )

    return object
  } catch (error) {
    console.error("Error analyzing rooftop image with OpenRouter Gemini:", error)
    throw new Error("Failed to analyze rooftop image")
  }
}

export function calculateFinancials(analysisData: any, locationData: any) {
  const systemSize = analysisData.potentialCapacity // kW
  const annualProduction = analysisData.annualProduction // kWh

  // Base cost calculation ($3-4 per watt)
  const costPerWatt = 3.5
  const estimatedCost = systemSize * 1000 * costPerWatt

  // Tax credits and incentives
  const federalTaxCredit = estimatedCost * 0.3 // 30% federal tax credit
  const stateTaxCredit = estimatedCost * 0.1 // Estimated 10% state credit
  const utilityRebate = systemSize * 500 // $500 per kW utility rebate

  const netCost = estimatedCost - federalTaxCredit - stateTaxCredit - utilityRebate

  // Savings calculation
  const electricityRate = locationData?.averageElectricityRate || 0.15 // $/kWh
  const annualSavings = annualProduction * electricityRate

  const paybackPeriod = netCost / annualSavings

  // 25-year ROI calculation
  const totalSavings25Year = annualSavings * 25 * 1.03 // 3% annual electricity rate increase
  const roi25Year = ((totalSavings25Year - netCost) / netCost) * 100

  // CO2 reduction (0.7 lbs CO2 per kWh)
  const co2Reduction = (annualProduction * 0.7) / 2000 // tons per year

  return {
    estimatedCost,
    federalTaxCredit,
    stateTaxCredit,
    utilityRebate,
    netCost,
    annualSavings,
    paybackPeriod,
    roi25Year,
    co2Reduction,
    electricityRate,
    annualElectricityIncrease: 3,
  }
}
