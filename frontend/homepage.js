/* global axios */

const itemTemplate = document.querySelector("#homepage-book-template");
const bookList = document.querySelector(".image-grid");

const instance = axios.create({
    baseURL: "http://localhost:8000/api",
  });
  
async function main() {
    
    try {
      // 抓用戶名並顯示
      const userId = localStorage.getItem("ID");
      const user = document.querySelector("#memberID");
      user.innerText = `${user.innerText} ${userId}`;

    
      Books = await getAllBooks();
      Books.forEach((book) => renderAllBooks(book));
      // bookList.innerHTML = "";
    
    } catch (error) {
      Swal.fire({
        icon: 'warning', // Set the icon (success, error, warning, info, question)
        title: 'Fail to load books!',
        showConfirmButton: true
        // timer: 3000
      });
      console.log(error);
    }
    
    $(document).ready(function() {
        // 書本超連結
        $('.image-grid').on('click', '.introduction-page', function() {
            const bookTitle = $(this).find('span').text();
            console.log(bookTitle);
            localStorage.setItem('storedText', bookTitle);
            window.location.href = "./introduction.html"
        });

        // 類別按鈕
        $('.themeicon').on('click', async function() {
          const bookCategory = $(this).attr('id');
          const headText = document.querySelector("#headText");
          headText.innerText = bookCategory;

          Books = await getCategoryBooks({"category":bookCategory});
          bookList.innerHTML = ""
          Books.forEach((book) => renderAllBooks(book));
          
          // 顯示書本
          $('.book-div').hide();
          $('.book-div').slice(0, 5).css('transform', 'translateX(0)').fadeIn(500);
          
        });

        var currentPage = 1;

        // 上一頁按鈕點擊事件
        $('#prev-btn').on('click', function () {
            console.log('上一頁按鈕被點擊');
            if (currentPage > 1) {
                currentPage--;
                slideLeft(currentPage);
            }
        });
    
        // 下一頁按鈕點擊事件
        $('#next-btn').on('click', function () {
            console.log('下一頁按鈕被點擊');
            var totalBooks = $('.book-div').length;
            var booksPerPage = 5;
            var totalPages = Math.ceil(totalBooks / booksPerPage);
    
            if (currentPage < totalPages) {
                currentPage++;
                slideRight(currentPage);
            }
        });
    
        // 顯示書本一開始執行一次

        $('.book-div').hide();
        $('.book-div').slice(0, 5).css('transform', 'translateX(0)').fadeIn(500);

        // 搜尋框
        $('#search-box').on('keyup', async function(event) {
          try {
    
            if (event.key === 'Enter') {
              const textInput = document.querySelector("#search-box");
              const text = textInput.value;
              if (!text) {
                Swal.fire({
                  icon: 'warning', // Set the icon (success, error, warning, info, question)
                  title: "Please enter word!",
                  showConfirmButton: true,
                });
                return;
              }
              Books = await getSearchBooks({"name":text})
              
              bookList.innerHTML = ""
              Books.forEach((book) => renderAllBooks(book));
              // 顯示書本
              $('.book-div').hide();
              $('.book-div').slice(0, 5).css('transform', 'translateX(0)').fadeIn(500);

              if(Books.length === 0){
                // 未找到書警告
                Swal.fire({
                  icon: 'warning', // Set the icon (success, error, warning, info, question)
                  title: 'No book Found!',
                  showConfirmButton: true
                  // timer: 3000
                });
                return;
              }
            }
          
          } catch (error) {
            Swal.fire({
              icon: 'error', // Set the icon (success, error, warning, info, question)
              title: "Failed to Search books!",
              showConfirmButton: true,
            });
            console.log(error);
          }
        });


    });

  }

function slideLeft(currentPage) {
    var booksPerPage = 5;
    var startBook = (currentPage - 1) * booksPerPage;
    var currentBook = (currentPage + 1) * booksPerPage;
    var endBook = startBook + booksPerPage;
    
    setTimeout(function() {          
      $('.book-div').slice(currentBook-5, currentBook).css('transform', 'translateX(100%)');            
    }, 200);

    setTimeout(function() {                    
      $('.book-div').slice(currentBook-1, currentBook).css('transform', 'translateX(20)').fadeOut(); 
    }, 200);
  
    setTimeout(function() {
      $('.book-div').css('transform', 'translateX(0)').hide();
    }, 700);

    setTimeout(function() {
    $('.book-div').slice(startBook, endBook).css('transform', 'translateX(0)').fadeIn(750);
     }, 700);

}

function slideRight(currentPage) {
  var booksPerPage = 5;
  var startBook = (currentPage - 1) * booksPerPage;
  var currentBook = (currentPage - 2) * booksPerPage;
  var endBook = startBook + booksPerPage;
  setTimeout(function() {      
      
    $('.book-div').slice(currentBook, startBook).css('transform', 'translateX(-100%)');          
  }, 200);

  setTimeout(function() {                    
    $('.book-div').slice(currentBook, currentBook+1).css('transform', 'translateX(20)').fadeOut(500); 
  }, 200);

  setTimeout(function() {
    $('.book-div').css('transform', 'translateX(0)').hide();
  }, 700);

  setTimeout(function() {
  $('.book-div').slice(startBook, endBook).css('transform', 'translateX(0)').fadeIn(750);
   }, 700);

}

// 抓取書本資訊
async function renderAllBooks(books) {
    const item = itemTemplate.content.cloneNode(true);
    // 圖片
    const coverImage = item.querySelector(".book-image");
    urlpic = "./image/" + books.cover
    coverImage.src = urlpic;

    // 書名
    const names = item.querySelector("span.book-series");
    names.innerText = books.name;

    // 作者
    const author = item.querySelector(".author-name");
    author.innerText = books.author;

    // 類別
    const category = item.querySelector("span.genre");
    category.innerText = books.category;

    // 瀏覽次數
    const times = item.querySelector("span.times");
    times.innerText = `${times.innerText} ${books.times} ${"次"}`;

    // 加入前端List
    bookList.appendChild(item);
    
}


// 前端呼叫後端function
async function getAllBooks() {
    const response = await instance.get("/books/all");
    return response.data;
}

async function getCategoryBooks(category) {
    // console.log({params:category})
    const response = await instance.get("/books/category", {params:category});
    return response.data;
}

async function getSearchBooks(name) {
  // console.log({params:category})
  const response = await instance.get("/books/search", {params:name});
  return response.data;
}

main();






