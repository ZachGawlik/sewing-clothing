import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react';
import imgBack from '../../../public/makes/vikisews-bernard-back.jpeg';
import imgDetails from '../../../public/makes/vikisews-bernard-details.jpeg';
import imgFlat from '../../../public/makes/vikisews-bernard-flat.jpeg';
import imgFrontClosed from '../../../public/makes/vikisews-bernard-front-closed.jpeg';
import imgFrontOpen from '../../../public/makes/vikisews-bernard-front-open.jpeg';
import imgSide from '../../../public/makes/vikisews-bernard-side.jpeg';
import { usePhotoswipeGallery } from './usePhotoswipeGallery';
import cx from 'classnames';

type GalleryItem = {
  href: string;
  src: typeof imgFrontOpen;
  alt: string;
  linkProps?: { className?: string };
  imgProps?: { priority?: boolean };
};

const imgs: GalleryItem[] = [
  {
    href: '/makes/vikisews-bernard-front-open.jpeg',
    src: imgFrontOpen,
    alt: 'Me standing facing the camera straight-on wearing a structure blue-green wool coat with strong shoulders and a notched lapel. The float arches out from the waist down to the hem reaching my knees due to wearing it unbuttoned.',
    linkProps: { className: 'col-span-2 row-span-2' },
    imgProps: { priority: true },
  },
  {
    href: '/makes/vikisews-bernard-side.jpeg',
    src: imgSide,
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
  usePhotoswipeGallery('bernard-gallery');

  return (
    <div id="bernard-gallery" className="not-prose max-w-[550px] m-auto">
      <div className="grid grid-cols-3 grid-rows-3 gap-2">
        {imgs.map(({ href, src, alt, linkProps, imgProps }) => (
          <Link
            key={href}
            className={cx('block', linkProps?.className)}
            href={href}
            target="_blank"
            rel="noreferrer"
            data-cropped="true"
            data-pswp-width={src.width}
            data-pswp-height={src.height}
          >
            <Image
              {...imgProps}
              src={src}
              alt={alt}
              className="block h-full w-full rounded-lg object-cover object-center"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BernardCoatGallery;
