//顶点着色器
var VSHADER_SOURCE = 
    
    'attribute vec4 a_Position;\n'+
    
    'attribute vec4 a_Color;\n'+

    'varying vec4 v_Color;\n'+

    'void main(){\n'+

    'gl_Position = a_Position;\n'+

    'v_Color = a_Color;\n'+

    '}\n';
//片段着色器
var FSHADER_SOURCE = 
    
    'precision mediump float;\n'+
    
    'varying vec4 v_Color;\n'+

    'void main(){\n'+

    'gl_FragColor = v_Color;\n'+

    '}\n';

function main(){

    var canvas = document.getElementById('webgl');
    //canvas.width = screen.width;
    //canvas.height = screen.height;

    //var gl = getWebGLContext(canvas);
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');//获取上下文

    if(!gl){

        alert("获取webGL上下文失败");

    }

    if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){

        alert("着色器编译失败");

    }

    gl.clearColor(0.0,1.0,1.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    
    var preObj = new Object;
    preObj.val = 121;

    
    var time = setInterval(function(){
        draw(gl,preObj);
        if(preObj.val <= 8){
            preObj.val = 121;
         }
        
    },1500)

    
}

function draw(gl,pre){

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for(;pre.val>0;pre.val--){
        if(360%pre.val === 0){
            break;

          }

    }

    temp = pre.val* Math.PI / 180;
    var n = initVertexBuffers(gl,temp);
    
    gl.drawElements(gl.LINES,n,gl.UNSIGNED_BYTE,0);

    pre.val--;

}

function getCircleData(r,pre){

    var radian = 360 * Math.PI / 180;

    var array = new Float32Array(radian/pre*2);
    
    var j = 0;
    for(var i = 0;i < radian;i += pre){

        array[j] = r * Math.cos(i);
        array[j+1] = r * Math.sin(i);
        j+=2;
    }
    
    return array;

}

function getCircleIndex(pre){

    var radian = 360 * Math.PI / 180;
    var length = radian /pre*2;
    var array = new Uint8Array(length);

    var j = 0;
    for(var i = 0;i<length;i++){

        array[j] = i;
        array[j+1] = i+1;
        j+=2;

    }
array[length-1] = 0;
return array;

}

function initVertexBuffers(gl,pre){

    /*var vertices = new Float32Array([

        0.0,0.0,0.5,0.0,0.5,0.5,0.0,0.5
    ]);*/

    var vertices = getCircleData(0.5,pre);
    var indices = getCircleIndex(pre);
    
    var colors = new Float32Array([

        1.0,0.0,0.0,

        ]);
   /* var indices = new Uint8Array([

        0,1,1,2,
        2,3,3,0,


        ]);*/


    var indexBuffer = gl.createBuffer();
    
    initArrayBuffer(gl,vertices,2,gl.FLOAT,'a_Position');

    initArrayBuffer(gl,colors,3,gl.FLOAT,'a_Color');
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);

    return indices.length;

    

}

function initArrayBuffer(gl,data,num,type,attribute){

    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);

    var a_attribute = gl.getAttribLocation(gl.program,attribute);
    gl.vertexAttribPointer(a_attribute,num,type,false,0,0);

    gl.enableVertexAttribArray(a_attribute);

    return true;


}
