"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, Trash2, CheckCircle, XCircle, Clock, RefreshCw, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
import { apiClient, type Transaction } from "@/lib/api"

const PaymentManagement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchTransactions()
  }, [searchTerm, statusFilter, currentPage])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const response = await apiClient.getTransactions({
        search: searchTerm,
        status: statusFilter,
        page: currentPage,
        limit: 10,
      })
      if (response.success && response.data) {
        setTransactions(response.data.transactions)
        setTotalPages(response.data.totalPages)
      } else {
        throw new Error(response.error || "Failed to fetch transactions")
      }
    } catch (error: any) {
      console.error("Error fetching transactions:", error)
      toast.error("Failed to load transactions", {
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: "bg-green-500/10 text-green-600 dark:text-green-400", icon: CheckCircle },
      failed: { color: "bg-red-500/10 text-red-600 dark:text-red-400", icon: XCircle },
      pending: { color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400", icon: Clock },
      refunded: { color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", icon: RefreshCw },
    }
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon
    return (
      <Badge className={`${config.color} border-0 flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleRefund = async (transactionId: string) => {
    try {
      const response = await apiClient.refundTransaction(transactionId, "Admin initiated refund")
      if (response.success) {
        const transaction = transactions.find((t) => t.id === transactionId)
        toast.success("Refund processed successfully", {
          description: `Ksh ${transaction?.amount} refunded to ${transaction?.phone}`,
        })
        fetchTransactions() // Refresh the list
      } else {
        throw new Error(response.error || "Refund failed")
      }
    } catch (error: any) {
      toast.error("Refund failed", {
        description: error.message,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by phone, transaction ID, or M-Pesa reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => {
            toast.info("Exporting transaction data...", { duration: 2000 })
            // TODO: Implement export functionality
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
      {/* Transactions Table */}
      <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Transactions ({transactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-slate-600 dark:text-slate-300">Transaction ID</TableHead>
                    <TableHead className="text-slate-600 dark:text-slate-300">Phone</TableHead>
                    <TableHead className="text-slate-600 dark:text-slate-300">Package</TableHead>
                    <TableHead className="text-slate-600 dark:text-slate-300">Amount</TableHead>
                    <TableHead className="text-slate-600 dark:text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-600 dark:text-slate-300">M-Pesa Ref</TableHead>
                    <TableHead className="text-slate-600 dark:text-slate-300">Timestamp</TableHead>
                    <TableHead className="text-slate-600 dark:text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm text-slate-900 dark:text-white">{transaction.id}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{transaction.phone}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{transaction.package}</TableCell>
                      <TableCell className="font-medium text-slate-900 dark:text-white">Ksh {transaction.amount}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell className="font-mono text-sm text-slate-600 dark:text-slate-400">{transaction.mpesaRef}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{transaction.timestamp}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {transaction.status === "completed" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (confirm("Are you sure you want to refund this transaction? This action cannot be undone.")) {
                                      handleRefund(transaction.id)
                                    }
                                  }}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Process Refund
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={async () => {
                                    try {
                                      const response = await apiClient.downloadReceipt(transaction.id)
                                      if (response.success && response.data) {
                                        window.open(response.data.receiptUrl, "_blank")
                                      }
                                    } catch (error) {
                                      toast.error("Failed to download receipt")
                                    }
                                  }}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download Receipt
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <Button variant="outline" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</Button>
              <span className="text-sm text-slate-600 dark:text-slate-400">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default PaymentManagement;
