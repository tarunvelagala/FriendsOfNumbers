let drawing = false;

let context;

let offset_left = 0;
let offset_top = 0;


function start_canvas() {
    let scribbler = document.getElementById("sheet");
    context = scribbler.getContext("2d");
    scribbler.onmousedown = function (event) {
        mousedown(event)
    };
    scribbler.onmousemove = function (event) {
        mousemove(event)
    };
    scribbler.onmouseup = function (event) {
        mouseup(event)
    };
    for (let o = scribbler; o; o = o.offsetParent) {
        offset_left += (o.offsetLeft - o.scrollLeft);
        offset_top += (o.offsetTop - o.scrollTop);
    }
    draw();
}

function getPosition(evt) {
    evt = (evt) ? evt : ((event) ? event : null);
    let left = 0;
    let top = 0;
    let scribbler = document.getElementById("sheet");

    if (evt.pageX) {
        left = evt.pageX;
        top = evt.pageY;
    } else if (document.documentElement.scrollLeft) {
        left = evt.clientX + document.documentElement.scrollLeft;
        top = evt.clientY + document.documentElement.scrollTop;
    } else {
        left = evt.clientX + document.body.scrollLeft;
        top = evt.clientY + document.body.scrollTop;
    }
    left -= offset_left;
    top -= offset_top;

    return {x: left, y: top};
}

function
mousedown(event) {
    drawing = true;
    let location = getPosition(event);
    context.lineWidth = 20.0;
    context.strokeStyle = "#ffffff";
    context.beginPath();
    context.moveTo(location.x, location.y);
}


function
mousemove(event) {
    if (!drawing)
        return;
    let location = getPosition(event);
    context.lineTo(location.x, location.y);
    context.stroke();
}


function
mouseup(event) {
    if (!drawing)
        return;
    mousemove(event);
    drawing = false;
}

function draw() {

    context.fillStyle = 'black';
    context.fillRect(0, 0, 400, 400);

}

function clearCanvas() {
    context.clearRect(0, 0, 400, 400);
    draw();
    document.getElementById("rec_result").innerHTML = "";
}


function processImg() {
    document.getElementById("rec_result").innerHTML = "connecting...";

    let scribbler = document.getElementById("sheet");
    let imageData = scribbler.toDataURL('image/png');
    // let dataTemp = imageData.substr(22);

    // let sendPackage = {"id": "1", "txt": imageData};
    /*$.post("/process", sendPackage, function(data){
        data = JSON.parse(data);
        if(data["status"] === 1)
        {
            document.getElementById("rec_result").innerHTML = data["result"];
        }
        else
        {
            document.getElementById("rec_result").innerHTML = "failed";
        }
    });*/
    $.ajax({
        type: 'POST',
        url: "/process/",
        data: imageData,
        success: function (response) {
            console.log(response);
            document.getElementById('rec_result').innerHTML = response;
        },
        error: function (err) {
            document.getElementById('rec_result').innerHTML = 'failed';
        }

    });

}

onload = start_canvas;

