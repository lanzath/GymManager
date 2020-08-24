// Get the current page path
const currentPage = location.pathname;
const menuItems = document.querySelectorAll('header .links a');

// Iterates menu links and applies class active into each element
for (item of menuItems) {
  if (currentPage.includes(item.getAttribute('href'))) {
    item.classList.add('active');
  }
};

// Paginate
// [1, ..., 13, 14, 15, 16, 17, ..., 20]
function paginate(selectedPage, totalPages) {
  let pages = [],
      oldPage;

  // push to pages array numbers as example array (line 13)
  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;

    if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {

      if (oldPage && currentPage - oldPage > 2) {
        pages.push('...');
      }

      if (oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1);
      }

      pages.push(currentPage);

      oldPage = currentPage;
    }
  }
  return pages;
}

const pagination = document.querySelector('.pagination');
// + operator will transform string number into a number data
const page = +pagination.dataset.page;
const total = +pagination.dataset.total;
const pages = paginate(page, total);

let elements = '';

for (let page of pages) {
  if (String(page).includes('...')) {
    elements += `<span>${page}</span>`;
  } else {
    elements += `<a href="?page=${page}">${page}</a>`;
  }
}

pagination.innerHTML = elements;
