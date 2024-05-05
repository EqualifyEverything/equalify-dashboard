import { useNavigate } from 'react-router-dom';

import { Button } from '~/components/buttons';
import { PropertyForm } from '~/components/forms';
import * as API from "aws-amplify/api";

const AddProperty = () => {
  const navigate = useNavigate();
  const addProperty = async (values) => {
    const response = await (await API.post({
      apiName: 'auth', path: '/add/properties', options: {
        body: {
          propertyName: values.propertyName,
          sitemapUrl: values.sitemapUrl,
          propertyDiscovery: 'manually_added',
        }
      }
    }).response).body.json();
    if (response?.result) {
      navigate(`/properties/${response?.result}`)
    }
  }
  return (
    <>
      <h1 id="add-property-heading" className="text-2xl font-bold md:text-3xl">
        Add New Property
      </h1>

      <section
        aria-labelledby="add-property-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
      >
        <PropertyForm
          onSubmit={addProperty}
          defaultValues={{ propertyName: '', sitemapUrl: '' }}
          formId="add-property-form"
        />

        <div className="space-x-6">
          <Button
            type="submit"
            form="add-property-form"
            className="w-fit bg-[#1D781D] text-white"
          >
            Add Property
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
    </>
  );
};

export default AddProperty;
