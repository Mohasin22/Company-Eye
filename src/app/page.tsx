import { CompanyAnalysisClient } from '@/components/company-analysis-client';
import { Bot } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container mx-auto flex items-center gap-3 px-4">
          <Bot className="w-8 h-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary tracking-tight">
            Company Eye
          </h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8">
        <CompanyAnalysisClient />
      </main>

      <footer className="p-4 border-t text-center text-sm text-muted-foreground">
        <p>Powered by AI. Built for smarter analysis.</p>
      </footer>
    </div>
  );
}
