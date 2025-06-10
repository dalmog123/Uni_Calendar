import React from "react"
import Table from "@uiw/react-table"
import type { TableColumns } from "@uiw/react-table"

interface CalculationCell {
  value: string | number
  formula?: string
  isHeader?: boolean
}

interface CalculationCanvasProps {
  data: CalculationCell[][]
  title?: string
}

interface RowData {
  id: string
  [key: string]: CalculationCell | string
}

export function CalculationCanvas({ data, title }: CalculationCanvasProps) {
  // Add row numbers column
  const rowNumbers: TableColumns<RowData> = {
    title: "",
    key: "rowNum",
    width: 32,
    render: (_: string, __: string, ___: RowData, rowIndex: number) => (
      <div className="py-0.5 px-1 text-center text-xs text-slate-500">{rowIndex + 1}</div>
    ),
  }

  const columns: TableColumns<RowData>[] = [
    rowNumbers,
    ...(data[0]?.map((_, index) => ({
      title: String.fromCharCode(65 + index), // Excel-like column headers (A, B, C, etc.)
      key: String(index),
      width: 100,
      render: (_: string, __: string, rowData: RowData) => {
        const cell = rowData[String(index)] as CalculationCell
        const rowIndex = parseInt(rowData.id)
        const cellRef = `${String.fromCharCode(65 + index)}${rowIndex + 1}`
        return (
          <div className="py-0.5 px-1 border-r border-slate-100 min-w-[80px] md:min-w-[100px] max-w-[200px]">
            <div className="font-medium font-mono text-xs md:text-sm break-words">{cell.value}</div>
            {cell.formula && (
              <div className="text-[10px] md:text-xs text-slate-500 mt-0.5 font-mono bg-slate-50 py-0.5 px-1 rounded break-words">
                <span className="text-blue-500">{cellRef}</span>: {cell.formula}
              </div>
            )}
          </div>
        )
      },
    })) || [])
  ]

  const rows: RowData[] = data.map((row, i) => ({
    id: i.toString(),
    ...Object.fromEntries(row.map((cell, j) => [j.toString(), cell])),
  }))

  return (
    <div className="-mx-3 md:mx-0 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
      {title && (
        <h3 className="mb-2 text-sm md:text-base font-semibold text-slate-800 px-2">{title}</h3>
      )}
      <div className="overflow-x-auto -mx-2">
        <div className="min-w-full p-2">
          <Table
            columns={columns}
            data={rows}
            className="w-full table-auto"
          />
        </div>
      </div>
    </div>
  )
}
