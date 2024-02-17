

document.addEventListener("DOMContentLoaded", function() {
  const keyword = document.getElementById('textToHighlight').dataset.keyword;
  const elements = document.querySelectorAll('#textToHighlight');

  elements.forEach(element => {
    const name = element.textContent;
    const regex = new RegExp(
      keyword.replace(/./g, function(match) {
        if (match === 'a') {
          return '[aáàảãạâấầẩẫậăắằẳẵặ]';
        } else if (match === 'e') {
          return '[eéèẻẽẹêếềểễệ]';
        } else if (match === 'i') {
          return '[iíìỉĩị]';
        } else if (match === 'o') {
          return '[oóòỏõọôốồổỗộơớờởỡợ]';
        } else if (match === 'u') {
          return '[uúùủũụưứừửữự]';
        } else if (match === 'y') {
          return '[yýỳỷỹỵ]';
        } else {
          return match;
        }
      }),
      'gi'
    );

    element.innerHTML = name.replace(regex, match => `<span class="highlight">${match}</span>`);
  });

});
$(document).ready(function() {

  // Lấy đường dẫn hiện tại
  var currentPath = window.location.pathname;

  // Lấy danh sách các thẻ li trong menu
  var menuItems = document.getElementById('menu').getElementsByTagName('li');
  
  // Kiểm tra từng thẻ li trong menu
  for (var i = 0; i < menuItems.length; i++) {
      var menuItemLink = menuItems[i].querySelector('a');

      // So sánh đường dẫn hiện tại với href của từng thẻ a
      if (currentPath === menuItemLink.getAttribute('href')) {
          // Nếu trùng khớp, thêm class main-menu-active và loại bỏ class mega-menu-item
          menuItems[i].classList.add('main-menu-active');
          menuItems[i].classList.remove('mega-menu-item');
      } else {
          // Nếu không trùng khớp, giữ nguyên các class khác của mỗi mục
          menuItems[i].classList.remove('main-menu-active');
      }
  }

  const recentlyViewedPostsDiv = $('#recentlyViewedPostsForUser');
  const recentlyViewedPostsListDiv = $('#recentlyViewedPostsListForUser');
  const userIdSave = recentlyViewedPostsDiv.data('user-id'); // Đặt ID của người dùng đã đăng nhập
  const userIdGet = recentlyViewedPostsListDiv.data('user-id'); 
  const cleanedURL = recentlyViewedPostsListDiv.data('clean-url');
  const uploadPath = '/uploads/article/'
  const postToSave = (recentlyViewedPostsDiv.attr('data-post') !== undefined) ? JSON.parse(recentlyViewedPostsDiv.attr('data-post')) : ''
  formatTime = (fulltime) => {
    const date = new Date(fulltime);

    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate
  }
  
  // Hàm để lưu bài viết gần đây của người dùng vào LocalStorage
  function saveRecentlyViewedPostsForUser(userId, post) {
    // Kiểm tra xem userId có giá trị không
    if (userId) {
        const userKey = `user_${userId}`;
        let recentlyViewed = JSON.parse(localStorage.getItem(userKey)) || [];

        // Kiểm tra xem postId đã tồn tại trong danh sách chưa
        const existingPostIndex = recentlyViewed.findIndex(item => item._id === post._id);

        if (existingPostIndex !== -1) {
            // Nếu postId đã tồn tại, loại bỏ nó khỏi vị trí hiện tại
            recentlyViewed.splice(existingPostIndex, 1);
        }

        // Thêm mới post vào đầu danh sách
        recentlyViewed.unshift(post);

        // Giữ chỉ số đến mức tối đa (ví dụ: 5 bài viết gần đây)
        const maxRecentlyViewed = 4;
        recentlyViewed = recentlyViewed.slice(0, maxRecentlyViewed);

        // Lưu danh sách vào LocalStorage
        localStorage.setItem(userKey, JSON.stringify(recentlyViewed));
    } else {
        console.log('UserId is null. Không lưu vào localStorage.');
    }
}

  // Gọi hàm khi người dùng đăng nhập và xem một bài viết

  if (postToSave) saveRecentlyViewedPostsForUser(userIdSave, postToSave);

  // Hàm để lấy danh sách bài viết gần đây của người dùng từ LocalStorage
  function getRecentlyViewedPostsForUser(userId) {
    const userKey = `user_${userId}`;
    return JSON.parse(localStorage.getItem(userKey)) || [];
  }

  // Sử dụng hàm để lấy danh sách bài viết gần đây của người dùng
  const recentlyViewedPostsForUser = getRecentlyViewedPostsForUser(userIdGet);

  function appendRecentlyViewedPosts (recentlyViewed) {
    if (recentlyViewed.length > 0) {
      var htmlResult = ` <div class="how2 how2-cl4 flex-s-c m-r-10 m-r-0-sr991">
      <h3 class="f1-m-2 cl3 tab01-title">
          Recently Viewed Articles
      </h3>
    </div>
    <div class="row p-t-35">
    `
      for (let i = 0; i < recentlyViewed.length; i++) {
        htmlResult += `<div class="col-sm-6 p-r-25 p-r-15-sr991">
        <div class="m-b-45">
            <a href="${cleanedURL}blog-detail/${recentlyViewed[i]._id}" class="wrap-pic-w big-image hov1 trans-03">
                <img src="${uploadPath + recentlyViewed[i].thumb}" alt="${recentlyViewed[i].thumb}">
            </a>

            <div class="p-t-16">
                <h5 class="p-b-5">
                    <a href="${cleanedURL}blog-detail/${recentlyViewed[i]._id}" class="f1-m-3 cl2 hov-cl10 trans-03 clamp-text">
                        ${recentlyViewed[i].name} 
                    </a>
                </h5>

                <span class="cl8">
                  ${recentlyViewed[i].created.user_name}
                    <span class="f1-s-3 m-rl-3">
                        -
                    </span>

                    <span class="f1-s-3">
                        ${formatTime(recentlyViewed[i].created.time)}
                    </span>
                </span>
            </div>
        </div>
    </div>`
      }
      htmlResult = htmlResult + '</div>'
      recentlyViewedPostsListDiv.append(htmlResult)
    }
  }
  appendRecentlyViewedPosts(recentlyViewedPostsForUser)
  
  function equalizeAspectRatio() {
    // Lấy tất cả các hình ảnh trong class "wrap-pic-w"
    var images = document.querySelectorAll('.wrap-pic-w.image-in-home img');
  
    // Tính tỉ lệ khung hình của hình ảnh đầu tiên
    var firstImageAspectRatio = images[0].naturalWidth / images[0].naturalHeight;
  
    // Đặt chiều cao của tất cả các hình ảnh theo tỉ lệ khung hình của hình ảnh đầu tiên
    for (var i = 0; i < images.length; i++) {
      var imageAspectRatio = images[i].naturalWidth / images[i].naturalHeight;
      var targetHeight = images[i].clientWidth / firstImageAspectRatio;
      images[i].style.height = targetHeight + 'px';
    }
  }
  
  equalizeAspectRatio();

})

document.addEventListener("DOMContentLoaded", function() {
  function loadDataFromAPI() {
    var urlCoin = "https://apiforlearning.zendvn.com/api/get-coin";

    fetch(urlCoin)
        .then(response => response.json())
        .then(data => {

            // Xử lý dữ liệu nhận được từ API ở đây
            let htmlResult = ''
            data.forEach((item, index) => {
              htmlResult += `<tr>
              <th scope="row">${index}</th>
              <td>${item.name}</td>
              <td>${item.price}</td>
              <td>${item.percent_change_24h}</td>
              <td>${item.percent_change_1h}</td>
            </tr>`
            })
            $('#coinPriceTable').append(htmlResult)
        })
        .catch(error => console.error("Lỗi: " + error));

    var urlGold = "https://apiforlearning.zendvn.com/api/get-gold";

    fetch(urlGold)
        .then(response => response.json())
        .then(data => {

            // Xử lý dữ liệu nhận được từ API ở đây
            let htmlResult = ''
            data.forEach((item, index) => {
              htmlResult += `<tr>
              <th scope="row">${index}</th>
              <td>${item.type}</td>
              <td>${item.buy}</td>
              <td>${item.sell}</td>
            </tr>`
            })
            $('#goldPriceTable').append(htmlResult)
        })
        .catch(error => console.error("Lỗi: " + error));
  }
  loadDataFromAPI()

});



