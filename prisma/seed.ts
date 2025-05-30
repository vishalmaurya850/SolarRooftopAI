import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const hashedPassword = await bcrypt.hash("password123", 12)

  const user1 = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      passwordHash: hashedPassword,
      firstName: "John",
      lastName: "Doe",
      role: "USER",
    },
  })

  const installer1 = await prisma.user.upsert({
    where: { email: "installer@solartech.com" },
    update: {},
    create: {
      email: "installer@solartech.com",
      passwordHash: hashedPassword,
      firstName: "Solar",
      lastName: "Tech",
      role: "INSTALLER",
      company: "SolarTech Solutions",
    },
  })

  // Create sample solar panel types
  const panelType1 = await prisma.solarPanelType.create({
    data: {
      name: "High Efficiency Monocrystalline",
      manufacturer: "SunPower",
      efficiency: 22.8,
      powerOutput: 400,
      dimensions: "2.067m x 1.046m x 0.040m",
      weight: 20.6,
      warrantyYears: 25,
      pricePerWatt: 3.5,
      panelType: "MONOCRYSTALLINE",
    },
  })

  // Create sample regions
  const region1 = await prisma.region.create({
    data: {
      name: "San Francisco Bay Area",
      state: "California",
      country: "United States",
      averageSunHours: 2100,
      averageElectricityRate: 0.28,
      stateIncentives: {
        rebate: 1000,
        taxCredit: 0.1,
      },
      utilityIncentives: {
        netMetering: true,
        rebatePerKw: 500,
      },
      netMeteringAvailable: true,
    },
  })

  // Create sample installers
  const installer1Company = await prisma.installer.create({
    data: {
      companyName: "SolarTech Solutions",
      contactEmail: "info@solartech.com",
      contactPhone: "(555) 123-4567",
      address: "123 Solar Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      licenseNumber: "CA-SOLAR-12345",
      certifications: ["NABCEP Certified", "Tesla Powerwall Certified"],
      serviceAreas: ["San Francisco", "Oakland", "San Jose"],
      rating: 4.8,
      reviewsCount: 127,
    },
  })

  const installer2Company = await prisma.installer.create({
    data: {
      companyName: "Green Energy Pros",
      contactEmail: "contact@greenenergypros.com",
      contactPhone: "(555) 987-6543",
      address: "456 Green Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      licenseNumber: "CA-SOLAR-67890",
      certifications: ["NABCEP Certified", "SunPower Elite Dealer"],
      serviceAreas: ["Los Angeles", "Long Beach", "Pasadena"],
      rating: 4.9,
      reviewsCount: 89,
    },
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
