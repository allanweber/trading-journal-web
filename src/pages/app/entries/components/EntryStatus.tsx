import { Badge } from "components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "components/ui/dialog";
import { Award, BookmarkMinus, Circle } from "lucide-react";
import { Entry, OrderStatus } from "model/entry";
import { CloseTradeForm } from "./CloseTradeForm";

type Props = {
  entry: Entry;
};

export const EntryStatus = ({ entry }: Props) => {
  if (entry.orderStatus === OrderStatus.CLOSED) {
    if (entry.result && entry.result > 0) {
      return (
        <Badge variant="outline" className="text-green-700 hover:text-green-600 font-bold w-20 h-6">
          <Award className="h-4 w-4 mr-1" />
          Win
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-red-700 hover:text-red-600 font-bold w-20 h-6">
          <BookmarkMinus className="h-4 w-4 mr-1" />
          Loss
        </Badge>
      );
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Badge variant="outline" className="hover:text-gray-500 w-20 h-6 font-bold">
          <Circle className="h-3 w-4 mr-1" />
          Open
        </Badge>
      </DialogTrigger>
      <DialogContent>
        <CloseTradeForm entry={entry} />
      </DialogContent>
    </Dialog>
  );
};
