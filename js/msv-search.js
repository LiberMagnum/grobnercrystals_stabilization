$(document).ready(function() {
    var permls = [];
    var curix = -1;
    var backls = [];
    var forwardls = [];
    var w = 0;

    $(document).keypress(function (k) {
        var key = k.which;
        if (key==13) {
            w = $('#perm').val();
            w = w.replace(' ','');
            permls = permls.slice(0,curix+1);
            loadPerm(w,true);
            curix += 1;
            updateButtons();
        }
    });

    $('#stabilize').on("click",function(){
        w = permls.at(curix);
        newW = '1';
        for (let i = 0; i<w.length; i++) {
            newW += `${parseInt(w.at(i))+1}`;
        };
        $('#perm').val(newW);
        permls = permls.slice(0,curix+1);
        loadPerm(newW,true);
        curix = permls.length;
        updateButtons();
    });

    $('#forward').on("click",function(){
        curix += 1;
        w = permls.at(curix);
        $('#perm').val(w);
        loadPerm(w,false);
        updateButtons();
    });

    $('#back').on("click",function(){
        curix -= 1;
        w = permls.at(curix);
        $('#perm').val(w);
        loadPerm(w,false);
        updateButtons();
    });

    function loadPerm(w,addnew) {
        var file_name = `./msv-betti-data/${w}.html`
        $.get(file_name, function() {
            $('#betti-container').load(file_name);
            $('#stabilize').prop("disabled",false);
            if (permls.at(-1) != w && addnew) {
                permls = permls.concat([w]);
            };
            console.log(permls);
        }).fail(function() {
            console.log("Failed")
            $('#betti-container').html(
                '<p>Data not found</p>'
            );
        });
    };

    function updateButtons() {
        backls = permls.slice(0,curix);
        forwardls = permls.slice(curix+1);

        if (backls.length != 0) {
            $('#back').prop('disabled',false);
        } else {
            $('#back').prop('disabled',true);
        };

        if (forwardls.length != 0) {
            $('#forward').prop('disabled',false);
        } else {
            $('#forward').prop('disabled',true)
        };
    };
});