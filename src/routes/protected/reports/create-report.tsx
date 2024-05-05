import { useNavigate } from 'react-router-dom';

import { Button } from '~/components/buttons';
import { ReportForm } from '~/components/forms';

const CreateReport = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1 id="create-report-heading" className="text-2xl font-bold md:text-3xl">
        Create a New Report
      </h1>

      <section
        aria-labelledby="create-report-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
      >
        <ReportForm
          onSubmit={(values) => console.log(values)}
          defaultValues={{ reportName: '' }}
          formId="create-report-form"
        />

        <div className="space-x-6">
          <Button
            type="submit"
            form="create-report-form"
            className="w-fit bg-[#1D781D] text-white"
            disabled
          >
            Create Report
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

export default CreateReport;
