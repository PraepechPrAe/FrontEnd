"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Upload, Plus, Trash2, FileSpreadsheet } from "lucide-react"
import { format } from "date-fns"

interface InventoryItem {
  id: string
  materialName: string
  batchNumber: string
  unrestrictedStock: number
  stockUnit: string
  stockSellValue: number
  currency: "SGD" | "CNY"
}

export default function DataSubmissionPage() {
  const [submissionType, setSubmissionType] = useState<"inbound" | "outbound" | "inventory">("inbound")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedMonth, setSelectedMonth] = useState<Date>()

  // Form states
  const [plantName, setPlantName] = useState("")
  const [materialNumber, setMaterialNumber] = useState("")
  const [netQuantity, setNetQuantity] = useState("")
  const [modeOfTransport, setModeOfTransport] = useState("")
  const [customerNumber, setCustomerNumber] = useState("")

  // Inventory table state
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [newItem, setNewItem] = useState({
    materialName: "",
    batchNumber: "",
    unrestrictedStock: "",
    stockUnit: "KG",
    stockSellValue: "",
    currency: "SGD" as "SGD" | "CNY",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mock submission - in real app, this would call an API
    const submissionData = {
      ...(submissionType === "inventory" && {
        BALANCE_AS_OF_DATE: selectedMonth ? format(selectedMonth, "MM-dd-yyyy") : "",
        PLANT_NAME: plantName,
        inventoryItems: inventoryItems.map((item) => ({
          MATERIAL_NAME: item.materialName,
          BATCH_NUMBER: item.batchNumber,
          UNRESRICTED_STOCK: item.unrestrictedStock,
          STOCK_UNIT: item.stockUnit,
          STOCK_SELL_VALUE: item.stockSellValue,
          CURRENCY: item.currency,
        })),
      }),
      ...(submissionType === "inbound" && {
        INBOUND_DATE: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        PLANT_NAME: plantName,
        MATERIAL_NAME: `MAT-${materialNumber}`,
        NET_QUANTITY_MT: Number(netQuantity),
      }),
      ...(submissionType === "outbound" && {
        OUTBOUND_DATE: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        PLANT_NAME: plantName,
        MODE_OF_TRANSPORT: modeOfTransport,
        MATERIAL_NAME: `MAT-${materialNumber}`,
        CUSTOMER_NUMBER: `CST-${customerNumber}`,
        NET_QUANTITY_MT: Number(netQuantity),
      }),
    }

    console.log("Submission Data:", submissionData)
    alert(`${submissionType.charAt(0).toUpperCase() + submissionType.slice(1)} submission successful!`)

    // Reset form
    resetForm()
  }

  const resetForm = () => {
    setSelectedDate(undefined)
    setSelectedMonth(undefined)
    setPlantName("")
    setMaterialNumber("")
    setNetQuantity("")
    setModeOfTransport("")
    setCustomerNumber("")
    setInventoryItems([])
    setNewItem({
      materialName: "",
      batchNumber: "",
      unrestrictedStock: "",
      stockUnit: "KG",
      stockSellValue: "",
      currency: "SGD",
    })
  }

  const addInventoryItem = () => {
    if (!newItem.materialName || !newItem.batchNumber || !newItem.unrestrictedStock || !newItem.stockSellValue) {
      alert("Please fill in all fields")
      return
    }

    const item: InventoryItem = {
      id: Date.now().toString(),
      materialName: `MAT-${newItem.materialName}`,
      batchNumber: newItem.batchNumber,
      unrestrictedStock: Number(newItem.unrestrictedStock),
      stockUnit: newItem.stockUnit,
      stockSellValue: Number(newItem.stockSellValue),
      currency: newItem.currency,
    }

    setInventoryItems([...inventoryItems, item])
    setNewItem({
      materialName: "",
      batchNumber: "",
      unrestrictedStock: "",
      stockUnit: "KG",
      stockSellValue: "",
      currency: "SGD",
    })
  }

  const removeInventoryItem = (id: string) => {
    setInventoryItems(inventoryItems.filter((item) => item.id !== id))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Mock file processing - in real app, this would parse Excel file
      console.log("Processing file:", file.name)
      alert(`File "${file.name}" uploaded successfully! (Mock processing)`)

      // Mock data population based on submission type
      if (submissionType === "inventory") {
        const mockInventoryData: InventoryItem[] = [
          {
            id: "1",
            materialName: "MAT-0045",
            batchNumber: "SCRAP",
            unrestrictedStock: 164,
            stockUnit: "KG",
            stockSellValue: 211,
            currency: "CNY",
          },
          {
            id: "2",
            materialName: "MAT-0100",
            batchNumber: "E2278A",
            unrestrictedStock: 1175,
            stockUnit: "KG",
            stockSellValue: 1210,
            currency: "SGD",
          },
        ]
        setInventoryItems(mockInventoryData)
      } else {
        // For inbound/outbound, populate form fields with mock data
        setPlantName("SINGAPORE-WAREHOUSE")
        setMaterialNumber("0354")
        setNetQuantity("23.375")
        if (submissionType === "outbound") {
          setModeOfTransport("Marine")
          setCustomerNumber("01467")
        }
      }
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Data Submission</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit Warehouse Data</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose submission type and fill in the required information or upload an Excel file
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Submission Type Selector */}
          <div className="space-y-2">
            <Label htmlFor="submission-type">Submission Type</Label>
            <Select
              value={submissionType}
              onValueChange={(value: "inbound" | "outbound" | "inventory") => {
                setSubmissionType(value)
                resetForm()
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select submission type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inbound">Inbound Submission</SelectItem>
                <SelectItem value="outbound">Outbound Submission</SelectItem>
                <SelectItem value="inventory">Inventory Submission</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Section */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
            <div className="text-center space-y-2">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Upload Excel File</p>
                <p className="text-xs text-muted-foreground">Upload an Excel file to automatically populate the form</p>
              </div>
              <div className="flex items-center justify-center">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    <Upload className="h-4 w-4" />
                    Choose File
                  </div>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </Label>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Manual Entry</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date Picker */}
                <div className="space-y-2">
                  <Label>{submissionType === "inventory" ? "Select Month" : "Select Date"}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {submissionType === "inventory"
                          ? selectedMonth
                            ? format(selectedMonth, "MMMM yyyy")
                            : "Pick a month"
                          : selectedDate
                            ? format(selectedDate, "PPP")
                            : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={submissionType === "inventory" ? selectedMonth : selectedDate}
                        onSelect={submissionType === "inventory" ? setSelectedMonth : setSelectedDate}
                        initialFocus
                        {...(submissionType === "inventory" && {
                          defaultMonth: selectedMonth,
                          fromYear: 2020,
                          toYear: 2030,
                        })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Plant Name */}
                <div className="space-y-2">
                  <Label htmlFor="plant-name">Plant Name</Label>
                  <Select value={plantName} onValueChange={setPlantName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGAPORE-WAREHOUSE">SINGAPORE-WAREHOUSE</SelectItem>
                      <SelectItem value="CHINA-WAREHOUSE">CHINA-WAREHOUSE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Conditional Fields Based on Submission Type */}
              {submissionType !== "inventory" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Material Name */}
                  <div className="space-y-2">
                    <Label htmlFor="material-name">Material Name</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                        <span className="text-sm text-muted-foreground">MAT-</span>
                      </div>
                      <Input
                        id="material-name"
                        value={materialNumber}
                        onChange={(e) => setMaterialNumber(e.target.value)}
                        placeholder="Enter number"
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Net Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="net-quantity">Net Quantity (MT)</Label>
                    <Input
                      id="net-quantity"
                      type="number"
                      value={netQuantity}
                      onChange={(e) => setNetQuantity(e.target.value)}
                      placeholder="Enter quantity"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Outbound Specific Fields */}
              {submissionType === "outbound" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mode of Transport */}
                  <div className="space-y-2">
                    <Label htmlFor="transport-mode">Mode of Transport</Label>
                    <Select value={modeOfTransport} onValueChange={setModeOfTransport}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marine">Marine</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Customer Number */}
                  <div className="space-y-2">
                    <Label htmlFor="customer-number">Customer Number</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                        <span className="text-sm text-muted-foreground">CST-</span>
                      </div>
                      <Input
                        id="customer-number"
                        value={customerNumber}
                        onChange={(e) => setCustomerNumber(e.target.value)}
                        placeholder="Enter number"
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Inventory Specific Section */}
              {submissionType === "inventory" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-semibold">Inventory Items</h4>
                    <Button type="button" onClick={addInventoryItem} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>

                  {/* Add New Item Form */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="space-y-2">
                      <Label className="text-xs">Material Name</Label>
                      <div className="flex">
                        <div className="flex items-center px-2 bg-background border border-r-0 rounded-l-md">
                          <span className="text-xs text-muted-foreground">MAT-</span>
                        </div>
                        <Input
                          value={newItem.materialName}
                          onChange={(e) => setNewItem({ ...newItem, materialName: e.target.value })}
                          placeholder="Number"
                          className="rounded-l-none text-sm"
                          size={10}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Batch Number</Label>
                      <Input
                        value={newItem.batchNumber}
                        onChange={(e) => setNewItem({ ...newItem, batchNumber: e.target.value })}
                        placeholder="Batch number"
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Unrestricted Stock</Label>
                      <Input
                        type="number"
                        value={newItem.unrestrictedStock}
                        onChange={(e) => setNewItem({ ...newItem, unrestrictedStock: e.target.value })}
                        placeholder="Stock"
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Stock Unit</Label>
                      <Input type="text" value={newItem.stockUnit} placeholder="Unit" className="text-sm" readOnly />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Stock Sell Value</Label>
                      <Input
                        type="number"
                        value={newItem.stockSellValue}
                        onChange={(e) => setNewItem({ ...newItem, stockSellValue: e.target.value })}
                        placeholder="Value"
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Currency</Label>
                      <Select
                        value={newItem.currency}
                        onValueChange={(value: "SGD" | "CNY") => setNewItem({ ...newItem, currency: value })}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SGD">SGD</SelectItem>
                          <SelectItem value="CNY">CNY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Inventory Items Table */}
                  {inventoryItems.length > 0 && (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Material Name</TableHead>
                            <TableHead>Batch Number</TableHead>
                            <TableHead>Unrestricted Stock</TableHead>
                            <TableHead>Stock Unit</TableHead>
                            <TableHead>Stock Sell Value</TableHead>
                            <TableHead>Currency</TableHead>
                            <TableHead className="w-[50px]">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inventoryItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.materialName}</TableCell>
                              <TableCell>{item.batchNumber}</TableCell>
                              <TableCell>{item.unrestrictedStock.toLocaleString()}</TableCell>
                              <TableCell>{item.stockUnit}</TableCell>
                              <TableCell>{item.stockSellValue.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.currency}</Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeInventoryItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  Submit {submissionType.charAt(0).toUpperCase() + submissionType.slice(1)} Data
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Reset Form
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
