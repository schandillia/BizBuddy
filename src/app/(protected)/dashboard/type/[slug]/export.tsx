import { Button } from "@/components/ui/button"
import { FaFileCsv } from "react-icons/fa"
import { PiMicrosoftExcelLogoFill } from "react-icons/pi"
import { RiFileExcel2Fill } from "react-icons/ri"

const Export = () => {
  return (
    <div className="gap-y-2">
      <Button
        size="sm"
        variant="ghost"
        className="text-gray-600 dark:text-gray-300"
      >
        <FaFileCsv className="size-6" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="text-gray-600 dark:text-gray-300"
      >
        <RiFileExcel2Fill className="size-6" />
      </Button>
    </div>
  )
}

export default Export
