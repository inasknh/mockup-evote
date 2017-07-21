$(document).ready(function() {
    var isCurrentlySubmitted = false;

    $(document).ajaxStart(function() {
        swal({
            html: true,
            imageUrl: 'img/loading.gif',
            title: '<h5>Mengautentikasi pemilih...</h5>',            
            showCancelButton: false,
            showConfirmButton: false            
        });        
    });

    $('#login-penjaga-form').submit(function(e){
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

            if ($('#username').val() === result.username && 
                $('#password').val() === result.password) 
            {                                    
                window.location = 'index.html';
            }
            else
            {
                swal({
                    title: 'Autentikasi Gagal',
                    text: 'Username, password, atau token salah',
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