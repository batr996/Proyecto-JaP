var productInfo = "";
var commentArray = [];


function showProductInfo(info) {


    let htmlContentToAppend = `
                <div class="justify-content-md-center m-5">
                    <div class="d-flex justify-content-between">
                        <h4 class="mb-3">` + info.name + `</h4>
                    </div>
                    <hr class="my-3">
                    <dl>
                        <dt>Precio</dt>
                        <dd><p>` + info.currency + " " + info.cost + `</p></dd>
                        <dt>Descripción</dt>
                        <dd><p>` + info.description + `</p></dd>
                        <dt>Categoría</dt>
                        <dd><a href="category-info.html">` + info.category + `</a></dd>
                        <dt>Cantidad de vendidos</dt>
                        <dd><p>` + info.soldCount + `</p></dd>
                        <dt>Imágenes ilustrativas</dt>
                        <div class="container col-md-8">
                        <div class="carousel slide" id="carousel" data-ride="carousel">
                        <div class="carousel-inner" id="images">
                        </div>
                        <a class="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#carousel" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                        </a>
                        </div></div><br>
                        <dt>Productos relacionados</dt>
                        <hr class="my-3">
                        <div class="row" id="related">
                        </div>
                        <dt>Comentarios</dt>
                        <hr class="my-3">
                        <div id="comments"></div>
                        <div id="newComments"></div><br>
                        <dt>Agregar nuevo</dt>
                        <hr class="my-3">
                        <dd class="text-muted">Agregar nuevo</dd>
                        <form> <textarea id="text" class="form-control col-md-6" rows="3"></textarea><br>
                        <dd class="text-muted">Puntuación</dd>
                        <select id="score" class="form-control col-md-1">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        </select>
                        <input type="submit" class="btn btn-primary mt-3" onclick="newComment()"></form>
                    </dl>
                </div>
            `


    document.getElementById("product-info-container").innerHTML = htmlContentToAppend;

};

function showImages(info) {
    info.images.forEach(element => {
        document.getElementById("images").innerHTML += ` <div class="carousel-item">
        <img src="` + element + `" class="img-thumbnail img-fluid d-block w-100" alt="..."></div> `
    })
    document.getElementsByClassName("carousel-item")[0].setAttribute("class", "carousel-item active");
};

function showRelatedProducts(info) {

    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            products = resultObj.data;

            info.relatedProducts.forEach(element => {
                document.getElementById("related").innerHTML += `<div class="col-md-3 card mb-4 shadow-sm custom-card"> 
                <img class="bd-placeholder-img card-img-top" src="`+ products[element].imgSrc + `" alt=""><h3 class="m-3">` + products[element].name + `</h3>
                <div class="card-body"><p class="card-text">`+ products[element].description + `</p>
                <a href="products.html"><p>Ver</p></a></div></div> `
            })
        }
    });

};

function newComment() {

    let cmtText = document.getElementById("text").value;
    let cmtUser = localStorage.getItem('email');
    let cmtScore = document.getElementById('score').value;
    let cmtDate = new Date;
    commentArray = {
        "score": cmtScore,
        "description": cmtText,
        "user": cmtUser,
        "dateTime": cmtDate.getFullYear() + "-" + cmtDate.getMonth() + "-" + cmtDate.getDate() + " " + cmtDate.getHours() + ":" + cmtDate.getMinutes() + ":" + cmtDate.getSeconds()
    }

    localStorage.setItem('newComment', JSON.stringify(commentArray));
};

function showComments() {
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            commentsArray = resultObj.data;

            if (localStorage.getItem('newComment')) {
                let sentComment = JSON.parse(localStorage.getItem('newComment'))
                commentsArray.push(sentComment)
            }

            let commentToShow = "";
            for (let i = 0; i < commentsArray.length; i++) {
                let comment = commentsArray[i];

                let starsScore = comment.score;
                let filledStars = ` <span class="fa fa-star checked"></span> `;
                let blankStars = ` <span class="fa fa-star"></span> `;
                let calification = filledStars.repeat(starsScore) + blankStars.repeat(5 - starsScore);

                commentToShow += `
                <dt class="d-inline">`+ comment.user + `</dt>
                <p class="d-inline">- `+ comment.dateTime + ` -</p>
                `+ calification + `
                <dd><p class="text-muted">`+ comment.description + `</p></dd>
                <hr class="my-3">
                `
            }
            document.getElementById("comments").innerHTML = commentToShow;
        }
    })
};


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productInfo = resultObj.data;

            showProductInfo(productInfo);
            showImages(productInfo);
            showRelatedProducts(productInfo);
            showComments();
        };
    })
});