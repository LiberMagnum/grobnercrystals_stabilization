$(document).ready(function() {
    var permls = [];
    var curix = -1;
    var backls = [];
    var forwardls = [];
    var w = 0;
    var newW = '';
    var stableW = '';
    var stabilized = 0;
    var stripes = "repeating-linear-gradient(30deg,transparent,transparent 4px,aliceblue 4px,aliceblue 8px)"
    var solid = "aliceblue"
    var noback = "transparent"
    var nodata = "#FFDEE2"

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
            $('#betti-container').load(file_name, function() {
                $('#stabilize').prop("disabled",false);
                if (permls.at(-1) != w && addnew) {
                    permls = permls.concat([w]);
                };
                whichStabilization(w);
                updateCSS();
            });
        }).fail(function() {
            console.log("Failed")
            $('#betti-container').html(
                '<p>Data not found</p>'
            );
        });
    };

    function whichStabilization(w) {
        var stability = -1;

        for (let i=0;i<w.length;i++){
            if (i+1==w.at(i)){
                stability = i;
            } else {
                break;
            }
        };

        var backstability = w.length;
        for (let i=w.length;i>=1;i--){
            if (i==w.at(i-1)){
                backstability = i-1;
            } else {
                break;
            }
        };
        console.log(backstability)
        newW = w.slice(stability+1,backstability);
        stableW = '';
        stabilized = stability+1;

        for (let i=0;i<newW.length;i++){
            stableW+=`${parseInt(newW.at(i))-(stability+1)}`;
        };
        console.log(stableW)
    };

    function updateCSS() {
        if (stableW in data) {
            weakCols = data[stableW]["column-weak-stability-thresholds"];
            strongCols = data[stableW]["column-strong-stability-thresholds"];
            for (let i=0;i<weakCols.length;i++){
                elt = "table tr:not(:first-child) td:nth-child("+`${i+2}`+")";
                console.log(elt);
                if (stabilized>=strongCols.at(i)){
                    console.log(`${i}`+" column strongly stabilized");
                    $(elt).css("background",solid);
                } else if (stabilized>=weakCols.at(i)){
                    console.log(`${i}`+" column weakly stabilized");
                    $(elt).css("background",stripes);
                } else {
                    console.log(`${i}`+" column not stabilized");
                    $(elt).css("background",noback);
                };
            };
        } else {
            for (let i=0;i<stableW.length;i++){
                elt = "table tr:not(:first-child) td:nth-child("+`${i+2}`+")";
                $(elt).css("background",nodata);
            };
        };
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