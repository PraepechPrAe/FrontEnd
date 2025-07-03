export interface WarehouseOverview {
  inbound: number
  outbound: number
  onground: number
  target: number
  predictedOutbound: number
  inventoryTarget: number
  operationCostPerDay: number
  operationCostPerMonth: number
}

export interface MaterialRatio {
  name: string
  value: number
  color: string
}

export interface DailyData {
  date: string
  carryOver: number
  inbound: number
  outbound: number
  uncleanOrder: number
  target: number
  maxCapacity: number
  inventoryTarget: number
  maxThroughput: number
}

export interface BatchData {
  id: string
  batchNumber: string
  material: string
  shelfLifeRemaining: number
  totalShelfLife: number
  expiryDate: string
}

export interface MaterialShelfLife {
  material: string
  averageShelfLife: number
  batchCount: number
}

export interface CustomerScore {
  id: string
  customerName: string
  score: number
  totalOrders: number
  returnedOrders: number
  returnRate: number
  lastOrderDate: string
  riskLevel: "Low" | "Medium" | "High"
}

export interface ChatMessage {
  id: string
  message: string
  sender: "user" | "bot"
  timestamp: Date
}
