// json-server --watch db.json --port 8000
const API = "http://localhost:8000/products";
let inpauthor = document.querySelector("#author");
let inppost = document.querySelector("#post");
let inpImg = document.querySelector("#image");
let btnSave = document.querySelector("#btn-save");
let modal = document.querySelector("#exampleModal");
let list = document.querySelector("#list");
// edit part
let editInpauthor = document.querySelector("#edit-author");
let editInppost = document.querySelector("#edit-post");
let editInpImg = document.querySelector("#edit-img");
let editBtnSave = document.querySelector("#edit-btn-save");
let editModal = document.querySelector("#editModal");

//Search
let searchInp = document.querySelector("#search");
let searchVal = "";
// pagination
let paginationList = document.querySelector("#pagination-list");
let prev = document.querySelector("#prev");
let next = document.querySelector("#next");
let currentPage = 1;
let pageCount = 1;

// todo ADD NEW post
btnSave.addEventListener("click", () => {
    let author = inpauthor.value;
    let post = inppost.value;
    let img = inpImg.value;
    // console.log(author, post)

    if (!author || !post) {
        alert("Заполните поля!");
        return;
    }

    let obj = {
        author: author,
        post: post,
        img: img,
    };
    postNewProduct(obj);
});

// TODO ADD REQUEST
function postNewProduct(newProduct) {
    // console.log(newProduct)

    fetch(API, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(newProduct),
    })
        .then(() => {
            modal.click();
            inpauthor.value = "";
            inppost.value = "";
            inpImg.value = "";
            render();
            showAlert("success", "успешно создан");
        })
        .catch((err) => {
            console.log(err);
        });
}

// TODO READ
function render() {
    fetch(`${API}?q=${searchVal}&_limit=3&_page=${currentPage}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            list.innerHTML = "";
            data.reverse().forEach((item) => {
                let card = drawCard(item);
                list.innerHTML += card;
            });
            drawPagBtns();
        });
}
render();

function drawCard(obj) {
    // console.log(obj)
    return `
    <div class="card bg-light text-dark my-2 w-100 mb-3" style="width: 22rem;">
		<div class="card-header fs-2 fw-bolder">@${obj.author}</div>
		<div class="card-body d-flex align-items-center justify-content-between">
        <h5 class="card-author mx-1 text-wrap">Post:<br><p>${obj.post}</p></h5>
		</div>
		<div class="h-75 d-flex justify-content-center">
		<img id="img" src="${obj.img}" class="img-fluid mb-3" alt="" >
		</div>
        <div class="d-flex justify-content-end mb-2 me-1">
        <button id="${obj.id}" class="btn btn-danger btn-del mx-1 ">Delete</button>
        <button id="${obj.id}" class="btn btn-info btn-edit mx-1 " data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
		<button id="${obj.id}" class="btn btn-warning btn-like mx-1 ">like</button>
		<button id="${obj.id}" class="btn btn-dark btn-like mx-1 ">comment</button>
        </div>
    </div>
	`;
}
// function noImg(){
// 	let img = document.getElementById("img");
// 	if(img==null){
// 		console.log(img);
// 		return img.style.display = "none";
// 	}
// }
// noImg()
// todo	delete
document.addEventListener("click", (e) => {
    // console.log(e.target.classList);
    let arr = [...e.target.classList];
    if (arr.includes("btn-del")) {
        let id = e.target.id;
        fetch(`${API}/${id}`, {
            method: "DELETE",
        }).then((res) => {
            // console.log(res);
            render();
            showAlert("danger", "deleted");
        });
    }
});

// todo edit
document.addEventListener("click", (e) => {
    // console.log(e.target.classList);
    let arr = [...e.target.classList];
    if (arr.includes("btn-edit")) {
        let id = e.target.id;
        fetch(`${API}/${id}`)
            .then((res) => res.json())
            .then((data) => {
                // console.log(data)
                editInpauthor.value = data.author;
                editInppost.value = data.post;
                editInpImg.value = data.img;
                editBtnSave.setAttribute("id", data.id);
            });
    }
});

editBtnSave.addEventListener("click", () => {
    let answer = confirm("are u sure?");
    if (!answer) {
        return;
    }
    let author = editInpauthor.value;
    let post = editInppost.value;
    let img = editInpImg.value;

    let obj = {
        author: author,
        post: post,
        img: img,
    };

    // console.log(obj);
    editProduct(obj, editBtnSave.id);
});

// todo search
searchInp.addEventListener("input", (e) => {
    // console.log(e.target.value);
    searchVal = e.target.value;
    // console.log(searchVal);
    currentPage = 1;
    render();
});

// todo pagination
function drawPagBtns() {
    fetch(`${API}?q=${searchVal}`)
        .then((res) => res.json())
        .then((data) => {
            // console.log(Math.ceil(data.length/3));
            pageCount = Math.ceil(data.length / 4);
            paginationList.innerHTML = "";
            for (let i = 1; i <= pageCount; i++) {
                paginationList.innerHTML += `
				<li class="page-item ${i == currentPage ? "active" : null}">
				<a class="page-link page_number" href="#">${i}</a></li>
				`;
            }
        });
}
next.addEventListener("click", () => {
    if (currentPage >= pageCount) return;
    currentPage++;
    render();
});

prev.addEventListener("click", () => {
    if (currentPage <= 1) return;
    currentPage--;
    render();
});

document.addEventListener("click", (e) => {
    // console.log(e.target.classList);
    let classes = e.target.classList;
    if (classes.contains("page_number")) {
        // console.log(e.target.innerText);
        currentPage = e.target.innerText;
        render();
    }
});
//! alert
let alertContainer = document.querySelector(".alert-cont");
function showAlert(type, text) {
    let alert = `
    <div class="alert alert-${type} show-alert" role="alert">
      ${text}
    </div>
  `;
    alertContainer.innerHTML = "";
    alertContainer.innerHTML = alert;
    alertContainer.style.display = "block";
    setTimeout(function () {
        alertContainer.style.display = "none";
    }, 3000);
}
