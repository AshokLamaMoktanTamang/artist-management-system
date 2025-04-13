import AddAlbumDialog from '../../components/AddAlbumDialog';

const ArtistDashboard = () => {
  return (
    <>
      <div className="flex justify-between">
        <h2 className='font-medium'>Albums</h2>
        <AddAlbumDialog />
      </div>
      
    </>
  );
};

export default ArtistDashboard;
