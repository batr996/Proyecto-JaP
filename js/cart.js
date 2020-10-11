const CART_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json"


function showCart(products) {
    tableBody = "";
    for (let i = 0; i < products.length; i++) {
        let product = products[i];

        tableBody += `
            <tbody><tr class="table-warning">
                <td><div class="row"><img src="` + product.src + `" alt="" class="img-thumbnail col-5">
                <div class="col"><h4 class="mb-1 text-center">`+ product.name + `</h4></div></div></td>
                <td><p class="text-center">`+ product.unitCost + ` ` + product.currency + `</p></td>
                <td><input type="number" name="count" class="count"
                min="1" value="`+ product.count + `" step="1"></td>
                <td><p class="subtotal text-center"></p></td>
                `
    }

    let htmlContentToAppend = `<div class="container">
    <div class="table-responsive">          
        <table class="table-hover table-bordered">
            <thead>
                <tr class="table-active">
                    <th>Producto</th>
                    <th>Precio por unidad</th>
                    <th>Cantidad</th>
                    <th>Subtotal en UYU</th>
                </tr>
            </thead>
            ` + tableBody + `
            </tr>
            <tr class="table-active table-borderless"><td></td><td></td><td><p class="text-right"><b>Seleccione tipo de envío:</b></p></td><td>
            <form name="radioForm" onchange="calculateTotal()"><div class="custom-control custom-radio">
            <input type="radio" class="custom-control-input" id="standard" name="shipping" value="0.05" checked>
            <label class="custom-control-label" for="standard">Standard - 12 a 15 días, costo del 5% sobre el subtotal.</label>
            </div><div class="custom-control custom-radio">
            <input type="radio" class="custom-control-input" id="express" name="shipping" value="0.07">
            <label class="custom-control-label" for="express">Express - 5 a 8 días, costo del 7% sobre el subtotal.</label>
            </div><div class="custom-control custom-radio">
            <input type="radio" class="custom-control-input" id="premium" name="shipping" value="0.15">
            <label class="custom-control-label" for="premium">Premium - 2 a 5 días, costo del 15% sobre el subtotal.</label>
            </div></form>
            </td></tr>
            <tr class="table-active table-borderless"><td></td><td></td><td><p class="text-right"><b>Total:</b></p></td><td><p id="total" class="font-weight-bold text-center"></p></td></tr>
            <tr class="table-active table-borderless"><td></td><td></td><td><p class="text-right"><b>Dirección de envío:</b></p></td><td>
            <input type="text" class="form-control" name="address" id="address" placeholder="Calle, número, esquina">
            </td></tr>
            </tbody>
        </table></br><form>
        <button type="submit" class="btn btn-secondary float-right">Confirmar compra</button></form>
        </div>
        </div>
            `

    document.getElementById("cart-list-container").innerHTML = htmlContentToAppend;
};

function calculateSubtotal(products) {
    let subtotal = document.getElementsByClassName('subtotal');
    let count = document.getElementsByClassName('count');
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        const productCount = count[i];
        const productSubtotal = subtotal[i];

        if (product.currency == "UYU") {
            productSubtotal.innerHTML = product.unitCost * productCount.value
        } if (product.currency == "USD") {
            productSubtotal.innerHTML = product.unitCost * productCount.value * 40
        }
        if (product.currency == "UYU") {
            productSubtotal.value = product.unitCost * productCount.value
        } if (product.currency == "USD") {
            productSubtotal.value = product.unitCost * productCount.value * 40
        }

        productCount.onchange = function (event) {
            if (product.currency == "UYU") {
                productSubtotal.innerHTML = product.unitCost * productCount.value
            } if (product.currency == "USD") {
                productSubtotal.innerHTML = product.unitCost * productCount.value * 40
            }
            calculateTotal();
        }
    }
};

function calculateTotal() {
    let total = document.getElementById('total');
    let subtotal = document.getElementsByClassName('subtotal');
    let rad = document.radioForm.shipping;
    let a = 0;
    let b = 0;

    for (let i of subtotal) {
        a += parseInt(i.innerHTML);
        b = a + (a * rad.value);
        total.innerHTML = b + ` UYU`;
    }
};


document.addEventListener("DOMContentLoaded", function (e) {

    getJSONData(CART_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            cartProducts = resultObj.data;

            showCart(cartProducts.articles);
            calculateSubtotal(cartProducts.articles);
            calculateTotal();
        }
    });

});