import DateDisplay from "components/DateDisplay";
import { DateDistance } from "components/DateDistance";
import { DirectionDisplay } from "components/DirectionDisplay";
import { MessageDisplay } from "components/MessageDisplay";
import NumberDisplay from "components/NumberDisplay";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "components/ui/table";
import { Textarea } from "components/ui/textarea";
import { Toggle } from "components/ui/toggle";
import { Pencil } from "lucide-react";
import { Entry } from "model/entry";
import { EntryType, getEntryType } from "model/entryType";
import { Size } from "model/size";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateNotes } from "service/entryQueries";
import { DeleteEntryButton } from "./DeleteEntryButton";
import { EntryImages } from "./EntryImages";
import { EntryResult } from "./EntryResult";

type Props = {
  entry: Entry;
};

const UpdateNotes = ({ entry }: Props) => {
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(entry.notes!);
  const mutation = useUpdateNotes(entry.id!);

  return (
    <Card>
      <CardHeader className="pt-2">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">Notes</div>
          <div className="flex md:justify-end mt-4 md:mt-0">
            <Toggle
              aria-label="Toggle Edit"
              pressed={editing}
              onClick={() => setEditing((prev) => !prev)}
            >
              <Pencil />
            </Toggle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <MessageDisplay message={mutation.error} variant="destructive" />
        {editing ? (
          <div>
            <div className="mb-4">
              <Textarea defaultValue={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button
                className="w-full sm:w-1/2 md:w-1/3"
                onClick={() => {
                  mutation.mutate(notes);
                  setEditing(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div aria-label="entry notes">{notes}</div>
        )}
      </CardContent>
    </Card>
  );
};

export const ClosedEntry = ({ entry }: Props) => {
  const [deleteError, setDeleteError] = useState<any>(null);
  const navigation = useNavigate();
  const entryType = getEntryType(entry.entryType)!;

  const items = [
    {
      label: "Entry Date",
      value: <DateDisplay withTime>{entry.date}</DateDisplay>,
    },
    {
      label: "Exit Date",
      value: <DateDisplay withTime>{entry.exitDate}</DateDisplay>,
    },
    {
      label: "Entry Price",
      value: <NumberDisplay>{entry.price}</NumberDisplay>,
    },
    {
      label: "Entry Size",
      value: <NumberDisplay>{entry.size}</NumberDisplay>,
    },
    {
      label: "Exit Price",
      value: <NumberDisplay>{entry.exitPrice}</NumberDisplay>,
    },
    {
      label: "Take Profit Price",
      value: entry.profit ? <NumberDisplay>{entry.profit}</NumberDisplay> : "N/A",
    },
    {
      label: "Stop Loss Price",
      value: entry.loss ? <NumberDisplay>{entry.loss}</NumberDisplay> : "N/A",
    },
    {
      label: "Costs",
      value: entry.costs ? <NumberDisplay>{entry.costs}</NumberDisplay> : "N/A",
    },
    {
      label: "Planned RR",
      value: entry.plannedRR ? <NumberDisplay>{entry.plannedRR}</NumberDisplay> : "N/A",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <MessageDisplay message={deleteError} variant="destructive" />
      <Card>
        <CardHeader>
          <div className="flex flex-col items-start justify-between md:flex-row md:items-center ">
            <div className="flex items-center justify-start gap-2 md:gap-4">
              <div>
                <span className="pl-0 text-2xl font-bold">{entry.symbol}</span>
              </div>
              <div className="text-xl">
                <EntryResult entry={entry} />
              </div>
            </div>
            <div className="flex md:justify-end mt-4 md:mt-0">
              <div className="flex flex-wrap items-center gap-2">
                <div>
                  <Badge variant="outline" className="text-base" aria-label="entry type">
                    {React.createElement(entryType.icon, { className: "h-5 w-5 mr-2" })}
                    {entryType.type}
                  </Badge>
                </div>
                <div>
                  {entryType.type === EntryType.STOCK && (
                    <Badge variant="outline" className="text-base">
                      <DateDistance startDate={entry.date} endDate={entry.exitDate!} />
                    </Badge>
                  )}
                </div>
                <div>
                  {entry.direction && (
                    <Badge variant="outline">
                      <DirectionDisplay direction={entry.direction} withLabel size={Size.LARGE} />
                    </Badge>
                  )}
                </div>
                <div>
                  <DeleteEntryButton
                    entry={entry}
                    onError={(error) => setDeleteError(error)}
                    onSuccess={() => navigation("/trading/entries")}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
            <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
              <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="h-2 rounded-lg bg-[#ecedef]" />
                ))}
              </div>
            </div>
          </div>
          <span className="block w-full p-2 text-center font-normal text-muted-foreground">
            Chart will be available in the future
          </span>
          <div>
            <EntryImages entryId={entry.id!} />
          </div>

          <Table>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.label}>
                  <TableCell colSpan={3} className="font-medium">
                    {item.label}
                  </TableCell>
                  <TableCell className="text-right">{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <UpdateNotes entry={entry} />
        </CardContent>
      </Card>
    </div>
  );
};
