import { Button } from '@/components/button';
import { Input } from '@/components/input';
import {
  useGetBulkPresignedUrlMutation,
  useInitiateBulkUploadMutation,
} from '@/store/slices/user.slice';
import { PRIVATE_ROUTES } from '@/utils/constants';
import { toastInfo } from '@shared/utils/toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const BulkUpload = () => {
  const navigate = useNavigate();
  const [bulkFile, setBulkFile] = useState<File | null>(null);

  const [uploadFile, { isLoading }] = useGetBulkPresignedUrlMutation();
  const [initiateBulkUpload, { isLoading: uploading }] =
    useInitiateBulkUploadMutation();

  const handleBulkUploadInitiate = () => {
    if (!bulkFile) return;

    uploadFile(bulkFile)
      .unwrap()
      .then((data) => {
        initiateBulkUpload({ fileKey: data as any })
          .unwrap()
          .then(() => {
            navigate(PRIVATE_ROUTES.artists);
            toastInfo(
              'Bulk Upload Initiated',
              'The data will be reflected after a while please wait'
            );
          });
      });
  };

  return (
    <>
      <Input
        type="file"
        accept=".xlsx"
        onChange={({ target: { files } }) => setBulkFile(files?.[0] || null)}
      />
      <Button
        disabled={!bulkFile || isLoading || uploading}
        onClick={handleBulkUploadInitiate}
      >
        Initiate Bulk Upload
      </Button>
    </>
  );
};
