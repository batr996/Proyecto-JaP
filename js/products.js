const ORDER_ASC_BY_PRICE = "$a";
const ORDER_DESC_BY_PRICE = "$b";
const ORDER_BY_REL = "Rel.";
var currentProductsArray = [];
var minPrice = undefined;
var maxPrice = undefined;

function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_DESC_BY_PRICE) {
        result = array.sort(function (a, b) {
            if (a.cost < b.cost) { return -1; }
            if (a.cost > b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_ASC_BY_PRICE) {
        result = array.sort(function (a, b) {
            if (a.cost > b.cost) { return -1; }
            if (a.cost < b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_REL) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }

    return result;
}

function showProductsList(currentProductsArray) {

    let htmlContentToAppend = "";
    for (let i = 0; i < currentProductsArray.length; i++) {
        let product = currentProductsArray[i];

        if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) &&
            ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice))) {

            htmlContentToAppend += `
            <a href="product-info.html" class="list-group-item list-group-item-action col-12 col-sm-6 col-md-3">
                <div class="card mb-4 shadow-sm custom-card">
                        <img src="` + product.imgSrc + `" alt="` + product.description + `" class="bd-placeholder-img card-img-top">
                        <h3 class="m-3">` + product.name + `</h3>
                        <div class="card-body"><p class="card-text">`+ product.description + `</p></div>
                        <div class="card-footer"><h4>` + product.currency + ` ` + product.cost + `</h4>
                        <small class="text-muted">` + product.soldCount + ` artículos</small></div>
                </div>
            </a>
            `
        }

        document.getElementById("product-list-container").innerHTML = htmlContentToAppend;
    }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    const searchBar = document.getElementById('productSearch');
    let filteredArray = [];
    
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProductsArray = resultObj.data;

            filteredArray = sortProducts(ORDER_ASC_BY_PRICE, currentProductsArray);

            showProductsList(filteredArray);
        }
    });

    searchBar.onkeyup = () => {
        let searchTerm = searchBar.value.toLowerCase();
        filteredArray = currentProductsArray.filter(item => {
            return item.name.toLowerCase().indexOf(searchTerm) > -1 ||
                item.description.toLowerCase().indexOf(searchTerm) > -1;
        });
        showProductsList(filteredArray);
    };

    searchBar.addEventListener("search", function (event) {
        filteredArray = currentProductsArray;
        showProductsList(filteredArray);
    });

    document.getElementById("sortPriceAsc").addEventListener("click", function () {
        filteredArray = sortProducts(ORDER_ASC_BY_PRICE, filteredArray);
        showProductsList(filteredArray);
    });

    document.getElementById("sortPriceDesc").addEventListener("click", function () {
        filteredArray = sortProducts(ORDER_DESC_BY_PRICE, filteredArray);
        showProductsList(filteredArray);
    });

    document.getElementById("sortByRel").addEventListener("click", function () {
        filteredArray = sortProducts(ORDER_BY_REL, filteredArray);
        showProductsList(filteredArray);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterPriceMin").value = "";
        document.getElementById("rangeFilterPriceMax").value = "";

        minPrice = undefined;
        maxPrice = undefined;

        showProductsList(filteredArray);
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por precio
        //del producto.
        minPrice = document.getElementById("rangeFilterPriceMin").value;
        maxPrice = document.getElementById("rangeFilterPriceMax").value;

        if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0) {
            minPrice = parseInt(minPrice);
        }
        else {
            minPrice = undefined;
        }

        if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0) {
            maxPrice = parseInt(maxPrice);
        }
        else {
            maxPrice = undefined;
        }

        showProductsList(filteredArray);
    });
});