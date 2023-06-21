import { useEffect } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

export const usePhotoswipeGallery = (galleryId: string) => {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${galleryId}`,
      children: 'a',
      pswpModule: () => import('photoswipe'),

      showAnimationDuration: 200,
      hideAnimationDuration: 200,
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, [galleryId]);
};
