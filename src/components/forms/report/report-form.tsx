import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '~/components/inputs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '..';
import ReportFilter from './report-filter';

const ReportSchema = z.object({
  reportName: z.string().min(1, 'Please enter a report name.'),
});

type ReportFormInputs = z.infer<typeof ReportSchema>;

interface ReportFormProps {
  onSubmit: (values: ReportFormInputs) => void;
  defaultValues: ReportFormInputs;
  formId: 'create-report-form' | 'edit-report-form';
}

const ReportForm: React.FC<ReportFormProps> = ({
  onSubmit,
  defaultValues,
  formId,
}) => {
  const form = useForm<ReportFormInputs>({
    resolver: zodResolver(ReportSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id={formId}>
        <FormField
          control={form.control}
          name="reportName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="reportName">Report Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="reportName"
                  placeholder="E.g. Accessibility Report"
                  className="h-12 bg-white"
                  disabled
                  aria-readonly
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ReportFilter />
      </form>
    </Form>
  );
};

export default ReportForm;
