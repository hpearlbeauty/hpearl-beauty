import type { Metadata } from "next";
import { seo } from "@/content/seo";
import { BookingShell } from "@/components/booking/BookingShell";
import { getSiteContent } from "@/lib/content/resolve";

export const metadata: Metadata = {
  title: seo.book.title,
  description: seo.book.description,
  robots: { index: false, follow: true },
};

export default async function BookPage() {
  const { services } = await getSiteContent();
  return <BookingShell services={services} />;
}
