import type { WarehouseOverview, DailyData, CustomerScore } from "@/types/warehouse"

// INVENTORY DATA - Using your exact schema
export const inventoryData = [
  {
    BALANCE_AS_OF_DATE: "12-31-2023",
    PLANT_NAME: "CHINA-WAREHOUSE",
    MATERIAL_NAME: "MAT-0045",
    BATCH_NUMBER: "SCRAP",
    UNRESRICTED_STOCK: 164,
    STOCK_UNIT: "KG",
    STOCK_SELL_VALUE: 211,
    CURRENCY: "CNY",
  },
  {
    BALANCE_AS_OF_DATE: "2-29-2024",
    PLANT_NAME: "SINGAPORE-WAREHOUSE",
    MATERIAL_NAME: "MAT-0100",
    BATCH_NUMBER: "E2278A",
    UNRESRICTED_STOCK: 1175,
    STOCK_UNIT: "KG",
    STOCK_SELL_VALUE: 1210,
    CURRENCY: "SGD",
  },
  {
    BALANCE_AS_OF_DATE: "1-15-2024",
    PLANT_NAME: "CHINA-WAREHOUSE",
    MATERIAL_NAME: "MAT-0354",
    BATCH_NUMBER: "B003",
    UNRESRICTED_STOCK: 850,
    STOCK_UNIT: "KG",
    STOCK_SELL_VALUE: 425,
    CURRENCY: "CNY",
  },
  {
    BALANCE_AS_OF_DATE: "3-10-2024",
    PLANT_NAME: "SINGAPORE-WAREHOUSE",
    MATERIAL_NAME: "MAT-0144",
    BATCH_NUMBER: "E2278B",
    UNRESRICTED_STOCK: 2200,
    STOCK_UNIT: "KG",
    STOCK_SELL_VALUE: 3300,
    CURRENCY: "SGD",
  },
  {
    BALANCE_AS_OF_DATE: "1-05-2024",
    PLANT_NAME: "CHINA-WAREHOUSE",
    MATERIAL_NAME: "MAT-0013",
    BATCH_NUMBER: "SCRAP2",
    UNRESRICTED_STOCK: 95,
    STOCK_UNIT: "KG",
    STOCK_SELL_VALUE: 142,
    CURRENCY: "CNY",
  },
]

// INBOUND DATA - Using your exact schema
export const inboundData = [
  {
    INBOUND_DATE: "2023-12-15",
    PLANT_NAME: "SINGAPORE-WAREHOUSE",
    MATERIAL_NAME: "MAT-0354",
    NET_QUANTITY_MT: 23.375,
  },
  {
    INBOUND_DATE: "2024-09-23",
    PLANT_NAME: "CHINA-WAREHOUSE",
    MATERIAL_NAME: "MAT-0144",
    NET_QUANTITY_MT: 25.5,
  },
  {
    INBOUND_DATE: "2024-01-10",
    PLANT_NAME: "SINGAPORE-WAREHOUSE",
    MATERIAL_NAME: "MAT-0045",
    NET_QUANTITY_MT: 18.75,
  },
  {
    INBOUND_DATE: "2024-02-05",
    PLANT_NAME: "CHINA-WAREHOUSE",
    MATERIAL_NAME: "MAT-0100",
    NET_QUANTITY_MT: 32.125,
  },
  {
    INBOUND_DATE: "2024-01-20",
    PLANT_NAME: "SINGAPORE-WAREHOUSE",
    MATERIAL_NAME: "MAT-0013",
    NET_QUANTITY_MT: 15.25,
  },
]

// OUTBOUND DATA - Using your exact schema
export const outboundData = [
  {
    OUTBOUND_DATE: "2024-01-02",
    PLANT_NAME: "CHINA-WAREHOUSE",
    MODE_OF_TRANSPORT: "Truck",
    MATERIAL_NAME: "MAT-0013",
    CUSTOMER_NUMBER: "CST-00001",
    NET_QUANTITY_MT: 25.5,
  },
  {
    OUTBOUND_DATE: "2025-01-02",
    PLANT_NAME: "SINGAPORE-WAREHOUSE",
    MODE_OF_TRANSPORT: "Marine",
    MATERIAL_NAME: "MAT-0012",
    CUSTOMER_NUMBER: "CST-01467",
    NET_QUANTITY_MT: 9.625,
  },
  {
    OUTBOUND_DATE: "2024-01-15",
    PLANT_NAME: "SINGAPORE-WAREHOUSE",
    MODE_OF_TRANSPORT: "Marine",
    MATERIAL_NAME: "MAT-0354",
    CUSTOMER_NUMBER: "CST-00234",
    NET_QUANTITY_MT: 12.75,
  },
  {
    OUTBOUND_DATE: "2024-02-08",
    PLANT_NAME: "CHINA-WAREHOUSE",
    MODE_OF_TRANSPORT: "Truck",
    MATERIAL_NAME: "MAT-0100",
    CUSTOMER_NUMBER: "CST-00567",
    NET_QUANTITY_MT: 28.375,
  },
  {
    OUTBOUND_DATE: "2024-01-25",
    PLANT_NAME: "SINGAPORE-WAREHOUSE",
    MODE_OF_TRANSPORT: "Marine",
    MATERIAL_NAME: "MAT-0045",
    CUSTOMER_NUMBER: "CST-00890",
    NET_QUANTITY_MT: 16.5,
  },
]

// Calculate warehouse overview from schema data (after data is declared)
const calculateInboundTotal = () => {
  return inboundData.reduce((total, item) => total + item.NET_QUANTITY_MT, 0)
}

const calculateOutboundTotal = () => {
  return outboundData.reduce((total, item) => total + item.NET_QUANTITY_MT, 0)
}

// Update warehouseOverview to use schema-based calculations
export const warehouseOverview: WarehouseOverview = {
  inbound: Math.round(calculateInboundTotal() * 1000), // Convert MT to smaller units for display
  outbound: Math.round(calculateOutboundTotal() * 1000), // Convert MT to smaller units for display
  onground: 3420, // Keep as static mock data
  target: Math.round(3420 + calculateInboundTotal() * 1000 - 1200), // onground + inbound - predicted
  predictedOutbound: 1200, // Keep as static mock data
  inventoryTarget: 4000, // Keep as static mock data
  operationCostPerDay: 15000, // Keep as static mock data
  operationCostPerMonth: 450000, // Keep as static mock data
}

// Keep existing daily chart data (no schema provided)
export const dailyData: DailyData[] = [
  {
    date: "2024-01-01",
    carryOver: 120,
    inbound: 450,
    outbound: 380,
    uncleanOrder: 25,
    target: 3650,
    maxCapacity: 5000,
    inventoryTarget: 4000,
    maxThroughput: 1500,
  },
  {
    date: "2024-01-02",
    carryOver: 85,
    inbound: 520,
    outbound: 420,
    uncleanOrder: 30,
    target: 3790,
    maxCapacity: 5000,
    inventoryTarget: 4000,
    maxThroughput: 1500,
  },
  {
    date: "2024-01-03",
    carryOver: 95,
    inbound: 380,
    outbound: 450,
    uncleanOrder: 20,
    target: 3750,
    maxCapacity: 5000,
    inventoryTarget: 4000,
    maxThroughput: 1500,
  },
  {
    date: "2024-01-04",
    carryOver: 75,
    inbound: 600,
    outbound: 520,
    uncleanOrder: 35,
    target: 3900,
    maxCapacity: 5000,
    inventoryTarget: 4000,
    maxThroughput: 1500,
  },
  {
    date: "2024-01-05",
    carryOver: 110,
    inbound: 480,
    outbound: 390,
    uncleanOrder: 28,
    target: 3860,
    maxCapacity: 5000,
    inventoryTarget: 4000,
    maxThroughput: 1500,
  },
  {
    date: "2024-01-06",
    carryOver: 65,
    inbound: 420,
    outbound: 480,
    uncleanOrder: 22,
    target: 3890,
    maxCapacity: 5000,
    inventoryTarget: 4000,
    maxThroughput: 1500,
  },
  {
    date: "2024-01-07",
    carryOver: 90,
    inbound: 550,
    outbound: 510,
    uncleanOrder: 40,
    target: 3960,
    maxCapacity: 5000,
    inventoryTarget: 4000,
    maxThroughput: 1500,
  },
]

// Keep existing daily carry over data (no schema provided)
export const dailyCarryOverData: { date: string; carryOver: number; day: string }[] = [
  { date: "2024-01-01", carryOver: 120, day: "Mon" },
  { date: "2024-01-02", carryOver: 85, day: "Tue" },
  { date: "2024-01-03", carryOver: 95, day: "Wed" },
  { date: "2024-01-04", carryOver: 75, day: "Thu" },
  { date: "2024-01-05", carryOver: 110, day: "Fri" },
  { date: "2024-01-06", carryOver: 65, day: "Sat" },
  { date: "2024-01-07", carryOver: 90, day: "Sun" },
  { date: "2024-01-08", carryOver: 105, day: "Mon" },
  { date: "2024-01-09", carryOver: 80, day: "Tue" },
  { date: "2024-01-10", carryOver: 125, day: "Wed" },
  { date: "2024-01-11", carryOver: 95, day: "Thu" },
  { date: "2024-01-12", carryOver: 70, day: "Fri" },
  { date: "2024-01-13", carryOver: 115, day: "Sat" },
  { date: "2024-01-14", carryOver: 100, day: "Sun" },
  { date: "2024-01-15", carryOver: 130, day: "Mon" },
  { date: "2024-01-16", carryOver: 85, day: "Tue" },
  { date: "2024-01-17", carryOver: 140, day: "Wed" },
  { date: "2024-01-18", carryOver: 110, day: "Thu" },
  { date: "2024-01-19", carryOver: 155, day: "Fri" },
  { date: "2024-01-20", carryOver: 120, day: "Sat" },
  { date: "2024-01-21", carryOver: 175, day: "Sun" },
]

// Keep existing customer scores (no schema provided)
export const customerScores: CustomerScore[] = [
  {
    id: "1",
    customerName: "ABC Corp",
    score: 85,
    totalOrders: 150,
    returnedOrders: 8,
    returnRate: 5.3,
    lastOrderDate: "2024-01-05",
    riskLevel: "Low",
  },
  {
    id: "2",
    customerName: "XYZ Ltd",
    score: 72,
    totalOrders: 89,
    returnedOrders: 12,
    returnRate: 13.5,
    lastOrderDate: "2024-01-03",
    riskLevel: "Medium",
  },
  {
    id: "3",
    customerName: "Tech Solutions",
    score: 45,
    totalOrders: 45,
    returnedOrders: 18,
    returnRate: 40.0,
    lastOrderDate: "2024-01-01",
    riskLevel: "High",
  },
  {
    id: "4",
    customerName: "Global Trade",
    score: 91,
    totalOrders: 200,
    returnedOrders: 5,
    returnRate: 2.5,
    lastOrderDate: "2024-01-06",
    riskLevel: "Low",
  },
  {
    id: "5",
    customerName: "Metro Supplies",
    score: 68,
    totalOrders: 75,
    returnedOrders: 15,
    returnRate: 20.0,
    lastOrderDate: "2024-01-04",
    riskLevel: "Medium",
  },
]

// Enhanced shelf life calculation with realistic mock data
export const calculateShelfLife = (balanceDate: string, materialName: string, batchNumber: string) => {
  // Create a seed based on material and batch for consistent results
  const seed = materialName.charCodeAt(materialName.length - 1) + batchNumber.length

  // Different materials have different shelf life patterns
  const materialShelfLifeMap: Record<string, { min: number; max: number; total: number }> = {
    "MAT-0045": { min: 45, max: 120, total: 180 }, // SCRAP materials - shorter shelf life
    "MAT-0100": { min: 180, max: 300, total: 365 }, // Regular materials - standard shelf life
    "MAT-0354": { min: 90, max: 200, total: 270 }, // Medium shelf life materials
    "MAT-0144": { min: 150, max: 280, total: 320 }, // Good shelf life materials
    "MAT-0013": { min: 30, max: 90, total: 150 }, // SCRAP2 - very short shelf life
  }

  const materialConfig = materialShelfLifeMap[materialName] || { min: 60, max: 200, total: 300 }

  // Use seed to generate consistent random values
  const random1 = ((seed * 9301 + 49297) % 233280) / 233280
  const random2 = ((seed * 1234 + 5678) % 233280) / 233280

  // Calculate remaining shelf life based on material type and some randomness
  const baseRemaining = Math.floor(materialConfig.min + (materialConfig.max - materialConfig.min) * random1)

  // Add some variation based on batch
  const variation = Math.floor((random2 - 0.5) * 30) // ±15 days variation
  const remaining = Math.max(5, baseRemaining + variation) // Minimum 5 days

  const total = materialConfig.total

  // Calculate expiry date from today + remaining days
  const today = new Date()
  const expiryDate = new Date(today.getTime() + remaining * 24 * 60 * 60 * 1000)

  return {
    remaining,
    total,
    expiryDate: expiryDate.toISOString().split("T")[0],
  }
}

// Convert inventory data to batch format for health check page
export const batchData = inventoryData.map((item, index) => {
  const shelfLife = calculateShelfLife(item.BALANCE_AS_OF_DATE, item.MATERIAL_NAME, item.BATCH_NUMBER)
  return {
    id: (index + 1).toString(),
    batchNumber: item.BATCH_NUMBER,
    material: item.MATERIAL_NAME,
    shelfLifeRemaining: shelfLife.remaining,
    totalShelfLife: shelfLife.total,
    expiryDate: shelfLife.expiryDate,
  }
})

// Convert inventory data to material shelf life format
export const materialShelfLife = inventoryData.reduce(
  (acc, item) => {
    const existing = acc.find((m) => m.material === item.MATERIAL_NAME)
    const shelfLife = calculateShelfLife(item.BALANCE_AS_OF_DATE, item.MATERIAL_NAME, item.BATCH_NUMBER)

    if (existing) {
      existing.averageShelfLife = (existing.averageShelfLife + shelfLife.remaining) / 2
      existing.batchCount += 1
    } else {
      acc.push({
        material: item.MATERIAL_NAME,
        averageShelfLife: shelfLife.remaining,
        batchCount: 1,
      })
    }

    return acc
  },
  [] as Array<{ material: string; averageShelfLife: number; batchCount: number }>,
)
