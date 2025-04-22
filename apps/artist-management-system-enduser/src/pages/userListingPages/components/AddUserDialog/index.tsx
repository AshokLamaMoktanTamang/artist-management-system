import { Button } from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import { HookForm, HookFormProvider } from '@/components/form';
import { HookInput } from '@/components/input';
import { HookSelect } from '@/components/select';
import {
  useAddUserMutation,
  useUpdateUserMutation,
} from '@/store/slices/user.slice';
import { FC, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { IAddUserDialog } from './type';
import { USER_GENDER, USER_ROLE } from '@/types';
import { SignupPayload } from '@/store/types';
import { SELECT_GENDER_OPTIONS, SELECT_ROLE_OPTIONS } from '@/utils/constants';
import useAuth from '@/hooks/useAuth';

const AddUserDialogView: FC<IAddUserDialog> = ({
  defaultValue,
  isEditMode,
}) => {
  const { user } = useAuth();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { reset } = useFormContext<SignupPayload>();

  const [addUser, { isLoading: adding }] = useAddUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const handleAddUser = (data: SignupPayload) => {
    if (isEditMode) {
      updateUser({ ...data, userId: defaultValue?.id || '' })
        .unwrap()
        .then(() => (triggerRef.current as any)?.click());
    } else {
      addUser(data)
        .unwrap()
        .then(() => (triggerRef.current as any)?.click());
    }
  };

  useEffect(() => {
    if (!isEditMode || !defaultValue) {
      reset();
      return;
    }

    reset({
      ...defaultValue,
      dob: new Date(defaultValue?.dob || '').toISOString().slice(0, 10),
    } as any);
  }, [defaultValue, isEditMode]);

  return (
    <Dialog>
      <DialogTrigger ref={triggerRef}>
        {isEditMode ? (
          <Button size="sm" variant="secondary">
            <PencilIcon className="mr-2 h-4 w-4" /> Edit
          </Button>
        ) : (
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> Add User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit User' : 'Add User'}</DialogTitle>
        </DialogHeader>

        <HookForm className="flex flex-col gap-4" onSubmit={handleAddUser}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HookInput
              name="first_name"
              label="First Name"
              required
              placeholder="John"
            />
            <HookInput
              name="last_name"
              label="Last Name"
              required
              placeholder="Doe"
            />
          </div>
          <HookInput
            name="email"
            label="Email"
            placeholder="name@example.com"
            required
            type="email"
          />
          {!isEditMode && (
            <HookInput
              name="password"
              label="Password"
              type="password"
              placeholder="********"
              required
            />
          )}
          <HookInput
            name="phone"
            label="Phone"
            placeholder="+977-98XXXXXXXX"
            required
            type="tel"
          />
          <HookInput
            name="dob"
            label="Date of Birth"
            type="date"
            required
            max={
              new Date(
                new Date().getFullYear() - 18,
                new Date().getMonth(),
                new Date().getDate()
              )
                .toISOString()
                .split('T')[0]
            }
          />
          <HookSelect
            name="gender"
            required
            label="Gender"
            options={SELECT_GENDER_OPTIONS}
            defaultValue={USER_GENDER.MALE}
          />
          <HookSelect
            name="role"
            required
            label="Role"
            options={SELECT_ROLE_OPTIONS}
            defaultValue={USER_ROLE.ARTIST}
            disabled={user?.role === USER_ROLE.ARTIST_MANAGER}
          />
          <Button disabled={adding || updating}>Save</Button>
        </HookForm>
      </DialogContent>
    </Dialog>
  );
};

const AddUserDialog: FC<IAddUserDialog> = (props) => (
  <HookFormProvider>
    <AddUserDialogView {...props} />
  </HookFormProvider>
);

export default AddUserDialog;
