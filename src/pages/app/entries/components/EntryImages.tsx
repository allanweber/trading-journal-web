import { Uploader } from "components/Uploader";
import { ZoomImage } from "components/ZoomImage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "components/ui/alert-dialog";
import { TrashIcon } from "lucide-react";
import { Entry } from "model/entry";
import { ImageUploaded } from "model/fileUploaded";
import { useDeleteImage, useGetImages, useSaveImage } from "service/entryQueries";

type Props = {
  entry: Entry;
  locked?: boolean;
};

export const EntryImages = ({ entry, locked = false }: Props) => {
  const { data: images } = useGetImages(entry.id!);
  const saveMutation = useSaveImage(entry.id!);
  const deleteMutation = useDeleteImage(entry.id!);

  const deleteImage = (imageId: string) => {
    deleteMutation.mutate(imageId);
  };

  const DeleteImage = ({ image }: { image: ImageUploaded }) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <TrashIcon className="h-6 w-6 sm:h-4 sm:w-4 leading-0 font-semibold text-white hover:scale-125" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {`This will permanently delete the image ${image.fileName}. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteImage(image.imageId)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <div>
      <div>
        {images && images.length > 0 ? (
          <div className="max-w-screen-xl mb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-2">
              {images.map((image) => (
                <div key={image.imageId} className="relative flex justify-start items-end">
                  <ZoomImage>
                    <img
                      src={image.url}
                      alt={image.fileName}
                      className="h-64 w-full flex"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </ZoomImage>

                  <div className="absolute top-0 right-0 left-0 mx-1 mt-2">
                    <DeleteImage image={image} />
                  </div>

                  <div className="absolute right-0 left-0 mx-1 mt-2 text-white text-xs">
                    {image.fileName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !locked && (
            <div className="flex items-center justify-center h-16 text-muted-foreground text-center">
              No images, use the upload bellow to add images to this entry
            </div>
          )
        )}
      </div>
      {!locked && (
        <div>
          <Uploader folder={entry.id!} onFileUploaded={(image) => saveMutation.mutate(image)} />
        </div>
      )}
    </div>
  );
};
