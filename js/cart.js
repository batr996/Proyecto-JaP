const CART_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json"


function showCart(products) {
    tableBody = "";
    for (let i = 0; i < products.length; i++) {
        let product = products[i];

        tableBody += `
            <tbody><tr>
                <td><div class="row"><img src="` + product.src + `" alt="" class="img-thumbnail img-fluid d-block col-5">
                <div class="col d-flex align-items-center"><div class="top-align-text"><h4 class="mb-1">`+ product.name + `</h4>
                <hr><div class="bottom-align-text"><p>Precio unitario: `+ product.unitCost + ` ` + product.currency + `</p></div></div></div></td>
                <td><input type="number" name="count" class="count"
                min="1" value="`+ product.count + `" step="1"></td>
                <td><p class="subtotal text-center font-weight-bold"></p></td>
                <td><button type="button" class="remove btn btn-danger" onclick="deleteRow(this)">Eliminar artículo</button></td>
                `
    }

    let htmlContentToAppend = `
    <div class="table-responsive">          
        <table id="table" class="table-hover">
            <thead>
                <tr class="table-active">
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Subtotal en UYU</th>
                </tr>
            </thead>
            ` + tableBody + `
            </tr>
            </tbody>
            </table><br><div class="container"><div class="row">
            <div class="col-6"><p><b>Seleccione tipo de envío:</b></p>
            <form action="#" name="radioForm" onchange="calculateTotal()"><div class="custom-control custom-radio">
            <input type="radio" class="custom-control-input" id="standard" name="shipping" value="0.05" checked>
            <label class="custom-control-label" for="standard">Standard - 12 a 15 días, costo del 5% sobre el subtotal.</label>
            </div><div class="custom-control custom-radio">
            <input type="radio" class="custom-control-input" id="express" name="shipping" value="0.07">
            <label class="custom-control-label" for="express">Express - 5 a 8 días, costo del 7% sobre el subtotal.</label>
            </div><div class="custom-control custom-radio">
            <input type="radio" class="custom-control-input" id="premium" name="shipping" value="0.15">
            <label class="custom-control-label" for="premium">Premium - 2 a 5 días, costo del 15% sobre el subtotal.</label>
            </div></div></form><div class="col-6">
            <p><b>Costo de envío:</b></p></td><td><h5 id="shippingCost" class="font-weight-bold text-center"></h5><hr>
            <p><b>Total:</b></p><h4 class="font-weight-bold text-center"><u id="total"></u></h4></div></div></div>
            <br>
        <div class="col-6 float-right"><button type="button" class="btn btn-primary float-right" data-toggle="modal" data-target="#paymentModal">
        Seleccionar método de pago y confirmar compra
        </button></div>
        <div class="modal fade" id="paymentModal" tabindex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
        <h4 class="modal-title" id="paymentModalLabel">Método de pago</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div class="modal-body">
        <form name="paymentForm" action="#" role="form" class="needs-validation">
        <div id="creditCard"><div class="form-group">
            <label for="cardNumber">
                Número de tarjeta de crédito</label>
            <div class="input-group">
                <input type="text" class="form-control" id="cardNumber" name="cardNumber" placeholder="Número de tarjeta válido"
                     autofocus />
                <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-5 col-md-5">
                <div class="form-group">
                    <label for="expityMonth">
                        Fecha de vencimiento</label>
                    <div class="col-xs-6 col-lg-6 pl-ziro float-left" style="padding: 0px">
                        <input type="text" class="form-control" id="expiryMonth" name="expiryMonth" placeholder="Mes" />
                    </div>
                    <div class="col-xs-6 col-lg-6 pl-ziro float-right" style="padding: 0px">
                        <input type="text" class="form-control" id="expiryYear" name="expiryYear" placeholder="Año" /></div>
                </div>
            </div>
            <div class="col-xs-5 col-md-5 pull-right">
                <div class="form-group">
                    <label for="cvCode" title="Código de 3 a 4 dígitos situado en el reverso de la tarjeta">
                        Código CV</label>
                    <input type="password" class="form-control" id="cvCode" name="cvCode" placeholder="CV" />
                </div>
            </div>
        </div></div>
        <div class="form-group">
            <label for="address">
            Dirección de envío:</label>
            <div class="input-group">
            <input type="text" class="form-control" name="address" id="address" placeholder="Calle, número, esquina" required>
            </div>
        </div>
        <div class="col-xs-12 col-md-12"><input type="checkbox" class="custom-control-input" id="bank" name="bank" onclick="paymentMethod()">
        <label class="custom-control-label" for="bank">Si desea pagar por transferencia bancaria seleccione esta opción.</label>
        </div><br>
        <div class="col-xs-12 col-md-12"><p id="transfer"><b>Datos para la transacción</b><br>IBAN: GB94BARC10201530093459<br>BIC: BSCHESMG
        <br>Número de pedido: `+ getTransferNumber() + `<br>Tu pedido se enviará cuando confirmemos que el pago ha sido recibido.<br>
        Para asociar más rapidamente tu transferencia con tu pedido, indica en el concepto de la transferencia tu número de pedido.</p></div>
        <div class="float-right"><button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
        <button type="submit" class="btn btn-primary" id="submit">Confirmar compra</button></div></form>
        </div>
        </div>
        </div>
        </div>
        </div>
            `

    document.getElementById("cart-list-container").innerHTML = htmlContentToAppend;
};

(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

function deleteRow(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    calculateTotal();
};

function paymentMethod() {
    var checkbox = document.getElementById('bank');
    var transfer = document.getElementById('transfer');
    var payform = document.paymentForm;
    var cc = document.getElementById('creditCard')

    if (checkbox.checked == true) {
        transfer.style.display = "block";
        cc.style.display = "none";
        payform.cardNumber.removeAttribute('required', '');
        payform.expiryYear.removeAttribute('required', '');
        payform.expiryMonth.value.removeAttribute('required', '');
        payform.cvCode.removeAttribute('required', '');
    } else {
        transfer.style.display = "none";
        cc.style.display = "block";
        payform.cardNumber.setAttribute('required', '');
        payform.expiryYear.setAttribute('required', '');
        payform.expiryMonth.value.setAttribute('required', '');
        payform.cvCode.setAttribute('required', '');
    }
};

function getTransferNumber() {
    return Math.floor(Math.random() * (50000 - 1) + 1);
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
    let shippingCost = document.getElementById('shippingCost');
    let rad = document.radioForm.shipping;
    let a = 0;
    let b = 0;

    for (let i of subtotal) {
        a += parseInt(i.innerHTML);
        b = a + (a * rad.value);
        total.innerHTML = b + ` UYU`;
        shippingCost.innerHTML = parseInt(a * rad.value) + ` UYU`;
    }
};


document.addEventListener("DOMContentLoaded", function (e) {

    getJSONData(CART_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            cartProducts = resultObj.data;

            showCart(cartProducts.articles);
            calculateSubtotal(cartProducts.articles);
            calculateTotal();
            paymentMethod();
        }
    });

});