import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input, Select } from '~/components/inputs';
import {
  Form as HookFormProvider,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '.';
import { useSubmit } from 'react-router-dom';

const PropertySchema = z.object({
  propertyName: z.string().min(1, 'Please enter a Property name.'),
  propertyUrl: z.string().url('Please enter a valid URL.'),
  propertyDiscovery: z.enum(['single', 'sitemap', 'discovery_process']),
});

type PropertyFormInputs = z.infer<typeof PropertySchema>;

interface PropertyFormProps {
  actionUrl: string;
  defaultValues: PropertyFormInputs;
  formId: 'add-property-form' | 'edit-property-form';
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  actionUrl,
  defaultValues,
  formId,
  onChange,
}) => {
  const submit = useSubmit();
  const form = useForm<PropertyFormInputs>({
    resolver: zodResolver(PropertySchema),
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
            submit(target, { method: 'post' })

          })(event)
        }}
        id={formId}
        className="flex flex-col gap-4 md:flex-row"
      >
        <FormField
          control={form.control}
          name="propertyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="propertyName">Property Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="propertyName"
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
        <FormField
          control={form.control}
          name="propertyUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="propertyUrl">URL</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="propertyUrl"
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
        <FormField
          control={form.control}
          name="propertyDiscovery"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="propertyDiscovery">Property Discovery</FormLabel>
              <FormControl>
                <select
                  id="propertyDiscovery"
                  className="h-12 bg-white border-[1px] rounded-lg px-2"
                  {...field}
                  onChange={(event) => {
                    field.onChange(event);
                    onChange && onChange(event);
                  }}>
                  {[
                    { label: 'Single', value: 'single' },
                    { label: 'Sitemap', value: 'sitemap' },
                  ].map((obj, index) => <option key={index} value={obj.value}>{obj.label}</option>)}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </HookFormProvider>
  );
};

export default PropertyForm;
