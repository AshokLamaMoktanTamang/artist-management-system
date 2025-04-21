import { Button } from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import { HookFileUploader } from '@/components/fileUploader';
import { HookForm, HookFormProvider } from '@/components/form';
import { HookInput } from '@/components/input';
import {
  useAddMusicMutation,
  useMusicPresignedUrlMutation,
  useUpdateMusicMutation,
} from '@/store/slices/music.slice';
import { IAddMusicPayload } from '@/store/types';
import { Trigger } from '@radix-ui/react-dialog';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { FC, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { IAddMusicDialog } from './type';
import { config } from '@/config';

const AddMusicDialogView: FC<IAddMusicDialog> = ({
  defaultValue,
  isEditMode,
}) => {
  const triggerRef = useRef<typeof Trigger>(null);
  const { setValue, reset } = useFormContext<IAddMusicPayload>();

  const [uploadMusic, { isLoading: musicLoading }] = useAddMusicMutation();
  const [updateMusic, { isLoading: musicUpdating }] = useUpdateMusicMutation();
  const [uploadCover, { isLoading: coverLoading }] =
    useMusicPresignedUrlMutation();

  const handlCoverChange = (file?: File) => {
    if (!file) {
      setValue('cover', undefined);
      return;
    }

    uploadCover(file)
      .unwrap()
      .then((data) => setValue('cover', data as any));
  };

  const handleAddMusic = (data: IAddMusicPayload) => {
    if (isEditMode) {
      updateMusic({ ...data, musicId: defaultValue?.id || '' })
        .unwrap()
        .then(() => {
          (triggerRef.current as any)?.click();
        });
    } else {
      uploadMusic(data)
        .unwrap()
        .then(() => {
          (triggerRef.current as any)?.click();
        });
    }
  };

  useEffect(() => {
    if (!isEditMode || !defaultValue) {
      reset();
      return;
    }

    reset(defaultValue as any);
  }, [defaultValue, isEditMode]);

  return (
    <>
      <Dialog>
        <DialogTrigger ref={triggerRef as any}>
          {isEditMode ? (
            <Button size={'sm'} variant={'secondary'}>
              <PencilIcon /> Edit
            </Button>
          ) : (
            <Button>
              <PlusIcon /> Add Music
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Music</DialogTitle>
          </DialogHeader>

          <HookForm className="flex flex-col gap-4" onSubmit={handleAddMusic}>
            <HookInput
              name="title"
              label="Music Title"
              required
              placeholder="Enter the music title"
            />
            <HookInput
              name="genre"
              label="Genre"
              required
              placeholder="Example: Romantic, Metal"
            />
            <HookFileUploader
              placeholder="Select the music cover"
              name="cover"
              label="Cover Thumbnail"
              accept="image/png,image/jpg,image/jpeg"
              multiple={false}
              onChange={handlCoverChange}
              defaultValue={
                isEditMode
                  ? config.assetBaseUrl + '/' + defaultValue?.cover
                  : undefined
              }
            />

            <Button disabled={musicLoading || coverLoading || musicUpdating}>
              Save
            </Button>
          </HookForm>
        </DialogContent>
      </Dialog>
    </>
  );
};

const AddMusicDialog: FC<IAddMusicDialog> = (props) => {
  return (
    <HookFormProvider>
      <AddMusicDialogView {...props} />
    </HookFormProvider>
  );
};

export default AddMusicDialog;
