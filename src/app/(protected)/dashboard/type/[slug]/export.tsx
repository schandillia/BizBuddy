import { Button } from "@/components/ui/button"
import { FaFileCsv } from "react-icons/fa"
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

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(formattedData)

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Events")

    // Generate Excel file and trigger download
    XLSX.writeFile(
      wb,
      `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`
    )
  }

  return (
    <div className="gap-y-2">
      <Button
        size="sm"
        variant="ghost"
        className="text-gray-600 dark:text-gray-300"
        onClick={downloadCSV}
        disabled={!data || data.length === 0}
      >
        <FaFileCsv className="size-6" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="text-gray-600 dark:text-gray-300"
        onClick={downloadExcel}
        disabled={!data || data.length === 0}
      >
        <RiFileExcel2Fill className="size-6" />
      </Button>
    </div>
  )
}

export default Export
