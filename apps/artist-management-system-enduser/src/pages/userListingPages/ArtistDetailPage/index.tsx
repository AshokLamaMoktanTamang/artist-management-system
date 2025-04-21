import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/table';
import { Card } from '@/components/card';
import { Skeleton } from '@/components/skeleton';
import { useFetchMusicsByUserQuery } from '@/store/slices/music.slice';
import { useGetUserDetailQuery } from '@/store/slices/user.slice';
import { config } from '@/config';
import { cn } from '@/utils/cn';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Loader } from 'lucide-react';

const ArtistDetailPage = () => {
  const { artistId = '' } = useParams();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: artist, isLoading: loadingArtist } = useGetUserDetailQuery({
    id: artistId,
  });

  const { data: musicData, isLoading: loadingMusics } =
    useFetchMusicsByUserQuery({
      id: artistId,
      limit,
      page,
    });

  const musics = musicData?.data || [];
  const pagination = musicData?.pagination;

  if (loadingArtist) return <Loader className="m-4 animate-spin" />;

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          {artist?.avatar ? (
            <img
              src={artist.avatar}
              alt={artist.full_name}
              className="h-14 w-14 object-cover rounded-full border"
            />
          ) : (
            <div className="h-14 w-14 bg-muted rounded-full flex items-center justify-center text-sm text-muted-foreground border">
              N/A
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold">{artist?.full_name}</h2>
            <p className="text-sm text-muted-foreground">{artist?.email}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">
          Music by {artist?.full_name}
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingMusics
              ? [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-14 w-14 rounded-md" />
                    </TableCell>
                    <TableCell colSpan={4}>
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
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {pagination && (
          <div className="flex justify-between items-center mt-4">
            <button
              className="text-sm text-muted-foreground"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPage}
            </span>
            <button
              className="text-sm text-muted-foreground"
              disabled={page === pagination.totalPage}
              onClick={() =>
                setPage((p) => Math.min(p + 1, pagination.totalPage))
              }
            >
              Next
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ArtistDetailPage;
