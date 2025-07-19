'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { getStockComparison, type ComparisonFormState } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';
import { StockComparisonTable } from './stock-comparison-table';

const initialState: ComparisonFormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Comparing...
        </>
      ) : (
        <>
          <Search className="mr-2 h-4 w-4" />
          Compare Stocks
        </>
      )}
    </Button>
  );
}

export function StockComparisonForm() {
  const [state, formAction] = useFormState(getStockComparison, initialState);
  const { pending } = useFormStatus();
  const { toast } = useToast();

  useEffect(() => {
    if (state.error && state.message) {
      toast({
        variant: "destructive",
        title: "Comparison Failed",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Comparison</CardTitle>
        <CardDescription>Compare the stock performance with other companies. Enter comma-separated names.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="space-y-4 md:flex md:space-y-0 md:space-x-4 md:items-start">
          <div className="flex-1">
            <Input
              name="companyNames"
              placeholder="e.g., 'Apple, Google, Amazon'"
              className="h-12 text-base"
              required
              disabled={pending}
            />
            {state.error && !state.comparison && <p className="text-sm text-destructive mt-2">{state.message}</p>}
          </div>
          <SubmitButton />
        </form>
        {state.comparison && <StockComparisonTable stocks={state.comparison} />}
      </CardContent>
    </Card>
  );
}
