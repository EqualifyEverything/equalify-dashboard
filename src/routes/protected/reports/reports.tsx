import React from 'react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { Link, useLoaderData } from 'react-router-dom';

import { SEO } from '~/components/layout';
import { reportsQuery } from '~/queries/reports';
import LoadingReport from './loading-report';

export const reportsLoader = (queryClient: QueryClient) => async () => {
  const initialReports = await queryClient.ensureQueryData(reportsQuery());
  return { initialReports };
};

interface Report {
  id: string;
  name: string;
  //activeIssues: number;
  //mostCommonIssue: string;
}
const ReportCard: React.FC<Report> = ({
  id,
  name,
  //activeIssues,
  //mostCommonIssue,
}) => (
  <article
    aria-labelledby={`report-title-${id}`}
    className="rounded-lg bg-white p-4 shadow"
  >
    <h2 id={`report-title-${id}`} className="text-lg">
      {name}
    </h2>
    <div className="mt-2 flex flex-col justify-between gap-3">
      <div className="min-w-0">
        {/*  <p className="mt-2 text-sm text-gray-600">
          Active Issues: {activeIssues}
        </p>
        
        <p className="mt-1 text-sm text-gray-500">
          Most Common:
          <div className="h-16 overflow-hidden overflow-ellipsis">
            <p title={mostCommonIssue}>{mostCommonIssue}</p>
          </div>
        </p>
         */}
      </div>
      <Link
        to={`/reports/${id}`}
        className="inline-flex h-9 justify-center whitespace-nowrap rounded-md bg-[#663808] px-4 py-2 text-sm  text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2"
        aria-label={`View Report: ${name}`}
      >
        View Report
      </Link>
    </div>
  </article>
);

const Reports = () => {
  const { initialReports } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof reportsLoader>>
  >;
  const {
    data: reports,
    isLoading,
    error,
  } = useQuery({
    ...reportsQuery(),
    initialData: initialReports,
  });

  if (error) return <p role="alert">Error loading reports</p>;

  return (
    <>
      <SEO
        title="Reports - Equalify"
        description="View and manage your accessibility reports on Equalify."
        url="https://dashboard.equalify.app/reports"
      />
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1
          className="text-2xl font-bold md:text-3xl"
          id="reports-list-heading"
        >
          Reports
        </h1>
        {reports.length > 0 && (
          <Link
            to="/reports/create"
            className="inline-flex h-9 items-center justify-end place-self-end whitespace-nowrap  rounded-md bg-[#005031] px-4 py-3 text-base text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 max-sm:w-fit max-sm:px-3 max-sm:py-2.5"
            aria-label="Create a new report"
          >
            Create Report
          </Link>
        )}
      </div>
      {isLoading ? (
        <section
          aria-labelledby="reports-list-heading"
          className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <LoadingReport key={index} />
          ))}
        </section>
      ) : reports.length === 0 ? (
        <div className="mt-7 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No Reports Yet
          </h2>
          <p className="mt-2 text-gray-600">
            It looks like you haven't created any reports yet. Start your
            journey towards better accessibility by creating your first report
            today.
          </p>
          <Link
            to="/reports/create"
            className="mt-4 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-[#005031] px-4 py-2 text-sm text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2"
          >
            Create Your First Report
          </Link>
        </div>
      ) : (
        <section
          aria-labelledby="reports-list-heading"
          className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {reports?.map((report) => <ReportCard key={report.id} {...report} />)}
        </section>
      )}
    </>
  );
};

export default Reports;
