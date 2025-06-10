import WaitingSubmit from '@/components/promise/WaitingSubmit';
import PlaceCategoryMap from '@/components/promise/map/PlaceCategoryMap';
import { usePromiseDataFromServerInfo } from '@/hooks/stores/promise/usePromiseDataFromServerStore';

const FinalizePage = () => {
  const { promiseDataFromServer } = usePromiseDataFromServerInfo();

  if (!promiseDataFromServer.isAllMemebersSubmit) {
    return <WaitingSubmit />;
  }

  return <PlaceCategoryMap />;
};

export default FinalizePage;
