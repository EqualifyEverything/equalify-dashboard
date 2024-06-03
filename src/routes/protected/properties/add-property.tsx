import { useState } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { ActionFunctionArgs, redirect, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '~/components/buttons';
import { PropertyForm } from '~/components/forms';
import { SEO } from '~/components/layout';
import { addProperty } from '~/services';

/**
 * Handles adding a new property.
 * @param queryClient - The Query Client instance.
 * @returns Action function to be used with React Router.
 */
export const addPropertyAction =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    try {
      const formData = await request.formData();
      const propertyName = formData.get('propertyName') as string;
      const sitemapUrl = formData.get('sitemapUrl') as string;
      const propertyDiscovery = formData.get('propertyDiscovery') as
        | 'manually_added'
        | 'single_page_import';

      const response = await addProperty(
        propertyName,
        sitemapUrl,
        propertyDiscovery,
      );

      await queryClient.invalidateQueries({ queryKey: ['properties'] });

      if (response.status === 'success') {
        toast.success('Property added successfully!');
        return redirect(`/properties`);
      } else {
        toast.error('Failed to add property.');
        throw new Response('Failed to add property', { status: 500 });
      }
    } catch (error) {
      toast.error('An error occurred while adding the property.');
      throw error;
    }
  };

const AddProperty = () => {
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const form = event.currentTarget.closest('form');
    const propertyName = form?.elements.namedItem(
      'propertyName',
    ) as HTMLInputElement;
    const sitemapUrl = form?.elements.namedItem(
      'sitemapUrl',
    ) as HTMLInputElement;

    if (propertyName && sitemapUrl) {
      const isFormValid =
        propertyName.value.trim() !== '' && sitemapUrl.value.trim() !== '';
      setIsFormValid(isFormValid);
    }
  };

  return (
    <>
      <SEO
        title="Add Property - Equalify"
        description="Add a new property to Equalify to start monitoring and improving its accessibility."
        url="https://www.equalify.dev/properties/add"
      />
      <h1 id="add-property-heading" className="text-2xl font-bold md:text-3xl">
        Add New Property
      </h1>

      <section
        aria-labelledby="add-property-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
        aria-live="polite"
      >
        <PropertyForm
          actionUrl="/properties/add"
          defaultValues={{
            propertyName: '',
            sitemapUrl: '',
            propertyDiscovery: 'manually_added',
          }}
          formId="add-property-form"
          onChange={handleFormChange}
        />

        <div className="space-x-6">
          <Button
            variant={'outline'}
            className="w-fit"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-property-form"
            className="w-fit bg-[#1D781D] text-white"
            disabled={!isFormValid}
            aria-disabled={!isFormValid}
            aria-live="polite"
          >
            Add Property
          </Button>
        </div>
      </section>
    </>
  );
};

export default AddProperty;
