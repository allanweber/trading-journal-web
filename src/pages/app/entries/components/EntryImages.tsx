import { Uploader } from "components/Uploader";
import { Entry } from "model/entry";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "components/ui/carousel";
import { useEffect, useState } from "react";

type Props = {
  entry: Entry;
};

const images = [
  {
    name: "image1",
    url: "https://res.cloudinary.com/dmhsxloua/image/upload/v1707199202/a.cassianoweber%40gmail.com/cls3fdag50001114nnskqlyeh/resized-3_cmopq8.jpg",
  },
  {
    name: "image2",
    url: "https://res.cloudinary.com/dmhsxloua/image/upload/v1707199202/a.cassianoweber%40gmail.com/cls3fdag50001114nnskqlyeh/resized-2_hj3adf.png",
  },
  {
    name: "image3",
    url: "https://res.cloudinary.com/dmhsxloua/image/upload/v1707199201/a.cassianoweber%40gmail.com/cls3fdag50001114nnskqlyeh/resized-1_gvmtuf.jpg",
  },
];

export const EntryImages = ({ entry }: Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="container">
      <div>
        <Carousel setApi={setApi} className="max-w-md mx-auto">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <img className="object-fill" src={image.url} alt={image.name} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious type="button" size="icon" />
          <CarouselNext type="button" size="icon" />
        </Carousel>
        <div className="py-2 text-center text-sm text-muted-foreground">
          Slide {current} of {count}
        </div>
      </div>
      <div>
        <Uploader folder={entry.id!} onFileUploaded={(e) => console.log(e)} />
      </div>
    </div>
  );
};
