function ajaxErrorAlert()
{
    swal({
        html: true,
        type: 'error',
        title: 'Terjadi Error',
        text: 'Terjadi error pada sistem. Silakan muat ulang halaman ini.',
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'Muat Ulang'
    }, function(isConfirm){
        if (isConfirm) window.location.reload(true);
    });
}