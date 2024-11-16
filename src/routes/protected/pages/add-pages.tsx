import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
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
import { Button } from '~/components/buttons';
import { PropertyForm } from '~/components/forms';
import { SEO } from '~/components/layout';
import { propertiesQuery } from '~/queries/properties';
import { addProperty } from '~/services';

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
        
          <Tabs.Root className="TabsRoot" defaultValue="url" value={activeTab} onValueChange={(value) => setValue('mode', value)} >
            <Tabs.List
              className="TabsList flex justify-center gap-4"
              aria-label="Select how you want to add pages:"
            >
              <Tabs.Trigger
                className="TabsTrigger text-sm font-medium text-[#186121] underline underline-offset-8 hover:text-[#186121CC]"
                value="url"
              >
                By URL
              </Tabs.Trigger>
              <Tabs.Trigger
                className="TabsTrigger text-sm font-medium text-[#186121] underline underline-offset-8 hover:text-[#186121CC]"
                value="sitemap"
              >
                By Sitemap
              </Tabs.Trigger>
              <Tabs.Trigger
                className="TabsTrigger text-sm font-medium text-[#186121] underline underline-offset-8 hover:text-[#186121CC]"
                value="csv"
              >
                By CSV
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content className="TabsContent" value="url">
              {/******* 
              URL Input tab Content 
              **********/}
              <p className="Text">URL</p>

              <ul>
                {fields.map((item, index) => {
                  return (
                    <li key={item.id} className="flex">
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
                        Delete
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
            <Tabs.Content className="TabsContent" value="sitemap">
              {/******* 
              Sitemap Input tab Content 
              **********/}
              <p className="Text">Sitemap URL</p>
              <input
                className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-base shadow-sm transition-colors"
                {...register(`sitemapUrl`, {
                  validate: (value) => {
                    return true;
                  }, // TODO conditional on current tab
                })}
              />
            </Tabs.Content>
            <Tabs.Content className="TabsContent" value="csv">
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
          <Controller
            name="property"
            control={control}
            render={({ field }) => (
              <Select.Root value={field.value} onValueChange={field.onChange}>
                <Select.Trigger
                  className="SelectTrigger"
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
                      <Select.Item value="none" key="null">
                        <Select.ItemText>None</Select.ItemText>
                      </Select.Item>
                      {initialProperties.map((item, index) => (
                        <Select.Item value={item.id} key={index}>
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
          <div className="flex flex-row items-center gap-2">
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
        </form>
      </section>
    </>
  );
};

export default AddPages;
