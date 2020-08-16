// Get the current page path
const currentPage = location.pathname;
const menuItems = document.querySelectorAll('header .links a');

// Iterates menu links and applies class active into each element
for (item of menuItems) {
  if (currentPage.includes(item.getAttribute('href'))) {
    item.classList.add('active');
  }
};
