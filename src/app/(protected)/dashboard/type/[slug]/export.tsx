import { Button } from "@/components/ui/button"
import { FaFileCsv } from "react-icons/fa6"
import { RiFileExcel2Fill } from "react-icons/ri"
import { Event } from "@prisma/client"
import * as XLSX from "xlsx"

interface ExportProps {
  data: Event[]
  filename?: string
}

const Export = ({ data, filename = "export" }: ExportProps) => {
  const getFormattedData = () => {
    if (!data || data.length === 0) return []

    const firstEvent = data[0]
    const fieldHeaders = Object.keys(firstEvent.fields as object)

    return data.map((event) => {
      const date = new Date(event.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })

      const fields = fieldHeaders.reduce(
        (acc, header) => ({
          ...acc,
          [header]: (event.fields as Record<string, any>)[header],
        }),
        {}
      )

      return {
        Date: date,
        ...fields,
        "Delivery Status": event.deliveryStatus,
      }
    })
  }

  const downloadCSV = () => {
    if (!data || data.length === 0) return

    const firstEvent = data[0]
    const fieldHeaders = Object.keys(firstEvent.fields as object)
    const headers = ["Date", ...fieldHeaders, "Delivery Status"]

    const csvContent = [
      headers.join(","),
      ...data.map((event) => {
        const date = new Date(event.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })

        const fields = fieldHeaders.map((header) => {
          const value = (event.fields as Record<string, any>)[header]
          return typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value ?? ""
        })

        return [date, ...fields, event.deliveryStatus].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `${filename}_${new Date().toISOString().split("T")[0]}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadExcel = () => {
    if (!data || data.length === 0) return

    const formattedData = getFormattedData()

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(formattedData)
    XLSX.utils.book_append_sheet(wb, ws, "Events")
    XLSX.writeFile(
      wb,
      `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`
    )
  }

  return (
    <div className="flex gap-3">
      <Button
        size="lg"
        variant="outline"
        className="relative group flex items-center justify-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300"
        onClick={downloadCSV}
        disabled={!data || data.length === 0}
      >
        <FaFileCsv className="size-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200" />
        <span className="absolute -bottom-8 scale-0 group-hover:scale-100 transition-all duration-200 text-xs text-gray-600 dark:text-gray-300">
          CSV
        </span>
      </Button>

      <Button
        size="lg"
        variant="outline"
        className="relative group flex items-center justify-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-green-500/50 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all duration-300"
        onClick={downloadExcel}
        disabled={!data || data.length === 0}
      >
        <RiFileExcel2Fill className="size-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200" />
        <span className="absolute -bottom-8 scale-0 group-hover:scale-100 transition-all duration-200 text-xs text-gray-600 dark:text-gray-300">
          Excel
        </span>
      </Button>
    </div>
  )
}

export default Export
