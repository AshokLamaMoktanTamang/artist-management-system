import { Button } from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import { HookFileUploader } from '@/components/fileUploader';
import { HookForm, HookFormProvider } from '@/components/form';
import { HookInput } from '@/components/input';
import {
  useAddAlbumMutation,
  useAlbumPresignedUrlMutation,
} from '@/store/slices/album.slice';
import { IAddAlbumPayload } from '@/store/types';
import { Trigger } from '@radix-ui/react-dialog';
import { PlusIcon } from 'lucide-react';
import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';

const AddAlbumDialogView = () => {
  const triggerRef = useRef<typeof Trigger>(null);
  const { setValue } = useFormContext<IAddAlbumPayload>();

  const [uploadAlbum, { isLoading: albumLoading }] = useAddAlbumMutation();
  const [uploadCover, { isLoading: coverLoading }] =
    useAlbumPresignedUrlMutation();

  const handlCoverChange = (file?: File) => {
    if (!file) {
      setValue('cover', undefined);
      return;
    }

    uploadCover(file)
      .unwrap()
      .then(({ data }) => setValue('cover', data));
  };

  const handleAddAlbum = (data: IAddAlbumPayload) => {
    uploadAlbum(data)
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
            <PlusIcon /> Add Album
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Album</DialogTitle>
            <DialogDescription>
              Add album and publish group music at once
            </DialogDescription>
          </DialogHeader>

          <HookForm className="flex flex-col gap-4" onSubmit={handleAddAlbum}>
            <HookInput
              name="title"
              label="Album Title"
              required
              placeholder="Enter the album title"
            />
            <HookInput
              name="genre"
              label="Genre"
              required
              placeholder="Example: Romantic, Metal"
            />
            <HookFileUploader
              placeholder="Select the album cover"
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

const AddAlbumDialog = () => {
  return (
    <HookFormProvider>
      <AddAlbumDialogView />
    </HookFormProvider>
  );
};

export default AddAlbumDialog;
