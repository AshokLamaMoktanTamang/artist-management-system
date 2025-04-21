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
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from '@/store/slices/user.slice';
import { UserDetail } from '@/store/types';
import { toastSuccess } from '@shared/utils/toast';
import { USER_ROLE } from '@/types';

const userTypeMap: Record<USER_ROLE, string> = {
  ARTIST: 'Artist',
  ARTIST_MANAGER: 'Artist Manager',
  SUPER_ADMIN: 'Super Admin',
};

const UserListPage = () => {
  const limit = 10;

  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data, isLoading } = useGetAllUsersQuery({ limit, page });
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const users = data?.data || [];
  const pagination = data?.pagination;

  const handleDelete = async () => {
    if (!selectedUser) return;

    deleteUser({ userId: selectedUser.id })
      .unwrap()
      .then(() => {
        toastSuccess(
          'User deleted',
          `User "${selectedUser.full_name}" was deleted.`
        );
        setShowDeleteDialog(false);
      });
  };

  return (
    <Card className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </TableCell>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.avatar ? (
                      <img
                        src={user?.avatar}
                        alt={user.full_name}
                        className="h-10 w-10 object-cover rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center text-xs text-muted-foreground">
                        N/A
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell className="capitalize">
                    {userTypeMap[user.role]}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        // setShowEditDialog(true); // add edit logic if needed
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteDialog(true);
                      }}
                      disabled={deleting}
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
            <strong>{selectedUser?.full_name}</strong>?
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
    </Card>
  );
};

export default UserListPage;
