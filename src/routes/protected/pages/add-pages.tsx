import { useState } from 'react';
import {
  ArchiveIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CrossCircledIcon,
  FileTextIcon,
  LaptopIcon,
} from '@radix-ui/react-icons';
import * as Select from '@radix-ui/react-select';
import * as Separator from '@radix-ui/react-separator';
import * as Tabs from '@radix-ui/react-tabs';
import { QueryClient } from '@tanstack/react-query';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  ActionFunctionArgs,
  redirect,
  useLoaderData,
  useNavigate,
} from 'react-router-dom';

import { toast } from '~/components/alerts';
import { SEO } from '~/components/layout';
import { propertiesQuery } from '~/queries/properties';

export const addPagesLoader = (queryClient: QueryClient) => async () => {
  const initialProperties =
    await queryClient.ensureQueryData(propertiesQuery());
  return { initialProperties };
};

/**
 * Handles adding new Pages.
 * @param queryClient - The Query Client instance.
 * @returns Action function to be used with React Router.
 */
/* export const addPropertyAction =
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
        toast.success({
          title: 'Success',
          description: 'Property added successfully!',
        });
        return redirect(`/properties`);
      } else {
        toast.error({ title: 'Error', description: 'Failed to add property.' });
        throw new Response('Failed to add property', { status: 500 });
      }
    } catch (error) {
      toast.error({
        title: 'Error',
        description: 'An error occurred while adding the property.',
      });
      throw error;
    }
  }; */

const AddPages = () => {
  const navigate = useNavigate();
  const { initialProperties } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof addPagesLoader>>
  >;

  const { register, control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      urls: [{ url: '' }],
      sitemapUrl: '',
      property: '',
      mode: 'url',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'urls',
  });
  const activeTab = watch('mode');
  const onSubmit = (data: any) => console.log('data', data);

  return (
    <>
      <SEO
        title="Add Pages - Equalify"
        description="Add new pages to Equalify to start monitoring and improving accessibility."
        url="https://dashboard.equalify.app/pages/add"
      />
      <h1 id="add-pages-heading" className="text-2xl font-bold md:text-3xl">
        Add New Pages
      </h1>

      <section
        aria-labelledby="add-pages-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
        aria-live="polite"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs.Root
            className="TabsRoot"
            defaultValue="url"
            value={activeTab}
            onValueChange={(value) => setValue('mode', value)}
          >
            <Tabs.List
              className="TabsList inline-flex w-full justify-center gap-4"
              aria-label="Select how you want to add pages:"
            >
              <Tabs.Trigger
                className="TabsTrigger inline-flex grow items-center border-green-800 p-2 text-left font-medium text-[#186121] hover:bg-slate-100 aria-selected:border-b-2"
                value="url"
              >
                <LaptopIcon className="mr-2" />
                By URL
              </Tabs.Trigger>
              <Tabs.Trigger
                className="TabsTrigger inline-flex grow items-center border-green-800 p-2 text-left font-medium text-[#186121] hover:bg-slate-100 aria-selected:border-b-2"
                value="sitemap"
              >
                <ArchiveIcon className="mr-2" />
                By Sitemap
              </Tabs.Trigger>
              <Tabs.Trigger
                className="TabsTrigger inline-flex grow items-center border-green-800 p-2 text-left font-medium text-[#186121] hover:bg-slate-100 aria-selected:border-b-2"
                value="csv"
              >
                <FileTextIcon className="mr-2" />
                By CSV
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content className="TabsContent p-2" value="url">
              {/******* 
              URL Input tab Content 
              **********/}
              <ul>
                {fields.map((item, index) => {
                  return (
                    <li key={item.id} className="flex py-1">
                      <input
                        className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-base shadow-sm transition-colors"
                        {...register(`urls.${index}.url`, {
                          validate: (value) => {
                            return true;
                          }, // TODO conditional on current tab
                        })}
                      />

                      {/* <Controller
                          render={({ field }) => <input {...field} />}
                          name={`urls.${index}.url`}
                          control={control}
                        /> */}
                      <button type="button" onClick={() => remove(index)}>
                        <CrossCircledIcon className="ml-2 opacity-50" />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={() => {
                  append({ url: '' });
                }}
              >
                Add URL
              </button>
            </Tabs.Content>
            <Tabs.Content className="TabsContent p-2" value="sitemap">
              {/******* 
              Sitemap Input tab Content 
              **********/}
              <input
                className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-base shadow-sm transition-colors"
                {...register(`sitemapUrl`, {
                  validate: (value) => {
                    return true;
                  }, // TODO conditional on current tab
                })}
              />
            </Tabs.Content>
            <Tabs.Content className="TabsContent p-2" value="csv">
              {/******* 
              CSV Input tab Content 
              **********/}
              <p className="Text">CSV</p>
            </Tabs.Content>
          </Tabs.Root>
          <Separator.Root />

          {/* <Button
            variant={'outline'}
            className="w-fit"
            onClick={() => navigate(-1)}
            aria-label='Cancel adding pages'
          >
            Cancel
          </Button> */}
          <Separator.Root />
          <div className="p-2">
            <Controller
              name="property"
              control={control}
              render={({ field }) => (
                <Select.Root value={field.value} onValueChange={field.onChange}>
                  <Select.Trigger
                    className="SelectTrigger border border-slate-200"
                    aria-label="Add to Property"
                  >
                    <Select.Value placeholder="Select a Property…" />
                    <Select.Icon className="SelectIcon">
                      <ChevronDownIcon />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="SelectContent">
                      <Select.ScrollUpButton className="SelectScrollButton">
                        <ChevronUpIcon />
                      </Select.ScrollUpButton>
                      <Select.Viewport className="SelectViewport">
                        <Select.Item value="none" key="null" className="p-2">
                          <Select.ItemText>None</Select.ItemText>
                        </Select.Item>
                        {initialProperties.map((item, index) => (
                          <Select.Item
                            value={item.id}
                            key={index}
                            className="p-2"
                          >
                            <Select.ItemText>{item.name}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                      <Select.ScrollDownButton className="SelectScrollButton">
                        <ChevronDownIcon />
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              )}
            />
            <Separator.Root />
            <div className="flex flex-row items-center gap-2 mt-4">
              <input
                type="submit"
                value="Add Pages"
                className="inline-flex items-center whitespace-nowrap rounded-md bg-[#005031] px-3 py-1 text-base text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 max-sm:w-fit max-sm:px-3 max-sm:py-2.5"
              />
              <button
                type="button"
                onClick={() =>
                  reset({
                    urls: [{ url: '' }],
                  })
                }
              >
                reset
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddPages;
