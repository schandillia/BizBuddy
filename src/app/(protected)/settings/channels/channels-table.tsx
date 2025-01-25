import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function ChannelsTable({ children }: { children: React.ReactNode }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Service</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Identifier</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="dark:text-gray-300">{children}</TableBody>
    </Table>
  )
}
