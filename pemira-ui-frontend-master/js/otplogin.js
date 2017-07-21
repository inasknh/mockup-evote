$(document).ready(function() {    
    $('#otp-token').focus();

    var otp_qr = new QRCode(document.getElementById('otp-qrcode'), {
        text: '77a8d8b9c9e0a09ff7c0a9d',
        width: 172,
        height: 172,
        correctLevel: QRCode.CorrectLevel.H
    });

    $(document).ajaxStart(function() {
        swal({
            html: true,
            imageUrl: 'img/loading.gif',
            title: '<h5>Mengautentikasi penjaga...</h5>',            
            showCancelButton: false,
            showConfirmButton: false            
        });
    });

    $('#otp-token-form').submit(function(e) {
        e.preventDefault();
        $('*:focus').blur();
       
        $.ajax({
            url: 'login.json',
            type: 'GET',
            dataType: 'json',
            data: {},
        })
        .done(function(r) {
            var result = JSON.parse(JSON.stringify(r));                

            if ($('#otp-token').val() === result.username) 
            {                                    
                window.location = 'token.html';
            }
            else
            {
                swal({
                    title: 'Autentikasi OTP Gagal',
                    text: 'Token salah',
                    showConfirmButton: false,
                    timer: 1200,
                    type: 'error'
                });
            }
        })
        .fail(function() {
            ajaxErrorAlert();
        });        
    });
});