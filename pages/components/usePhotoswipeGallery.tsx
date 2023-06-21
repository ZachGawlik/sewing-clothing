import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react';
import cx from 'classnames';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { StaticImageData } from 'next/image';

export const usePhotoswipeGallery = ({
  id,
  title,
}: {
  id: string;
  title?: string;
}) => {
  React.useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${id}`,
      children: '.pswp-gallery__item',
      pswpModule: () => import('photoswipe'),

      showAnimationDuration: 200,
      hideAnimationDuration: 200,
    });

    lightbox.on('uiRegister', function () {
      if (title) {
        lightbox.pswp?.ui?.registerElement({
          name: 'pswp__gallery-title',
          className:
            'pswp__gallery-title ml-8 self-center text-slate-200 text-sm',
          order: 6,
          onInit: (el) => {
            el.innerText = title;
          },
        });
      }

      lightbox.pswp?.ui?.registerElement({
        name: 'custom-caption',
        className: 'pswp__custom-caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        html: '<div class="pswp__custom-caption__inner bg-slate-800 opacity-80 rounded-lg text-sm"></div>',
        onInit: (el, pswp) => {
          pswp.on('change', () => {
            const currSlideElement = lightbox?.pswp?.currSlide?.data.element;
            const innerEl = el.querySelector('.pswp__custom-caption__inner');
            const captionText =
              currSlideElement?.querySelector('.hidden-caption-content')
                ?.innerHTML || '';

            if (innerEl) {
              innerEl.innerHTML = captionText;
              innerEl.classList.toggle('px-4', !!captionText);
              innerEl.classList.toggle('py-2', !!captionText);
            }
          });
        },
      });
    });

    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, [id, title]);
};

export type GalleryItem = {
  href: string;
  src: StaticImageData;
  alt: string;
  caption?: string;
  linkProps?: { className?: string };
  imgProps?: { priority?: boolean };
};

export const GalleryImages = ({
  className,
  items,
  id,
  title,
}: {
  className?: string;
  items: GalleryItem[];
  id: string;
  title?: string;
}) => {
  usePhotoswipeGallery({
    id,
    title,
  });
  return (
    <div id={id} className={className}>
      {items.map(({ href, src, alt, caption, linkProps, imgProps }) => (
        <div
          className={cx('pswp-gallery__item', linkProps?.className)}
          key={href}
        >
          <Link
            className="block h-full w-full"
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
          {caption && <div className="hidden-caption-content">{caption}</div>}
        </div>
      ))}
    </div>
  );
};
