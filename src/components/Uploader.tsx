import { asUploadButton } from "@rpldy/upload-button";
import UploadDropZone from "@rpldy/upload-drop-zone";
import withPasteUpload from "@rpldy/upload-paste";
import Uploady, {
  useItemErrorListener,
  useItemFinishListener,
  useItemProgressListener,
  useItemStartListener,
} from "@rpldy/uploady";
import { useAuthState } from "lib/authentication";
import { UploadCloud, X } from "lucide-react";
import { ImageUploaded } from "model/fileUploaded";
import { Ref, forwardRef, useState } from "react";
import { Button } from "./ui/button";

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
  itemId: string;
  name: string;
  state: "pending" | "uploading" | "completed" | "error";
  completed: number;
  error?: string;
};

type Props = {
  url: string;
  onFileUploaded?: (file: ImageUploaded) => void;
};

export const Uploader = ({ url, onFileUploaded }: Props) => {
  const { getToken } = useAuthState();
  const [token, setToken] = useState<string>();
  getToken().then((t) => setToken(t));

  const destination = {
    url,
    method: "POST",
    filesParamName: "file",
    headers: { Authorization: `Bearer ${token}` },
  };

  const UploadStatusView = () => {
    const [files, setFiles] = useState<UploadStatus[] | undefined>([]);
    useItemStartListener((e) =>
      setFiles((prev) => {
        return [
          ...prev!,
          {
            itemId: e.id,
            name: e.file.name,
            state: "pending",
            completed: 0,
          },
        ];
      })
    );

    useItemFinishListener((item) => {
      if (onFileUploaded) {
        onFileUploaded({
          imageId: item.uploadResponse?.data.imageId,
          url: item.uploadResponse?.data.url,
          fileName: item.uploadResponse?.data.fileName,
        });
      }
      setFiles((prev) => {
        return prev!.map((i) => {
          if (i.itemId === item.id) {
            return {
              ...i,
              state: "completed",
              completed: 100,
            };
          }
          return i;
        });
      });
    });

    useItemProgressListener((item) =>
      setFiles((prev) => {
        return prev!.map((i) => {
          if (i.itemId === item.id) {
            return {
              ...i,
              completed: item.completed,
            };
          }
          return i;
        });
      })
    );

    useItemErrorListener((item) => {
      console.error(item);
      setFiles((prev) => {
        return prev!.map((i) => {
          if (i.itemId === item.id) {
            return {
              ...i,
              state: "error",
              error: item.uploadResponse?.data?.error?.message ?? item.uploadStatus,
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
            <div key={file.itemId} className="flex flex-col">
              <div className="rounded-md bg-[#F5F7FB] py-1 px-2">
                <div className="flex items-center justify-between">
                  <span className="truncate text-base font-medium text-[#07074D]">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-[#07074D] p-0 m-0"
                    onClick={() => {
                      setFiles((prev) => {
                        return prev!.filter((i) => i.itemId !== file.itemId);
                      });
                    }}
                  >
                    <X size={14} />
                  </Button>
                </div>
                {file.error ? (
                  <p className="text-red-500 dark:text-red-400 text-wrap max-w-xs md:max-w-md truncate">
                    {file.error}
                  </p>
                ) : (
                  <div className="relative mt-1 h-[6px] rounded-lg bg-[#E2E5EF]">
                    <div
                      className="absolute left-0 right-0 h-full rounded-lg bg-green-500 dark:bg-green-400"
                      style={{ width: `${file.completed}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Uploady autoUpload={true} multiple={true} destination={destination} accept=".png,.jpg,.jpeg">
      <PasteUploadDropZone params={{ test: "paste" }}>
        <PasteArea>
          <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-evenly space-y-2 pt-2">
              <UploadCloud size={40} className=" text-gray-500 dark:text-gray-400" />
              <p className="text-sm text-gray-500">Drag and Drop file, Paste from clipboard or</p>
              <ButtonAsUploadButton />
            </div>
          </div>
        </PasteArea>
      </PasteUploadDropZone>

      <div className="mt-2 flex flex-row flex-wrap">
        <UploadStatusView />
      </div>
    </Uploady>
  );
};
