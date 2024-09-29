import './globals.css';
import SessionProviderWrapper from '@/app/providers/SessionProviderWrapper'; // Adjust the import if necessary
import '@/cron-jobs/messageScheduler'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
