'use client'

import { cn } from '@/shared/shadcn/lib/utils'
import { useLog } from '@/shared/utilities/hooks'
import { startCase } from 'lodash'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from 'shadcn-blocks/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'shadcn-blocks/ui/card'
import { Checkbox } from 'shadcn-blocks/ui/checkbox'
import { Input } from 'shadcn-blocks/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'shadcn-blocks/ui/table'

export function Seed({ data }) {
  const states = data.map(useState)
  const tables = states.map(([state]) => state)
  const setTables = states.map(([, setState]) => setState)

  return (
    <div className="container mx-auto space-y-8 p-4">
      <Card>
        <CardHeader className="relative">
          <CardTitle>Database Seed Preview</CardTitle>
          <CardDescription>
            Review the sample data that will be used to seed the database
          </CardDescription>
          <Button className="absolute top-3 right-3">Seed Database</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {tables.map((table, i) => {
              const { columns, rows, tableName } = table
              return (
                <div key={tableName}>
                  <h3 className="mb-2 flex items-center justify-between text-lg font-semibold [&+div]:h-75">
                    <span>{startCase(tableName)}</span>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setTables[i]((state) => ({
                          ...state,
                          rows: [resetRow(columns), ...state.rows],
                        }))
                      }
                    >
                      <Plus />
                    </Button>
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow className="sticky top-0 bg-white shadow-xs hover:bg-transparent">
                        {columns.map((column) => (
                          <TableHead
                            className={cn(
                              'min-w-50 whitespace-nowrap',
                              column.type === 'boolean' && 'text-center',
                            )}
                            key={column.field}
                          >
                            {startCase(column.field)}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row, j) => {
                        const _row = row
                        return (
                          <TableRow key={j}>
                            {columns.map((column) => (
                              <TableCell
                                className="min-w-50"
                                key={column.field}
                              >
                                {column.type === 'boolean' ? (
                                  <div className="flex w-full justify-center">
                                    <Checkbox
                                      checked={_row[column.field]}
                                      onCheckedChange={(value) =>
                                        setTables[i]((state) => {
                                          const newRows = [...state.rows]
                                          newRows[j][column.field] = value
                                          return { ...state, rows: newRows }
                                        })
                                      }
                                    />
                                  </div>
                                ) : (
                                  <Input
                                    value={String(_row[column.field])}
                                    type={
                                      column.type === 'number'
                                        ? 'number'
                                        : 'text'
                                    }
                                    onChange={(event) =>
                                      setTables[i]((state) => {
                                        const newRows = [...state.rows]
                                        newRows[j][column.field] =
                                          event.target.value
                                        return { ...state, rows: newRows }
                                      })
                                    }
                                  />
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function resetRow(columns) {
  const entries = columns.map(({ field, type }) => [
    field,
    type === 'number' ? 0 : type === 'string' ? '' : false,
  ])
  return Object.fromEntries(entries)
}
