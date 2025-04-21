import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/table';
import { Card } from '@/components/card';
import { Button } from '@/components/button';
import { Skeleton } from '@/components/skeleton';
import { Dialog, DialogContent, DialogFooter } from '@/components/dialog';

import { useState } from 'react';
import {
  useDeleteMusicMutation,
  useFetchMusicsQuery,
  useUpdateMusicMutation,
} from '@/store/slices/music.slice';
import { cn } from '@/utils/cn';
import { config } from '@/config';
import { Music } from '@/store/types';
import { toastSuccess } from '@shared/utils/toast';
import AddMusicDialog from '../AddMusicDialog';

const MusicListing = () => {
  const limit = 10;

  const [page, setPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);

  const { data, isLoading } = useFetchMusicsQuery({ limit, page });
  const [deleteMusic, { isLoading: deleting }] = useDeleteMusicMutation();
  const [publishMusic, { isLoading: publishing }] = useUpdateMusicMutation();

  const musics = data?.data || [];
  const pagination = data?.pagination;

  const handleDelete = async () => {
    if (!selectedMusic) return;

    deleteMusic({ id: selectedMusic.id })
      .unwrap()
      .then(() => {
        toastSuccess(
          'Music deleted',
          `Music "${selectedMusic.title}" was deleted.`
        );
        setShowDeleteDialog(false);
      });
  };

  const handlePublish = async () => {
    if (!selectedMusic) return;

    publishMusic({ musicId: selectedMusic.id, is_draft: false })
      .unwrap()
      .then(() => {
        toastSuccess(
          'Music Published!',
          `Music "${selectedMusic.title}" was published.`
        );
        setShowPublishDialog(false);
      });
  };

  return (
    <Card className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cover</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-14 w-14 rounded-md" />
                  </TableCell>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : musics.map((music) => (
                <TableRow key={music.id}>
                  <TableCell>
                    {music.cover ? (
                      <img
                        src={`${config.assetBaseUrl}/${music.cover}`}
                        alt={music.title}
                        className="h-14 w-14 object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-14 w-14 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                        No Cover
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{music.title}</TableCell>
                  <TableCell>{music.genre}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        music.is_draft ? 'text-yellow-500' : 'text-green-600'
                      )}
                    >
                      {music.is_draft ? 'Draft' : 'Published'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(music.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <AddMusicDialog isEditMode defaultValue={music} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedMusic(music);
                        setShowPublishDialog(true);
                      }}
                      disabled={deleting}
                    >
                      Publish
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedMusic(music);
                        setShowDeleteDialog(true);
                      }}
                      disabled={publishing}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      {pagination && (
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPage}
          </span>

          <Button
            variant="outline"
            onClick={() =>
              setPage((p) => Math.min(p + 1, pagination.totalPage))
            }
            disabled={page === pagination.totalPage}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{' '}
            <strong>{selectedMusic?.title}</strong>?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to publish{' '}
            <strong>{selectedMusic?.title}</strong>?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handlePublish}>
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MusicListing;
