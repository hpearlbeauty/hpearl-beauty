import type { Metadata } from "next";
import { seo } from "@/content/seo";
import { BookingShell } from "@/components/booking/BookingShell";

export const metadata: Metadata = {
  title: seo.book.title,
  description: seo.book.description,
  robots: { index: false, follow: true },
};

export default function BookPage() {
  return <BookingShell />;
}
