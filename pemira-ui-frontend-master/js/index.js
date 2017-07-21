var pemilihan = {};
$(document).ready(function() {
    // binding data to pemilihan object on click
    $(document).on('click', 'input[type=checkbox]', function(){
        var t = $(this);        
        pemilihan[t.attr('name')]['no_urut'] = (t[0].checked) ? t.val() : null;
    });

    // load the data and diplay it
    $.ajax({
        url: 'json.json',
        type: 'POST',
        dataType: 'json',
        data: {'npm': '1306464114'},
    })
    .done(function(r) {
        var result = JSON.parse(JSON.stringify(r));
        var surat_suara_content = [];
        var list_surat_suara = '';

        for (var p = result.pemilihan, i = 0; i < p.length; i++) 
        {
            var nama_pemilihan = p[i].nama_pemilihan.replace(/ /g,'');
            var id_pemilihan = p[i].nama_pemilihan.replace(/[-[\]{}()*+?.,\\^$|#\s\&]/g, '');
            
            pemilihan[id_pemilihan] = {};
            pemilihan[id_pemilihan]['no_urut'] = null;
            pemilihan[id_pemilihan]['id_pemilihan'] = p[i].id_pemilihan;            

            surat_suara_content.push(
                '<span id="'+id_pemilihan+'-header" class="font-24 text-black text-bold text-uppercase">'+p[i].nama_pemilihan+'</span><br><br />',
                '<div id="'+id_pemilihan+'" class="panel panel-default surat-suara inline-block"><div class="panel-body text-center"><div class="surat-suara-header"><h6><b>SURAT SUARA PEMILIHAN RAYA</b></h6><h6><b class="text-uppercase">'+p[i].nama_pemilihan+'</b></h6><h6><b>TAHUN 2017</b></h6></div><br><div class="surat-suara-content table-content"><div class="table-row">',
                '<input type="hidden" name="'+id_pemilihan+'_nama_pemilihan" value="'+p[i].nama_pemilihan.toUpperCase()+'">'
            );

            for (var c = p[i].daftar_calon, j = 0; j < c.length; j++) 
            {
                var nama_calon_arr = c[j].nama_calon.split('-');
                var nama_calon = '';

                if (nama_calon_arr.length == 2) 
                    nama_calon += '<div class="calon-ketua text-uppercase table-cell"><b>'+nama_calon_arr[0]+'</b></div><div class="calon-wakil text-uppercase table-cell"><b>'+nama_calon_arr[1]+'</b></div>';
                else
                    nama_calon += '<div class="calon-sendiri text-uppercase table-cell"><b>'+nama_calon_arr[0]+'</b></div>';

                surat_suara_content.push(
                    '<label for="'+id_pemilihan+(j+1)+'">',
                    '<input type="hidden" name="'+id_pemilihan+c[j].no_urut+'_calon" value="'+c[j].nama_calon.toUpperCase()+'">',
                    '<input type="checkbox" class="calon-input" name="'+id_pemilihan+'" id="'+id_pemilihan+(j+1)+'" value="'+c[j].no_urut+'">',
                    '<div class="card calon"><div class="card-body">',
                    '<div class="checked-mark text-green"></div>',
                    '<div class="checked-icon glyphicon glyphicon-ok text-white"></div>',
                    '<div class="nomor-calon clearfix">',
                    '<span class="relative"><b>'+c[j].no_urut+'</b></span>',
                    '</div><div class="foto-calon ">',
                    '<img src="'+c[j].foto_calon+'" alt="calon">',
                    '</div><div class="nama-calon table-content">',
                    nama_calon,                    
                    '</div></div></div><div class="checked text-center">&nbsp;</div></label>'
                );
            }

            surat_suara_content.push('</div></div></div></div><br><br /><br />');            

            // append string surat suara nav
            list_surat_suara += '<li><a href="#'+id_pemilihan+'-header" class="btn btn-default btn-lg btn-block reset-button-style btn-surat-suara waves-effect waves-light dark-color text-uppercase"><div class="wrap">'+p[i].nama_pemilihan+'</div></a></li>';
        }        

        $('#surat-suara-viewport').append(surat_suara_content.join('\n'));
        $('#surat-suara-nav').append(list_surat_suara);
    })
    .fail(function() {
        ajaxErrorAlert();
    });

    // activate scroll spy
    $('[data-spy="scroll"]').each(function () {
        var spy = $(this).scrollspy('refresh');
    })

    $('#submit-surat-suara').click(function(e){
        e.preventDefault();

        var confirmation_html = '<table class="table table-striped text-left">';
        var ringkasan_pilihan = [];

        for (var k in pemilihan)
        {
            if (pemilihan.hasOwnProperty(k))
            {                
                if (pemilihan[k]['no_urut'])
                    var calon_terpilih = $('input:hidden[name="'+k+pemilihan[k]['no_urut']+'_calon"]').val().replace(/-/g, ' &amp; <br>');
                else
                    var calon_terpilih = '<span class="text-red">Tidak memilih</span>';

                confirmation_html += '<tr><td>'+$('input:hidden[name="'+k+'_nama_pemilihan"]').val()+'</td><td>'+calon_terpilih+'</td><tr>';
                ringkasan_pilihan.push(pemilihan[k]);
            }                            
        }

        confirmation_html += '</table>';

        swal({
            html: true,
            title: 'Sudah Yakin dengan Pilihan Anda?',
            text: 
                '<span>Pilihan tidak bisa diubah kembali setelah kirim. Setiap pemilih hanya memiliki kesempatan satu kali untuk memilih.</span><br>'+
                confirmation_html,
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: 'batal',
            confirmButtonText: 'kirim',
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
        },  
        function(){
            // ajax to save the data
            $.ajax({
                url: 'submit.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    npm: '1306464114',
                    pilihan: ringkasan_pilihan
                }
            })
            .done(function(r) {
                if (r) 
                {
                    swal({
                        html: true,
                        title: 'Suara Anda Telah Direkam',
                        text: 'Terima kasih atas partisipasi Anda dalam Pemilihan Raya UI.',
                        showCancelButton: false,
                        confirmButtonText: 'Keluar',
                    }, function(){
                        window.location = 'loginpemilih.html'
                    });
                } // kalo ada gagal nya tinggal tambahin else aja
            })
            .fail(function() {
                ajaxErrorAlert();
            });            
        });
    });

    /**
     * Treat checkbox like radio button
     * Only one candidate can selected at a time
     * 
     * .on() clik event handler for all input:checkbox
     */
    $(document).on('click', 'input:checkbox', function(e){                   
        var checkbox_arr = [];

        // push all checkbox id from specific group to checkbox_arr
        $.each($('input:checkbox[name="'+$(this).prop('name')+'"]'), function(i, v) { 
            checkbox_arr.push(v.id);
        });

        // remove current selected checkbox from checkbox_arr        
        for(var i = 0; i < checkbox_arr.length; i++)
            if(checkbox_arr[i] === $(this)[0].id) checkbox_arr.splice(i, 1);

        // set the rest checkbox to false
        $.each(checkbox_arr, function(i, v) {
            $('#'+v).prop('checked', false);             
        });
    });        
});