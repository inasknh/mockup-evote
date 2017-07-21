$(document).ready(function() {
    var nama = '';

    $('#npm').focus();    

    $('#npm').on('keypress keyup change paste click input', function(event) {
        return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 13;
    });

    $(document).ajaxStart(function() {
        swal_loading = swal({
            html: true,
            imageUrl: 'img/loading.gif',
            title: 'Mengambil Data...',
            showCancelButton: false,
            showConfirmButton: false            
        });
    });

    $('#npm-form').submit(function(event) {
        event.preventDefault();
        $('*:focus').blur();

        $.ajax({
            url: 'token.json', /* token.json OR tokendone.json OR tokenfail.json */
            type: 'GET',
            dataType: 'json',
            data: {'npm': $('#npm').val()},
        })
        .done(function(r) {
            var result = JSON.parse(JSON.stringify(r));

            if (result.status == 'ok') 
            {
                nama = result.nama;

                $('#foto-pemilih').attr('src', 'img/jundi.jpg');
                $('#nama-pemilih').html('<b>'+nama+'</b>');
                $('#npm-pemilih').html(result.npm);
                $('#fakultas-pemilih').html(result.fakultas);
                $('#jurusan-pemilih').html(result.jurusan);

                var hak_pemilih = '';

                if (result.sesi_pemilihan) 
                {                
                    for (var h = result.sesi_pemilihan, i = 0; i < h.length; i++)
                    {
                        var votingStatus = h[i].sudah_tersedia;
                        var isVoterVoted = h[i].sudah_memilih;

                        if (votingStatus === '0')
                            var label = '<span class="label label-danger">BELUM DIMULAI</span>&nbsp;&nbsp;';
                        else if (votingStatus === '2')
                            var label = '<span class="label label-danger">SUDAH SELESAI</span>&nbsp;&nbsp;';
                        else if (isVoterVoted)
                            var label = '<span class="label label-danger">SUDAH MEMILIH</span>&nbsp;&nbsp;';
                        else
                            var label = '<span class="label label-success">BELUM MEMILIH</span>&nbsp;&nbsp;';

                        hak_pemilih += 
                            '<li class="text-uppercase list-group-item"><div class="row"><div class="col-md-9 wrap">'+h[i].nama_pemilihan+'</div><div class="col-md-3">'+label+'</div></div></li>';
                    }
                }
                else
                {
                    hak_pemilih += '<li class="text-uppercase list-group-item text-green"><b>TIDAK MEMILIKI HAK SUARA</b></li>'
                }
                                        
                $('#hak-pemilih').html(hak_pemilih);
                $('#data-pemilih-body').removeClass('hidden');
                $('#data-pemilih-panel .panel-header span').addClass('hidden');
                $('#btn-generate-token').removeClass('hidden');
                $('#user-pemilih').html('');
                $('#token-pemilih').html('');
                $('#token-info').removeClass('hidden');

                swal({ title: '', showConfirmButton: false, timer: 0 });  // just to cancel the starting swal
            }
            else if (result.status == 'error')
            {
                swal({
                    title: result.reason,
                    showConfirmButton: false,
                    timer: 1200,
                    type: 'error'
                });
            }
        })
        .fail(function() {
            ajaxErrorAlert();
        })
        .always(function() {
            $('#npm').val('');
            $('#npm').focus();
        });        
    });

    $(document).on('click', '#btn-generate-token', function(e){
        e.preventDefault();

        $('#token-pemilih').html(randomToken());
        $('#user-pemilih').html(nama);
        $('#token-pemilih').removeClass('hidden');
        $('#user-pemilih').removeClass('hidden');  
        $('#token-info').addClass('hidden');
        $('#btn-generate-token').addClass('hidden');
    });

    function randomToken()
    {
        return Math.floor(Math.random()*9000) + 1000;
    }
});