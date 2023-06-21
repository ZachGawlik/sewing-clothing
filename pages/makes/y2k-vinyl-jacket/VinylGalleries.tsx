import * as React from 'react';

import imgVinylFinalFrontOpen from '../../../public/makes/vinyl/vinyl-final-front-open.jpeg';
import imgVinylFinalFront from '../../../public/makes/vinyl/vinyl-final-front.jpeg';

import imgVinylFinalStanding from '../../../public/makes/vinyl/vinyl-final-standing.jpeg';
import imgVinylFinalSide from '../../../public/makes/vinyl/vinyl-final-side.jpeg';
import imgVinylFinalBack from '../../../public/makes/vinyl/vinyl-final-back.jpeg';

import imgVinylMuslinInitialCropped from '../../../public/makes/vinyl/vinyl-muslin-initial-cropped.jpeg';
import imgVinylMuslinTapeCropped from '../../../public/makes/vinyl/vinyl-muslin-tape-cropped.jpeg';

import imgVinylSnapsBefore from '../../../public/makes/vinyl/vinyl-pre-snaps.jpeg';
import imgVinylSnapsInstalled from '../../../public/makes/vinyl/vinyl-snaps-installed.jpeg';

import {
  GalleryImages,
  GalleryItem,
} from '../../components/usePhotoswipeGallery';

const finalImages: GalleryItem[] = [
  {
    href: '/makes/vinyl/vinyl-final-front.jpeg',
    src: imgVinylFinalFront,
    linkProps: { className: 'col-start-1 row-start-2' },
    alt: 'TODO TK TK TK',
  },
  {
    href: '/makes/vinyl/vinyl-final-front-open.jpeg',
    src: imgVinylFinalFrontOpen,
    alt: 'TODO TK TK TK',
  },
  {
    href: '/makes/vinyl/vinyl-final-standing.jpeg',
    src: imgVinylFinalStanding,
    alt: 'TODO TK TK TK',
    linkProps: { className: 'col-span-2 row-span-2' },
    imgProps: { priority: true },
    caption:
      'The vinyl felt flimsy at first, but once the seams were in place the whole garment started to stiffen up. After several minutes I finally got it to stand up on its own for long enough to take a quick photo',
  },
  {
    href: '/makes/vinyl/vinyl-final-side.jpeg',
    src: imgVinylFinalSide,
    alt: 'TODO TK TK TK',
    linkProps: { className: 'col-start-4 row-start-1' },
  },
  {
    href: '/makes/vinyl/vinyl-final-back.jpeg',
    src: imgVinylFinalBack,
    alt: 'TODO TK TK TK',
    linkProps: { className: 'col-start-4 row-start-2' },
  },
];

export const VinylFinalGallery = () => {
  return (
    <GalleryImages
      className="not-prose grid grid-cols-4 grid-rows-2 gap-2"
      items={finalImages}
      id="vinyl-final-gallery"
      title="Completed vinyl jacket photos"
    />
  );
};

const muslinImages: GalleryItem[] = [
  {
    href: '/makes/vinyl/vinyl-muslin-initial-cropped.jpeg',
    src: imgVinylMuslinInitialCropped,
    caption: 'Initial try-on',
    alt: 'TODO TK TK TK',
  },
  {
    href: '/makes/vinyl/vinyl-muslin-tape-cropped.jpeg',
    src: imgVinylMuslinTapeCropped,
    caption:
      '"Alterations" made by applying masking tape to see if it fixed the visual balance',
    alt: 'TODO TK TK TK',
  },
];

export const VinylMuslinGallery = () => {
  return (
    <GalleryImages
      className="not-prose grid grid-cols-2 gap-2"
      items={muslinImages}
      id="vinyl-muslin-gallery"
      title="Vinyl jacket muslin"
    />
  );
};

const snapsImages: GalleryItem[] = [
  {
    href: '/makes/vinyl/vinyl-pre-snaps.jpeg',
    src: imgVinylSnapsBefore,
    alt: 'TKTKTK',
    caption: 'Before snaps...',
  },
  {
    href: '/makes/vinyl/vinyl-snaps-installed.jpeg',
    src: imgVinylSnapsInstalled,
    alt: 'TKTKTKTK',
    caption: 'After snaps installed',
  },
];

export const VinylSnapsGallery = () => {
  return (
    <GalleryImages
      className="not-prose max-w-[500px] m-auto grid grid-cols-2 gap-2"
      items={snapsImages}
      id="vinyl-snaps-gallery"
      title="Vinyl jacket front snap installation"
    />
  );
};
