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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "components/ui/carousel";
import { TrashIcon } from "lucide-react";
import { Entry } from "model/entry";
import { useEffect, useState } from "react";
import { useDeleteImage, useGetImages, useSaveImage } from "service/entryQueries";

type Props = {
  entry: Entry;
  locked?: boolean;
};

export const EntryImages = ({ entry, locked = false }: Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const { data: images } = useGetImages(entry.id!);
  const saveMutation = useSaveImage(entry.id!);
  const deleteMutation = useDeleteImage(entry.id!);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api, images, saveMutation, deleteMutation]);

  const deleteImage = () => {
    if (images && images[current - 1]) {
      deleteMutation.mutate(images[current - 1].imageId);
    }
  };

  const ImageDataAndDelete = () => {
    if (!images || !images[current - 1]) {
      return null;
    }
    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <div className="flex items-center space-x-2">
            {images[current - 1].fileName}
            <TrashIcon className="ml-2 h-6 w-6 sm:h-4 sm:w-4 hover:scale-150 hover:cursor-pointer" />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {`This will permanently delete the image ${
                images[current - 1].fileName
              }. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteImage()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <div>
      <div>
        {images && images.length > 0 ? (
          <Carousel setApi={setApi} className="max-w-md mx-auto">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <ZoomImage>
                    <img
                      src={image.url}
                      alt={image.fileName}
                      loading="lazy"
                      style={{
                        objectFit: "contain",
                        objectPosition: "50% 50%",
                        width: "100%",
                      }}
                    />
                  </ZoomImage>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious type="button" size="icon" />
            <CarouselNext type="button" size="icon" />
          </Carousel>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground text-center">
            No images, use the upload bellows to add images to this entry
          </div>
        )}
        <div className="flex justify-center items-center">
          <div className="py-2 text-center text-sm text-muted-foreground">
            Image {current} of {count}
          </div>
          <div className="ml-2">
            <ImageDataAndDelete />
          </div>
        </div>
      </div>
      {!locked && (
        <div>
          <Uploader folder={entry.id!} onFileUploaded={(image) => saveMutation.mutate(image)} />
        </div>
      )}
    </div>
  );
};
