import { ExclamationTriangleIcon, PinRightIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';

import { toast } from '~/components/alerts';
import { Button } from '~/components/buttons';
import { DangerDialog } from '~/components/dialogs';
import { AccountForm } from '~/components/forms';
import { SEO } from '~/components/layout';
import { useAuth } from '~/hooks/useAuth';

const Account = () => {
  const { signOut, deleteUser } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      toast.success({
          title: 'Success',
          description: 'Deleting account...',
      });
      await deleteUser();
    } catch (error) {
      toast.error({
        title: 'Error',
        description: 'Failed to delete account. Please try again.',
      });
    }
  };

  const handleSignOut = () => {
    toast.success({ title: 'Success', description: 'You have logged out.' });
    setTimeout(() => {
      signOut();
      navigate('/login');
    }, 1000);
  };
  return (
    <>
      <SEO
        title="Account - Equalify"
        description="Manage your Equalify account settings and personal information."
        url="https://dashboard.equalify.app/account"
      />
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1 id="account-heading" className="text-2xl font-bold md:text-3xl">
          Your Account
        </h1>
        <Button
          onClick={handleSignOut}
          className="w-fit gap-2 place-self-end bg-[#005031]"
        >
          Log Out
          <PinRightIcon aria-hidden />
        </Button>
      </div>

      <section
        aria-labelledby="general-info-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
      >
        <h2 id="general-info-heading" className="text-lg">
          General Information
        </h2>

        <AccountForm />
      </section>

      <section
        aria-labelledby="danger-zone-heading"
        className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
      >
        <h2 id="danger-zone-heading" className="text-lg text-[#cf000f]">
          Danger Zone
        </h2>

        <DangerDialog
          title="Confirm Account Deletion"
          description="Are you sure you want to delete your account? This action cannot be undone."
          onConfirm={handleDeleteAccount}
          triggerButton={
            <Button
              className="gap-2 bg-[#cf000f]"
              aria-describedby="delete-account-description"
              aria-label="Delete account"
            >
              Delete Account
              <ExclamationTriangleIcon aria-hidden />
            </Button>
          }
        />
        <p
          id="delete-account-description"
          className="mt-2 text-sm text-gray-600"
        >
          Deleting your account is irreversible. Please proceed with caution.
        </p>
      </section>
    </>
  );
};

export default Account;
