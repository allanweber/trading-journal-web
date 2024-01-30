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
    //TODO: be able to close trade when click here
    <Badge variant="outline" className="hover:text-gray-500 w-20 h-6 font-bold">
      <Circle className="h-3 w-4 mr-1" />
      Open
    </Badge>
  );
};
