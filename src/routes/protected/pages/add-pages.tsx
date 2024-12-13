import { ChangeEvent } from 'react';
import {
  ArchiveIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CrossCircledIcon,
  FileTextIcon,
  LaptopIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import * as Separator from '@radix-ui/react-separator';
import * as Tabs from '@radix-ui/react-tabs';
import { QueryClient } from '@tanstack/react-query';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';

import { toast } from '~/components/alerts';
import { SEO } from '~/components/layout';
import { propertiesQuery } from '~/queries/properties';
import { addPagesFromForm } from '~/services/pages';

export const addPagesLoader = (queryClient: QueryClient) => async () => {
  const initialProperties =
    await queryClient.ensureQueryData(propertiesQuery());
  return { initialProperties };
};

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

const AddPages = () => {
  const navigate = useNavigate();
  const { initialProperties } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof addPagesLoader>>
  >;

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
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
  const currentUrls = watch('urls');
  const onSubmit = (data: any) => addPages(data);

  const addPages = async (data: any) => {
    console.log('Sending...', data);
    const response = await addPagesFromForm({ data });
    console.log('Response...', response);
    if (response.result.status === 'success') {
      toast.success({
        title: 'Success',
        description: 'Pages added!',
      });
    } else {
      toast.error({
        title: 'Error',
        description: 'There was a problem adding the pages.',
      });
    }
    reset();
  };

  const onFileReaderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    let file;
    if (target.files && target.files.length) {
      file = target.files[0];
    } else {
      return;
    }
    if (file.type !== 'text/csv') {
      return throwFileError(event, `You must select a CSV file`);
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        const text = e.target.result;
        if (text && typeof text == 'string') {
          const rows = text.split('\n');
          const parsedData = rows.map(
            (cell) => cell.trim(),
          );
          const headers = parsedData;
          if (
            headers?.[0] !== 'url' 
          ) {
            return throwFileError(
              event,
              `You must have the first row headers set to "url"`,
            );
          }
          const parsedRows = parsedData.slice(1, parsedData.length).filter(function (el) {
            return el != null && el != ""; // remove any empty rows
          });
          console.log(parsedRows);
          for (const row of parsedRows) {
            try {
              const url = new URL(row);
              if(!row.match(URL_REGEX)){ throw "URL Matching Error" };
            } catch (err) {
              return throwFileError(
                event,
                `You have an invalid URL in your CSV`,
              );
            }
          }
          //setData(parsedData);
          //console.log(parsedRows);
          const formattedForExport = parsedRows.map((val)=>{
            return { url: val }
          });
          //console.log(formattedForExport);
          setValue("urls", formattedForExport)
        }
      }
    };
    reader.readAsText(file);
    return;
  };

  const throwFileError = (
    event: ChangeEvent<HTMLInputElement>,
    message: string,
  ) => {
    alert(message);
    //setData([]);
    event.target.value = '';
    return;
  };

  return (
    <>
      <SEO
        title="Add Pages - Equalify"
        description="Add new pages to Equalify to start monitoring and improving accessibility."
        url="https://dashboard.equalify.app/pages/add"
      />

      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1
          className="text-2xl font-bold md:text-3xl"
          id="properties-list-heading"
        >
          Add Pages
        </h1>
        <div className="flex flex-row items-center gap-2">
          <Link
            to=""
            onClick={() => navigate(-1)}
            aria-label="Back to Pages"
            className="text-[#186121]"
          >
            &#60; Back to Pages
          </Link>
        </div>
      </div>
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
                        aria-invalid={
                          errors && errors.urls && errors.urls[index]
                            ? 'true'
                            : 'false'
                        }
                        className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-base shadow-sm transition-colors aria-[invalid=true]:border-red-400"
                        {...register(`urls.${index}.url`, {
                          required: activeTab == 'url',
                          pattern: {
                            value:
                            URL_REGEX,
                            message: 'Invalid URL format',
                          },
                          /* validate: (value) => {
                            return true;
                          }, */
                          // TODO conditional on current tab
                        })}
                      />

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
                className="mr-8 inline-flex w-full items-center justify-center rounded-md border border-gray-200 bg-slate-100 py-2 text-center hover:bg-green-200"
              >
                <PlusCircledIcon className="mr-2" /> Add URL
              </button>
            </Tabs.Content>
            <Tabs.Content className="TabsContent p-2" value="sitemap">
              {/******* 
              Sitemap Input tab Content 
              **********/}
              <input
                aria-invalid={errors.sitemapUrl ? 'true' : 'false'}
                className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-base shadow-sm transition-colors aria-[invalid=true]:border-red-400"
                {...register(`sitemapUrl`, {
                  required: activeTab == 'sitemap',
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
                    message: 'Invalid URL format',
                  },
                  /* validate: (value) => {
                    return true;
                  }, */ // TODO conditional on current tab
                })}
              />
            </Tabs.Content>
            <Tabs.Content className="TabsContent p-2" value="csv">
              {/******* 
              CSV Input tab Content 
              **********/}
              Upload a CSV file of pages to add to Equalify. Please review the <a target="_blank" className="underline" href="/template-pages.csv">example CSV template</a> for format.
              <input onChange={onFileReaderChange} type="file" accept=".csv" />
              {(currentUrls.length > 0 && currentUrls[0].url !== "") && (
                <div className="flex flex-col">
                  <div>CSV successfully uploaded! Showing first 10 rows:</div>
                  {currentUrls.slice(0, 10).map((row, index) => (
                    <div
                      key={index}
                      className={`flex flex-row gap-2 p-1 ${index === 0 && 'bg-card'}`}
                    >
                      <div key={index} className="truncate">
                        {row.url}
                      </div>
                    </div>
                  ))}
                  <div>...</div>
                </div>
              )}
            </Tabs.Content>
          </Tabs.Root>
          <Separator.Root />

          <div className="p-2">
            <Label.Root htmlFor="property" className="pr-2 text-xs">
              Add to Property
            </Label.Root>
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
                        <Select.Item
                          value="none"
                          key="null"
                          className="cursor-pointer p-2 hover:bg-green-100"
                        >
                          <Select.ItemText>None</Select.ItemText>
                        </Select.Item>
                        {initialProperties.map((item, index) => (
                          <Select.Item
                            value={item.id}
                            key={index}
                            className="cursor-pointer p-2 hover:bg-green-100"
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
            <div className="mt-4 flex flex-row items-center gap-2">
              <input
                type="submit"
                value="Add Pages"
                className="inline-flex cursor-pointer items-center whitespace-nowrap rounded-md bg-[#005031] px-3 py-1 text-base text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D781D] focus-visible:ring-offset-2 max-sm:w-fit max-sm:px-3 max-sm:py-2.5"
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
