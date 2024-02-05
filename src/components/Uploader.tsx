import { asUploadButton } from "@rpldy/upload-button";
import UploadDropZone from "@rpldy/upload-drop-zone";
import withPasteUpload from "@rpldy/upload-paste";
import Uploady, {
  BatchItem,
  useItemErrorListener,
  useItemFinishListener,
  useItemProgressListener,
  useItemStartListener,
} from "@rpldy/uploady";
import { useAuthState } from "lib/authentication";
import { UploadCloud } from "lucide-react";
import { Ref, forwardRef, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const PasteUploadDropZone = withPasteUpload(UploadDropZone);
const SimpleContainer = forwardRef<HTMLDivElement>((props, ref) => {
  return <div ref={ref} {...props} className="w-full" />;
});
const PasteArea = withPasteUpload(SimpleContainer);

const ButtonAsUploadButton = asUploadButton(
  forwardRef<HTMLButtonElement>((props, ref) => {
    return (
      <Button type="button" variant="link" ref={ref as Ref<HTMLButtonElement>} {...props}>
        click here
      </Button>
    );
  })
);

type UploadStatus = {
  item: BatchItem;
};

const UploadStatusView = () => {
  const [files, setFiles] = useState<UploadStatus[] | undefined>([]);

  useItemStartListener((e) =>
    setFiles((prev) => {
      return [
        ...prev!,
        {
          id: e.id,
          item: e,
        },
      ];
    })
  );

  useItemFinishListener(() =>
    setFiles((prev) => {
      return prev!.map((item) => {
        if (item.item.completed === 100) {
          return {
            ...item,
          };
        }
        return item;
      });
    })
  );

  useItemProgressListener((item) =>
    setFiles((prev) => {
      return prev!.map((i) => {
        if (i.item.id === item.id) {
          return {
            ...i,
            item,
          };
        }
        return i;
      });
    })
  );

  useItemErrorListener((item) => {
    setFiles((prev) => {
      return prev!.map((i) => {
        if (i.item.id === item.id) {
          return {
            ...i,
          };
        }
        return i;
      });
    });
  });

  if (!files || files.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-col flex-wrap gap-4 w-full">
      {files.map((file) => {
        return (
          <div key={file.item.id} className="flex flex-col">
            <span>{file.item.file.name}</span>
            <div
              className="h-ful h-2 bg-green-500 dark:bg-green-400 rounded-lg"
              style={{ width: `${file.item.completed}%` }}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

type Props = {
  url: string;
};

export const Uploader = ({ url }: Props) => {
  const { getToken } = useAuthState();
  const [accessToken, setAccessToken] = useState("");
  getToken().then((token) => {
    setAccessToken(token!);
  });

  const destination = {
    url,
    filesParamName: "file",
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return (
    <Uploady autoUpload={true} multiple={true} destination={destination} accept=".png,.jpg,.jpeg">
      <Card>
        <CardContent className="p-0">
          <PasteUploadDropZone params={{ test: "paste" }}>
            <PasteArea>
              <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-evenly space-y-2 pt-2">
                  <UploadCloud size={40} className=" text-gray-500 dark:text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Drag and Drop file, Paste from clipboard or
                  </p>
                  <ButtonAsUploadButton />
                </div>
              </div>
            </PasteArea>
          </PasteUploadDropZone>
        </CardContent>
      </Card>
      <div className="mt-2 flex flex-row flex-wrap">
        <UploadStatusView />
      </div>
    </Uploady>
  );
};
