import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '~/components/inputs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '.';

const PropertySchema = z.object({
  propertyName: z.string().min(1, 'Please enter a Property name.'),
  siteMapURL: z.string().url('Please enter a valid URL.'),
});

type PropertyFormInputs = z.infer<typeof PropertySchema>;

interface PropertyFormProps {
  onSubmit: (values: PropertyFormInputs) => void;
  defaultValues: PropertyFormInputs;
  formId: 'add-property-form' | 'edit-property-form';
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  onSubmit,
  defaultValues,
  formId,
}) => {
  const form = useForm<PropertyFormInputs>({
    resolver: zodResolver(PropertySchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
                  disabled
                  aria-readonly
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="siteMapURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="siteMapURL">Sitemap URL</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="siteMapURL"
                  placeholder="E.g. https://example.com/sitemap.xml"
                  className="h-12 bg-white"
                  disabled
                  aria-readonly
                  {...field}
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
      </form>
    </Form>
  );
};

export default PropertyForm;
