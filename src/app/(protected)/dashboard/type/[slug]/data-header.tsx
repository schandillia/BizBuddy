// DataHeader.tsx
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table } from "@tanstack/react-table"
import { Event, EventType } from "@prisma/client"
import { Heading } from "@/components/heading"
import { RiFileExcel2Fill } from "react-icons/ri"
import { FaFileCsv } from "react-icons/fa6"
import * as XLSX from "xlsx"

interface DataHeaderProps {
  limitInput: string
  handleLimitChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  table: Table<Event>
  isFetching: boolean
  type: EventType
  data: Event[]
}

const DataHeader = ({
  limitInput,
  handleLimitChange,
  table,
  isFetching,
  type,
  data,
}: DataHeaderProps) => {
  const [customValue, setCustomValue] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomValue(value)
    handleLimitChange(e)
  }

  const handleSelectChange = (value: string) => {
    if (value === "custom") {
      setShowCustomInput(true)
      return
    }
    setShowCustomInput(false)
    handleLimitChange({
      target: { value },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  const formatDataForExport = () => {
    return data.map((event) => {
      const fields = event.fields as Record<string, any>
      return {
        Date: new Date(event.createdAt).toLocaleString(),
        ...fields,
        Status: event.deliveryStatus,
      }
    })
  }

  const exportToCSV = () => {
    const formattedData = formatDataForExport()
    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(formattedData[0]).join(",") +
      "\n" +
      formattedData
        .map((row) => {
          return Object.values(row).join(",")
        })
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${type.name}_events.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = () => {
    const formattedData = formatDataForExport()
    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Events")
    XLSX.writeFile(wb, `${type.name}_events.xlsx`)
  }

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h2" className="text-2xl font-semibold tracking-tight">
          Event Overview
        </Heading>
        <p className="text-sm text-muted-foreground mt-1">
          Tracking {type.name} events
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Select
              value={showCustomInput ? "custom" : limitInput}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className="w-32 text-gray-600 dark:text-gray-300">
                <SelectValue placeholder="Rows per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 rows</SelectItem>
                <SelectItem value="30">30 rows</SelectItem>
                <SelectItem value="50">50 rows</SelectItem>
                <SelectItem value="100">100 rows</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            {showCustomInput && (
              <Input
                type="number"
                min="1"
                max="100"
                value={customValue}
                onChange={handleCustomChange}
                placeholder="1-100"
                className="w-24"
              />
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300"
            >
              <FaFileCsv className="size-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">CSV</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToExcel}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-green-500/50 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all duration-300"
            >
              <RiFileExcel2Fill className="size-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">Excel</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isFetching}
          >
            <ChevronLeft className="size-4 text-gray-600 dark:text-gray-300" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isFetching}
          >
            <ChevronRight className="size-4 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DataHeader
