import localFont from "next/font/local";
import "./globals.css";
import Provider from "./context/Provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Live like everyone else",
  description:
    "Une plateforme spécialement conçue pour les personnes ayant une mobilité réduite ou autre type de handicap.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <Provider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </Provider>
    </html>
  );
}
