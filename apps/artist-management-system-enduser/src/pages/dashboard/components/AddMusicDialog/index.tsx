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
} from '@/store/slices/music.slice';
import { IAddMusicPayload } from '@/store/types';
import { Trigger } from '@radix-ui/react-dialog';
import { PlusIcon } from 'lucide-react';
import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';

const AddMusicDialogView = () => {
  const triggerRef = useRef<typeof Trigger>(null);
  const { setValue } = useFormContext<IAddMusicPayload>();

  const [uploadMusic, { isLoading: albumLoading }] = useAddMusicMutation();
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
    uploadMusic(data)
      .unwrap()
      .then(() => {
        (triggerRef.current as any)?.click();
      });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger ref={triggerRef as any}>
          <Button>
            <PlusIcon /> Add Music
          </Button>
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
            />

            <Button disabled={albumLoading || coverLoading}>Save</Button>
          </HookForm>
        </DialogContent>
      </Dialog>
    </>
  );
};

const AddMusicDialog = () => {
  return (
    <HookFormProvider>
      <AddMusicDialogView />
    </HookFormProvider>
  );
};

export default AddMusicDialog;
