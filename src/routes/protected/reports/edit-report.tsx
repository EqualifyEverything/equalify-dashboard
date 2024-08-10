import { useEffect, useState } from 'react';
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
  useActionData,
  useLoaderData,
  useNavigate,
} from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '~/components/buttons';
import { DangerDialog } from '~/components/dialogs';
import { ReportForm } from '~/components/forms';
import { SEO } from '~/components/layout';
import { reportQuery } from '~/queries/reports';
import { deleteReport, updateReport } from '~/services';
import { assertNonNull } from '~/utils/safety';
import { useStore } from '~/store';

/**
 * Loader function to fetch report data
 * @param queryClient - The Query Client instance.
 * @returns Loader function to be used with React Router.
 */
export const reportLoader =
  (queryClient: QueryClient) =>
    async ({ params }: LoaderFunctionArgs) => {
      assertNonNull(
        params.reportId,
        'Report ID is missing in the route parameters',
      );

      const initialReport = await queryClient.ensureQueryData(
        reportQuery(params.reportId),
      );
      return { initialReport, reportId: params.reportId };
    };

/**
 * Handles updating a report.
 * @param queryClient - The Query Client instance.
 * @returns Action function to be used with React Router.
 */
export const updateReportAction =
  (queryClient: QueryClient) =>
    async ({ params, request }: ActionFunctionArgs) => {
      try {
        assertNonNull(params.reportId, 'reportId is required');

        const formData = await request.formData();
        const reportName = formData.get('reportName');

        assertNonNull(reportName, 'reportName is required');
        const selectedFilters = useStore.getState().selectedFilters;

        if (!selectedFilters.some((filter) => ['properties', 'urls'].includes(filter.type))) {
          return { error: 'Please add at least one property and/or URL filter.' };
        }

        const response = await updateReport(
          params.reportId,
          reportName.toString(),
          selectedFilters,
        );
        await queryClient.invalidateQueries({
          queryKey: ['report', params.reportId],
        });
        await queryClient.invalidateQueries({ queryKey: ['reports'] });

        if (response.status === 'success') {
          toast.success('Report updated successfully');
          return redirect(`/reports/${params.reportId}`);
        } else {
          toast.error('Failed to update report');
          throw new Error('Failed to update report');
        }
      } catch (error) {
        console.log(error);
        toast.error('An error occurred while updating the report.');
        throw error;
      }
    };

const EditReport = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { initialReport, reportId } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof reportLoader>>
  >;

  const actionData = useActionData();

  const [isFormChanged, setIsFormChanged] = useState(false);
  const selectedFilters = useStore((state) => state.selectedFilters);
  const [isFormValid, setIsFormValid] = useState(false);


  useEffect(() => {
    setIsFormValid(selectedFilters.some(filter => ['properties', 'urls'].includes(filter.type)));
  }, [selectedFilters]);

  const { data: report } = useQuery({
    ...reportQuery(reportId!),
    initialData: initialReport,
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: () => deleteReport(reportId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report deleted successfully!');
      navigate('/reports');
    },
    onError: () => {
      toast.error('Failed to delete report.');
    },
  });

  const handleFormChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } },
  ) => {
    const { name, value } = event.target;
    if (name === 'reportName' && value.trim() !== report?.name.trim()) {
      setIsFormChanged(true);
    } else if (name === 'filters') {
      setIsFormChanged(true);
    } else {
      setIsFormChanged(false);
    }
  };

  const handleDeleteReport = async () => {
    deleteMutate();
  };

  return (
    <>
      <SEO
        title={`Edit ${report?.name || 'Report'} - Equalify`}
        description={`Edit the details of ${report?.name || 'this report'} on Equalify.`}
        url={`https://dashboard.equalify.app/reports/${reportId}/edit`}
      />
      <h1 id="edit-report-heading" className="text-2xl font-bold md:text-3xl">
        Edit {report?.name || 'Report'}
      </h1>

      <section
        aria-labelledby="edit-report-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
        aria-live="polite"
      >
        <ReportForm
          actionUrl={`/reports/${reportId}/edit`}
          defaultValues={{
            reportName: report?.name || '',
            filters: report?.filters || [],
          }}
          formId="edit-report-form"
          onChange={handleFormChange}
          onFilterChange={() => setIsFormChanged(true)}
          error={actionData?.error}
        />

        <div className="space-x-6">
          <Button
            variant={'outline'}
            className="w-fit"
            onClick={() => navigate(-1)}
            aria-label="Cancel editing report"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-report-form"
            className="w-fit bg-[#1D781D] text-white"
            disabled={!isFormChanged || !isFormValid}
            aria-disabled={!isFormChanged || !isFormValid}
            aria-live="polite"
            aria-label="Update report"
          >
            Update Report
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
          title="Confirm Report Deletion"
          description="Are you sure you want to delete your report? This action cannot be undone."
          onConfirm={handleDeleteReport}
          triggerButton={
            <Button
              className="gap-2 bg-[#cf000f]"
              aria-describedby="delete-report-description"
              aria-label="Delete report"
            >
              Delete Report
              <ExclamationTriangleIcon aria-hidden />
            </Button>
          }
        />
        <p
          id="delete-report-description"
          className="mt-2 text-sm text-gray-600"
        >
          Deleting your report is irreversible. Please proceed with caution.
        </p>
      </section>
    </>
  );
};

export default EditReport;
