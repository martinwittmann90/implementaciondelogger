/*---------------LOGOUT BUTTON-----------------*/
const logoutBtn = document.getElementById('logout-btn');

logoutBtn.onclick = async () => {
  try {
    const loadingElement = document.createElement('div');
    loadingElement.textContent = 'Loading...';
    document.body.appendChild(loadingElement);

    localStorage.removeItem('cartID');
    await fetch('/api/sessions/logout');

    document.body.removeChild(loadingElement);

    const successElement = document.createElement('div');
    successElement.textContent = 'Redirecting to login page...';
    document.body.appendChild(successElement);

    setTimeout(() => {
      document.body.removeChild(successElement);
      window.location.href = '/?login=true';
    }, 2500);
  } catch (error) {
    const errorElement = document.createElement('div');
    errorElement.textContent = 'Oops... Something went wrong!';
    document.body.appendChild(errorElement);

    setTimeout(() => {
      document.body.removeChild(errorElement);
    }, 2500);
  }
};

/*---------------CARROUSEL PRODUCTS HOME-----------------*/
document.addEventListener('DOMContentLoaded', function () {
  const carouselItems = document.querySelectorAll('.carousel-item');
  let currentIndex = 0;

  function showNextImage() {
    carouselItems[currentIndex].classList.remove('active');
    carouselItems[currentIndex].classList.add('hidden');

    currentIndex = (currentIndex + 1) % carouselItems.length;

    carouselItems[currentIndex].classList.remove('hidden');
    carouselItems[currentIndex].classList.add('active');
  }

  // Mostrar la siguiente imagen cada 5 segundos
  setInterval(showNextImage, 5000);
});
