/**
 * Created by lcl on 2017/1/6.
 */


/*************************************************************************
 *  扩展jquery，提供变换接口
 *************************************************************************/

/*****
 * 检查是否存在Jquery
 *****/
if(!($ || jQuery)){
    throw "jQuery没有引入"
}

/**
 * 初始化所选jquery dom对象，在第一次用到本插件提供的方法时运行本方法
 * @param dom jquery dom对象，例如，$('#id')所选中的对象
 * @returns {*} 返回包装后的对象
 */
function initElement(dom){
    if(dom.matrix3){ //元素已经初始化过
        return;
    }
    /*
    根据情况，初始化矩阵，用3维矩阵表示元素的2D变换，用4维矩阵表示元素的3D变换
     */
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
    var option = this.matrix3.toTransformOption();
    setTransform(this,option)
}

$.fn.rotate = function(angle){
    initElement(this);
    this.matrix3.rotate(angle);
    var option = this.matrix3.toTransformOption();
    setTransform(this,option)
}
$.fn.scale = function(x,y){
    initElement(this);
    this.matrix3.scale(x,y);
    var option = this.matrix3.toTransformOption();
    setTransform(this,option)
}
$.fn.skew = function(xAngle,yAngle){
    initElement(this);
    this.matrix3.skew(xAngle,yAngle);
    var option = this.matrix3.toTransformOption();
    setTransform(this,option)
}

$.fn.translate3d = function(x,y,z){
    initElement(this);
    this.matrix4.translate(x,y,z);
    var option = this.matrix4.toTransformOption();
    setTransform(this,option)
}
$.fn.translateX = function(x){
    initElement(this);
    this.matrix4.translateX(x);
    var option = this.matrix4.toTransformOption();
    setTransform(this,option)
}
$.fn.translateY = function(y){
    initElement(this);
    this.matrix4.translateY(y);
    var option = this.matrix4.toTransformOption();
    setTransform(this,option)
}
$.fn.translateZ = function(z){
    initElement(this);
    this.matrix4.translateZ(z);
    var option = this.matrix4.toTransformOption();
    setTransform(this,option)
}

$.fn.scale3d = function(x,y,z){
    initElement(this);
    this.matrix4.scale3d(x,y,z);
    var option = this.matrix4.toTransformOption();
    setTransform(this,option)
}
$.fn.scaleX = function(x){
    initElement(this);
    this.matrix4.scaleX(x);
    var option = this.matrix4.toTransformOption();
    setTransform(this,option)
}
$.fn.scaleY = function(y){
    initElement(this);
    this.matrix4.scaleY(y);
    var option = this.matrix4.toTransformOption();
    setTransform(this,option)
}
$.fn.scaleZ = function(z){
    initElement(this);
    this.matrix4.scaleZ(z);
    var option = this.matrix4.toTransformOption();
    setTransform(this,option)
}

$.fn.rotate = function(x,y,z,angle){
    initElement(this);
    this.matrix4.rotate(new Vector3(x,y,z),angle);
    var option = this.matrix4.toTransformOption();
    setTransform(this,option)
}


/*************************************************************************
 *  插件定义的3维矩阵和4维矩阵，及其相关方法
 *************************************************************************/
/**
 * 3维矩阵，用来表示2D变换
 * @param matrix 矩阵
 * @constructor
 */
var Matrix3 = function(matrix){
    this.matrix = matrix?matrix:
           [1,0,0,
            0,1,0,
            0,0,1];
    /*
    下面各个属性用来记录2D变换的结果
     */
    this.rotateAngle = 0;
    this.skewX = 0;
    this.skewY = 0;
    this.translateX = 0;
    this.translateY = 0;
    this.scaleX = 1.0;
    this.scaleY = 1.0;
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
    var angleInc = angle - this.rotateAngle;   //计算差值
    var rad = angleInc/180*Math.PI;
    var transformMatrix = new Matrix3([
        Math.cos(rad),-Math.sin(rad),0,
        Math.sin(rad),Math.cos(rad),0,
        0,0,1
    ]);
    this.multiply(transformMatrix);
    this.rotateAngle = angle;
    return this;
}

/**
 * 移动
 * @param x
 * @param y
 * @returns {Matrix3}
 */
Matrix3.prototype.translate = function(x,y){
    var xInc = x - this.translateX;//计算差值
    var yInc = y - this.translateY;
    var transformMatrix = new Matrix3([
        1,0,xInc,
        0,1,yInc,
        0,0,1
    ]);
    this.multiply(transformMatrix);
    this.translateX = x;
    this.translateY = y;
    return this;
}

/**
 * 缩放
 * @param x
 * @param y
 * @returns {Matrix3}
 */
Matrix3.prototype.scale = function(x,y){
    var xInc = x/this.scaleX;
    var yInc = y/this.scaleY;
    var transformMatrix = new Matrix3([
        xInc,0,0,
        0,yInc,0,
        0,0,1
    ]);
    this.multiply(transformMatrix);
    this.scaleX = x;
    this.scaleY = y;
    return this;
}
/**
 * 扭曲
 * @param xAngle
 * @param yAngle
 * @returns {Matrix3}
 */
Matrix3.prototype.skew = function(xAngle,yAngle){
    var xInc = xAngle - this.skewX;
    var yInc = yAngle - this.skewY;
    var xRad = xInc/180*Math.PI;
    var yRad = yInc/180*Math.PI;
    var transformMatrix = new Matrix3([
        1,Math.tan(xRad),0,
        Math.tan(yRad),1,0,
        0,0,1
    ]);
    this.multiply(transformMatrix);
    this.skewX = xAngle;
    this.skewY = yAngle;
    return this;
}

/**
 * 将矩阵转化成transform字符串
 * @returns {string}
 */
Matrix3.prototype.toTransformString = function(){
    var matrix = this.matrix;
    var str = "matrix("+matrix[0]+","+matrix[3]+", "+matrix[1]+","+matrix[4]+", "+matrix[2]+","+matrix[5]+")"
    return str;
}

Matrix3.prototype.toTransformOption = function(){
    var that = this;
    return {
        matrix:that.toTransformString()
    };
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
    /*
     下面各个属性用来记录3D变换的结果
     */
    this._rotateX = 0;
    this._rotateY = 0;
    this._rotateZ = 0;
    this._skewX = 0;
    this._skewY = 0;
    this._skewZ = 0;
    this._translateX = 0;
    this._translateY = 0;
    this._translateZ = 0;
    this._scaleX = 1;
    this._scaleY = 1;
    this._scaleZ = 1;
    return this;
}

/**
 * 3d移动
 * @param x
 * @param y
 * @param z
 * @returns {Matrix4}
 */
Matrix4.prototype.translate = function(x,y,z){
    var xInc = x - this._translateX;//计算差值
    var yInc = y - this._translateY;
    var zInc = z - this._translateZ;
    var transformMatrix = new Matrix4([
        1,0,0,xInc,
        0,1,0,yInc,
        0,0,1,zInc,
        0,0,0,1
    ]);
    this.multiply(transformMatrix);
    this._translateX = x;
    this._translateY = y;
    this._translateZ = z;
    return this;
}

/**
 * 沿x轴移动
 * @param x
 * @returns {Matrix4}
 */
Matrix4.prototype.translateX = function(x){
    return this.translate(x,this._translateY,this._translateZ);
}

/**
 * 沿y轴移动
 * @param y
 * @returns {Matrix4}
 */
Matrix4.prototype.translateY = function(y){
    return this.translate(this._translateX,y,this._translateZ);
}
/**
 * 沿z轴移动
 * @param z
 * @returns {Matrix4}
 */
Matrix4.prototype.translateZ = function(z){
    return this.translate(this._translateX,this._translateY,z);
}


/**
 * 3d缩放
 * @param x x方向
 * @param y y方向
 * @param z z方向
 * @returns {Matrix4}
 */
Matrix4.prototype.scale = function(x,y,z){
    var xInc = x/this._scaleX;
    var yInc = y/this._scaleY;
    var zInc = z/this._scaleZ;
    var transformMatrix = new Matrix4([
        xInc,0,0,0,
        0,yInc,0,0,
        0,0,zInc,0,
        0,0,0,1
    ]);
    this.multiply(transformMatrix);
    this._scaleX = x;
    this._scaleY = y;
    this._scaleZ = z;
    return this;
}

/**
 * 沿x轴缩放
 * @param x
 * @returns {Matrix4}
 */
Matrix4.prototype.scaleX = function(x){
    return this.scale(x,this._scaleY,this._scaleZ);
}
/**
 * 沿y轴缩放
 * @param y
 * @returns {Matrix4}
 */
Matrix4.prototype.scaleY = function(y){
    return this.scale(this._scaleX,y ,this._scaleZ);
}

/**
 * 沿z轴缩放
 * @param zx
 * @returns {Matrix4}
 */
Matrix4.prototype.scaleZ = function(z){
    return this.scale(this._scaleX,this._scaleY,z);
}

/**
 * 3d任意轴旋转（四元数旋转）
 * @param axis 旋转轴
 * @param angle 角度
 * @returns {Matrix4}
 */
Matrix4.prototype.rotate = function(axis,angle){
    axis.normalize();
    var sin = Math.sin;
    var cos = Math.cos;
    var ux = axis.x;
    var ux2 = ux*ux;
    var uy = axis.y;
    var uy2 = uy*uy;
    var uz = axis.z;
    var uz2 = uz*uz;
    var w = 1 - cos(angle);
    var  R = [
        ux2*w+cos(angle)         ,  ux*uy*w - uz*sin(angle)       ,   ux*uz*w+uy*sin(angle)   ,    0,
        uy*ux*w+uz*sin(angle)    ,  uy2*w+cos(angle)              ,   uy*uz*w - ux*sin(angle) ,    0,
        uz*ux*w - uy*sin(angle)  ,  uz*uy*w+ux*sin(angle)         ,    uz2*w+cos(angle)       ,    0,
        0                        ,  0                             ,    0                      ,    1];
    var transfromMatrix = new Matrix4(R);
    this.multiply(transfromMatrix);
    this.translate(this._translateX,this._translateY,this._translateZ);
    return this;
}

/**
 * 沿x轴旋转
 * @param angle
 * @returns {Matrix4}
 */
Matrix4.prototype.rotateX = function(angle){
    return this.rotate(new Vector3(1,0,0),angle);
}

/**
 * 沿y轴旋转
 * @param angle
 * @returns {Matrix4}
 */
Matrix4.prototype.rotateY = function(angle){
    return this.rotate(new Vector3(0,1,0),angle);
}

/**
 * 沿z轴旋转
 * @param angle
 * @returns {Matrix4}
 */
Matrix4.prototype.rotateZ = function(angle){
    return this.rotate(new Vector3(0,0,1),angle);
}


/**
 * 4维矩阵乘法
 * @param item
 * @returns {Matrix3}
 */
Matrix4.prototype.multiply = function(item){
    var matrix = this.matrix;
    var itemMatrix = item.matrix;
    var resultMatrix = [];
    for(var i = 0 ; i < matrix.length ;i++){
        var row = Number.parseInt(i/4);
        var col = Number.parseInt(i%4);
        var sum = 0;
        for(var j = 0 ; j< 4 ; j++){
            sum += matrix[row*4+j]*itemMatrix[j*4+col];
        }
        resultMatrix[i] = sum;
    }
    this.matrix = resultMatrix;
    return this;
}


/**
 * 将矩阵转化成transform字符串
 * @returns {string}
 */
Matrix4.prototype.toTransformString = function(){
    var matrix = this.matrix;
    var str = "matrix3d("+matrix[0]+","+matrix[4]+", "+matrix[8]+","+matrix[12]+", " +
        matrix[1]+","+matrix[5]+", "+matrix[9]+","+matrix[13]+", " +
        matrix[2]+","+matrix[6]+", "+matrix[10]+","+matrix[14]+", " +
        matrix[3]+","+matrix[7]+", "+matrix[11]+","+matrix[15] +")";
    return str;
}

Matrix4.prototype.toTransformOption = function(){
    var that = this;
    return {
        matrix3d:that.toTransformString()
    };
}

/**
 * 向量
 */

function Vector3(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
    this.length = Math.sqrt((x*x+y*y+z*z));
}

Vector3.prototype.normalize = function(){
    this.x = this.x/this.length;
    this.y = this.y/this.length;
    this.z = this.z/this.length;
}

/*************************************************************************
 * 帮助函数
 *************************************************************************/
/**
 * 提取元素的transform矩阵
 * @param dom
 * @returns {*}
 */
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
    if(matrix.length == 6){   //三维矩阵
        return [
            matrix[0],matrix[2],matrix[4],
            matrix[1],matrix[3],matrix[5],
            0,0,1
        ];
    }else{             //四维矩阵
        return [
            matrix[0],matrix[4],matrix[8],matrix[12],
            matrix[1],matrix[5],matrix[9],matrix[13],
            matrix[2],matrix[6],matrix[10],matrix[14],
            matrix[3],matrix[7],matrix[11],matrix[15]
        ];
    }

}

/**
 * 将变换应用于DOM元素
 * @param dom
 * @param option
 */
function setTransform(dom,option){
    var transformString = "";
    option.matrix ? transformString+= option.matrix+" ":null;
    option.matrix3d ? transformString+= option.matrix3d+" ":null;
    dom.css({transform:transformString});
}