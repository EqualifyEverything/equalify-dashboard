import { useState } from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '~/components/buttons';
import { DangerDialog } from '~/components/dialogs';
import {PropertyForm} from '~/components/forms'; 
import { usePropertyDetails } from '~/graphql/hooks/useProperties'; 

const EditProperty = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams<{ propertyId: string }>(); 
  const { data: propertyDetails, error, isLoading } = usePropertyDetails(propertyId || '');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteProperty = async () => {
    setIsDeleteDialogOpen(false);
    console.log(`Deleting property: ${propertyId}`);
  };

  const handleSubmit = async (values: { propertyName: string; siteMapURL: string }) => {
    console.log('Updating property:', values);
  };

  if (isLoading) return <p>Loading property details...</p>;
  if (error) return <p>Error loading property details</p>;

  return (
    <>
      <h1 id="edit-property-heading" className="text-2xl font-bold md:text-3xl">
        Edit {propertyDetails?.name || 'Property'}
      </h1>

      <section
        aria-labelledby="edit-property-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
      >
        <PropertyForm
          onSubmit={handleSubmit}
          defaultValues={{ propertyName: propertyDetails?.name || '', siteMapURL: propertyDetails?.sitemapUrl || '' }}
          formId="edit-property-form"
        />

        <div className="space-x-6">
          <Button
            type="submit"
            form="edit-property-form"
            className="w-fit bg-[#1D781D] text-white"
          >
            Update Property
          </Button>
          <Button
            variant={'outline'}
            className="w-fit"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </section>

      <section
        aria-labelledby="danger-zone-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
      >
        <h2 id="danger-zone-heading" className="text-lg text-[#cf000f]">
          Danger Zone
        </h2>

        <Button
          onClick={() => setIsDeleteDialogOpen(true)}
          className="gap-2 bg-[#cf000f]"
          aria-describedby="delete-property-description"
        >
          Delete Property
          <ExclamationTriangleIcon aria-hidden />
        </Button>
        <p
          id="delete-property-description"
          className="mt-2 text-sm text-gray-600"
        >
          Deleting your property is irreversible. Please proceed with caution.
        </p>

        {isDeleteDialogOpen && (
          <DangerDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteProperty}
            title="Confirm Property Deletion"
            description="Are you sure you want to delete your property? This action cannot be undone."
          />
        )}
      </section>
    </>
  );
};

export default EditProperty;
