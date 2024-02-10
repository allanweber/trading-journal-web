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
import { ImageUploaded } from "model/fileUploaded";
import { useDeleteImage, useGetImages } from "service/entryQueries";

export const EntryImages = ({ entryId }: { entryId: string }) => {
  const { data: images } = useGetImages(entryId);
  const deleteMutation = useDeleteImage(entryId);

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
          <div className="flex items-center justify-center h-16 text-muted-foreground text-center">
            No images uploaded
          </div>
        )}
      </div>
    </div>
  );
};
