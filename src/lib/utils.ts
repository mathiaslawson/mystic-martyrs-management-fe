import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// export function formatDate(date: string): string {
//   return format(new Date(date), "MMM dd, yyyy");
// }

interface Record {
  attendance_id: string;
  member_id: string;
  cell_id: string;
  date: string;
  is_present: boolean;
  remarks: string;
  member: {
    firstname: string;
    lastname: string;
  };
  cell: {
    cell_name: string;
  };
}

export function filterByWeek(
  date: Date,
  records: Record[]
) {
  const start = startOfWeek(date);
  const end = endOfWeek(date);
  return records.filter((record) =>
    isWithinInterval(new Date(record.date), { start, end })
  );
}

export function filterByMonth(
  date: Date,
  records: Record[]
) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return records.filter((record) =>
    isWithinInterval(new Date(record.date), { start, end })
  );
}
