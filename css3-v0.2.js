/**
 * Created by Administrator on 2017/1/6.
 */

/*****
 * 检查是否存在Jquery
 *****/
if(!($ || jQuery)){
    throw "jQuery没有引入"
}
/**
 * 主对象
 * @constructor
 */
function initElement(dom){
    if(dom.matrix3){ //元素已经初始化过
        return;
    }
    var transformMatrix = getDOMElementTransformMatrix(dom);
    if(transformMatrix.length >0 ){
        if(transformMatrix.length>9){
            dom.matrix4 = new Matrix4(transformMatrix);
            dom.matrix3 = new Matrix3();
        } else{
            dom.matrix4 = new Matrix4();
            dom.matrix3 = new Matrix3(transformMatrix);
        }
    }else{
        dom.matrix3 = new Matrix3();
        dom.matrix4 = new Matrix4();
    }
    return dom;
}

$.fn.translate = function(x,y){
    initElement(this);
    this.matrix3.translate(x,y);
    var str = this.matrix3.toTansformString();
    this.css({transform:str});
}

$.fn.rotate = function(angle){
    initElement(this);
    this.matrix3.rotate(angle);
    var str = this.matrix3.toTansformString();
    this.css({transform:str});
}
$.fn.scale = function(x,y){
    initElement(this);
    this.matrix3.scale(x,y);
    var str = this.matrix3.toTansformString();
    this.css({transform:str});
}
$.fn.skew = function(xAngle,yAngle){
    initElement(this);
    this.matrix3.skew(xAngle,yAngle);
    var str = this.matrix3.toTansformString();
    this.css({transform:str});
}





/**
 * 3维矩阵
 * @param matrix 矩阵
 * @constructor
 */
var Matrix3 = function(matrix){
    this.matrix = matrix?matrix:
           [1,0,0,
            0,1,0,
            0,0,1];
    return this;
}

/**
 * 3维矩阵乘法
 * @param item
 * @returns {Matrix3}
 */
Matrix3.prototype.multiply = function(item){
    var matrix = this.matrix;
    var itemMatrix = item.matrix;
    var resultMatrix = [];
    for(var i = 0 ; i < matrix.length ;i++){
        var row = Number.parseInt(i/3);
        var col = Number.parseInt(i%3);
        var sum = 0;
        for(var j = 0 ; j< 3 ; j++){
            sum += matrix[row*3+j]*itemMatrix[j*3+col];
        }
        resultMatrix[i] = sum;
    }
//    console.log(resultMatrix);
    this.matrix = resultMatrix;
    return this;
}

/**
 * 旋转
 * @param angle
 * @returns {Matrix3}
 */
Matrix3.prototype.rotate = function(angle){
    var rad = angle/180*Math.PI;
    var transformMatrix = new Matrix3([
        Math.cos(rad),-Math.sin(rad),0,
        Math.sin(rad),Math.cos(rad),0,
        0,0,1
    ]);
    this.multiply(transformMatrix);
    return this;
}

/**
 * 移动
 * @param x
 * @param y
 * @returns {Matrix3}
 */
Matrix3.prototype.translate = function(x,y){
    var transformMatrix = new Matrix3([
        1,0,x,
        0,1,y,
        0,0,1
    ]);
    this.multiply(transformMatrix);
    return this;
}

/**
 * 缩放
 * @param x
 * @param y
 * @returns {Matrix3}
 */
Matrix3.prototype.scale = function(x,y){
    var transformMatrix = new Matrix3([
        x,0,0,
        0,y,0,
        0,0,1
    ]);
    this.multiply(transformMatrix);
    return this;
}
/**
 * 扭曲
 * @param xAngle
 * @param yAngle
 * @returns {Matrix3}
 */
Matrix3.prototype.skew = function(xAngle,yAngle){
    var xRad = xAngle/180*Math.PI;
    var yRad = yAngle/180*Math.PI;
    var transformMatrix = new Matrix3([
        1,Math.tan(xRad),0,
        Math.tan(yRad),1,0,
        0,0,1
    ]);
    this.multiply(transformMatrix);
    return this;
}



Matrix3.prototype.toTansformString = function(){
    var matrix = this.matrix;
    var str = "matrix("+matrix[0]+","+matrix[3]+", "+matrix[1]+","+matrix[4]+", "+matrix[2]+","+matrix[5]+")"
    return str;
}

/**
 * 4维矩阵
 * @param matrix 矩阵
 * @constructor
 */
var Matrix4 = function(matrix){
    this.matrix = matrix?matrix:
        [1,0,0,0,
         0,1,0,0,
         0,0,1,0,
         0,0,0,1];
    return this;
}


/************************
 * 帮助函数
 ************************/

function getDOMElementTransformMatrix(dom){
    let transform = dom.css('transform');
    let leftParent = transform.indexOf('(');
    let rightParent = transform.indexOf(')');
    if(leftParent == -1 || rightParent == -1){
        return [];
    }
    var matrixData = transform.substring(leftParent+1,rightParent);
    var matrix = matrixData.split(",");
    matrix.forEach(function(v,i){
        v = v.toString().replace(" ","");
        matrix[i] = +v;
    });
    return [
        matrix[0],matrix[2],matrix[4],
        matrix[1],matrix[3],matrix[5],
        0,0,1
    ];
}