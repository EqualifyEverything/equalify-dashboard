import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from '~/components/alerts';
import { z } from 'zod';

import { Button } from '~/components/buttons';
import {
  Input,
} from '~/components/inputs';
import { useAuth } from '~/hooks/useAuth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '.';
import { useQuery } from '@tanstack/react-query';
import { getApikey } from '~/services';

const AccountSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  selectedAccount: z.string(),
});

type AccountFormInputs = z.infer<typeof AccountSchema>;

const AccountForm = () => {
  const { user, updateUserAttributes, loading } = useAuth();
  const form = useForm<AccountFormInputs>({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email ?? '',
      selectedAccount: '',
    },
  });

  const { data: apikey } = useQuery({
    queryKey: ['apikey'],
    queryFn: () => getApikey(),
  })

  const [isFormChanged, setIsFormChanged] = useState(false);

  const watchedFields = useWatch({ control: form.control });

  useEffect(() => {
    const isChanged =
      (watchedFields.firstName?.trim() ?? '') !== (user?.firstName ?? '') ||
      (watchedFields.lastName?.trim() ?? '') !== (user?.lastName ?? '');
    setIsFormChanged(isChanged);
  }, [watchedFields, user]);

  const handleUpdateAccount = async (values: AccountFormInputs) => {
    try {
      await updateUserAttributes({
        firstName: values.firstName,
        lastName: values.lastName,
      });
      form.reset(values);
      toast.success({title:'Success', description:'Account updated successfully.'});
    } catch (error) {
      toast.error({title: 'Success', description:'Failed to update account'});
    }
  };

  const handleCancel = () => {
    form.reset({
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email ?? '',
      selectedAccount: '',
    });
    setIsFormChanged(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateAccount)}
        className="grid grid-cols-1 gap-x-10 md:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="h-12 bg-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="h-12 bg-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  className="h-12 bg-white"
                  disabled
                  aria-readonly
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apikey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <input className='border-[1px] p-[11px] rounded-md' id='apikey' name='apikey' value={apikey?.apikey} disabled readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex space-x-4' />
        <div className="flex space-x-4">
          <Button
            type="submit"
            className="w-fit bg-[#1D781D] text-white"
            disabled={!isFormChanged}
            aria-disabled={!isFormChanged}
            aria-live="polite"
          >
            {loading ? (
              <>
                <span className="sr-only">Processing, please wait...</span>
                <div
                  role="status"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"
                ></div>
              </>
            ) : (
              'Update Account'
            )}
          </Button>

          {isFormChanged && (
            <Button
              type="button"
              variant={'outline'}
              className="w-fit"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default AccountForm;
