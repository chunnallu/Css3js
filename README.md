# Css3js

jquery css3插件，使用jquery操作css3变换，为jquery对象提供css3变换接口，接口名称和css3保持一致。

[演示](http://static.outsidelook.cn/my/projects/css3js/0.3/index.html)

[下载](http://static.outsidelook.cn/my/projects/css3js/0.3/css3-v0.3.js)

# 教程

## 使用2D转换

首先需引入css3js,jquery需先于css3js引入:


```
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>css3js测试</title>
    <script src="http://static.outsidelook.cn/js/lib/jquery/jquery-3.1.0.js"></script>
    <script src="css3-v0.3.js"></script>
    <style>
        .box{
            width:100px;
            height:100px;
            position: relative;
            background: #ccc;
        }
    </style>
</head>
<body>
   <div class="box"></div>

 <script>
    //这里写代码
     
 </script>

</body>
</html>
```


使用jquery选中某个元素，直接调用方法即可

```
$('.box').translate(100,100)
```


# 使用3D转换

要看到3D效果，需要设置perspective属性，这个属性可以直接设置,这会使得元素的子元素显示出透视相机的效果（也就是近大远小）,如下，给`container`类添加了perspective属性，`box`将会有近小远大的效果。

```
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>css3js测试</title>
    <script src="http://static.outsidelook.cn/js/lib/jquery/jquery-3.1.0.js"></script>
    <script src="css3-v0.3.js"></script>
    <style>
        .container{
           perspective:500px;
        }
        .box{
            width:100px;
            height:100px;
            position: relative;
            background: #ccc;
        }
    </style>
</head>
<body>
   <div class="container">
       <div class="box"></div>
   </div>

 <script>
    //这里写代码
     
 </script>

</body>
</html>
```
也可以作为元素的transform属性的一个方法设置，这会使元素本身显示出正交相机的效果（也就是没有近大远小）,但是，这种方式在目前的css3js上使用会有问题，设置的pective会被覆盖掉。

```
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>css3js测试</title>
    <script src="http://static.outsidelook.cn/js/lib/jquery/jquery-3.1.0.js"></script>
    <script src="css3-v0.3.js"></script>
    <style>
        .box{
            width:100px;
            height:100px;
            position: relative;
            background: #ccc;
            transform:pespective(500px)
        }
    </style>
</head>
<body>
   <div class="box"></div>
 <script>
    //这里写代码
     
 </script>

</body>
</html>
```