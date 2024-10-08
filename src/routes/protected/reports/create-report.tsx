import { useEffect, useState } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { ActionFunctionArgs, redirect, useActionData, useNavigate } from 'react-router-dom';
import { toast } from '~/components/alerts';

import { Button } from '~/components/buttons';
import { ReportForm } from '~/components/forms';
import { SEO } from '~/components/layout';
import { addReport } from '~/services';
import { useStore } from '~/store';
import { assertNonNull } from '~/utils/safety';

/**
 * Handles creating a new report.
 * @param queryClient - The Query Client instance.
 * @returns Action function to be used with React Router.
 */
export const createReportAction =
  (queryClient: QueryClient) =>
    async ({ request }: ActionFunctionArgs) => {
      try {
        const formData = await request.formData();
        const reportName = formData.get('reportName');

        assertNonNull(reportName, 'reportName is required');

        const selectedFilters = useStore.getState().selectedFilters;

        if (!selectedFilters.some((filter) => ['properties', 'urls'].includes(filter.type))) {
          return { error: 'Please add at least one property and/or URL filter.' };
        }

        const response = await addReport(reportName.toString(), selectedFilters);
        await queryClient.invalidateQueries({ queryKey: ['reports'] });

        if (response.status === 'success') {
          toast.success({ title: 'Success', description: 'Report created successfully' });
          return redirect('/reports');
        } else {
          toast.error({ title: 'Error', description: 'Failed to create report' });
          throw new Error('Failed to create report');
        }
      } catch (error) {
        toast.error({ title: 'Error', description: 'An error occurred while creating the report.' });
        throw error;
      }
    };

const CreateReport = () => {
  const navigate = useNavigate();
  const actionData = useActionData();
  const [isFormValid, setIsFormValid] = useState(false);
  const selectedFilters = useStore((state) => state.selectedFilters);

  useEffect(() => {
    setIsFormValid(selectedFilters.length > 0);
  }, [selectedFilters]);

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    if ('currentTarget' in event) {
      const form = event.currentTarget.closest('form');
      const reportName = form?.elements.namedItem('reportName') as HTMLInputElement;

      if (reportName) {
        const isFormValid = reportName.value.trim() !== '';
        setIsFormValid(isFormValid && selectedFilters.length > 0);
      }
    }
  };

  return (
    <>
      <SEO
        title="Create Report - Equalify"
        description="Create a new accessibility report on Equalify to start analyzing and improving your website's accessibility."
        url="https://dashboard.equalify.app/reports/create"
      />
      <h1 id="create-report-heading" className="text-2xl font-bold md:text-3xl">
        Create a New Report
      </h1>

      <section
        aria-labelledby="create-report-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
        aria-live="polite"
      >
        <ReportForm
          actionUrl="/reports/create"
          defaultValues={{ reportName: '' }}
          formId="create-report-form"
          onChange={handleFormChange}
          onFilterChange={() => setIsFormValid(selectedFilters.some((filter) => ['properties', 'urls'].includes(filter.type)))}
          error={actionData?.error}
        />

        <div className="space-x-6">
          <Button
            variant={'outline'}
            className="w-fit"
            onClick={() => navigate(-1)}
            aria-label="Cancel creating report"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-report-form"
            className="w-fit bg-[#1D781D] text-white"
            disabled={!isFormValid}
            aria-disabled={!isFormValid}
            aria-live="polite"
            aria-label="Create report"
          >
            Create Report
          </Button>
        </div>
      </section>
    </>
  );
};

export default CreateReport;
