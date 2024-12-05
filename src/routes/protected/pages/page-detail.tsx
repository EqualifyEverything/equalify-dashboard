import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { ActionFunctionArgs, Link, useLoaderData, useNavigate } from 'react-router-dom';
import { SEO } from '~/components/layout';
import { pageDetailQuery } from '~/queries/pages';

// Initial data on pageload
export const pageDetailLoader =
  (queryClient: QueryClient) => async ({ params }: ActionFunctionArgs) => {
    console.log(params);
    if(!params.pageId) return;
    const initialPage = await queryClient.ensureQueryData(
      pageDetailQuery({ pageId: params.pageId }),
    );
    return { initialPage };
  };

const pageDetail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { initialPage } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof pageDetailLoader>>
  >; 

  return (
    <>
      <SEO
        title="Pages - Equalify"
        description="Manage and monitor your properties on Equalify to improve their accessibility."
        url="https://dashboard.equalify.app/properties"
      />
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1
          className="text-2xl font-bold md:text-3xl"
          id="properties-list-heading"
        >
          Page Detail
        </h1>
        <div className="flex flex-row items-center gap-2">
          <Link
            to=""
            onClick={() => navigate(-1)}
            aria-label='Back to Pages'
            className="text-[#186121]">
            &#60; Back to Pages
          </Link>
        </div> 
      </div>
      <section>
        </section> 
      </>
    )
};
export default pageDetail;
