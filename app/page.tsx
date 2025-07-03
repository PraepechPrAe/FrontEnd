"use client"

import { useState } from "react"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingUp, TrendingDown, DollarSign, Target, CalendarIcon, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { format, addDays } from "date-fns"
import { warehouseOverview, dailyCarryOverData, dailyData, inboundData, outboundData } from "@/data/mockData"
import type { DateRange } from "react-day-picker"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Chart } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

// Add these helper functions after the imports
const calculateInboundTotal = () => {
  return inboundData.reduce((total, item) => total + item.NET_QUANTITY_MT, 0)
}

const calculateOutboundTotal = () => {
  return outboundData.reduce((total, item) => total + item.NET_QUANTITY_MT, 0)
}

export default function OverviewDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 0, 7),
  })

  // Chart visibility toggles
  const [chartVisibility, setChartVisibility] = useState({
    inbound: true,
    outbound: true,
    uncleanOrder: true,
    carryOver: true,
    target: true,
    maxCapacity: true,
    inventoryTarget: true,
    maxThroughput: true,
  })

  const toggleVisibility = (key: keyof typeof chartVisibility) => {
    setChartVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Filter and combine schema data with mock data for chart
  const getFilteredData = () => {
    if (!dateRange?.from || !dateRange?.to) {
      // Use first 7 days of dailyData but enhance with schema calculations
      return dailyData.slice(0, 7).map((item, index) => ({
        ...item,
        // Use actual inbound/outbound averages from schema data
        inbound: index < inboundData.length ? Math.round(inboundData[index].NET_QUANTITY_MT * 20) : item.inbound,
        outbound: index < outboundData.length ? Math.round(outboundData[index].NET_QUANTITY_MT * 18) : item.outbound,
      }))
    }

    const startDate = dateRange.from
    const endDate = dateRange.to

    // Generate 7 days of data based on selected range, incorporating schema data
    const filteredData = []
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i)
      const dateString = format(currentDate, "yyyy-MM-dd")

      // Use schema data to influence the generated data
      const schemaInbound = inboundData[i % inboundData.length]?.NET_QUANTITY_MT || 20
      const schemaOutbound = outboundData[i % outboundData.length]?.NET_QUANTITY_MT || 15

      filteredData.push({
        date: dateString,
        carryOver: 60 + Math.floor(Math.random() * 80),
        inbound: Math.round(schemaInbound * (15 + Math.random() * 10)), // Scale up from MT
        outbound: Math.round(schemaOutbound * (15 + Math.random() * 10)), // Scale up from MT
        uncleanOrder: 15 + Math.floor(Math.random() * 30),
        target: 3600 + Math.floor(Math.random() * 400),
        maxCapacity: 5000,
        inventoryTarget: 4000,
        maxThroughput: 1500,
      })
    }

    return filteredData
  }

  const filteredData = getFilteredData()

  // Prepare chart data for daily carry over
  const carryOverChartData = {
    labels: dailyCarryOverData.map((item) => item.day),
    datasets: [
      {
        label: "Daily Carry Over",
        data: dailyCarryOverData.map((item) => item.carryOver),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // Prepare combined operations chart data
  const operationsChartData = {
    labels: filteredData.map((item, index) => {
      const date = new Date(item.date)
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      return days[date.getDay()]
    }),
    datasets: [
      // Stacked Bar Charts
      ...(chartVisibility.inbound
        ? [
            {
              type: "bar" as const,
              label: "Inbound",
              data: filteredData.map((item) => item.inbound),
              backgroundColor: "rgba(34, 197, 94, 0.8)",
              borderColor: "rgb(34, 197, 94)",
              borderWidth: 1,
              stack: "operations",
              yAxisID: "y",
            },
          ]
        : []),
      ...(chartVisibility.outbound
        ? [
            {
              type: "bar" as const,
              label: "Outbound",
              data: filteredData.map((item) => item.outbound),
              backgroundColor: "rgba(239, 68, 68, 0.8)",
              borderColor: "rgb(239, 68, 68)",
              borderWidth: 1,
              stack: "operations",
              yAxisID: "y",
            },
          ]
        : []),
      ...(chartVisibility.uncleanOrder
        ? [
            {
              type: "bar" as const,
              label: "Unclean Orders",
              data: filteredData.map((item) => item.uncleanOrder),
              backgroundColor: "rgba(251, 146, 60, 0.8)",
              borderColor: "rgb(251, 146, 60)",
              borderWidth: 1,
              stack: "operations",
              yAxisID: "y",
            },
          ]
        : []),
      ...(chartVisibility.carryOver
        ? [
            {
              type: "bar" as const,
              label: "Carry Over",
              data: filteredData.map((item) => item.carryOver),
              backgroundColor: "rgba(168, 85, 247, 0.8)",
              borderColor: "rgb(168, 85, 247)",
              borderWidth: 1,
              stack: "operations",
              yAxisID: "y",
            },
          ]
        : []),
      // Area Chart
      ...(chartVisibility.target
        ? [
            {
              type: "line" as const,
              label: "Target",
              data: filteredData.map((item) => item.target),
              borderColor: "rgba(59, 130, 246, 0.8)",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              yAxisID: "y1",
            },
          ]
        : []),
      // Line Charts
      ...(chartVisibility.maxCapacity
        ? [
            {
              type: "line" as const,
              label: "Max Capacity",
              data: filteredData.map((item) => item.maxCapacity),
              borderColor: "rgb(220, 38, 127)",
              backgroundColor: "transparent",
              borderWidth: 3,
              borderDash: [5, 5],
              pointRadius: 0,
              yAxisID: "y1",
            },
          ]
        : []),
      ...(chartVisibility.inventoryTarget
        ? [
            {
              type: "line" as const,
              label: "Inventory Target",
              data: filteredData.map((item) => item.inventoryTarget),
              borderColor: "rgb(16, 185, 129)",
              backgroundColor: "transparent",
              borderWidth: 3,
              borderDash: [10, 5],
              pointRadius: 0,
              yAxisID: "y1",
            },
          ]
        : []),
      ...(chartVisibility.maxThroughput
        ? [
            {
              type: "line" as const,
              label: "Max Throughput",
              data: filteredData.map((item) => item.maxThroughput),
              borderColor: "rgb(245, 158, 11)",
              backgroundColor: "transparent",
              borderWidth: 3,
              borderDash: [15, 5],
              pointRadius: 0,
              yAxisID: "y",
            },
          ]
        : []),
    ].filter(Boolean),
  }

  const carryOverChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            const index = context[0].dataIndex
            const data = dailyCarryOverData[index]
            return `${data.day} - ${format(new Date(data.date), "MMM dd, yyyy")}`
          },
          label: (context: any) => `Carry Over: ${context.parsed.y.toLocaleString()} units`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 12,
          },
          callback: (value: any) => value.toLocaleString(),
        },
        beginAtZero: false,
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  }

  const operationsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: (context: any) => {
            const index = context[0].dataIndex
            const item = filteredData[index]
            return format(new Date(item.date), "MMM dd, yyyy")
          },
          label: (context: any) => {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Operations (Units)",
          font: {
            size: 12,
          },
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: (value: any) => value.toLocaleString(),
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Inventory & Capacity",
          font: {
            size: 12,
          },
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: (value: any) => value.toLocaleString(),
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Overview Dashboard</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Inbound"
          value={warehouseOverview.inbound.toLocaleString()}
          icon={<TrendingUp className="h-4 w-4 text-green-600" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Outbound"
          value={warehouseOverview.outbound.toLocaleString()}
          icon={<TrendingDown className="h-4 w-4 text-red-600" />}
          trend={{ value: -5, isPositive: false }}
        />
        <StatCard
          title="On Ground"
          value={warehouseOverview.onground.toLocaleString()}
          icon={<Package className="h-4 w-4 text-blue-600" />}
          subtitle="Current inventory"
        />
        <StatCard
          title="Target"
          value={warehouseOverview.target.toLocaleString()}
          icon={<Target className="h-4 w-4 text-purple-600" />}
          subtitle="Onground + Inbound - Predicted"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Predicted Outbound"
          value={warehouseOverview.predictedOutbound.toLocaleString()}
          icon={<TrendingDown className="h-4 w-4 text-orange-600" />}
        />
        <StatCard
          title="Inventory Target"
          value={warehouseOverview.inventoryTarget.toLocaleString()}
          icon={<Target className="h-4 w-4 text-green-600" />}
        />
        <StatCard
          title="Cost/Day"
          value={`$${warehouseOverview.operationCostPerDay.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4 text-yellow-600" />}
        />
        <StatCard
          title="Cost/Month"
          value={`$${warehouseOverview.operationCostPerMonth.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4 text-yellow-600" />}
        />
      </div>

      {/* Schema Data Insights */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Schema Data Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest inbound and outbound transactions from your data submissions
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Inbound */}
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Recent Inbound Shipments</h4>
              <div className="space-y-2">
                {inboundData.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium">{item.MATERIAL_NAME}</div>
                      <div className="text-sm text-muted-foreground">{item.PLANT_NAME}</div>
                      <div className="text-xs text-muted-foreground">{item.INBOUND_DATE}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{item.NET_QUANTITY_MT} MT</div>
                      <div className="text-xs text-muted-foreground">Net Quantity</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Inbound: <span className="font-semibold">{calculateInboundTotal().toFixed(2)} MT</span>
              </div>
            </div>

            {/* Recent Outbound */}
            <div className="space-y-3">
              <h4 className="font-semibold text-red-600">Recent Outbound Shipments</h4>
              <div className="space-y-2">
                {outboundData.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium">{item.MATERIAL_NAME}</div>
                      <div className="text-sm text-muted-foreground">{item.PLANT_NAME}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.OUTBOUND_DATE} • {item.MODE_OF_TRANSPORT}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">{item.NET_QUANTITY_MT} MT</div>
                      <div className="text-xs text-muted-foreground">{item.CUSTOMER_NUMBER}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Outbound: <span className="font-semibold">{calculateOutboundTotal().toFixed(2)} MT</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Carry Over Line Chart */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Daily Carry Over Trend</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track inventory carry over across multiple days to identify patterns and trends
          </p>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px]">
            <Chart type="line" data={carryOverChartData} options={carryOverChartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Combined Warehouse Operations Chart */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Warehouse Operations Overview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Combined view of daily operations, inventory levels, and capacity metrics
                </p>
              </div>

              {/* Date Picker moved here */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Select 7-Day Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-[280px] justify-start text-left font-normal bg-transparent"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM dd, yyyy")
                        )
                      ) : (
                        <span>Pick a 7-day date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={(range) => {
                        if (!range) {
                          setDateRange(undefined)
                          return
                        }

                        if (range.from && !range.to) {
                          setDateRange(range)
                        } else if (range.from && range.to) {
                          const diffTime = Math.abs(range.to.getTime() - range.from.getTime())
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                          if (diffDays === 6) {
                            setDateRange(range)
                          } else {
                            const correctEndDate = new Date(range.from)
                            correctEndDate.setDate(correctEndDate.getDate() + 6)
                            setDateRange({ from: range.from, to: correctEndDate })
                          }
                        } else {
                          setDateRange(range)
                        }
                      }}
                      numberOfMonths={2}
                    />
                    <div className="p-3 border-t text-xs text-muted-foreground text-center">
                      Select a start date for a 7-day period. Chart will update automatically.
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Chart Controls */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Operations</h4>
                <div className="space-y-2">
                  {[
                    { key: "inbound", label: "Inbound", color: "bg-green-500" },
                    { key: "outbound", label: "Outbound", color: "bg-red-500" },
                    { key: "uncleanOrder", label: "Unclean Orders", color: "bg-orange-500" },
                    { key: "carryOver", label: "Carry Over", color: "bg-purple-500" },
                  ].map(({ key, label, color }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={chartVisibility[key as keyof typeof chartVisibility]}
                        onCheckedChange={() => toggleVisibility(key as keyof typeof chartVisibility)}
                      />
                      <div className={`w-3 h-3 rounded ${color}`} />
                      <label htmlFor={key} className="text-xs cursor-pointer">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Inventory</h4>
                <div className="space-y-2">
                  {[{ key: "target", label: "Target (Area)", color: "bg-blue-500" }].map(({ key, label, color }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={chartVisibility[key as keyof typeof chartVisibility]}
                        onCheckedChange={() => toggleVisibility(key as keyof typeof chartVisibility)}
                      />
                      <div className={`w-3 h-3 rounded ${color}`} />
                      <label htmlFor={key} className="text-xs cursor-pointer">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Capacity Lines</h4>
                <div className="space-y-2">
                  {[
                    { key: "maxCapacity", label: "Max Capacity", color: "bg-pink-600" },
                    { key: "inventoryTarget", label: "Inventory Target", color: "bg-emerald-500" },
                    { key: "maxThroughput", label: "Max Throughput", color: "bg-amber-500" },
                  ].map(({ key, label, color }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={chartVisibility[key as keyof typeof chartVisibility]}
                        onCheckedChange={() => toggleVisibility(key as keyof typeof chartVisibility)}
                      />
                      <div className={`w-3 h-3 rounded ${color}`} />
                      <label htmlFor={key} className="text-xs cursor-pointer">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Quick Actions</h4>
                <div className="space-y-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setChartVisibility((prev) => {
                        const allVisible = Object.values(prev).every((v) => v)
                        return Object.keys(prev).reduce(
                          (acc, key) => ({
                            ...acc,
                            [key]: !allVisible,
                          }),
                          {} as typeof prev,
                        )
                      })
                    }
                    className="w-full text-xs"
                  >
                    {Object.values(chartVisibility).every((v) => v) ? (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Hide All
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Show All
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[500px]">
            <Chart type="bar" data={operationsChartData} options={operationsChartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
