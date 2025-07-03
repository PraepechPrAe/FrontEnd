"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, AlertTriangle, Clock, Activity, TrendingUp, Package } from "lucide-react"
import { batchData, materialShelfLife } from "@/data/mockData"

export default function HealthCheckPage() {
  const [viewMode, setViewMode] = useState<"batch" | "material">("batch")
  const [sortField, setSortField] = useState<string>("shelfLifeRemaining")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Calculate average shelf life
  const averageShelfLife = batchData.reduce((acc, batch) => acc + batch.shelfLifeRemaining, 0) / batchData.length

  // Get top 3 batches with least shelf life
  const criticalBatches = [...batchData].sort((a, b) => a.shelfLifeRemaining - b.shelfLifeRemaining).slice(0, 3)

  // Calculate health metrics
  const totalBatches = batchData.length
  const criticalCount = batchData.filter((batch) => batch.shelfLifeRemaining <= 30).length
  const warningCount = batchData.filter(
    (batch) => batch.shelfLifeRemaining > 30 && batch.shelfLifeRemaining <= 90,
  ).length
  const goodCount = batchData.filter((batch) => batch.shelfLifeRemaining > 90).length

  // Sort data based on current sort settings
  const sortedBatchData = [...batchData].sort((a, b) => {
    const aValue = a[sortField as keyof typeof a]
    const bValue = b[sortField as keyof typeof b]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  const sortedMaterialData = [...materialShelfLife].sort((a, b) => {
    const aValue = a[sortField as keyof typeof a]
    const bValue = b[sortField as keyof typeof b]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Warehouse Health Check</h1>
        <Badge variant="outline" className="text-sm">
          <Activity className="w-4 h-4 mr-2" />
          System Status: Healthy
        </Badge>
      </div>

      {/* Health Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Average Shelf Life
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{averageShelfLife.toFixed(1)} days</div>
            <p className="text-xs text-muted-foreground mt-1">Across all inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Critical Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">≤ 30 days remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4 text-yellow-500" />
              Warning Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <p className="text-xs text-muted-foreground mt-1">31-90 days remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Package className="h-4 w-4 text-green-500" />
              Healthy Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{goodCount}</div>
            <p className="text-xs text-muted-foreground mt-1">{">"}90 days remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Batches Alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Critical Batches - Immediate Attention Required
          </CardTitle>
          <p className="text-sm text-muted-foreground">Batches with shortest shelf life that need immediate action</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {criticalBatches.map((batch) => (
              <div
                key={batch.id}
                className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div>
                  <div className="font-medium text-red-900">{batch.batchNumber}</div>
                  <div className="text-sm text-red-700">{batch.material}</div>
                  <div className="text-xs text-red-600 mt-1">Expires: {batch.expiryDate}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-red-600">{batch.shelfLifeRemaining}</div>
                  <div className="text-xs text-red-600">days left</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Health Distribution</CardTitle>
          <p className="text-sm text-muted-foreground">Overview of inventory health across all batches</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Health Status Bars */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm font-medium">Critical (≤30 days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(criticalCount / totalBatches) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-12">
                    {criticalCount}/{totalBatches}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm font-medium">Warning (31-90 days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(warningCount / totalBatches) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-12">
                    {warningCount}/{totalBatches}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm font-medium">Healthy ({">"}90 days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(goodCount / totalBatches) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-12">
                    {goodCount}/{totalBatches}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Shelf Life Analysis</CardTitle>
            <div className="flex gap-2">
              <Button variant={viewMode === "batch" ? "default" : "outline"} onClick={() => setViewMode("batch")}>
                By Batch
              </Button>
              <Button variant={viewMode === "material" ? "default" : "outline"} onClick={() => setViewMode("material")}>
                By Material
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {viewMode === "batch"
              ? "Detailed view of individual batches and their shelf life status"
              : "Material-wise summary of average shelf life and batch counts"}
          </p>
        </CardHeader>
        <CardContent>
          {viewMode === "batch" ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("batchNumber")}>
                        Batch Number
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("shelfLifeRemaining")}>
                        Shelf Life Remaining (Days)
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBatchData.map((batch) => {
                    const days = batch.shelfLifeRemaining
                    let status = "Good"
                    let variant: "default" | "secondary" | "destructive" | "outline" = "default"

                    if (days <= 30) {
                      status = "Critical"
                      variant = "destructive"
                    } else if (days <= 90) {
                      status = "Warning"
                      variant = "secondary"
                    }

                    return (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                        <TableCell>{batch.material}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{days}</span>
                            {days <= 30 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                            {days > 30 && days <= 90 && <Clock className="h-4 w-4 text-yellow-500" />}
                          </div>
                        </TableCell>
                        <TableCell>{batch.expiryDate}</TableCell>
                        <TableCell>
                          <Badge variant={variant}>{status}</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("averageShelfLife")}>
                        Average Shelf Life (Days)
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Total Batches</TableHead>
                    <TableHead>Health Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedMaterialData.map((material, index) => {
                    const avgDays = material.averageShelfLife
                    let healthStatus = "Good"
                    let statusColor = "text-green-600"

                    if (avgDays <= 30) {
                      healthStatus = "Critical"
                      statusColor = "text-red-600"
                    } else if (avgDays <= 90) {
                      healthStatus = "Warning"
                      statusColor = "text-yellow-600"
                    }

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{material.material}</TableCell>
                        <TableCell>{material.averageShelfLife.toFixed(1)}</TableCell>
                        <TableCell>{material.batchCount}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${statusColor}`}>{healthStatus}</span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
