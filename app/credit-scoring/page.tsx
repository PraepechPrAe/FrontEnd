"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { customerScores } from "@/data/mockData"
import type { CustomerScore } from "@/types/warehouse"

export default function CreditScoringPage() {
  const columns: ColumnDef<CustomerScore>[] = [
    {
      accessorKey: "customerName",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Customer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "score",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Credit Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const score = row.getValue("score") as number
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{score}</span>
            {score >= 80 && <TrendingUp className="h-4 w-4 text-green-500" />}
            {score < 60 && <TrendingDown className="h-4 w-4 text-red-500" />}
          </div>
        )
      },
    },
    {
      accessorKey: "totalOrders",
      header: "Total Orders",
    },
    {
      accessorKey: "returnedOrders",
      header: "Returned Orders",
    },
    {
      accessorKey: "returnRate",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Return Rate (%)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const rate = row.getValue("returnRate") as number
        return (
          <div className="flex items-center gap-2">
            <span>{rate.toFixed(1)}%</span>
            {rate > 20 && <AlertCircle className="h-4 w-4 text-red-500" />}
          </div>
        )
      },
    },
    {
      accessorKey: "lastOrderDate",
      header: "Last Order",
    },
    {
      accessorKey: "riskLevel",
      header: "Risk Level",
      cell: ({ row }) => {
        const riskLevel = row.getValue("riskLevel") as string
        let variant: "default" | "secondary" | "destructive" | "outline" = "default"

        switch (riskLevel) {
          case "Low":
            variant = "default"
            break
          case "Medium":
            variant = "secondary"
            break
          case "High":
            variant = "destructive"
            break
        }

        return <Badge variant={variant}>{riskLevel}</Badge>
      },
    },
  ]

  // Calculate summary statistics
  const averageScore = customerScores.reduce((acc, customer) => acc + customer.score, 0) / customerScores.length
  const highRiskCustomers = customerScores.filter((customer) => customer.riskLevel === "High").length
  const totalReturns = customerScores.reduce((acc, customer) => acc + customer.returnedOrders, 0)
  const totalOrders = customerScores.reduce((acc, customer) => acc + customer.totalOrders, 0)
  const overallReturnRate = (totalReturns / totalOrders) * 100

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Credit Scoring System</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Credit Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{averageScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Across all customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Risk Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highRiskCustomers}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Return Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{overallReturnRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalReturns} of {totalOrders} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{customerScores.length}</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Scores Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Credit Scores</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track customer reliability based on order history and return patterns
          </p>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={customerScores} />
        </CardContent>
      </Card>
    </div>
  )
}
