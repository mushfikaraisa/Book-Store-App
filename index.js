const API_URL = 'https://bookstore-api-six.vercel.app/api/books';
const booksContainer = document.getElementById('books-container');
const bookForm = document.getElementById('book-form');

const loadBooks = async () => {
  try {
    const cachedBooks = localStorage.getItem('books');
    if (cachedBooks) {
      displayBooks(JSON.parse(cachedBooks));
      return;
    }
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch books');
    const books = await response.json();
    localStorage.setItem('books', JSON.stringify(books));
    displayBooks(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    booksContainer.innerHTML = '<p class="text-danger">Error loading books.</p>';
  }
};

const displayBooks = (books) => {
  booksContainer.innerHTML = '';
  books.forEach(book => {
    const bookCol = document.createElement('div');
    bookCol.className = 'col-md-4';
    bookCol.innerHTML = `
      <div class="book-card h-100">
        <h5 class="fw-bold text-primary">${book.title}</h5>
        <p class="mb-1"><strong>Author:</strong> ${book.author}</p>
        <p class="mb-1"><strong>ISBN:</strong> ${book.isbn}</p>
        <p class="mb-2"><strong>Price:</strong> $${book.price}</p>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${book.id}">Delete</button>
      </div>
    `;
    booksContainer.appendChild(bookCol);
  });
};

bookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const bookData = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    isbn: document.getElementById('isbn').value,
    price: parseFloat(document.getElementById('price').value),
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(bookData),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to add book');
    const newBook = await response.json();
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    books.push(newBook);
    localStorage.setItem('books', JSON.stringify(books));
    displayBooks(books);
    bookForm.reset();
  } catch (error) {
    console.error('Error adding book:', error);
    alert('Failed to add book.');
  }
});

booksContainer.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.dataset.id;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete book');

      const books = JSON.parse(localStorage.getItem('books') || '[]').filter(book => `${book.id}` !== id);
      localStorage.setItem('books', JSON.stringify(books));
      displayBooks(books);
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book.');
    }
  }
});

document.addEventListener('DOMContentLoaded', loadBooks);
