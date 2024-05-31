import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '~/components/inputs';
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
  sitemapUrl: z.string().url('Please enter a valid URL.'),
  propertyDiscovery: z.enum(['manually_added', 'single_page_import']),
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
          form.handleSubmit(()=> {
            submit(target, {method: 'post'})

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
                  placeholder="E.g. Accessibility Property"
                  className="h-12 bg-white"
                  aria-readonly
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
          name="sitemapUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="sitemapUrl">Sitemap URL</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="sitemapUrl"
                  placeholder="E.g. https://example.com/sitemap.xml"
                  className="h-12 bg-white"
                  aria-readonly
                  {...field}
                  onChange={(event) => {
                    field.onChange(event);
                    onChange && onChange(event);
                  }} 
                />
              </FormControl>
              <FormDescription>
                Sitemaps must follow valid XML Sitemap schema.
                Example:"https://equalify.app/sitemap.xml"
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Input type='hidden' value='manually_added' {...form.register('propertyDiscovery')} />
      </form>
    </HookFormProvider>
  );
};

export default PropertyForm;
