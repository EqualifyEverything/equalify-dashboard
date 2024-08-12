import { useState } from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useNavigate,
} from 'react-router-dom';
import { useToast } from '~/components/alerts/toast';
import { Button } from '~/components/buttons';
import { DangerDialog } from '~/components/dialogs';
import { PropertyForm } from '~/components/forms';
import { SEO } from '~/components/layout';
import { propertyQuery } from '~/queries/properties';
import { deleteProperty, sendToScan, updateProperty } from '~/services';
import { assertNonNull } from '~/utils/safety';
import { LoadingProperty } from './loading';

/**
 * Loader function to fetch property data
 * @param queryClient - The Query Client instance.
 * @returns Loader function to be used with React Router.
 */
export const propertyLoader =
  (queryClient: QueryClient) =>
    async ({ params }: LoaderFunctionArgs) => {
      assertNonNull(
        params.propertyId,
        'Property ID is missing in the route parameters',
      );

      const initialProperty = await queryClient.ensureQueryData(
        propertyQuery(params.propertyId),
      );
      return { initialProperty, propertyId: params.propertyId };
    };

/**
 * Handles updating a property.
 * @param queryClient - The Query Client instance.
 * @returns Action function to be used with React Router.
 */
export const updatePropertyAction =
  (queryClient: QueryClient) =>
    async ({ request, params }: ActionFunctionArgs) => {
      const toast = useToast();
      assertNonNull(params.propertyId, 'No property ID provided');

      try {
        const formData = await request.formData();
        const propertyName = formData.get('propertyName') as string;
        const propertyUrl = formData.get('propertyUrl') as string;
        const propertyDiscovery = formData.get('propertyDiscovery') as string;

        const response = await updateProperty(
          params.propertyId,
          propertyName,
          propertyUrl,
          propertyDiscovery,
        );

        await queryClient.invalidateQueries({
          queryKey: ['property', params.propertyId],
        });
        await queryClient.invalidateQueries({ queryKey: ['properties'] });

        if (response.status === 'success') {
          toast.success({ title: 'Success', description: 'Property updated successfully!' });
          return redirect(`/properties`);
        } else {
          toast.error({ title: 'Error', description: 'Failed to update property.' });
          throw new Response('Failed to update property', { status: 500 });
        }
      } catch (error) {
        toast.error({ title: 'Error', description: 'An error occurred while updating the property.' });
        throw error;
      }
    };

const EditProperty = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { initialProperty, propertyId } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof propertyLoader>>
  >;

  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { data: property, isLoading } = useQuery({
    ...propertyQuery(propertyId!),
    initialData: initialProperty,
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: () => {
      const response = deleteProperty(propertyId!);
      queryClient.refetchQueries({ queryKey: ['filters'] });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success({ title: 'Success', description: 'Property deleted successfully!' });
      navigate('/properties');
    },
    onError: () => {
      toast.error({ title: 'Error', description: 'Failed to delete property.' });
    },
  });

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'propertyName' && value.trim() !== property?.name.trim()) {
      setIsFormChanged(true);
    } else if (
      name === 'propertyUrl' &&
      value.trim() !== property?.propertyUrl.trim()
    ) {
      setIsFormChanged(true);
    } else if (name === 'propertyDiscovery' && value !== property?.discovery) {
      setIsFormChanged(true);
    } else {
      setIsFormChanged(false);
    }
  };

  const handleDeleteProperty = async () => {
    deleteMutate();
  };

  const handleSendToScan = async () => {
    setIsSending(true);
    try {
      const response = await sendToScan([propertyId!]);
      if (response.status === 'success') {
        toast.success({ title: 'Success', description: 'Property sent to scan successfully!' });
      } else {
        toast.error({ title: 'Error', description: 'Failed to send property to scan.' });
      }
    } catch (error) {
      toast.error({ title: 'Error', description: 'An error occurred while sending the property to scan.' });
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };
  return (
    <>
      <SEO
        title={`Edit ${property?.name || 'Property'} - Equalify`}
        description={`Edit the details of ${property?.name || 'this property'} on Equalify.`}
        url={`https://dashboard.equalify.app/properties/${propertyId}/edit`}
      />

      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1
          id="edit-property-heading"
          className="text-2xl font-bold md:text-3xl"
        >
          Edit {property?.name || 'Property'}
        </h1>

        <Button
          className="w-fit justify-end place-self-end bg-[#005031]"
          onClick={handleSendToScan}
          disabled={isSending}
          aria-disabled={isSending}
        >
          {isSending ? 'Sending...' : 'Send to Scan'}
        </Button>
      </div>

      <section
        aria-labelledby="edit-property-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
        aria-live="polite"
      >
        {isLoading ? (
          <LoadingProperty />
        ) : (
          <PropertyForm
            actionUrl={`/properties/${propertyId}/edit`}
            defaultValues={{
              propertyName: property?.name || '',
              propertyUrl: property?.propertyUrl || '',
              propertyDiscovery: property?.discovery || 'single',
            }}
            formId="edit-property-form"
            onChange={handleFormChange}
          />
        )}

        <div className="space-x-6">
          <Button
            variant={'outline'}
            className="w-fit"
            onClick={() => navigate('/properties')}
            aria-label="Cancel editing property"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-property-form"
            className="w-fit bg-[#1D781D] text-white"
            disabled={!isFormChanged}
            aria-disabled={!isFormChanged}
            aria-live="polite"
          >
            Update Property
          </Button>
        </div>
      </section>

      <section
        aria-labelledby="danger-zone-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
        aria-live="polite"
      >
        <h2 id="danger-zone-heading" className="text-lg text-[#cf000f]">
          Danger Zone
        </h2>

        <DangerDialog
          title="Confirm Property Deletion"
          description="Are you sure you want to delete your property? This action cannot be undone."
          onConfirm={handleDeleteProperty}
          triggerButton={
            <Button
              className="gap-2 bg-[#cf000f]"
              aria-describedby="delete-property-description"
              aria-label="Delete property"
            >
              Delete Property
              <ExclamationTriangleIcon aria-hidden />
            </Button>
          }
        />
        <p
          id="delete-property-description"
          className="mt-2 text-sm text-gray-600"
        >
          Deleting your property is irreversible. Please proceed with caution.
        </p>
      </section>
    </>
  );
};

export default EditProperty;
