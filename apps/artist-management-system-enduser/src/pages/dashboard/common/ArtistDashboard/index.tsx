import AddAlbumDialog from '../../components/AddAlbumDialog';
import AlbumListing from '../../components/AlbumListing';

const ArtistDashboard = () => {
  return (
    <>
      <div className="flex justify-between">
        <h2 className="font-medium">Albums</h2>
        <AddAlbumDialog />
      </div>

      <AlbumListing />
    </>
  );
};

export default ArtistDashboard;
