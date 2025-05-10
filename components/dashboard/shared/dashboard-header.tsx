import {Button} from '@/components/ui/button';
import {Plus} from 'lucide-react';
import {useRouter} from 'next/navigation';

interface DashboardHeaderProps {
  userType: string;
  userOptionType: string;
  title: string;
  btnText: string;
  route: string;
}

type Item = {
  item: DashboardHeaderProps;
};

const DashboardHeader = ({item}: Item) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between ">
      <h1 className="text-2xl font-bold tracking-tight">{item.title}</h1>
      {item.userType === item.userOptionType && (
        <Button
          onClick={() => router.push(item.route)}
          className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" /> {item.btnText}
        </Button>
      )}
    </div>
  );
};
export default DashboardHeader;
