import AddMusicDialog from '../../components/AddMusicDialog';
import MusicListing from '../../components/MusicListing';

const ArtistDashboard = () => {
  return (
    <>
      <div className="flex justify-between">
        <h2 className="font-medium">Musics</h2>
        <AddMusicDialog />
      </div>

      <MusicListing />
    </>
  );
};

export default ArtistDashboard;
