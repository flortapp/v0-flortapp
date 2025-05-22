"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  className?: string
  initialDateFrom?: Date
  initialDateTo?: Date
  onUpdate?: (date: { from: Date | undefined; to: Date | undefined }) => void
}

export function DateRangePicker({ className, initialDateFrom, initialDateTo, onUpdate }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: initialDateFrom,
    to: initialDateTo,
  })

  React.useEffect(() => {
    if (onUpdate && date?.from && date?.to) {
      onUpdate(date)
    }
  }, [date, onUpdate])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Tarih seçin</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={() => {
            const today = new Date()
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            setDate({ from: weekAgo, to: today })
          }}
        >
          Son 7 Gün
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const today = new Date()
            const monthAgo = new Date()
            monthAgo.setMonth(monthAgo.getMonth() - 1)
            setDate({ from: monthAgo, to: today })
          }}
        >
          Son 30 Gün
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const today = new Date()
            const yearAgo = new Date()
            yearAgo.setFullYear(yearAgo.getFullYear() - 1)
            setDate({ from: yearAgo, to: today })
          }}
        >
          Son 1 Yıl
        </Button>
      </div>
    </div>
  )
}
