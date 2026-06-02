import {
  DM_Sans,
  Playfair_Display,
  Sofadi_One,
  Nunito,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const sofadi = Sofadi_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sofadi",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sofadi.variable} ${nunito.variable} ${dmSans.variable}`}
    >
      <body className="font-dm-sans antialiased">
        {children}
      </body>
    </html>
  );
}