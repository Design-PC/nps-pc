import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pesquisa de Satisfação Prime Control",
  description: "Plataforma NPS corporativa Prime Control",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  return (
    <html lang="pt-BR">
      <body>
        {children}
        {clarityProjectId ? (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityProjectId}");
            `}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
