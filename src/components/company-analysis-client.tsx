'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { getCompanyAnalysis, type FormState } from '@/app/actions';
import { useToast } from "@/hooks/use-toast"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Telescope } from 'lucide-react';
import { InsightsDashboard } from './insights-dashboard';
import { LoadingSkeleton } from './loading-skeleton';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Search className="mr-2 h-4 w-4" />
          Analyze
        </>
      )}
    </Button>
  );
}

export function CompanyAnalysisClient() {
  const [state, formAction] = useFormState(getCompanyAnalysis, initialState);
  const { pending } = useFormStatus();
  const { toast } = useToast();

  useEffect(() => {
    if (state.error && state.message) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">
          Uncover Company Insights with AI
        </h2>
        <p className="mt-4 text-muted-foreground md:text-xl">
          Enter the name of a software company to generate a report on public sentiment, trends, and key aspects.
        </p>
      </div>

      <form action={formAction} className="max-w-xl mx-auto space-y-4 md:flex md:space-y-0 md:space-x-4 md:items-start">
        <div className="flex-1">
          <Input
            name="companyName"
            placeholder="e.g., 'OpenAI', 'Vercel', 'Microsoft'"
            className="h-12 text-base"
            required
            disabled={pending}
          />
           {state.error && !state.analysis && <p className="text-sm text-destructive mt-2">{state.message}</p>}
        </div>
        <SubmitButton />
      </form>

      <div className="mt-12">
        {pending && <LoadingSkeleton />}
        {!pending && state.analysis && <InsightsDashboard analysis={state.analysis} comparisonAnalysis={state.comparisonAnalysis} />}
        {!pending && !state.analysis && (
          <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
            <Telescope className="mx-auto h-12 w-12" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">Waiting for analysis</h3>
            <p className="mt-2 text-sm">Your company insights will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
