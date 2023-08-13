let locateCartById = document.getElementsByClassName('cartInfo')[0];
let API_URL;
if (window.location.hostname === 'localhost' && window.location.port === '3000') {
  API_URL = 'http://localhost:3000/api';
} else {
  API_URL = 'http://localhost:8080/api';
}

function putIntoCart(_id) {
  const cartIdValue = locateCartById?.getAttribute('id');
  console.log('cartIdValue:', cartIdValue);
  console.log('_id:', _id);
  if (cartIdValue === undefined) {
    window.location.href = '/api/sessions/current';
  }
  const url = API_URL + '/carts/' + cartIdValue + '/product/' + _id;
  const data = {};
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((res) => {
      alert('Product add to cart');
    })
    .catch((error) => {
      console.error('Error:', error);
      alert(JSON.stringify(error));
    });
}

function removeProductFromCart(_id) {
  addToCartById = localStorage.getItem('carrito-id');
  const url = API_URL + '/carts/' + addToCartById + '/products/' + _id;

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((res) => {
      alert('Product removed from cart');
    })
    .catch((error) => {
      console.error('Error:', error);
      alert(JSON.stringify(error));
    });
}

//FUNCION PARA VACIAR CARRITO
function clearCart() {
  const cartIdValue = locateCartById?.getAttribute('id');
  const url = API_URL + '/carts/' + addToCartById;

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  window.location.reload();

  fetch(url, options)
    .then((response) => response.json())
    .then((res) => {
      alert('Cart cleared successfully');
    })
    .catch((error) => {
      console.error('Error:', error);
      alert(JSON.stringify(error));
    });
}
