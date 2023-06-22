// API key: 37642435-e4446bd0bb140ef40df83585e
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const refs = {
  form: document.querySelector('.search-form'),
  listImg: document.querySelector('.gallery'),
  targetLoadMore: document.querySelector('.targetLoadMore'),
};

refs.form.addEventListener('submit', handlerSubmit);


async function handlerSubmit(evt) {
  evt.preventDefault();
  query = refs.form.elements.searchQuery.value;
  page = 1;

    const result = await serviceImageSearch();
    Notiflix.Notify.info(
        `Hooray! We found ${result.totalHits} images.`
    )
    refs.listImg.innerHTML = '';
    if (result.totalHits === 0) {
        observer.unobserve(refs.targetLoadMore);
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
    } else {
        createMarkup(result.hits);
        // refs.btnLoadMore.classList.remove('hide');
        maxpage = result.totalHits / 40;
    }
    observer.observe(refs.targetLoadMore);
  refs.form.reset();
}

let lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});
let page;
let query;
let maxpage;
let observer = new IntersectionObserver(onObserver);


async function serviceImageSearch() {
  const BASE_URL = 'https://pixabay.com/api/';
  const searchParams = new URLSearchParams({
    key: '37642435-e4446bd0bb140ef40df83585e',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 40,
  });
  const url = `${BASE_URL}?${searchParams}`;
    const response = await axios.get(url);
    console.log(response);
  if (response.status !== 200) {
    throw new Error(response.status);
  }
  return response.data;
}

function createMarkup(arr) {
  const markup = arr
    .map(({ likes, views, comments, downloads, tags, webformatURL, largeImageURL }) => {
        return `<div class="photo-card">
      <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b><span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span>${downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');
    refs.listImg.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
}

async function handlerLoadMore() {
  page += 1;
  if (page > maxpage) {
   
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    const nextImg = await serviceImageSearch();
      createMarkup(nextImg.hits);
      window.scrollBy({
        top: 550,
        behavior: 'smooth',
      });
  }
}

function onObserver (entries, observer) {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          handlerLoadMore();
    }; 
  });
};

