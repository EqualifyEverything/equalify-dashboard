import { useState } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { ActionFunctionArgs, redirect, useNavigate } from 'react-router-dom';
import { toast } from '~/components/alerts';

import { Button } from '~/components/buttons';
import { PropertyForm } from '~/components/forms';
import { SEO } from '~/components/layout';
import { addProperty } from '~/services';

/**
 * Handles adding a new property.
 * @param queryClient - The Query Client instance.
 * @returns Action function to be used with React Router.
 */
export const bulkPropertyAction =
    (queryClient: QueryClient) =>
        async ({ request }: ActionFunctionArgs) => {
            try {
                const formData = await request.formData();
                const propertyName = formData.get('propertyName') as string;
                const propertyUrl = formData.get('propertyUrl') as string;
                const propertyDiscovery = formData.get('propertyDiscovery') as
                    | 'single'
                    | 'sitemap'
                    | 'discovery_process';

                const response = await addProperty(
                    propertyName,
                    propertyUrl,
                    propertyDiscovery,
                );

                await queryClient.invalidateQueries({ queryKey: ['properties'] });

                if (response.status === 'success') {
                    toast.success({ title: 'Success', description: 'Property added successfully!' });
                    return redirect(`/properties`);
                } else {
                    toast.error({ title: 'Error', description: 'Failed to add property.' });
                    throw new Response('Failed to add property', { status: 500 });
                }
            } catch (error) {
                toast.error({ title: 'Error', description: 'An error occurred while adding the property.' });
                throw error;
            }
        };

const BulkProperty = () => {
    const navigate = useNavigate();
    const [isFormValid, setIsFormValid] = useState(false);

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const form = event.currentTarget.closest('form');
        const propertyName = form?.elements.namedItem(
            'propertyName',
        ) as HTMLInputElement;
        const propertyUrl = form?.elements.namedItem(
            'propertyUrl',
        ) as HTMLInputElement;

        if (propertyName && propertyUrl) {
            const isFormValid =
                propertyName.value.trim() !== '' && propertyUrl.value.trim() !== '';
            setIsFormValid(isFormValid);
        }
    };

    return (
        <>
            <SEO
                title="Add Property - Equalify"
                description="Add a new property to Equalify to start monitoring and improving its accessibility."
                url="https://dashboard.equalify.app/properties/add"
            />
            <h1 id="add-property-heading" className="text-2xl font-bold md:text-3xl">
                Bulk Upload CSV
            </h1>

            <section
                aria-labelledby="add-property-heading"
                className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
                aria-live="polite"
            >
                <div className='flex flex-col gap-4'>
                    <a target='_blank' className='underline' href='/template.csv'>Example Template CSV</a>
                    <input type='file' />
                </div>
                <div className="space-x-6">
                    <Button
                        variant={'outline'}
                        className="w-fit"
                        onClick={() => navigate(-1)}
                        aria-label='Cancel adding property'
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
                        Preview
                    </Button>
                </div>
            </section>
        </>
    );
};

export default BulkProperty;
