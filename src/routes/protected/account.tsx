import { useState } from 'react';
import { ExclamationTriangleIcon, PinRightIcon } from '@radix-ui/react-icons';

import { Button } from '~/components/buttons';
import { DangerDialog } from '~/components/dialogs';
import { AccountForm } from '~/components/forms';
import { useAuth } from '~/hooks/useAuth';

const Account = () => {
  const { signOut, deleteUser } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteAccount = async () => {
    await deleteUser();
    setIsDeleteDialogOpen(false);
  };
  return (
    <>
      <header className="flex items-center justify-between">
        <h1 id="account-heading" className="text-2xl md:text-3xl">
          Your Account
        </h1>
        <Button onClick={signOut} className="gap-2 bg-[#005031]">
          Log Out
          <PinRightIcon aria-hidden />
        </Button>
      </header>

      <section
        aria-labelledby="general-info-heading"
        className="mt-6 space-y-6 rounded-lg bg-white p-6 shadow"
      >
        <h2 id="general-info-heading" className="text-lg">
          General Information
        </h2>

        <AccountForm />
      </section>

      <section
        aria-labelledby="danger-zone-heading"
        className="mt-6 space-y-6 rounded-lg bg-white p-6 shadow"
      >
        <h2 id="danger-zone-heading" className="text-lg text-[#cf000f]">
          Danger Zone
        </h2>

        <Button
          onClick={() => setIsDeleteDialogOpen(true)}
          className="gap-2 bg-[#cf000f]"
          aria-describedby="delete-account-description"
        >
          Delete Account
          <ExclamationTriangleIcon aria-hidden />
        </Button>
        <p
          id="delete-account-description"
          className="mt-2 text-sm text-gray-600"
        >
          Deleting your account is irreversible. Please proceed with caution.
        </p>

        {isDeleteDialogOpen && (
          <DangerDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteAccount}
            title="Confirm Account Deletion"
            description="Are you sure you want to delete your account? This action cannot be undone."
          />
        )}
      </section>
    </>
  );
};

export default Account;
