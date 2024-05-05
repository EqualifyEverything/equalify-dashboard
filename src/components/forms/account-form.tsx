import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import * as Auth from 'aws-amplify/auth'
import * as API from "aws-amplify/api";
const apiClient = API.generateClient();

import { Button } from '~/components/buttons';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
import { useStore } from '~/store';
import { useState } from 'react';

const AccountSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  selectedAccount: z.string(),
});

type AccountFormInputs = z.infer<typeof AccountSchema>;

const AccountForm = () => {
  const [loading, setLoading] = useState(false);
  const setUser = useStore(state => state.setUser);
  const { user } = useAuth();
  const form = useForm<AccountFormInputs>({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email ?? '',
      selectedAccount: '',
    },
  });

  const onSubmit = async (values: AccountFormInputs) => {
    setLoading(true);
    const keyDict = { firstName: 'given_name', lastName: 'family_name', email: 'email' };
    const newUser = {};
    for (const [key, value] of Object.entries(values)?.filter(([key,]) => ['firstName', 'lastName', 'email'].includes(key))) {
      const result = await Auth.updateUserAttributes({ userAttributes: { [keyDict?.[key]]: value } });
      if (result) {
        await apiClient.graphql({
          query: `mutation($id:UUID!) {
            updateUser(input:{id:$id, patch:{${key}: "${value}"}}) {
              user {id}
            }
          }`,
          variables: { id: user?.userId },
        });
        newUser[key] = value;
      }
    }
    setUser({ ...user, ...newUser });
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
                  placeholder="E.g. John"
                  className="h-12 bg-white"
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
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="E.g. Doe"
                  className="h-12 bg-white"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="E.g. johndoe@email.com"
                  className="h-12 bg-white"
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
          name="selectedAccount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Active Account</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                aria-readonly
                disabled
              >
                <FormControl>
                  <SelectTrigger className="h-12" aria-label="Select account">
                    <SelectValue placeholder="Select your active Account" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="equalify_account_1">
                    equalify_account_1
                  </SelectItem>
                  <SelectItem value="equalify_account_2">
                    equalify_account_2
                  </SelectItem>
                  <SelectItem value="equalify_account_3">
                    equalify_account_3
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-fit bg-[#1D781D] text-white"
          disabled={loading}
        >
          {!loading ? 'Update Account' : 'Updating...'}
        </Button>
      </form>
    </Form>
  );
};

export default AccountForm;
