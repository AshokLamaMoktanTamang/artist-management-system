import { Button } from '@/components/button';
import { toastSuccess } from '@shared/utils/toast';

export function App() {
  return (
    <div className="m-8">
      <Button
        onClick={() => {
          toastSuccess('test', 'etestestestes ajscvakjcv asjhcvasjhcvashjcv');
        }}
      >
        Show Toast
      </Button>
    </div>
  );
}

export default App;
