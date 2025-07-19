
'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { getStockComparison } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Loader2, BarChart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Comparing...
        </>
      ) : (
        <>
          <BarChart className="mr-2 h-4 w-4" />
          Compare Stocks
        </>
      )}
    </Button>
  );
}

export function StockComparisonForm({ initialCompany }: { initialCompany?: string }) {
  const [state, formAction] = useFormState(getStockComparison, initialState);
  const [companies, setCompanies] = useState<string[]>(initialCompany ? [initialCompany, ''] : ['']);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "Comparison Failed",
        description: state.message,
      });
    }
  }, [state, toast]);

  const handleAddCompany = () => {
    setCompanies([...companies, '']);
  };

  const handleRemoveCompany = (index: number) => {
    if (companies.length > 1) {
      const newCompanies = companies.filter((_, i) => i !== index);
      setCompanies(newCompanies);
    }
  };

  const handleCompanyChange = (index: number, value: string) => {
    const newCompanies = [...companies];
    newCompanies[index] = value;
    setCompanies(newCompanies);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare Stock Prices</CardTitle>
        <CardDescription>Add competitor company names to compare their stock performance side-by-side.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            {companies.map((company, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  name="companyNames[]"
                  placeholder="e.g., 'Google', 'Apple'"
                  value={company}
                  onChange={(e) => handleCompanyChange(index, e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCompany(index)}
                  disabled={companies.length <= 1}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleAddCompany}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Company
          </Button>
          <SubmitButton />
          {state?.error && <p className="text-sm text-destructive mt-2">{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
