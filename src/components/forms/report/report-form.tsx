import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSubmit } from 'react-router-dom';
import { z } from 'zod';

import { Input } from '~/components/inputs';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as HookFormProvider,
} from '..';
import ReportFilter from './report-filter';

const ReportSchema = z.object({
  reportName: z.string().min(1, 'Please enter a report name.'),
  filters: z.any(),
});

type ReportFormInputs = z.infer<typeof ReportSchema>;

interface ReportFormProps {
  actionUrl: string;
  defaultValues: ReportFormInputs;
  formId: 'create-report-form' | 'edit-report-form';
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  actionUrl,
  defaultValues,
  formId,
  onChange,
}) => {
  const submit = useSubmit();
  const form = useForm<ReportFormInputs>({
    resolver: zodResolver(ReportSchema),
    defaultValues,
  });

  return (
    <HookFormProvider {...form}>
      <form
        method="post"
        action={actionUrl}
        onSubmit={(event) => {
          const target = event.currentTarget;
          form.handleSubmit(() => {
            submit(target, { method: 'post' });
          })(event);
        }}
        id={formId}
      >
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
                  className="h-12 bg-white"
                  {...field}
                  onChange={(event) => {
                    field.onChange(event);
                    onChange && onChange(event);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ReportFilter
          defaultFilters={defaultValues?.filters}
          onChange={() => onChange({ target: { name: 'filters' } })}
        />
      </form>
    </HookFormProvider>
  );
};

export default ReportForm;
