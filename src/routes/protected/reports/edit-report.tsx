import { useState } from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';

import { Button } from '~/components/buttons';
import { DangerDialog } from '~/components/dialogs';
import { ReportForm } from '~/components/forms';

const EditReport = () => {
  const navigate = useNavigate();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteReport = async () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <h1 id="edit-report-heading" className="text-2xl font-bold md:text-3xl">
        Edit {'< Report Name >'}
      </h1>

      <section
        aria-labelledby="edit-report-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
      >
        <ReportForm
          onSubmit={(values) => console.log(values)}
          defaultValues={{ reportName: '' }}
          formId="edit-report-form"
        />

        <div className="space-x-6">
          <Button
            type="submit"
            form="edit-report-form"
            className="w-fit bg-[#1D781D] text-white"
            disabled
          >
            Update Report
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
          aria-describedby="delete-report-description"
        >
          Delete Report
          <ExclamationTriangleIcon aria-hidden />
        </Button>
        <p
          id="delete-report-description"
          className="mt-2 text-sm text-gray-600"
        >
          Deleting your report is irreversible. Please proceed with caution.
        </p>

        {isDeleteDialogOpen && (
          <DangerDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteReport}
            title="Confirm Report Deletion"
            description="Are you sure you want to delete your report? This action cannot be undone."
          />
        )}
      </section>
    </>
  );
};

export default EditReport;
