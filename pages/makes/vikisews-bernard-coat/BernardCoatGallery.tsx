import * as React from 'react';
import imgBack from '../../../public/makes/vikisews-bernard-back.jpeg';
import imgDetails from '../../../public/makes/vikisews-bernard-details.jpeg';
import imgFlat from '../../../public/makes/vikisews-bernard-flat.jpeg';
import imgFrontClosed from '../../../public/makes/vikisews-bernard-front-closed.jpeg';
import imgFrontOpen from '../../../public/makes/vikisews-bernard-front-open.jpeg';
import bernardImageside from '../../../public/makes/vikisews-bernard-side.jpeg';
import {
  GalleryItem,
  GalleryImages,
} from '../../components/usePhotoswipeGallery';

const bernardImages: GalleryItem[] = [
  {
    href: '/makes/vikisews-bernard-front-open.jpeg',
    src: imgFrontOpen,
    alt: 'Me standing facing the camera straight-on wearing a structure blue-green wool coat with strong shoulders and a notched lapel. The float arches out from the waist down to the hem reaching my knees due to wearing it unbuttoned.',
    linkProps: { className: 'col-span-2 row-span-2' },
    imgProps: { priority: true },
  },
  {
    href: '/makes/vikisews-bernard-side.jpeg',
    src: bernardImageside,
    alt: 'Side 3/4 view of me wearing the coat',
  },
  {
    href: '/makes/vikisews-bernard-details.jpeg',
    src: imgDetails,
    alt: 'Zoomed in photo of a flat lay of the coat, showing the front button, the matching sleeve buttons, the small horizontal chest welt pocket and the tip of the slanted front welt pocket',
  },
  {
    href: '/makes/vikisews-bernard-back.jpeg',
    src: imgBack,
    alt: 'Back view of me wearing the coat',
  },
  {
    href: '/makes/vikisews-bernard-front-closed.jpeg',
    src: imgFrontClosed,
    alt: 'Front view with buttons closed, one arm in pocket',
  },
  {
    href: '/makes/vikisews-bernard-flat.jpeg',
    src: imgFlat,
    alt: 'Flat lay of the top half of the coat showing to show the seamlines around the collar, notched lapel and the shiny black lining',
  },
];

const BernardCoatGallery = () => {
  return (
    <GalleryImages
      className="not-prose max-w-[550px] m-auto grid grid-cols-3 grid-rows-3 gap-2"
      id="bernard-gallery"
      items={bernardImages}
      title="Completed VikiSews Bernard Coat photos"
    />
  );
};

export default BernardCoatGallery;
