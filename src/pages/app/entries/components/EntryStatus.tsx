import { Badge } from "components/ui/badge";
import { Award, BookmarkMinus, Circle } from "lucide-react";
import { Entry } from "model/entry";

type Props = {
  entry: Entry;
};

export const EntryStatus = ({ entry }: Props) => {
  if (entry.result) {
    if (entry.result > 0) {
      return (
        <Badge className="bg-emerald-500 hover:bg-emerald-600 w-20 h-6">
          <Award className="h-4 w-4 mr-1" />
          Win
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-500 hover:bg-red-600 w-20 h-6">
          <BookmarkMinus className="h-4 w-4 mr-1" />
          Loss
        </Badge>
      );
    }
  }

  return (
    //TODO: be able to close trade when click here
    <Badge className=" bg-zinc-500 hover:bg-zinc-600 w-20 h-6">
      <Circle className="h-3 w-4 mr-1" />
      Open
    </Badge>
  );
};
