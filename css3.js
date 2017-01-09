/**
 * Created by Administrator on 2017/1/6.
 */
/**
 * 主对象
 * @constructor
 */
var CSS3 = function(selector){
    var dom = $(selector);
    return new Element(dom);
}

/**
 * 选择函数
 * @param selector
 */
CSS3.prototype.find = function(selector){
    var dom = $(selector);
    return new Element(dom);
}

/**
 * 元素对象
 * @param dom
 * @constructor
 */
var Element = function(dom){
    this.dom = dom;
    var transformMatrix = getDOMElementTransformMatrix(dom);
    if(transformMatrix.length >0 ){
       if(transformMatrix.length>9){
           this.matrix4 = new Matrix4(transformMatrix);
           this.matrix3 = new Matrix3();
       } else{
           this.matrix4 = new Matrix4();
           this.matrix3 = new Matrix3(transformMatrix);
       }
    }else{
        this.matrix3 = new Matrix3();
        this.matrix4 = new Matrix4();
    }
    return this;
}

Element.prototype.translate = function(x,y){
    this.matrix3.translate(x,y);
    var str = this.matrix3.toTansformString();
    this.dom.css({transform:str});
}

Element.prototype.rotate = function(angle){
    this.matrix3.rotate(angle);
    var str = this.matrix3.toTansformString();
    this.dom.css({transform:str});
}
Element.prototype.scale = function(x,y){
    this.matrix3.scale(x,y);
    var str = this.matrix3.toTansformString();
    this.dom.css({transform:str});
}
Element.prototype.skew = function(xAngle,yAngle){
    this.matrix3.skew(xAngle,yAngle);
    var str = this.matrix3.toTansformString();
    this.dom.css({transform:str});
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

Matrix3.prototype.rotate = function(angle){
    var transformMatrix = new Matrix3([
        Math.cos(angle),-Math.sin(angle),0,
        Math.sin(angle),Math.cos(angle),0,
        0,0,1
    ]);
    this.multiply(transformMatrix);
    return this;
}

Matrix3.prototype.translate = function(x,y){
//    this.matrix[2] += x;
//    this.matrix[5] += y;
    var transformMatrix = new Matrix3([
        1,0,x,
        0,1,y,
        0,0,1
    ]);
    this.multiply(transformMatrix);
    return this;
}

Matrix3.prototype.scale = function(x,y){
    var transformMatrix = new Matrix3([
        x,0,0,
        0,y,0,
        0,0,1
    ]);
    this.multiply(transformMatrix);
    return this;
}
Matrix3.prototype.skew = function(xAngle,yAngle){
    var transformMatrix = new Matrix3([
        1,Math.tan(xAngle),0,
        Math.tan(yAngle),1,0,
        0,0,1
    ]);
    this.multiply(transformMatrix);
    return this;
}



Matrix3.prototype.toTansformString = function(){
    var matrix = this.matrix;
    var str = "matrix("+matrix[0]+","+matrix[1]+", "+matrix[3]+","+matrix[4]+", "+matrix[2]+","+matrix[5]+")"
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
    })
    return matrix;
}