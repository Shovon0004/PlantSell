import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop — PlantSell | Premium Plants, Trees & Fertilizers",
  description:
    "Browse our full collection of indoor plants, outdoor trees, fruit trees, bonsai, and organic fertilizers. Filter by category, price, and rating. Same-day delivery available.",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
