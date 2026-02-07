import Swiper from "swiper/bundle";
import "swiper/css/bundle";

export function initSwiper(selector, options = {}) {
  return new Swiper(selector, {
    loop: true,
    spaceBetween: 20,
    slidesPerView: 4,
    navigation: {
      nextEl: `.swiper-button-next`,
      prevEl: `.swiper-button-prev`,
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
