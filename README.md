# money-manager

## 需求
手中有一些现金，但未来几个月内会有支出（比较大的支出，比如，报名费和住宿费）和一些收入，
因此，需要计算出这些事情之后的可用现金。这样，才能知道自己能够将多少钱拿去理财。
为了提供给大众用户使用，最终会生成exe安装文件。

## 实现
用electron作为支撑，结合html和jquery进行界面和逻辑的开发

## 打包为exe文件步骤

1)在命令行输入 $npm install  
这一步会添加package.json中的依赖，在这个项目中是electron和electron-packager

2)根据系统，更改package.json中的scripts中的package-mac，或者package-win，或者package-linux。我的系统为win32。在控制台，使用如下的三条语句之一，就可以在release-builds下生成一个绿色版的免安装文件夹。
```bash
npm run package-mac
npm run package-win
npm run package-linux 
```



