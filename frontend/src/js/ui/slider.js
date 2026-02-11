import Swiper from "swiper/bundle";
import "swiper/css/bundle";

export function initSwiper(selector, options = {}) {
  return new Swiper(selector, {
    loop: true,
    spaceBetween: 16,
    slidesPerView: 4,
    navigation: {
      nextEl: `.swiper-btn-next`,
      prevEl: `.swiper-btn-prev`,
    },
    breakpoints: {
      1440: { slidesPerView: 4 },
      1024: { slidesPerView: 3 },
      576: { slidesPerView: 2 },
      0: { slidesPerView: 1 },
    },
    ...options,
  });
}
